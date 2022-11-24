import { useParams } from '@remix-run/react'

/**
 * Returns itemId URL parameter in items page
 * items 페이지에서 itemId URL 매개변수를 가져와 반환합니다.
 */
export function useItemIdParams() {
  const { itemId } = useParams<{ itemId: string }>()
  const parsed = itemId ? parseInt(itemId) : null
  if (parsed && isNaN(parsed)) return null
  return parsed
}
