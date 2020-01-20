import React from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'

const Question = styled.p`
  margin: 0;
  padding: 0;
  cursor: pointer;
`

export default () => (
  <Container
    css={`
      margin-top: 30px;
    `}
  >
    <p>
      <strong>The basics</strong>
    </p>
    <Accordion defaultActiveKey='0'>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='0'>
          <Question>Click me!</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='0'>
          <Card.Body>Hello! I'm the body</Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='1'>
          <Question>Click me!</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='1'>
          <Card.Body>Hello! I'm another body</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    <div
      css={`
        margin-top: 15px;
      `}
    />
    <Accordion>
      <p>
        <strong>The legalities</strong>
      </p>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='0'>
          <Question>Click me!</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='0'>
          <Card.Body>Hello! I'm the body</Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey='1'>
          <Question>Click me!</Question>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='1'>
          <Card.Body>Hello! I'm another body</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  </Container>
)
