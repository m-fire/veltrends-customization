import RecentListing from './RecentListing.js'
import TrendingListing from './TrendingListing.js'
import PastListing from './PastListing.js'
import { ListMode } from '../../core/pagination/types.js'

/* Todo:  기존 class 기반 모듈을 TS Type & Interface 기반으로 변경 */

class ItemsListingStrategy {
  static getStrategy<K extends ListMode>(mode: K) {
    switch (mode) {
      case 'recent':
        return RecentListing.getInstance()
      case 'trending':
        return TrendingListing.getInstance()
      case 'past':
        return PastListing.getInstance()
      default:
        throw new Error(`Unhandled mode: "${mode}"`)
    }
  }
}
export default ItemsListingStrategy
