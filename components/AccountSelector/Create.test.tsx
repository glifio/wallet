import React from 'react'
import { render, act, screen, cleanup, fireEvent } from '@testing-library/react'
import { ThemeProvider, theme } from '@glif/react-components'

import Create from './Create'
import { flushPromises } from '../../test-utils'

describe('Create Account', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })
  test('it calls the callback with the right network and index', () => {
    const mock = jest.fn()
    const nextAccountIdx = 1
    act(() => {
      render(
        <ThemeProvider theme={theme}>
          <Create
            onClick={mock}
            loading={false}
            nextAccountIndex={nextAccountIdx}
            errorMsg=''
          />
        </ThemeProvider>
      )
      fireEvent.click(screen.getByText('Create'))
    })

    expect(mock).toHaveBeenCalledWith(nextAccountIdx, 'f')
  })

  test('it calls the callback with the right network and index 2', async () => {
    const mock = jest.fn()
    const nextAccountIdx = 5

    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Create
            onClick={mock}
            loading={false}
            nextAccountIndex={nextAccountIdx}
            errorMsg=''
          />
        </ThemeProvider>
      )
      fireEvent.click(screen.getByText(/Legacy/))
      await flushPromises()
      fireEvent.click(screen.getByText('Create'))
    })

    expect(mock).toHaveBeenCalledWith(nextAccountIdx, 't')
  })
})
