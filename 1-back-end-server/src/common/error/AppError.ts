export type AppErrorType =
  | 'UserExists'
  | 'Authentication'
  | 'Unauthorized'
  | 'BadRequest'
  | 'RefreshFailure'
  | 'Forbidden'
  | 'NotFound'
  | 'InvalidUrl'
  | 'AlreadyExists'
  | 'Unknown'

export type ErrorPayloadOpt<K extends AppErrorType> = K extends 'Unauthorized'
  ? {
      isExpiredToken: boolean
    }
  : K extends 'BadRequest' | 'Forbidden'
  ? {
      message: string
    }
  : undefined
// : K extends '....Type'
// ? {
//     prop: type
//   }
// : undefined

interface ErrorInfo {
  message: string
  statusCode: number
}

const ERROR_INFO_MAP: Record<AppErrorType, ErrorInfo> = {
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
  Forbidden: {
    message: 'Forbidden',
    statusCode: 403,
  },
  NotFound: {
    message: 'Not found',
    statusCode: 404,
  },
  InvalidUrl: {
    message: 'Invalid URL',
    statusCode: 422,
  },
  AlreadyExists: {
    message: 'The data already exists',
    statusCode: 409,
  },
  Unknown: {
    message: 'Unknown error',
    statusCode: 500,
  },
} as const

// Common Error

export default class AppError<
  K extends AppErrorType = AppErrorType,
> extends Error {
  public readonly statusCode: number

  constructor(
    public readonly name: K,
    public payload?: ErrorPayloadOpt<K> & { message?: string },
  ) {
    const info = ERROR_INFO_MAP[name]
    super(payload?.message ?? info.message)
    if (payload?.message != null) {
      delete payload.message
    }
    this.statusCode = info.statusCode
  }

  static is(error: any): error is AppError {
    return (
      error?.name !== undefined &&
      error?.message !== undefined &&
      error?.statusCode !== undefined
    )
  }

  static info<K extends AppErrorType>(
    name: K,
  ): { name: K } & typeof ERROR_INFO_MAP[K] {
    return { name, ...ERROR_INFO_MAP[name] }
  }
}
