import { ExternalItemInfo } from './types.js'
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
