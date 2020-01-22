import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import 'styled-components/macro'

import {
  JustifyContentContainer,
  UnderlineOnHover,
  Button
} from '../../StyledComponents'

const Text = styled.p`
  font-size: 13px;
  color: #bababa;
`

const TextLabel = styled.label`
  font-size: 13px;
  color: black;
  background-color: #61d6d9;
  width: 75px;
  line-height: 2;
  border-radius: 4px;
`

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
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
    width: 10px;
    height: 10px;
    border-radius: 4px;
    background: #61d6d9;
    cursor: pointer;
  }

  ::-moz-range-thumb {
    width: 10px;
    height: 10px;
    background:
    cursor: pointer;
  }
`

const GasLimitInput = styled.input`
  font-size: 13px;
  width: 60px;
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

const OptionButtons = styled(Button).attrs(() => {
  return {
    type: 'button'
  }
})`
  border: ${props => `1px solid ${props.color}`};
  background-color: white;
  color: ${props => `${props.color}`};
  font-size: 13px;
  margin-bottom: 3px;
  width: 70px;
`

const GasConfig = ({ gasLimit, gasPrice, setGasPrice, setGasLimit }) => {
  const [configOpen, setConfigOpen] = useState(false)
  const [gasPriceLocal, setGasPriceLocal] = useState(gasPrice)
  const [gasLimitLocal, setGasLimitLocal] = useState(gasLimit)
  return (
    <div
      css={`
        margin-top: 20px;
      `}
    >
      {configOpen ? (
        <JustifyContentContainer
          flexDirection='row'
          justifyContent='space-between'
        >
          <div
            css={`
              margin-right: 50px;
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
                margin-bottom: 15px;
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
                  margin-right: 10px;
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
                  margin-left: 10px;
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
                  margin-top: 15px;
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
              width: 100px;
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
          css={{ 'font-size': '13px' }}
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
