type AppErrorType =
  | 'UserExistsError'
  | 'AuthenticationError'
  | 'UnauthorizedError'
  | 'UnknownError'

interface ErrorInfo {
  message: string
  statusCode: number
}

const ERROR_INFO_BY_TYPE: Record<AppErrorType, ErrorInfo> = {
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
  UnknownError: {
    message: 'Unknown error',
    statusCode: 500,
  },
}

type ErrorPayloadOpt<K extends AppErrorType> = K extends 'UserExistsError'
  ? undefined
  : K extends 'AuthenticationError'
  ? undefined
  : K extends 'UnauthorizedError'
  ? {
      isExpiredToken: boolean
    }
  : K extends 'UnknownError'
  ? undefined
  : never

// Common Error

export default class AppError<
  K extends AppErrorType = AppErrorType,
> extends Error {
  public readonly statusCode: number

  constructor(public readonly type: K, public payload?: ErrorPayloadOpt<K>) {
    const info = ERROR_INFO_BY_TYPE[type]
    super(info.message)
    this.statusCode = info.statusCode
  }

  static is(error: unknown): error is AppError {
    return error instanceof AppError
  }

  static getInfo<K extends AppErrorType>(type: K) {
    return { ...ERROR_INFO_BY_TYPE[type], type }
  }
}
