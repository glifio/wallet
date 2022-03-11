import styled from 'styled-components'
import { Box, ButtonV2, space, baseColors } from '@glif/react-components'

export const BurnerWallet = styled(ButtonV2)`
  color: ${(props) => props.theme.colors.core.darkgray};
  border-color: ${(props) => props.theme.colors.core.darkgray};
`

export const Caution = styled(Box)`
  background: rgba(255, 168, 38, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  height: auto;
  padding: 8px 24px;
  margin-top: ${space('large')};
  margin-bottom: ${space('small')};

  > svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  > p {
    margin: 0;
    color: ${baseColors.yellow.mid};
    line-height: 1.5;

    > a {
      &:hover {
        cursor: pointer;
        color: inherit;
      }
    }
  }
`
