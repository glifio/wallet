import { NextRouter } from 'next/router'
import { PAGE } from '../../constants'

const requiredUrlParams = ['network']

export const persistRequiredUrlParams = (router: NextRouter) => {
  const keyParams = new Set([...requiredUrlParams])

  const newParams = {}

  // @ts-ignore
  const currParams = new URLSearchParams(router.query)
  currParams.forEach((val, key) => {
    if (keyParams.has(key)) {
      newParams[key] = val
    }
  })

  return new URLSearchParams(newParams)
}

export const generateRouteWithRequiredUrlParams = (
  router: NextRouter,
  pageUrl: PAGE,
  extraParams?: Record<string, any>
): string => {
  const newParams = persistRequiredUrlParams(router)
  if (extraParams) {
    Object.keys(extraParams).forEach(key => {
      newParams.append(key, extraParams[key])
    })
  }

  return `${pageUrl}?${newParams.toString()}`
}

// maintains the required query params while navigating to pageUrl
export const navigate = (
  router: NextRouter,
  pageUrl: PAGE,
  extraParams: Record<string, any>
): void => {
  router.push(generateRouteWithRequiredUrlParams(router, pageUrl, extraParams))
}

export const detectPage = (router: NextRouter) => {
  // We're using the pathname as a routing page id
  // These are matched against the pathnames declared in /constants.js
  // Note that for next.js dynamic urls, the pathname will returned in the form like this /[cid]
  // so it will still match a dynamic url's string declared in constants.
  return router.pathname
}

export const resetWallet = () => {
  // a full page reload will reset the wallet
  window?.location?.reload()
}
