import db from '../common/config/prisma/db-client.js'
import { randomUUID } from 'crypto'

export default class UserRepository {
  private static instance: UserRepository

  private constructor() {}

  static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository()
    }
    return UserRepository.instance
  }

  async findUnique(username: string) {
    const exists = await db.user.findUnique({
      where: {
        username,
      },
    })
    return exists
  }

  async save(username: string, passwordHash: string) {
    return await db.user.create({
      data: {
        username, //: `${username}-${randomUUID().substring(0, 2)}`,
        passwordHash,
      },
    })
  }
}
