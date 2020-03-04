import styled, { keyframes } from 'styled-components'

const LoaderGlyphParent = styled.span`
  display: inline-block;
  height: 48px;
  width: 48px;
  background-color: ${props => props.theme.colors.core.primary};
`

const LoaderGlyphAnimation = keyframes`
 20% { transform:translate(0px, 0px )}
 40% { transform:translate(24px, 0px )}
 60% { transform:translate(24px, 24px )}
 80% { transform:translate(0px, 24px )}
 100% { transform:translate(0px, 0px )}
 `

const LoaderGlyphChild = styled.span`
  display: inline-block;
  height: 24px;
  width: 24px;
  background-color: rgb(26, 0, 102);
  animation-name: ${LoaderGlyphAnimation};
  animation-duration: 2s;
  animation-iteration-count: infinite;
`

export default () => (
  <LoaderGlyphParent>
    <LoaderGlyphChild />
  </LoaderGlyphParent>
)
