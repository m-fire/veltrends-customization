export default class TokenRepository {
  private static instance: TokenRepository

  private constructor() {}

  static getInstance() {
    if (!TokenRepository.instance) {
      TokenRepository.instance = new TokenRepository()
    }
    return TokenRepository.instance
  }
}
