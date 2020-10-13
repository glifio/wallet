import React from 'react'
import PropTypes from 'prop-types'
import Box from '../Box'
import Button from '../Button'
import Glyph from '../Glyph'
import OnboardCard from '../Card/OnboardCard'
import { StyledATag } from '../Link'
import { Text, Title } from '../Typography'

const DescriptionText = ({ description }) => {
  if (typeof description === 'string') {
    return <Text>{description}</Text>
  }

  return (
    <>
      {description.map(d => (
        <Text mt={0}>{d}</Text>
      ))}
    </>
  )
}

DescriptionText.propTypes = {
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
}

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
      alignItems='center'
      justifyContent='flex-start'
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
          ml={2}
          minHeight={11}
          p={0}
        >
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            bg='status.warning.background'
            p={3}
          >
            <Glyph
              color='status.warning.foreground'
              bg='status.warning.background'
              acronym='Wn'
            />
            <Title color='status.warning.foreground'>{title}</Title>
          </Box>
          <Box px={3} py={4}>
            <DescriptionText color='core.nearblack' description={description} />

            <StyledATag
              rel='noopener'
              target='_blank'
              href={linkhref}
              fontSize={3}
            >
              {linkDisplay}
            </StyledATag>
          </Box>
        </OnboardCard>
        {onAccept && onBack && (
          <Box display='flex' justifyContent='space-between'>
            <Button mt={5} variant='secondary' title='Back' onClick={onBack} />
            <Button
              mt={5}
              variant='primary'
              title='I Understand'
              onClick={onAccept}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

WarningCard.propTypes = {
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  title: PropTypes.string.isRequired,
  linkhref: PropTypes.string.isRequired,
  linkDisplay: PropTypes.string.isRequired,
  onBack: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.oneOf([null])
  ]),
  onAccept: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.oneOf([null])
  ])
}

WarningCard.defaultProps = {
  onBack: null,
  onAccept: null
}

export default WarningCard
