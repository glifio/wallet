import styled, { css } from 'styled-components'
import {
  Box,
  ButtonV2,
  devices,
  space,
  fontSize,
  baseColors
} from '@glif/react-components'

export const ResponsiveWalletTile = styled.div`
  cursor: default;

  @media (min-width: ${devices.gt.tablet}) {
    position: sticky;
    top: ${space()};

    ${(props) =>
      !props.phishingBannerClosed
        ? css`
            height: calc(100vh - 50px - (${space()} * 3));
          `
        : css`
            height: calc(100vh - (${space()} * 2));
          `}
  }

  @media (max-width: ${devices.tablet}) {
    height: 250px;
  }
`

export const ConnectContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  @media (max-width: ${devices.tablet}) {
    padding: 80px 30px 30px;
  }

  @media (min-width: ${devices.gt.tablet}) {
    padding: ${space('large')} 50px 50px 50px;
  }
`

export const ConnectBtn = styled(ButtonV2)`
  margin-top: ${space()};
`

export const BurnerWallet = styled(ConnectBtn)`
  color: ${(props) => props.theme.colors.core.darkgray};
  border-color: ${(props) => props.theme.colors.core.darkgray};
`

export const TextBox = styled.div`
  font-size: ${fontSize('large')};
  border-radius: 8px;
  margin-top: ${space()};
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (max-width: ${devices.tablet}) {
    padding: 30px;
  }

  @media (min-width: ${devices.gt.tablet}) {
    padding: 80px 40px;
  }

  p {
    margin: 0;
  }
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
