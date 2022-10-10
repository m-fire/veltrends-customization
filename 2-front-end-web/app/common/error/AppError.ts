import axios from 'axios'

type AppErrorType =
  | 'UserExistsError'
  | 'AuthenticationError'
  | 'UnauthorizedError'
  | 'BadReqeustError'
  | 'RefreshTokenError'
  | 'UnknownError'

export type ErrorPayloadOpt<K extends AppErrorType> =
  K extends 'UserExistsError'
    ? undefined
    : K extends 'AuthenticationError'
    ? undefined
    : K extends 'UnauthorizedError'
    ? {
        isExpiredToken: boolean
      }
    : K extends 'BadReqeustError'
    ? undefined
    : K extends 'RefreshTokenError'
    ? undefined
    : K extends 'UnknownError'
    ? undefined
    : never

interface ErrorInfo {
  message: string
  statusCode: number
}

const ERRORINFO_BY_TYPE: Record<AppErrorType, ErrorInfo> = {
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
  RefreshTokenError: {
    message: 'Failed to refresh token',
    statusCode: 401,
  },
  UnknownError: {
    message: 'Unknown error',
    statusCode: 500,
  },
}

// Common Error

export default class AppError<
  K extends AppErrorType = AppErrorType,
> extends Error {
  public readonly statusCode: number

  constructor(public readonly type: K, public payload?: ErrorPayloadOpt<K>) {
    const info = ERRORINFO_BY_TYPE[type]
    super(info.message)
    this.name = type
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
    type: K,
  ): typeof ERRORINFO_BY_TYPE[K] & { type: K } {
    return { ...ERRORINFO_BY_TYPE[type], type }
  }

  static extract(error: unknown): AppError {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data
      console.log(`AppError.extract() error, data:`, error, data)
      if (AppError.equals(data)) {
        return data
      }
    }
    return new AppError('UnknownError')
  }
}
