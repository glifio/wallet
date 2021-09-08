import { PAGE_HOME, PAGE_SPEED_UP } from '../../constants'

export const persistKeyUrlParams = router => {
  const keyParams = new Set(['network'])

  const newParams = {}

  const currParams = new URLSearchParams(router.query)
  currParams.forEach((val, key) => {
    if (keyParams.has(key)) {
      newParams[key] = val
    }
  })

  return new URLSearchParams(newParams)
}

export const gotoRouteWithKeyUrlParams = (router, routeUrl, extraParams) => {
  const newParams = persistKeyUrlParams(router)
  if (extraParams) {
    Object.keys(extraParams).forEach(key => {
      newParams.append(key, extraParams[key])
    })
  }
  router.push(`${routeUrl}?${newParams.toString()}`)
}

export const gotoPageHomeWithKeyParams = (router, extraParams) => {
  gotoRouteWithKeyUrlParams(router, PAGE_HOME, extraParams)
}
