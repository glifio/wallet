import { useContext } from 'react'
import { cleanup, render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import { ConverterWrapper, ConverterContext } from './Converter'
import { flushPromises } from '../test-utils'
import { mocks } from '../test-utils/mocks/mock-filecoin-number'

describe('converter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  afterEach(cleanup)

  test('it renders its children', async () => {
    const { findAllByText } = render(
      <ConverterWrapper>
        <div>child</div>
        <div>child</div>
      </ConverterWrapper>
    )
    const items = await findAllByText(/child/)
    expect(items).toHaveLength(2)
  })

  test('it caches the conversion rate before setting internal state', async () => {
    await act(async () => {
      render(<ConverterWrapper />)
    })
    expect(mocks.cacheConversionRate).toHaveBeenCalledTimes(1)
  })

  test('it exposes the Converter instance via context', async () => {
    const Consumer = () => {
      const value = useContext(ConverterContext)
      if (value.converter) return 'true'
      return 'false'
    }

    let res
    await act(async () => {
      res = render(
        <ConverterWrapper>
          <Consumer />
        </ConverterWrapper>
      )
    })
    await flushPromises()
    expect(true).toBe(true)
    const items = await res.findAllByText(/true/)
    expect(items).toHaveLength(1)
  })
})
