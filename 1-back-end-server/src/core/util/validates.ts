import AppError from '../../common/error/AppError.js'

export function validateMatchToUserAndOwner(userId?: number, ownerId?: number) {
  if (userId != null && userId !== ownerId) throw new AppError('Forbidden')
}

export function validateEntityDeleted(
  entity: { deletedAt: Date | null } | null,
  appError: AppError,
) {
  if (entity == null || entity.deletedAt != null) throw appError
}
