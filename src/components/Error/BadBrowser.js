import React from 'react'
import 'styled-components/macro'

import { OnboardingContainer, JustifyContentCenter } from '../StyledComponents'

export default () => (
  <JustifyContentCenter>
    <OnboardingContainer css={{ 'justify-content': 'center' }}>
      <p css={{ margin: '30px', 'text-align': 'center' }}>
        We only support Google Chrome on the desktop at the moment. Sorry for
        any inconvenience!
      </p>
    </OnboardingContainer>
  </JustifyContentCenter>
)
