import React, { useState } from 'react'
import styled from 'styled-components'
import { node, string } from 'prop-types'
import { Box, Text, Button, Glyph } from '../../Shared'
import ImportWallet from './Import'

const DevMode = styled(ImportWallet)``

const ExpandableBox = ({ acronym, title, children, ...props }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <Box {...props}>
      {expanded ? (
        <Box
          display='flex'
          flexDirection='column'
          alignSelf='center'
          bg='background.messageHistory'
          px={3}
          py={3}
          border={1}
          borderRadius={2}
        >
          <Box display='flex' alignItems='center' m={2} px={2}>
            <Glyph border={0} acronym={acronym} />
            <Text ml={4} my={0}>
              {title}
            </Text>
          </Box>
          {children}
          <Button
            variant='tertiary'
            title='Close'
            color='core.black'
            m={2}
            border={0}
            p={0}
            onClick={() => setExpanded(false)}
          />
        </Box>
      ) : (
        <DevMode
          alignSelf='center'
          justifySelf='flex-end'
          onClick={() => setExpanded(true)}
          glyphAcronym={acronym}
          title={title}
        />
      )}
    </Box>
  )
}

ExpandableBox.propTypes = {
  acronym: string.isRequired,
  children: node.isRequired,
  title: string.isRequired
}

export default ExpandableBox
