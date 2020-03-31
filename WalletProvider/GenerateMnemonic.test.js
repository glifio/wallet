import { act, cleanup, render } from '@testing-library/react'
import GenerateMnemonic from './GenerateMnemonic'

describe('Mnemonic generator', () => {
  afterEach(cleanup)

  let mockSetMnemonic
  beforeEach(() => {
    jest.clearAllMocks()
    mockSetMnemonic = jest.fn()
  })

  test('it does not render children', async () => {
    await act(async () => {
      const { container } = render(
        <GenerateMnemonic setMnemonic={mockSetMnemonic}>
          <div>Yo</div>
        </GenerateMnemonic>
      )
      expect(container.firstChild).toBeNull()
    })
  })
})
