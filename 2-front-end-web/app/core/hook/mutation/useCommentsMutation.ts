import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { createComment, editComment } from '~/core/api/items$comments'

export function useCreateCommentMutation(
  options: UseMutationOptionsOf<typeof createComment> = {},
) {
  return useMutation(createComment, options)
}

export function useEditCommentMutation(
  options: UseMutationOptionsOf<typeof editComment> = {},
) {
  return useMutation(editComment, options)
}

// UseMutationOptions<Comment, unknown, { itemId: number; parentCommentId?: number | undefined; }, unknown>, "mutationFn">
type UseMutationOptionsOf<
  T extends (...args: any) => any,
  E = any,
> = UseMutationOptions<
  // TData, TError, TVariables, TContext
  Awaited<ReturnType<T>>,
  E,
  Parameters<T>[0]
>
