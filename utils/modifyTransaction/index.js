import { gotoRouteWithKeyUrlParams } from '../urlParams'
import { PAGE_SPEED_UP } from '../../constants'

export const speedUpTransaction = (transactionId, router) => {
  gotoRouteWithKeyUrlParams(router, PAGE_SPEED_UP, {
    transactionId: transactionId
  })
}
