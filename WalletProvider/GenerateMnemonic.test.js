import { act, cleanup, render } from '@testing-library/react'
import GenerateMnemonic from './GenerateMnemonic'
import mockRustModule from '@zondax/filecoin-signer-wasm'

jest.mock('@zondax/filecoin-signer-wasm')

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

  test('it calls the mnemonic_generate wasm function and setMnemonic prop once the wasm component loads', async () => {
    await act(async () => {
      render(
        <GenerateMnemonic setMnemonic={mockSetMnemonic}>
          <div>Yo</div>
        </GenerateMnemonic>
      )

      expect(mockSetMnemonic).not.toHaveBeenCalled()
      expect(mockRustModule.mnemonic_generate).not.toHaveBeenCalled()
    })

    expect(mockSetMnemonic).toHaveBeenCalled()
    expect(mockRustModule.mnemonic_generate).toHaveBeenCalled()
  })
})
