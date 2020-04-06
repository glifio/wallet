import React from 'react'
import { cleanup, render, act, fireEvent } from '@testing-library/react'
import Receive from '.'
import noop from '../../utils/noop'
import { ThemeProvider } from '../Shared'

describe('Receive', () => {
  afterEach(cleanup)

  test('it renders correctly', () => {
    const { container } = render(
      <ThemeProvider>
        <Receive
          address='t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
          close={noop}
        />
      </ThemeProvider>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it reveals the address when the user clicks reveal', () => {
    const { container, getByText } = render(
      <ThemeProvider>
        <Receive
          address='t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
          close={noop}
        />
      </ThemeProvider>
    )

    act(() => {
      fireEvent.click(getByText('Reveal'))
    })

    expect(container.firstChild).toMatchSnapshot()
  })
})
