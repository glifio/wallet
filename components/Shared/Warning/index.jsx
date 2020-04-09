import React from 'react'
import PropTypes from 'prop-types'
import Box from '../Box'
import Button from '../Button'
import Glyph from '../Glyph'
import OnboardCard from '../Card/OnboardCard'
import { StyledATag } from '../Link'
import { Text, Title } from '../Typography'

const WarningCard = ({
  description,
  linkhref,
  linkDisplay,
  title,
  onBack,
  onAccept
}) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      width='100%'
      height='90vh'
      alignItems='center'
      justifyContent='center'
      p={4}
    >
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignContent='center'
      >
        <OnboardCard
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          borderColor='status.warning.background'
          bg='status.warning.background'
          color='status.warning.foreground'
          ml={2}
          minHeight={11}
        >
          <Box>
            <Glyph color='status.warning.foreground' acronym='Wn' />
            <Title mt={4} mb={2}>
              {title}
            </Title>
            <Text>{description}</Text>
          </Box>

          <Box>
            <StyledATag
              rel='noopener'
              target='_blank'
              href={linkhref}
              fontSize={3}
              color='core.white'
            >
              {linkDisplay}
            </StyledATag>
          </Box>
        </OnboardCard>
        <Box display='flex' justifyContent='space-between'>
          <Button mt={5} variant='secondary' title='Back' onClick={onBack} />
          <Button
            mt={5}
            variant='primary'
            title='I Understand'
            onClick={onAccept}
          />
        </Box>
      </Box>
    </Box>
  )
}

WarningCard.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  linkhref: PropTypes.string.isRequired,
  linkDisplay: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired
}

export default WarningCard
