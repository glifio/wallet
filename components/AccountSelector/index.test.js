import React from 'react'
import AccountSelector from '.'
import renderer from 'react-test-renderer'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { Provider } from 'react-redux'

import { initializeStore } from '../../test-utils'
import { initialState } from '../../store/states'
import createPath from '../../utils/createPath'
import { theme, ThemeProvider } from '../Shared'

const wallets = [
  {
    address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
    balance: new FilecoinNumber('1', 'fil'),
    path: createPath(1, 0)
  },
  {
    address: 't1ddlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
    balance: new FilecoinNumber('2', 'fil'),
    path: createPath(1, 1)
  }
]

describe('AccountSelector', () => {
  test('it renders the wallets in redux, and an option to create the next wallet', () => {
    const store = initializeStore(Object.freeze({ ...initialState, wallets }))
    const tree = renderer
      .create(
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <AccountSelector />
          </ThemeProvider>
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it renders an error when an error exists', () => {
    const store = initializeStore(
      Object.freeze({ ...initialState, wallets, error: 'test error message' })
    )
    const tree = renderer
      .create(
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <AccountSelector />
          </ThemeProvider>
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
