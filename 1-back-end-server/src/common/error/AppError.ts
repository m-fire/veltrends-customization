export type AppErrorType =
  | 'UserExistsError'
  | 'AuthenticationError'
  | 'UnauthorizedError'
  | 'BadReqeustError'
  | 'RefreshFailureError'
  | 'ForbiddenError'
  | 'NotFoundError'
  | 'UnknownError'

export type ErrorPayloadOpt<K extends AppErrorType> =
  K extends 'UnauthorizedError'
    ? {
        isExpiredToken: boolean
      }
    : K extends 'BadReqeustError'
    ? any
    : undefined
// : K extends '....Error'
// ? {
//     key: boolean
//   }
// : undefined

interface ErrorInfo {
  message: string
  statusCode: number
}

const ERRORS_INFO_BY_NAME: Record<AppErrorType, ErrorInfo> = {
  UserExistsError: {
    message: 'User already exists',
    statusCode: 409,
  },
  AuthenticationError: {
    message: 'Invalid username password',
    statusCode: 401,
  },
  UnauthorizedError: {
    message: 'Unauthorized',
    statusCode: 401,
  },
  BadReqeustError: {
    message: 'Bad reqeust',
    statusCode: 400,
  },
  RefreshFailureError: {
    message: 'Failed to refresh token',
    statusCode: 401,
  },
  ForbiddenError: {
    message: 'Forbidden',
    statusCode: 403,
  },
  NotFoundError: {
    message: 'Not found',
    statusCode: 404,
  },
  UnknownError: {
    message: 'Unknown error',
    statusCode: 500,
  },
} as const

// Common Error

export default class AppError<
  K extends AppErrorType = AppErrorType,
> extends Error {
  public readonly statusCode: number

  constructor(public readonly name: K, public payload?: ErrorPayloadOpt<K>) {
    const info = ERRORS_INFO_BY_NAME[name]
    super(info.message)
    this.statusCode = info.statusCode
  }

  static equals(error: any): error is AppError {
    return (
      error?.name !== undefined &&
      error?.message !== undefined &&
      error?.statusCode !== undefined
    )
  }

  static info<K extends AppErrorType>(
    name: K,
  ): { name: K } & typeof ERRORS_INFO_BY_NAME[K] {
    return { name, ...ERRORS_INFO_BY_NAME[name] }
  }
}
