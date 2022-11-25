import { client } from '../config/axios/client.js'
import AppError from '../error/AppError.js'
import { ExternalItemInfo, HtmlInfo } from './types.js'
import { Validator } from '../util/validates.js'
import metascraper from 'metascraper'
import publisherRule from 'metascraper-publisher'
import authorRule from 'metascraper-author'
import logoRule from 'metascraper-logo-favicon'
import imageRule from 'metascraper-image'

const scrapOpenGraphMetaData = metascraper([
  publisherRule(),
  authorRule(),
  logoRule(),
  imageRule(),
])

export async function getOriginItemInfo(
  url: string,
): Promise<ExternalItemInfo> {
  const { url: validUrl, html } = await extractValidHtmlInfo(url)
  const og = await scrapOpenGraphMetaData({
    url: validUrl,
    html /* Todo: URL 이 있는데 HTML 을 추가로 넣어줘야 하나? 향후 확인할것 */,
  })

  const domain = new URL(validUrl).hostname

  return {
    url: validUrl,
    domain,
    og: {
      publisher: og.publisher ?? domain,
      author: og.author,
      thumbnail: og.image,
      favicon: og.logo,
    },
  }
}

async function extractValidHtmlInfo(url: string): Promise<HtmlInfo> {
  let html: string

  if (Validator.URL.hasProtocol(url)) {
    try {
      const response = await client.get(url)
      html = response.data

      return { url, html }
    } catch (e) {
      throw new AppError('InvalidUrl')
    }
  }

  const withHttps = `https://${url}`
  const withHttp = `http://${url}`

  type FulfilledHtmlResult = PromiseFulfilledResult<{ data: string }>
  const [https, http] = await Promise.allSettled<FulfilledHtmlResult['value']>([
    // all: Promise state 중 하나라도 rejected 가 되면 모두 rejected
    // allSettled: 각각의 Promise state 결과를 배열에 담아 반환
    client.get(withHttps),
    client.get(withHttp),
  ])

  switch ('fulfilled') {
    case https.status:
      return {
        url: withHttps,
        html: (https as FulfilledHtmlResult).value.data,
      }
    case http.status:
      return {
        url: withHttp,
        html: (http as FulfilledHtmlResult).value.data,
      }
    default:
      throw new AppError('InvalidUrl')
  }
}
