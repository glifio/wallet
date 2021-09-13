import React from 'react'
import { cleanup, render, act, fireEvent } from '@testing-library/react'
import Address from '.'
import ThemeProvider from '../ThemeProvider'

describe('Receive', () => {
  afterEach(cleanup)

  test('it renders correctly', () => {
    const { container } = render(
      <ThemeProvider>
        <Address address='t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy' />
      </ThemeProvider>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it reveals the address when the user clicks reveal', () => {
    const { container, getByText } = render(
      <ThemeProvider>
        <Address address='t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy' />
      </ThemeProvider>
    )

    act(() => {
      fireEvent.click(getByText('Reveal'))
    })

    expect(container.firstChild).toMatchSnapshot()
  })
})
