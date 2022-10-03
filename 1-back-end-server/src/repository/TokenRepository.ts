import db from '../common/config/prisma/db-client.js'

export default class TokenRepository {
  private static instance: TokenRepository

  private constructor() {}

  static getInstance() {
    if (!TokenRepository.instance) {
      TokenRepository.instance = new TokenRepository()
    }
    return TokenRepository.instance
  }

  async save(userId: number) {
    return await db.token.create({
      data: {
        userId,
      },
    })
  }
}
