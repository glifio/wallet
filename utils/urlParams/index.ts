import { NextRouter } from 'next/router'
import { PAGE } from '../../constants'

const requiredUrlParamsWithDefaults = {}

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
  const searchParams = new URLSearchParams(existingQParams)

  // delete q params if the maintainQParams flag is not set
  if (!maintainQParams) {
    for (const [key] of [...searchParams.entries()]) {
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
  let maintain: boolean = true
  // default to maintain
  if (typeof opts?.maintainQueryParams !== 'undefined')
    maintain = opts.maintainQueryParams

  const newParams = combineExistingNewAndRequiredQueryParams(
    opts.existingQParams,
    opts?.newQueryParams,
    maintain
  )

  if (opts?.urlPathExtension) {
    let route = `${opts.pageUrl}/${opts.urlPathExtension.join('/')}`

    if (newParams.toString().length > 0) {
      route += `?${newParams.toString()}`
    }

    return route
  }

  if (!newParams.toString()) {
    return opts.pageUrl
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
      existingQParams: {}
    })
  )
}

export const resetWallet = () => {
  // a full page reload will reset the wallet
  window?.location?.reload()
}
