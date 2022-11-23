import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getCommentList } from '~/common/api/items$comments'

export function useCommentsQuery(
  itemId: number,
  options: UseQueryOptionsOf<typeof getCommentList> = {},
) {
  return useQuery(extractKey(itemId), () => getCommentList(itemId), options)
}

const extractKey = (itemId: number) => ['comments', itemId]

useCommentsQuery.extractKey = extractKey

// types

type UseQueryOptionsOf<T extends (...args: any) => any> = UseQueryOptions<
  // <TQueryFnData, TError, TData, TQueryKey>
  Awaited<ReturnType<T>>,
  unknown,
  Awaited<ReturnType<T>>,
  any[]
>
