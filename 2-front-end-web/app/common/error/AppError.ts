import axios from 'axios'

type AppErrorType =
  | 'UserExists'
  | 'Authentication'
  | 'Unauthorized'
  | 'BadRequest'
  | 'RefreshFailure'
  | 'InvalidUrl'
  | 'Unknown'

export type ErrorPayloadOpt<K extends AppErrorType> = K extends 'Unauthorized'
  ? {
      isExpiredToken: boolean
    }
  : K extends 'BadRequest'
  ? {
      message: string
    }
  : undefined

interface ErrorInfo {
  message: string
  statusCode: number
}

export const APP_ERRORS_INFO: Record<AppErrorType, ErrorInfo> = {
  UserExists: {
    message: 'User already exists',
    statusCode: 409,
  },
  Authentication: {
    message: 'Invalid username password',
    statusCode: 401,
  },
  Unauthorized: {
    message: 'Unauthorized',
    statusCode: 401,
  },
  BadRequest: {
    message: 'Bad reqeust',
    statusCode: 400,
  },
  RefreshFailure: {
    message: 'Failed to refresh token',
    statusCode: 401,
  },
  InvalidUrl: {
    message: 'Invalid URL',
    statusCode: 422,
  },
  Unknown: {
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
    const info = APP_ERRORS_INFO[type]
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
  ): typeof APP_ERRORS_INFO[K] & { type: K } {
    return { ...APP_ERRORS_INFO[type], type }
  }

  static extract(error: unknown): AppError {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data
      console.log(`AppError.extract() error, data:`, error, data)
      if (AppError.equals(data)) {
        return data
      }
    }
    return new AppError('Unknown')
  }
}
