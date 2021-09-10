/**
 * @jest-environment jsdom
 */

// import '@testing-library/jest-dom/extend-expect'
// import { cleanup } from '@testing-library/react'
// import { renderHook } from '@testing-library/react-hooks'
// import { cache } from 'swr'

// import { useMsig, MsigProviderWrapper } from '.'
// import composeMockAppTree from '../test-utils/composeMockAppTree'

// waiting on https://github.com/vercel/swr/issues/1444
describe.skip('Multisig provider', () => {
  // afterEach(cleanup)

  // beforeEach(() => {
  //   jest.clearAllMocks()
  // })

  test('useMsig hook exposes a method to set multisig address', () => {
    // const { result } = renderHook(() => useMsig(), { wrapper: Tree })
    expect(true).toBe(true)
  })
})
