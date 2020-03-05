import React from 'react'
import styled from 'styled-components'

// Sidebar layout w/ implicit sizing & wrap, courtesy of https://every-layout.dev/layouts/sidebar/

// Wrapper wraps the content and applies a negative margin onto "Gutter" - thus acting as a defacto gutter between the Sidebar and Content sections.
const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-grow: 999;

    > * {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 999;
      margin: -0.5rem;
    }

    > * > * {
      /* ↓ applies to both elements */
      margin: 0.5rem;
    }
  }
  `
// Creates an implicit gutter between Sidebar and Content
const Gutter = styled.div``

// Sidebar grows to adopt the width of its children
const Sidebar = styled.div`
  flex-grow: 1;
`
// Content is a flexible container with no explicit width (hence basis=0) but which grows to consume all available space. It then wraps once its min-width is reached.
const Content = styled.div`
  display: flex;
  flex-basis: 0;
  flex-grow: 999;
  justify-content: center;
  padding-top: ${props => props.theme.sizes[4]}px;
  min-width: calc(55% - 1rem);
`
export const SidebarLayout = props => (
  <Wrapper>
    <Gutter>
      <Sidebar>{props.children.sidebar}</Sidebar>
      <Content>{props.children.content}</Content>
    </Gutter>
  </Wrapper>
)
