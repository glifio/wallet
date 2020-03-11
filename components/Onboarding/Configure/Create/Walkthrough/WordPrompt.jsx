import React from 'react'
import PropTypes from 'prop-types'

const WordPrompt = ({ word }) => {
  return <div>{word}</div>
}

WordPrompt.propTypes = {
  word: PropTypes.string.isRequired
}

export default WordPrompt
