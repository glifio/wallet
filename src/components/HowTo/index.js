import React from 'react'
import 'styled-components/macro'
import Container from 'react-bootstrap/Container'
import { useHistory } from 'react-router-dom'

export default () => {
  const history = useHistory()
  const changeTab = relativeUrl => history.push(relativeUrl)
  return (
    <Container
      css={`
        margin-top: 30px;
        margin-bottom: 50px;
        max-width: 720px !important;
      `}
    >
      <h1 id='how-to-use-the-filecoin-web-wallet-with-your-ledger-device'>
        How to use the Filecoin web wallet with your Ledger device
      </h1>
      <p>
        The Filecoin web wallet is a companion to your Ledger device that helps
        you manage your Filecoin. Your private keys will stay offline on your
        Ledger device and never be shared with your PC.
      </p>
      <p>
        <strong>To use the web wallet you’ll need:</strong>
      </p>
      <ul>
        <li>
          A Ledger device that’s already been{' '}
          <a href='https://support.ledger.com/hc/en-us/articles/360000613793'>
            set up
          </a>
        </li>
        <li>
          <a href='https://support.ledger.com/hc/en-us/articles/360002731113'>
            Up to date firmware
          </a>
        </li>
        <li>Google Chrome</li>
      </ul>
      <p>
        <strong>Install the Filecoin app on your Ledger device:</strong>
      </p>
      <ol>
        <li>Open Ledger Live’s Manger tab.</li>
        <li>Connect and unlock your Ledger device.</li>
        <li>
          If you’re prompted, allow Ledger Live and the manager on your device.
        </li>
        <li>Find Filecoin in the app catalog.</li>
        <li>
          Click the <code>Install</code> button for the Filecoin app.
        </li>
        <li>
          The app will install and you’ll see <code>Processing…</code> on your
          device.
        </li>
        <li>The app shows an install confirmation. </li>
      </ol>
      <p>
        <strong>Set up</strong> <strong>the web wallet:</strong>
      </p>
      <ol>
        <li>Connect and unlock your Ledger device.</li>
        <li>Open the Filecoin app your Ledger device.</li>
        <li>
          Go back to the{' '}
          <a href='/' onclick={() => changeTab('/')}>
            home page.
          </a>
        </li>
        <li>Click the checkboxes to confirm you’ve connected the Ledger.</li>
      </ol>
      <p>
        <strong>Where to see your Filecoin balance:</strong>
      </p>
      <p>
        You’ll see your Filecoin balance under the big Filecoin logo in the
        middle of the screen.
      </p>
      <p>
        <strong>How to receive Filecoin:</strong>
      </p>
      <ul>
        <li>
          Choose an account you want Filecoin sent to via the “Switch Accounts”
          tab.
        </li>
        <li>
          In the top left “Account” section, click “Show address on Ledger” and
          verify that the address on the Ledger device matches the address
          that’s being displayed on your computer.{' '}
        </li>
        <li>
          Share the address with any party that wants to send Filecoin to you.{' '}
        </li>
      </ul>
      <p>
        <strong>How to send Filecoin:</strong>
      </p>
      <ul>
        <li>
          When viewing an account, define the address and amount of Filecoin to
          send in the “Send Filecoin” section, and click “Send”.
        </li>
        <li>Confirm the amount and address you’re sending to.</li>
        <li>
          Ensure the message on your Ledger device matches what you’re
          expecting, and choose “Sign Transaction” on your device.
        </li>
        <li>
          View the transaction and its status in the “Transaction History”
          section.
        </li>
      </ul>
      <p>
        <strong>Support:</strong>
      </p>
      <p>
        To contact us, you can email ahoy@openworklabs.com or DM our Twitter
        account, @openworklabs.{' '}
      </p>
    </Container>
  )
}
