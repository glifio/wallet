jest.mock('axios')

import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import axios from 'axios'

import InvestorOnboard from './InvestorOnboard'
import Home from './Home'
import composeMockAppTree from '../../test-utils/composeMockAppTree'
import { flushPromises } from '../../test-utils'

describe('investor', () => {
  describe('Investor Onboard', () => {
    afterEach(() => {
      jest.clearAllMocks()
      cleanup()
    })

    test('it renders correctly', () => {
      const { Tree } = composeMockAppTree('preOnboard')
      const { container } = render(
        <Tree>
          <InvestorOnboard setWalletType={() => {}} />
        </Tree>
      )
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(container.firstChild).toMatchSnapshot()
    })

    test('it rejects bad investor IDs correctly', () => {
      const { Tree } = composeMockAppTree('preOnboard')
      const { container } = render(
        <Tree>
          <InvestorOnboard setWalletType={() => {}} />
        </Tree>
      )

      act(() => {
        fireEvent.click(screen.getAllByPlaceholderText('ID')[0])
        fireEvent.change(screen.getAllByPlaceholderText('ID')[0], {
          target: {
            value: 'bad investor id'
          }
        })
        fireEvent.click(screen.getByText('Submit'))
      })
      expect(screen.getByText('Invalid investor ID.')).toBeInTheDocument()
      expect(container.firstChild).toMatchSnapshot()
    })

    test('it accepts valid investor IDs', async () => {
      const { Tree } = composeMockAppTree('preOnboard')
      render(
        <Tree>
          <InvestorOnboard setWalletType={() => {}} />
        </Tree>
      )

      await act(async () => {
        fireEvent.click(screen.getAllByPlaceholderText('ID')[0])
        fireEvent.change(screen.getAllByPlaceholderText('ID')[0], {
          target: {
            value: 'Qmcv45ZPc3oEwsbcHMRcs3AG59Rp8EUFr6Dm512KUswpRA'
          }
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Submit'))
      })
      expect(screen.getByText('Step 2')).toBeInTheDocument()
    })
  })

  describe('Home', () => {
    test('it renders correctly', () => {
      const { Tree } = composeMockAppTree('postInvestorOnboard')
      const { container } = render(
        <Tree>
          <Home setWalletType={() => {}} />
        </Tree>
      )
      expect(screen.getByText('Step 4')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Filecoin address/).value).toBe(
        't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'
      )
      expect(screen.getByPlaceholderText(/InvestorID/).value).toBe(
        'Qmcv45ZPc3oEwsbcHMRcs3AG59Rp8EUFr6Dm512KUswpRA'
      )
      expect(screen.getByText('Show address on device')).toBeInTheDocument()
      expect(container.firstChild).toMatchSnapshot()
    })

    test('it sends the magic string to PL', async () => {
      const { Tree } = composeMockAppTree('postInvestorOnboard')
      const { container } = render(
        <Tree>
          <Home setWalletType={() => {}} />
        </Tree>
      )

      await act(async () => {
        fireEvent.click(screen.getByText('Generate string'))
        await flushPromises()
      })

      const payload = {
        address: 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi',
        hash:
          'fb97c41fb9a1e8fce8ed5386b2201abecbf5d90c6fa5b1a9f246034f9ba4c9a1',
        magicString:
          '74317a323235746775676778346f6e626175696d7176787a75746f707a6472326d3473367a367767692c516d637634355a5063336f4577736263484d52637333414735395270384555467236446d3531324b5573777052413a61633465653536613537316335643965326437383831623364333136313364626430666638636330626161663137626665326237333363616363643137333632'
      }

      expect(JSON.stringify(axios.post.mock.calls[0][1])).toBe(
        JSON.stringify(payload)
      )
      expect(screen.getByText('Step 5')).toBeInTheDocument()
      expect(screen.getByText(/Copy string/)).toBeInTheDocument()
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
