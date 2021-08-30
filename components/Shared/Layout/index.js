import styled from 'styled-components'
export * from './SidebarLayout'
export { default as ContentContainer } from './Container'

import {
 SCREEN_MAX_WIDTH
} from '../../../constants'

export const PageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* Temp implementation to simplistically handle large scale displays. This should be removed and a more dynamic solution introduced e.g https://css-tricks.com/optimizing-large-scale-displays/  */
  max-width: ${SCREEN_MAX_WIDTH}px;
  margin: 0 auto;
  min-height: 100vh;
`
