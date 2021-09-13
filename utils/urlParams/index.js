import { PAGE_HOME } from '../../constants'

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

export const detectPage = router => {
  // We're using the pathname as a routing page id
  // These are matched against the pathnames declared in /constants.js
  // Note that for next.js dynamic urls, the pathname will returned in the form like this /[cid]
  // so it will still match a dynamic url's string declared in constants.
  return router.pathname
}

export const resetWallet = () => {
  // a full page reload will reset the wallet
  window.location.reload()
}
