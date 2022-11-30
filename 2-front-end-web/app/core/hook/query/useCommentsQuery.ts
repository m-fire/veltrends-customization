import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getCommentList } from '~/core/api/items$comments'

export function useCommentListQuery(
  itemId: number,
  options: UseQueryOptionsOf<typeof getCommentList> = {},
) {
  return useQuery(commentsKey(itemId), () => getCommentList(itemId), options)
}

export function commentsKey(itemId: number) {
  return ['comments', itemId]
}

// types

type UseQueryOptionsOf<T extends (...args: any) => any> = UseQueryOptions<
  // <TQueryFnData, TError, TData, TQueryKey>
  Awaited<ReturnType<T>>,
  unknown,
  Awaited<ReturnType<T>>,
  any[]
>
