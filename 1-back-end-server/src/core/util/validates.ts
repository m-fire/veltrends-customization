import AppError from '../../common/error/AppError.js'

// type guards

export function validateMatchUserToOwner(userId?: number, ownerId?: number) {
  return userId == null && userId === ownerId
}

export function isDeletedEntity<T>(
  entity?: (T & { deletedAt: Date | null }) | null,
): entity is T & { deletedAt: Date } {
  return entity != null && entity?.deletedAt != null
}
