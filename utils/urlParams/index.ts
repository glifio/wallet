import { NextRouter } from 'next/router'
import { PAGE } from '../../constants'

const requiredUrlParamsWithDefaults = {
  network: 'f'
}

export const combineExistingNewAndRequiredQueryParams = (
  existingQParams: Record<string, string>,
  newQParams?: Record<string, string>
): URLSearchParams => {
  // @ts-ignore
  const searchParams = new URLSearchParams(existingQParams)
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
  existingQParams: Record<string, string>,
  pageUrl: PAGE,
  options?: {
    // this is to handle nextJS page routing structure
    // while staying compliant with TS compiler
    urlPathExtension?: string[]
    newQueryParams?: Record<string, any>
  }
): string => {
  const newParams = combineExistingNewAndRequiredQueryParams(
    existingQParams,
    options?.newQueryParams
  )

  if (options?.urlPathExtension) {
    return `${pageUrl}/${options.urlPathExtension.join(
      '/'
    )}?${newParams.toString()}`
  }
  return `${pageUrl}?${newParams.toString()}`
}

// maintains the required query params while navigating to pageUrl
export const navigate = (
  router: NextRouter,
  pageUrl: PAGE,
  options?: {
    // this is to handle nextJS page routing structure
    // while staying compliant with TS compiler
    urlPathExtension: string[]
    queryParams?: Record<string, any>
  }
): void => {
  router.push(
    generateRouteWithRequiredUrlParams(
      // router.query and URLSearchParams aren't playing nicely together with typescript,
      // so i'm making some semi aggressive moevs around it because this has been working for a while
      router.query as Record<string, string>,
      pageUrl,
      options
    )
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
