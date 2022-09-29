type AppErrorType = 'UserExistsError' | 'AuthenticationError' | 'UnknownError'

interface ErrorInfo {
  message: string
  statusCode: number
}

const statusCodeMap: Record<AppErrorType, ErrorInfo> = {
  UserExistsError: {
    message: 'User already exists',
    statusCode: 409,
  },
  AuthenticationError: {
    message: 'Invalid username password',
    statusCode: 401,
  },
  UnknownError: {
    message: 'Unknown error',
    statusCode: 500,
  },
}

export default class AppError extends Error {
  public statusCode: number

  constructor(public type: AppErrorType) {
    const info = statusCodeMap[type]
    super(info.message)
    this.statusCode = info.statusCode
  }
}
