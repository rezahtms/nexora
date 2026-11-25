import { createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import DataTableHeader from "@/components/shared/data-table/data-table-header";

function findButtonOnClick(node: ReactNode): (() => void) | undefined {
  if (!isValidElement<{ onClick?: () => void; children?: ReactNode }>(node)) return undefined;
  if (typeof node.props.onClick === "function") return node.props.onClick;
  const children = node.props.children;
  if (Array.isArray(children)) {
    for (const child of children) {
      const found = findButtonOnClick(child);
      if (found) return found;
    }
    return undefined;
  }
  return findButtonOnClick(children);
}

function renderHeader(element: ReactElement): string {
  return renderToStaticMarkup(createElement("table", null, createElement("thead", null, createElement("tr", null, element))));
}

describe("DataTableHeader", () => {
  it("renders a plain column header without aria-sort when not sortable", () => {
    const html = renderHeader(
      createElement(DataTableHeader, {
        columnId: "email",
        header: "Email",
        sortable: false,
      }),
    );

    expect(html).toContain('scope="col"');
    expect(html).toContain("Email");
    expect(html).not.toContain("aria-sort");
    expect(html).not.toContain("<button");
  });

  it("renders aria-sort=none for an inactive sortable column", () => {
    const html = renderHeader(
      createElement(DataTableHeader, {
        columnId: "email",
        header: "Email",
        sortable: true,
        sort: { columnId: "firstName", order: "asc" },
      }),
    );

    expect(html).toContain('aria-sort="none"');
    expect(html).toContain('aria-label="Sort by Email"');
  });

  it("renders ascending and descending aria-sort states for the active column", () => {
    const ascHtml = renderHeader(
      createElement(DataTableHeader, {
        columnId: "firstName",
        header: "Full name",
        sortable: true,
        sort: { columnId: "firstName", order: "asc" },
      }),
    );
    expect(ascHtml).toContain('aria-sort="ascending"');
    expect(ascHtml).toContain('aria-label="Sort by Full name, currently ascending"');

    const descHtml = renderHeader(
      createElement(DataTableHeader, {
        columnId: "firstName",
        header: "Full name",
        sortable: true,
        sort: { columnId: "firstName", order: "desc" },
      }),
    );
    expect(descHtml).toContain('aria-sort="descending"');
    expect(descHtml).toContain('aria-label="Sort by Full name, currently descending"');
  });

  it("invokes onSortChange with the column id when the sort button is triggered", () => {
    const onSortChange = vi.fn();
    const tree = DataTableHeader({
      columnId: "firstName",
      header: "Full name",
      sortable: true,
      sort: { columnId: "firstName", order: "asc" },
      onSortChange,
    });

    const handleClick = findButtonOnClick(tree);
    expect(handleClick).toBeDefined();
    handleClick?.();
    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenCalledWith("firstName");
  });
});
