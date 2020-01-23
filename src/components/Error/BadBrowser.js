import React from 'react'
import 'styled-components/macro'

import {
  OnboardingContainer,
  JustifyContentCenter,
  BASE_SIZE_UNIT
} from '../StyledComponents'

export default () => (
  <JustifyContentCenter>
    <OnboardingContainer css={{ 'justify-content': 'center' }}>
      <p css={{ margin: `${BASE_SIZE_UNIT * 6}px`, 'text-align': 'center' }}>
        We only support Google Chrome on the desktop at the moment. Sorry for
        any inconvenience!
      </p>
    </OnboardingContainer>
  </JustifyContentCenter>
)
