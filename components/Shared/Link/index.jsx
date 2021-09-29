import styled from 'styled-components'
import {
  color,
  typography,
  layout,
  space,
  grid,
  position,
  border
} from 'styled-system'
import Link from 'next/link'
import PropTypes from 'prop-types'

export const StyledATag = styled.a.attrs((props) => ({
  color: 'core.primary',
  fontSize: 2,
  rel: props.rel || 'noopener noreferrer',
  target: props.target || 'blank',
  ...props
}))`
  text-decoration: none;
  transition: 0.18s ease-in-out;
  border-bottom: 2px solid ${(props) => props.theme.colors.core.primary}00;
  &:hover {
    border-bottom: 2px solid ${(props) => props.theme.colors.core.primary};
  }
  ${color}
  ${typography}
  ${layout}
  ${position}
  ${grid}
  ${space}
  ${border}
`

export const StyledLink = ({ href, name, ...props }) => {
  return (
    <Link href={href} passHref>
      <StyledATag {...props}>{name}</StyledATag>
    </Link>
  )
}

StyledLink.propTypes = {
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rel: PropTypes.string,
  target: PropTypes.string
}

StyledLink.defaultProps = {
  rel: '',
  target: ''
}
