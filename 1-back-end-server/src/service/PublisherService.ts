import { Publisher } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'

export default class PublisherService {
  private static instance: PublisherService

  static getInstance() {
    if (!PublisherService.instance) {
      PublisherService.instance = new PublisherService()
    }
    return PublisherService.instance
  }

  private constructor() {}

  async createPublisher({ domain, name, favicon }: GetPublisherParams) {
    const exists = await db.publisher.findUnique({ where: { domain } })
    if (exists) return exists

    const publisher = await db.publisher.create({
      data: { domain, name, favicon },
    })

    return publisher
  }
}

interface GetPublisherParams {
  domain: string
  name: string
  favicon?: string
}
