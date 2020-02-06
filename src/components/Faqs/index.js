import React from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'

const Question = styled.p`
  margin: 0;
  padding: 0;
  cursor: pointer;
`

export default () => (
  <Container
    css={`
      margin-top: 30px;
    `}
  >
    <p>
      <strong>The basics</strong>
    </p>
    <Accordion defaultActiveKey='0'>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='0'>
          <Question>What is a wallet?</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='0'>
          <Card.Body>
            A wallet is a public/private key pair. Your private key is a secret,
            it should be kept safe and secure in a place where no one else can
            access it. Your public key is available for anyone to see on the
            network. Your wallet’s address (starts with the letter “t” or “f”)
            is what you see on this app - it’s a reformatted version of your
            public key and is the information you should give anyone else trying
            to send you Filecoin.
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='1'>
          <Question>Does this site store my private keys?</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='1'>
          <Card.Body>
            We do not store any information about your private keys. Wallets can
            be imported or created for each session, but as soon as you refresh
            the page or leave your computer idol, we erase your private keys
            from memory. It is your responsibility to store keys in a safe and
            secure location.
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='2'>
          <Question>How can I create additional wallets?</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='2'>
          <Card.Body>
            In the top right corner, select the accounts/network button to
            switch wallets. If you don’t see any other options, it’s because you
            chose to import a single wallet into our app.
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='3'>
          <Question>
            What do I do if I lost my seed phrase or private key?
          </Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='3'>
          <Card.Body>
            We’re really sorry, but there isn’t much we can help with if you
            lose your seed phrase or private key. For security reasons, we do
            not copy your private information or back it up anywhere.
          </Card.Body>
        </Accordion.Collapse>
        <Accordion.Toggle as={Card.Header} eventKey='4'>
          <Question>Where can I get Filecoin?</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='4'>
          <Card.Body>
            You can't buy Filecoin here right now, but after mainnet launch
            you'll be able to buy Filecoin from a number of exchanges.
            <br />
            <br />
            <div>
              If you're using the testnet, you can get test Filecoin from a{' '}
              <a href='https://faucet.testnet.filecoin.io/'>faucet</a>.
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    <div
      css={`
        margin-top: 15px;
      `}
    />
    {/* <Accordion>
      <p>
        <strong>The legalities</strong>
      </p>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='0'>
          <Question>Click me!</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='0'>
          <Card.Body>Hello! I'm the body</Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='1'>
          <Question>Click me!</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='1'>
          <Card.Body>Hello! I'm another body</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion> */}
  </Container>
)
