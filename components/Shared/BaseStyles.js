import React from 'react'
import PropTypes, { node } from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'
import { color, typography, space } from 'styled-system'
import { normalize } from 'polished'
import theme from './theme'

const GlobalStyle = createGlobalStyle`
  ${normalize()}
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
`

const Base = ({ children, ...rest }) => {
  return (
    <div {...rest}>
      <GlobalStyle />
      {children}
    </div>
  )
}

Base.propTypes = {
  children: node.isRequired
}

const BaseStyles = styled(Base)`
  ${space};
  ${typography};
  ${color};
`

BaseStyles.defaultProps = {
  fontSize: '2',
  fontFamily: 'sansSerif',
  color: 'text',
  theme
}

BaseStyles.propTypes = {
  ...typography.propTypes,
  ...space.propTypes,
  ...color.propTypes,
  theme: PropTypes.object
}

export default BaseStyles
