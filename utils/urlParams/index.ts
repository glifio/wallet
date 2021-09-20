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
  const searchParams = new URLSearchParams(existingQParams)

  // delete q params if the maintainQParams flag is not set
  if (!maintainQParams) {
    // @ts-ignore line
    for (const [key] of searchParams) {
      if (!requiredUrlParamsWithDefaults[key]) {
        searchParams.delete(key)
      }
    }
  }

  // add new query params
  if (newQParams) {
    for (const param in newQParams) {
      searchParams.set(param, newQParams[param])
    }
  }

  // patch required q params if not present
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

export const resetWallet = () => {
  // a full page reload will reset the wallet
  window?.location?.reload()
}
