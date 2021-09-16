import { NextRouter } from 'next/router'
import { PAGE } from '../../constants'

const requiredUrlParamsWithDefaults = {
  network: 'f'
}

interface NavigationOptions {
  existingQParams: Record<string, string>
  pageUrl: PAGE
  urlPathExtension?: string[]
  newQueryParams?: Record<string, any>
  maintainQueryParams?: boolean
}

export const combineExistingNewAndRequiredQueryParams = (
  existingQParams: Record<string, string>,
  newQParams?: Record<string, string>,
  maintainQParams?: boolean
): URLSearchParams => {
  // @ts-ignore
  const searchParams = new URLSearchParams(
    !!maintainQParams ? existingQParams : {}
  )
  if (newQParams) {
    for (const param in newQParams) {
      searchParams.set(param, newQParams[param])
    }
  }

  for (const param in requiredUrlParamsWithDefaults) {
    if (!searchParams.get(param)) {
      searchParams.set(param, requiredUrlParamsWithDefaults[param])
    }
  }

  return searchParams
}

export const generateRouteWithRequiredUrlParams = (
  opts: NavigationOptions
): string => {
  const newParams = combineExistingNewAndRequiredQueryParams(
    opts.existingQParams,
    opts?.newQueryParams,
    opts?.maintainQueryParams
  )

  if (opts?.urlPathExtension) {
    return `${opts.pageUrl}/${opts.urlPathExtension.join(
      '/'
    )}?${newParams.toString()}`
  }
  return `${opts.pageUrl}?${newParams.toString()}`
}

// maintains the required query params while navigating to pageUrl
export const navigate = (
  router: NextRouter,
  opts: Omit<NavigationOptions, 'existingQParams'>
): void => {
  router.push(
    generateRouteWithRequiredUrlParams({
      ...opts,
      existingQParams: router.query as Record<string, string>
    })
  )
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
