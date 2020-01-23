import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import 'styled-components/macro'

import {
  JustifyContentContainer,
  UnderlineOnHover,
  ButtonBase,
  TEXT_XSM,
  GRAY,
  BLACK,
  FILECOIN_BLUE,
  BASE_SIZE_UNIT,
  WHITE
} from '../../StyledComponents'

const Text = styled.p`
  font-size: ${TEXT_XSM}px;
  color: ${GRAY};
`

const TextLabel = styled.label`
  font-size: ${TEXT_XSM}px;
  color: ${BLACK};
  background-color: ${FILECOIN_BLUE};
  width: ${BASE_SIZE_UNIT * 15}px;
  line-height: 2;
  border-radius: 4px;
`

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: ${BASE_SIZE_UNIT}px;
  border-radius: 4px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &:hover: {
    opacity: 1;
  }

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: ${BASE_SIZE_UNIT * 2}px;
    height: ${BASE_SIZE_UNIT * 2}px;
    border-radius: 4px;
    background: ${FILECOIN_BLUE};
    cursor: pointer;
  }

  ::-moz-range-thumb {
    width: ${BASE_SIZE_UNIT * 2}px;
    height: ${BASE_SIZE_UNIT * 2}px;
    cursor: pointer;
  }
`

const GasLimitInput = styled.input`
  font-size: ${TEXT_XSM}px;
  width: ${BASE_SIZE_UNIT * 12}px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  transition-property: border-color, box-shadow;
  transition-duration: 0.14s, 0.15s;
  transition-timing-function: ease-in-out, ease-in-out;
  transition-delay: 0s, 0s;
  padding: 3px;

  &:focus {
    outline: 0;
  }
`

const OptionButtons = styled(ButtonBase).attrs(() => {
  return {
    type: 'button'
  }
})`
  border: ${props => `1px solid ${props.color}`};
  background-color: ${WHITE};
  color: ${props => `${props.color}`};
  font-size: ${TEXT_XSM}px;
  margin-bottom: ${BASE_SIZE_UNIT}px;
  width: ${BASE_SIZE_UNIT * 14}px;
`

const GasConfig = ({ gasLimit, gasPrice, setGasPrice, setGasLimit }) => {
  const [configOpen, setConfigOpen] = useState(false)
  const [gasPriceLocal, setGasPriceLocal] = useState(gasPrice)
  const [gasLimitLocal, setGasLimitLocal] = useState(gasLimit)
  return (
    <div
      css={`
        margin-top: ${BASE_SIZE_UNIT * 4}px;
      `}
    >
      {configOpen ? (
        <JustifyContentContainer
          flexDirection='row'
          justifyContent='space-between'
        >
          <div
            css={`
              margin-right: ${BASE_SIZE_UNIT * 10}px;
            `}
          />
          <div
            css={`
              flex-grow: 2;
            `}
          >
            <JustifyContentContainer
              flexDirection='row'
              justifyContent='space-between'
              css={`
                align-items: center;
                margin-bottom: ${BASE_SIZE_UNIT * 3}px;
              `}
            >
              <Text
                css={`
                  margin: 0;
                `}
              >
                Gas price:
              </Text>
              <TextLabel
                css={`
                  margin: 0;
                `}
                htmlFor='gasPrice'
              >
                {gasPriceLocal} AttoFil
              </TextLabel>
            </JustifyContentContainer>
            <JustifyContentContainer
              flexDirection='row'
              justifyContent='space-between'
              css={`
                align-items: center;
              `}
            >
              <Text
                css={`
                  margin-bottom: 0;
                  margin-right: ${BASE_SIZE_UNIT * 2}px;
                `}
              >
                Slow
              </Text>

              <Slider
                type='range'
                min='1'
                max='100'
                value={gasPriceLocal}
                onChange={e => setGasPriceLocal(e.target.value)}
                name='gasPrice'
                id='gasPrice'
              />

              <Text
                css={`
                  margin-bottom: 0;
                  margin-left: ${BASE_SIZE_UNIT * 2}px;
                `}
              >
                Fast
              </Text>
            </JustifyContentContainer>
            <JustifyContentContainer
              flexDirection='row'
              justifyContent='space-between'
              css={`
                align-items: center;
              `}
            >
              <Text
                css={`
                  margin-top: ${BASE_SIZE_UNIT * 3}px;
                `}
              >
                Gas limit:
              </Text>
              <GasLimitInput
                type='number'
                min='1'
                max='10000'
                aria-describedby='gasLimit'
                name='gasLimit'
                value={gasLimitLocal}
                onChange={e => setGasLimitLocal(e.target.value)}
              />
            </JustifyContentContainer>
          </div>
          <JustifyContentContainer
            flexDirection='column'
            justifyContent='end'
            css={`
              width: ${BASE_SIZE_UNIT * 20}px;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
            `}
          >
            <OptionButtons
              onClick={() => {
                setGasPrice(gasPriceLocal)
                setGasLimit(gasLimitLocal)
                setConfigOpen(false)
              }}
              color='darkseagreen'
            >
              Save
            </OptionButtons>
            <OptionButtons
              onClick={() => {
                setGasLimitLocal('1000')
                setGasPriceLocal('1')
              }}
              color='cornflowerblue'
            >
              Default
            </OptionButtons>
            <OptionButtons
              onClick={() => {
                setConfigOpen(false)
                setGasLimitLocal(gasLimit)
                setGasPriceLocal(gasPrice)
              }}
              color='mediumvioletred'
            >
              Cancel
            </OptionButtons>
          </JustifyContentContainer>
        </JustifyContentContainer>
      ) : (
        <UnderlineOnHover
          onClick={() => setConfigOpen(true)}
          css={{ 'font-size': `${TEXT_XSM}px` }}
        >
          Average network fee: ~128 AttoFil
        </UnderlineOnHover>
      )}
    </div>
  )
}

GasConfig.propTypes = {
  gasLimit: PropTypes.string.isRequired,
  gasPrice: PropTypes.string.isRequired,
  setGasPrice: PropTypes.func.isRequired,
  setGasLimit: PropTypes.func.isRequired
}

export default GasConfig
