import { ItemsPagingMode } from '../../ItemService.js'
import RecentPaging from './RecentPaging.js'
import TrendingPaging from './TrendingPaging.js'
import PastPaging from './PastPaging.js'

const itemsModePagination = {
  getPagination<K extends ItemsPagingMode>(mode: K) {
    switch (mode) {
      case 'recent':
        return RecentPaging.getInstance()
      case 'trending':
        return TrendingPaging.getInstance()
      case 'past':
        return PastPaging.getInstance()
      default:
        throw new Error(`Unhandled mode: "${mode}"`)
    }
  },
}
export default itemsModePagination

// abstraction
