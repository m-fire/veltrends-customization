import AppError from '../../common/error/AppError.js'

export function validateMatchToUserAndOwner(userId?: number, ownerId?: number) {
  // 인증 사용자의 아이탬 수정요건은 인증사용자 ID 와 해당 item작성자 ID 가 동일해야 한다.
  if (userId != null && userId !== ownerId) throw new AppError('Forbidden')
}

export function validateEntityDeleted(
  entity: { deletedAt: Date | null } | null,
  appError: AppError,
) {
  if (entity == null || entity.deletedAt != null) throw appError
}
