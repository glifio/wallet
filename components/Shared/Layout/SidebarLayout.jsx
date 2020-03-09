import styled from 'styled-components'

// Sidebar layout w/ implicit sizing & wrap, courtesy of https://every-layout.dev/layouts/sidebar/

// Wrapper wraps the content and applies a negative margin onto "Gutter" - thus acting as a defacto gutter between the Sidebar and Content sections.
export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

// Sidebar grows to adopt the width of its children
export const Sidebar = styled.div`
  flex-grow: 1;
  margin: 0.5rem;
`
// Content is a flexible container with no explicit width (hence basis=0) but which grows to consume all available space. It then wraps once its min-width is reached.
export const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 0;
  flex-grow: 999;
  padding-top: ${props => props.theme.sizes[4]}px;
  margin: 0.5rem;
  min-width: 53%;
`
