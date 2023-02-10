import db from '../core/config/prisma/index.js'

class PublisherService {
  static async createPublisher({ domain, name, favicon }: GetPublisherParams) {
    const exists = await db.publisher.findUnique({ where: { domain } })
    if (exists) return exists

    const publisher = await db.publisher.create({
      data: { domain, name, favicon },
    })

    return publisher
  }
}
export default PublisherService

interface GetPublisherParams {
  domain: string
  name: string
  favicon?: string
}
