import React, { forwardRef } from 'react'
import { color, typography, layout, space, border } from 'styled-system'
import styled from 'styled-components'
import { node, oneOf, number } from 'prop-types'

import theme from '../theme'

const H1Base = styled.h1`
  ${color}
  ${typography}
  ${layout}
  ${space}
`

export const Header = forwardRef(({ children, ...props }, ref) => (
  <H1Base ref={ref} {...theme.textStyles.header} {...props}>
    {children}
  </H1Base>
))

Header.propTypes = { children: node.isRequired }

export const BigTitle = forwardRef(({ children, ...props }, ref) => (
  <H1Base ref={ref} {...theme.textStyles.bigTitle} {...props}>
    {children}
  </H1Base>
))

BigTitle.propTypes = { children: node }
BigTitle.defaultProps = { children: <></> }

const H2Base = styled.h2`
  ${color}
  ${typography}
  ${layout}
  ${space}
`

export const Title = forwardRef(({ children, ...props }, ref) => (
  <H2Base ref={ref} {...theme.textStyles.title} {...props}>
    {children}
  </H2Base>
))

Title.propTypes = { children: node }
Title.defaultProps = { children: <></> }

const TextBase = styled.p`
  ${color}
  ${typography}
  ${layout}
  ${space}
  ${border}
`

export const Text = forwardRef((props, ref) => {
  return (
    <TextBase ref={ref} {...theme.textStyles.text} {...props}>
      {props.children}
    </TextBase>
  )
})

Text.propTypes = { children: node }
Text.defaultProps = { children: <></> }

const H4Base = styled.h4`
  ${color}
  ${typography}
  ${layout}
  ${space}
`

export const Label = forwardRef(({ children, ...props }, ref) => (
  <H4Base m={0} ref={ref} {...props} {...theme.textStyles.label}>
    {children}
  </H4Base>
))

Label.propTypes = { children: node }
Label.defaultProps = { children: <></> }

export const Num = forwardRef(({ children, size, ...props }, ref) => (
  <H2Base ref={ref} {...theme.textStyles.num[size]} {...props}>
    {children}
  </H2Base>
))

Num.propTypes = {
  children: node.isRequired,
  size: oneOf(Object.keys(theme.textStyles.num))
}

export const Highlight = styled.span`
  border-radius: ${props => props.theme.radii[6]};
  padding: 0rem 1rem;
  margin-right: 0.5rem;
  background-color: #ffc0cb;
  ${typography}
`
Highlight.propTypes = {
  fontSize: number.isRequired
}
