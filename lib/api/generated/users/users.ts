
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  DeleteResponse,
  GetUsersParams,
  SearchUsersParams,
  User,
  UserInput,
  UserList
} from '../model';

import { customInstance } from '../../axios-instance';

const withQueryKey = <T extends object, K>(query: T, queryKey: K): T & { queryKey: K } => {
  const result = { queryKey } as T & { queryKey: K };
  for (const key of Object.keys(query)) {
    if (key === 'queryKey') continue;
    Object.defineProperty(result, key, {
      enumerable: true,
      configurable: true,
      get: () => (query as Record<string, unknown>)[key],
    });
  }
  return result;
};

export const getUsers = (
    params?: GetUsersParams,
 signal?: AbortSignal
) => {

      return customInstance<UserList>(
      {url: `/users`, method: 'GET',
        params, signal
    },
      );
    }

export const getGetUsersQueryKey = (params?: GetUsersParams,) => {
    return [
    `/users`, ...(params ? [params] : [])
    ] as const;
    }

export const getGetUsersQueryOptions = <TData = Awaited<ReturnType<typeof getUsers>>, TError = unknown>(params?: GetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUsersQueryKey(params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({ signal }) => getUsers(params, signal);

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getUsers>>>
export type GetUsersQueryError = unknown

export function useGetUsers<TData = Awaited<ReturnType<typeof getUsers>>, TError = unknown>(
 params: undefined |  GetUsersParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUsers>>,
          TError,
          Awaited<ReturnType<typeof getUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUsers<TData = Awaited<ReturnType<typeof getUsers>>, TError = unknown>(
 params?: GetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUsers>>,
          TError,
          Awaited<ReturnType<typeof getUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUsers<TData = Awaited<ReturnType<typeof getUsers>>, TError = unknown>(
 params?: GetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUsers<TData = Awaited<ReturnType<typeof getUsers>>, TError = unknown>(
 params?: GetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, }
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUsersQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const searchUsers = (
    params: SearchUsersParams,
 signal?: AbortSignal
) => {

      return customInstance<UserList>(
      {url: `/users/search`, method: 'GET',
        params, signal
    },
      );
    }

export const getSearchUsersQueryKey = (params?: SearchUsersParams,) => {
    return [
    `/users/search`, ...(params ? [params] : [])
    ] as const;
    }

export const getSearchUsersQueryOptions = <TData = Awaited<ReturnType<typeof searchUsers>>, TError = unknown>(params: SearchUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof searchUsers>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSearchUsersQueryKey(params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof searchUsers>>> = ({ signal }) => searchUsers(params, signal);

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof searchUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SearchUsersQueryResult = NonNullable<Awaited<ReturnType<typeof searchUsers>>>
export type SearchUsersQueryError = unknown

export function useSearchUsers<TData = Awaited<ReturnType<typeof searchUsers>>, TError = unknown>(
 params: SearchUsersParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof searchUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof searchUsers>>,
          TError,
          Awaited<ReturnType<typeof searchUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSearchUsers<TData = Awaited<ReturnType<typeof searchUsers>>, TError = unknown>(
 params: SearchUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof searchUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof searchUsers>>,
          TError,
          Awaited<ReturnType<typeof searchUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSearchUsers<TData = Awaited<ReturnType<typeof searchUsers>>, TError = unknown>(
 params: SearchUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof searchUsers>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSearchUsers<TData = Awaited<ReturnType<typeof searchUsers>>, TError = unknown>(
 params: SearchUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof searchUsers>>, TError, TData>>, }
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSearchUsersQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getUser = (
    id: number,
 signal?: AbortSignal
) => {

      return customInstance<User>(
      {url: `/users/${id}`, method: 'GET', signal
    },
      );
    }

export const getGetUserQueryKey = (id: number,) => {
    return [
    `/users/${id}`
    ] as const;
    }

export const getGetUserQueryOptions = <TData = Awaited<ReturnType<typeof getUser>>, TError = void>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUserQueryKey(id);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUser>>> = ({ signal }) => getUser(id, signal);

   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUserQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>
export type GetUserQueryError = void

export function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = void>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUser>>,
          TError,
          Awaited<ReturnType<typeof getUser>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = void>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUser>>,
          TError,
          Awaited<ReturnType<typeof getUser>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = void>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = void>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>, }
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUserQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const updateUser = (
    id: number,
    userInput: UserInput,
 signal?: AbortSignal
) => {

      return customInstance<User>(
      {url: `/users/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: userInput, signal
    },
      );
    }

export const getUpdateUserMutationKey = () => ['updateUser'] as const;

export const getUpdateUserMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,UpdateUserMutationVariables, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,UpdateUserMutationVariables, TContext> => {

const mutationKey = getUpdateUserMutationKey();
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateUser>>, UpdateUserMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  updateUser(id,data,)
        }

  return  { mutationFn, ...mutationOptions }}

    export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>
    export type UpdateUserMutationBody = UserInput
    export type UpdateUserMutationError = unknown
    export type UpdateUserMutationVariables = {id: number;data: UserInput}

    export const useUpdateUser = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,UpdateUserMutationVariables, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateUser>>,
        TError,
        UpdateUserMutationVariables,
        TContext
      > => {
      return useMutation(getUpdateUserMutationOptions(options), queryClient);
    }
    export const deleteUser = (
    id: number,
 signal?: AbortSignal
) => {

      return customInstance<DeleteResponse>(
      {url: `/users/${id}`, method: 'DELETE', signal
    },
      );
    }

export const getDeleteUserMutationKey = () => ['deleteUser'] as const;

export const getDeleteUserMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,DeleteUserMutationVariables, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,DeleteUserMutationVariables, TContext> => {

const mutationKey = getDeleteUserMutationKey();
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteUser>>, DeleteUserMutationVariables> = (props) => {
          const {id} = props ?? {};

          return  deleteUser(id,)
        }

  return  { mutationFn, ...mutationOptions }}

    export type DeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUser>>>

    export type DeleteUserMutationError = unknown
    export type DeleteUserMutationVariables = {id: number}

    export const useDeleteUser = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,DeleteUserMutationVariables, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteUser>>,
        TError,
        DeleteUserMutationVariables,
        TContext
      > => {
      return useMutation(getDeleteUserMutationOptions(options), queryClient);
    }
    export const addUser = (
    userInput: UserInput,
 signal?: AbortSignal
) => {

      return customInstance<User>(
      {url: `/users/add`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: userInput, signal
    },
      );
    }

export const getAddUserMutationKey = () => ['addUser'] as const;

export const getAddUserMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addUser>>, TError,AddUserMutationVariables, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof addUser>>, TError,AddUserMutationVariables, TContext> => {

const mutationKey = getAddUserMutationKey();
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      const mutationFn: MutationFunction<Awaited<ReturnType<typeof addUser>>, AddUserMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  addUser(data,)
        }

  return  { mutationFn, ...mutationOptions }}

    export type AddUserMutationResult = NonNullable<Awaited<ReturnType<typeof addUser>>>
    export type AddUserMutationBody = UserInput
    export type AddUserMutationError = unknown
    export type AddUserMutationVariables = {data: UserInput}

    export const useAddUser = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addUser>>, TError,AddUserMutationVariables, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof addUser>>,
        TError,
        AddUserMutationVariables,
        TContext
      > => {
      return useMutation(getAddUserMutationOptions(options), queryClient);
    }
