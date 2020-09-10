import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../../test-utils/composeMockAppTree'
import Step1 from './Step1'
import Step2 from './Step2'
import { initialLedgerState } from '../../../../utils/ledger/ledgerStateManagement'

describe('Ledger configuration', () => {
  describe('Step1', () => {
    afterEach(() => {
      jest.clearAllMocks()
      cleanup()
    })

    test('it renders normal wallet step1 correctly, with the right number of steps', () => {
      const { Tree } = composeMockAppTree('preOnboard')
      const { container } = render(
        <Tree>
          <Step1 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(screen.getByText('Step 1')).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders premainnet saft step1 correctly, with the right number of steps', () => {
      const { Tree } = composeMockAppTree('preOnboard')
      const { container } = render(
        <Tree>
          <Step1 premainnetInvestor={true} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders msig step1 correctly, with the right number of steps', () => {
      const { Tree } = composeMockAppTree('preOnboard')
      const { container } = render(
        <Tree>
          <Step1 premainnetInvestor={false} msig={true} setStep={() => {}} />
        </Tree>
      )
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders connectedFailure ledger error in the UI correctly', () => {
      const mockWPState = {
        walletType: null,
        walletProvider: null,
        error: '',
        ledger: {
          ...initialLedgerState,
          connectedFailure: true
        }
      }

      const { Tree } = composeMockAppTree('preOnboard', {
        walletProviderInitialState: mockWPState
      })
      const { container } = render(
        <Tree>
          <Step1 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(
        screen.getByText('Please unlock your Ledger and try again.')
      ).toBeInTheDocument()
      expect(
        screen.getByText('We couldn’t connect to your Ledger Device.')
      ).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders inUseByAnotherApp ledger error in the UI correctly', () => {
      const mockWPState = {
        walletType: null,
        walletProvider: null,
        error: '',
        ledger: {
          ...initialLedgerState,
          inUseByAnotherApp: true
        }
      }

      const { Tree } = composeMockAppTree('preOnboard', {
        walletProviderInitialState: mockWPState
      })
      const { container } = render(
        <Tree>
          <Step1 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(
        screen.getByText(
          'Looks like another app is connected to your Ledger device.'
        )
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          'Please quit any other application using your Ledger device, and try again.'
        )
      ).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Step2', () => {
    afterEach(() => {
      jest.clearAllMocks()
      cleanup()
    })

    test('it renders normal wallet step2 correctly, with the right number of steps', () => {
      const { Tree } = composeMockAppTree('preOnboard')
      const { container } = render(
        <Tree>
          <Step2 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(screen.getByText('Step 2')).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders premainnet saft step2 correctly, with the right number of steps', () => {
      const { Tree } = composeMockAppTree('preOnboard')
      const { container } = render(
        <Tree>
          <Step2 premainnetInvestor={true} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(screen.getByText('Step 3')).toBeInTheDocument()
      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders msig step2 correctly, with the right number of steps', () => {
      const { Tree } = composeMockAppTree('preOnboard')
      const { container } = render(
        <Tree>
          <Step2 premainnetInvestor={false} msig={true} setStep={() => {}} />
        </Tree>
      )
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders connectedFailure ledger error in the UI correctly', () => {
      const mockWPState = {
        walletType: null,
        walletProvider: null,
        error: '',
        ledger: {
          ...initialLedgerState,
          connectedFailure: true
        }
      }

      const { Tree } = composeMockAppTree('preOnboard', {
        walletProviderInitialState: mockWPState
      })
      const { container } = render(
        <Tree>
          <Step2 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(
        screen.getByText('Is your Ledger device plugged in?')
      ).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders inUseByAnotherApp ledger error in the UI correctly', () => {
      const mockWPState = {
        walletType: null,
        walletProvider: null,
        error: '',
        ledger: {
          ...initialLedgerState,
          inUseByAnotherApp: true
        }
      }

      const { Tree } = composeMockAppTree('preOnboard', {
        walletProviderInitialState: mockWPState
      })
      const { container } = render(
        <Tree>
          <Step2 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(
        screen.getByText('Please quit any other App using your Ledger device.')
      ).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders locked ledger error in the UI correctly', () => {
      const mockWPState = {
        walletType: null,
        walletProvider: null,
        error: '',
        ledger: {
          ...initialLedgerState,
          locked: true
        }
      }

      const { Tree } = composeMockAppTree('preOnboard', {
        walletProviderInitialState: mockWPState
      })
      const { container } = render(
        <Tree>
          <Step2 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(
        screen.getByText('Is your Ledger device unlocked?')
      ).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders filecoinAppNotOpen error in the UI correctly', () => {
      const mockWPState = {
        walletType: null,
        walletProvider: null,
        error: '',
        ledger: {
          ...initialLedgerState,
          filecoinAppNotOpen: true
        }
      }

      const { Tree } = composeMockAppTree('preOnboard', {
        walletProviderInitialState: mockWPState
      })
      const { container } = render(
        <Tree>
          <Step2 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(
        screen.getByText('Is the Filecoin App open on your Ledger device?')
      ).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders replug error in the UI correctly', () => {
      const mockWPState = {
        walletType: null,
        walletProvider: null,
        error: '',
        ledger: {
          ...initialLedgerState,
          replug: true
        }
      }

      const { Tree } = composeMockAppTree('preOnboard', {
        walletProviderInitialState: mockWPState
      })
      const { container } = render(
        <Tree>
          <Step2 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(
        screen.getByText(
          'Please unplug and replug your Ledger device, and try again.'
        )
      ).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })

    test('it renders busy error in the UI correctly', () => {
      const mockWPState = {
        walletType: null,
        walletProvider: null,
        error: '',
        ledger: {
          ...initialLedgerState,
          busy: true
        }
      }

      const { Tree } = composeMockAppTree('preOnboard', {
        walletProviderInitialState: mockWPState
      })
      const { container } = render(
        <Tree>
          <Step2 premainnetInvestor={false} msig={false} setStep={() => {}} />
        </Tree>
      )
      expect(
        screen.getByText('Is your Ledger device locked or busy?')
      ).toBeInTheDocument()

      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
