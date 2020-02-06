import React from 'react'
import 'styled-components/macro'
import Container from 'react-bootstrap/Container'

export default () => (
  <Container
    css={`
      margin-top: 30px;
      padding-left: 200px !important;
    `}
  >
    <div
      css={`
        margin-bottom: 10px;
      `}
    >
      This app is made by Open Work Labs, LLC and Protocol Labs, Inc.
    </div>
    <div
      css={`
        margin-bottom: 10px;
      `}
    >
      To report bugs, please format your report like this:{' '}
    </div>
    <div>
      <ul>
        <li>Operating system and version: [Mac OS 10.14.5] </li>
        <li>Browser and version: [Google Chrome 79.0.3]</li>
        <li>Public address (if any): [t0mrck2h5tfwdieolmd4y]</li>
        <li>Issue: [Explain issue here]</li>
      </ul>
    </div>
    <div>
      And email them to Open Work Labs at{' '}
      <a href='mailto:ahoy@openworklabs.com'>ahoy@openworklabs.com</a>.
    </div>
  </Container>
)
