export type HtmlInfo = {
  url: string
  html: string
}

export interface ExternalItemInfo {
  url: string
  domain: string

  // Web3.0 meta data: External `Open-Graph` data
  og: {
    publisher: string
    siteName?: string
    favicon?: string
    author?: string
    thumbnail?: string
  }
}
