import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axiosInstance } from "@/lib/configs/axios-instance";
import { sendRequest } from "@/lib/configs/request";
import { ApiError } from "@/lib/utils/api-error";
import {
  extractResponseMessage,
  getDefaultErrorMessage,
  getDefaultSuccessMessage,
} from "@/lib/utils/toast-messages";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const originalAdapter = axiosInstance.defaults.adapter;

describe("toast message mapping", () => {
  it("maps default success messages by status code and method", () => {
    expect(getDefaultSuccessMessage(201, "post")).toBe("Created successfully");
    expect(getDefaultSuccessMessage(200, "delete")).toBe("Deleted successfully");
    expect(getDefaultSuccessMessage(204, "delete")).toBe("Deleted successfully");
    expect(getDefaultSuccessMessage(200, "put")).toBe("Updated successfully");
    expect(getDefaultSuccessMessage(200, "patch")).toBe("Updated successfully");
    expect(getDefaultSuccessMessage(200, "post")).toBe("Done successfully");
  });

  it("maps default error messages by status code and error code", () => {
    expect(getDefaultErrorMessage(0, "ECONNABORTED")).toBe("Request timed out. Please try again.");
    expect(getDefaultErrorMessage(0, "ERR_NETWORK")).toBe("Network error. Please check your connection.");
    expect(getDefaultErrorMessage(0)).toBe("Network error. Please check your connection.");
    expect(getDefaultErrorMessage(400)).toBe("Invalid request.");
    expect(getDefaultErrorMessage(401)).toBe("Your session has expired.");
    expect(getDefaultErrorMessage(403)).toBe("You do not have permission to do this.");
    expect(getDefaultErrorMessage(404)).toBe("Resource not found.");
    expect(getDefaultErrorMessage(408)).toBe("Request timed out.");
    expect(getDefaultErrorMessage(429)).toBe("Too many requests. Please slow down.");
    expect(getDefaultErrorMessage(503)).toBe("Server error. Please try again later.");
    expect(getDefaultErrorMessage(418)).toBe("Something went wrong.");
  });

  it("extracts backend message strings cleanly", () => {
    expect(extractResponseMessage({ message: "User not found" })).toBe("User not found");
    expect(extractResponseMessage({ message: "   " })).toBeUndefined();
    expect(extractResponseMessage({ id: 1 })).toBeUndefined();
    expect(extractResponseMessage(null)).toBeUndefined();
  });
});

describe("sendRequest interceptor toast behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("window", {});
  });

  afterEach(() => {
    axiosInstance.defaults.adapter = originalAdapter;
    vi.unstubAllGlobals();
  });

  it("shows default success toasts for mutations and stays silent for GET", async () => {
    axiosInstance.defaults.adapter = async (config: InternalAxiosRequestConfig) => ({
      data: { id: 1 },
      status: config.method === "post" ? 201 : 200,
      statusText: "OK",
      headers: {},
      config,
    });

    await sendRequest<{ id: number }>({ method: "get", url: "/users" });
    expect(toast.success).not.toHaveBeenCalled();

    await sendRequest<{ id: number }, { name: string }>({
      method: "post",
      url: "/users/add",
      body: { name: "Ada" },
    });
    expect(toast.success).toHaveBeenLastCalledWith("Created successfully", {
      id: "api-success-post-201",
    });

    await sendRequest<{ id: number }, { name: string }>({
      method: "put",
      url: "/users/1",
      body: { name: "Ada" },
    });
    expect(toast.success).toHaveBeenLastCalledWith("Updated successfully", {
      id: "api-success-put-200",
    });

    await sendRequest<{ id: number }>({ method: "delete", url: "/users/1" });
    expect(toast.success).toHaveBeenLastCalledWith("Deleted successfully", {
      id: "api-success-delete-200",
    });
  });

  it("uses successMessage override when provided", async () => {
    axiosInstance.defaults.adapter = async (config: InternalAxiosRequestConfig) => ({
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });

    await sendRequest<{ ok: boolean }>({
      method: "post",
      url: "/users/add",
      successMessage: "Customer saved",
    });
    expect(toast.success).toHaveBeenCalledWith("Customer saved", {
      id: "api-success-post-200",
    });
  });

  it("throws ApiError and shows error toast for failed mutations while keeping GET errors silent", async () => {
    axiosInstance.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      throw new AxiosError(
        "Request failed",
        "ERR_BAD_REQUEST",
        config,
        null,
        {
          data: { message: "User with id '999' not found" },
          status: 404,
          statusText: "Not Found",
          headers: new AxiosHeaders(),
          config,
        },
      );
    };

    await expect(sendRequest({ method: "get", url: "/users/999" })).rejects.toMatchObject({
      name: "ApiError",
      statusCode: 404,
      message: "User with id '999' not found",
    });
    expect(toast.error).not.toHaveBeenCalled();

    await expect(sendRequest({ method: "delete", url: "/users/999" })).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(toast.error).toHaveBeenCalledWith("User with id '999' not found", {
      id: "api-error-404",
    });
  });

  it("rethrows canceled requests silently with no toast", async () => {
    axiosInstance.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      throw new AxiosError("canceled", "ERR_CANCELED", config);
    };

    await expect(sendRequest({ method: "delete", url: "/users/1" })).rejects.toMatchObject({
      code: "ERR_CANCELED",
    });
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
