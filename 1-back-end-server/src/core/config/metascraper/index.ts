import metascraper from 'metascraper'
import publisherRule from 'metascraper-publisher'
import authorRule from 'metascraper-author'
import logoRule from 'metascraper-logo-favicon'
import imageRule from 'metascraper-image'

export const scrapOpenGraphMetaData = metascraper([
  publisherRule(),
  authorRule(),
  logoRule(),
  imageRule(),
])
