import { generateRouteWithRequiredUrlParams } from '.'
import { PAGE } from '../../constants'

describe('generateRouteWithRequiredUrlParams', () => {
  test('it adds the required params when generating navigation urls', () => {
    const route = generateRouteWithRequiredUrlParams({
      existingQParams: {},
      pageUrl: PAGE.MSIG_HOME
    })
    expect(route.includes(PAGE.MSIG_HOME)).toBe(true)
    expect(route.includes('?network=f')).toBe(true)
  })

  test('it does not change the required params when generating navigation urls', () => {
    const route = generateRouteWithRequiredUrlParams({
      existingQParams: { network: 't' },
      pageUrl: PAGE.MSIG_HOME
    })

    expect(route.includes(PAGE.MSIG_HOME)).toBe(true)
    expect(route.includes('?network=t')).toBe(true)
  })

  test('it allows for adding new query params', () => {
    const route = generateRouteWithRequiredUrlParams({
      existingQParams: { network: 't' },
      pageUrl: PAGE.MSIG_HOME,
      newQueryParams: { test: 'value' }
    })

    expect(route.includes(PAGE.MSIG_HOME)).toBe(true)
    expect(route.includes('network=t')).toBe(true)
    expect(route.includes('test=value')).toBe(true)

    const route2 = generateRouteWithRequiredUrlParams({
      existingQParams: { network: 'f' },
      pageUrl: PAGE.MSIG_HOME,
      newQueryParams: { test: 'value' }
    })

    expect(route2.includes(PAGE.MSIG_HOME)).toBe(true)
    expect(route2.includes('network=f')).toBe(true)
    expect(route2.includes('test=value')).toBe(true)
  })

  test('it allows for adding computed paths', () => {
    const route = generateRouteWithRequiredUrlParams({
      existingQParams: { network: 't' },
      pageUrl: PAGE.MSIG_HOME,
      urlPathExtension: ['extension']
    })

    expect(route.includes(PAGE.MSIG_HOME)).toBe(true)
    expect(route.includes('network=t')).toBe(true)
    expect(route.includes('/extension')).toBe(true)

    const route2 = generateRouteWithRequiredUrlParams({
      existingQParams: {},
      pageUrl: PAGE.MSIG_HOME,
      urlPathExtension: ['extension']
    })

    expect(route2.includes(PAGE.MSIG_HOME)).toBe(true)
    expect(route2.includes('network=f')).toBe(true)
    expect(route2.includes('/extension')).toBe(true)
  })

  test('it deletes not required q params by default', () => {
    const route = generateRouteWithRequiredUrlParams({
      existingQParams: { network: 't', param2: 'kobe' },
      pageUrl: PAGE.MSIG_HOME,
      urlPathExtension: ['extension', 'second-extension'],
      newQueryParams: {
        test: 'value',
        test2: 'thingy'
      }
    })

    expect(route.includes(PAGE.MSIG_HOME)).toBe(true)
    expect(route.includes('network=t')).toBe(true)
    expect(route.includes('param2=kobe')).toBe(false)
    expect(route.includes('/extension/second-extension')).toBe(true)
  })

  test('it works for the most complex cases', () => {
    const route = generateRouteWithRequiredUrlParams({
      existingQParams: { network: 't', param2: 'kobe' },
      pageUrl: PAGE.MSIG_HOME,
      maintainQueryParams: true,
      urlPathExtension: ['extension', 'second-extension'],
      newQueryParams: {
        test: 'value',
        test2: 'thingy'
      }
    })

    expect(route.includes(PAGE.MSIG_HOME)).toBe(true)
    expect(route.includes('network=t')).toBe(true)
    expect(route.includes('param2=kobe')).toBe(true)
    expect(route.includes('/extension/second-extension')).toBe(true)
  })
})
