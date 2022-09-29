import * as brcypt from 'bcrypt'
import { Authentication } from '../routes/api/auth/types.js'
import db from '../common/config/prisma/db-client.js'

const SOLT_ROUNDS = 10

class UserService {
  private static instance: UserService

  private constructor() {}

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async register({ username, password }: Authentication) {
    const exists = await db.user.findUnique({
      where: {
        username,
      },
    })
    if (exists) throw new Error('User aleady exists.')

    // 암호화
    const passwordHash = await brcypt.hash(password, SOLT_ROUNDS)
    const newUser = await db.user.create({
      data: {
        username,
        passwordHash,
      },
    })
    return newUser
  }

  login() {
    return 'logged in!'
  }
}

export default UserService
