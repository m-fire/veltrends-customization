import algoliasearch from 'algoliasearch'

if (!process.env.ALGOLIA_APP_ID) {
  throw new Error('process.env.ALGOLIA_APP_ID is not set')
}

if (!process.env.ALGOLIA_ADMIN_KEY) {
  throw new Error('process.env.ALGOLIA_ADMIN_KEY is not set')
}

export const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY,
)
