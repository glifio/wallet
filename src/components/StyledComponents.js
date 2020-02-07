import styled from 'styled-components'

/* COLOR VARIABLES */
export const FILECOIN_BLUE = '#61d6d9'
export const WHITE = 'white'
export const GRAY = '#bababa'
export const BLACK = 'black'
export const GREEN = 'darkseagreen'
export const SECONDARY_BLUE = 'cornflowerblue'
export const RED = 'red'
export const SECONDARY_RED = 'mediumvioletred'

/* FONTS */
export const TEXT_XSM = '13'
export const TEXT_SM = '18'
export const TEXT_MD = '22'
export const TEXT_LG = '30'

/* SIZING */
export const BASE_SIZE_UNIT = '5'

/* FLEXBOX STYLES */
export const JustifyContentCenter = styled.div`
  display: flex;
  justify-content: center;
`

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.flexDirection};
`

export const JustifyContentContainer = styled(FlexContainer)`
  justify-content: ${props => props.justifyContent};
`

/* COMPONENTS */

export const Wrapper = styled.div`
  display: grid;
  font-size: ${TEXT_XSM}px;
  grid-template-columns: 1fr ${BASE_SIZE_UNIT * 110}px 1fr;
  grid-template-rows: auto 3fr ${BASE_SIZE_UNIT * 62}px auto;
  grid-template-areas:
    'left-gutter account-header right-gutter'
    'left-gutter balance-banner right-gutter'
    'left-gutter message-creator right-gutter'
    'left-gutter transaction-history right-gutter';
`

export const Header = styled.div`
  background-color: ${WHITE};
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr ${BASE_SIZE_UNIT * 110} 1fr;
  margin-bottom: ${BASE_SIZE_UNIT * 6};
  grid-template-areas: 'left-gutter app-title right-gutter';
`

export const AppTitle = styled.div`
  grid-area: app-title;
  margin: ${BASE_SIZE_UNIT * 3}px 0px;
`

export const AppFAQs = styled.div`
  float
`

export const AccountHeader = styled.div`
  grid-area: account-header;
  display: grid;
  grid-template-columns: 7fr 2fr;
  grid-template-rows: 1fr auto;
  grid-row-gap: 7.5px;
  grid-column-gap: ${BASE_SIZE_UNIT * 3}px;
  margin-bottom: ${BASE_SIZE_UNIT * 3}px;
  overflow: hidden;
  grid-template-areas:
    'accountLabel right-gutter'
    'accountDetails switchAccountButton';
`

export const AccountDetailWrapper = styled.div`
  grid-area: accountDetails;
`

export const AccountLabel = styled.div`
  grid-area: accountLabel;
  color: ${GRAY};
  font-weight: bold;
`

export const AccountDetail = styled.div`
  grid-area: accountDetails;
  background-color: ${WHITE};
  padding: ${BASE_SIZE_UNIT}px ${BASE_SIZE_UNIT * 2}px;
`

export const AccountAddress = styled.div`
  word-wrap: break-word;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

export const AccountBalance = styled.span`
  font-weight: bold;
`

export const SwitchAccountButton = styled.button`
  grid-area: switchAccountButton;
  background-color: ${WHITE};
  border: 0;
`

export const BalanceBanner = styled.button`
  grid-area: balance-banner;
  background-color: ${WHITE};
  border: 0;
`

export const BalanceInBanner = styled.div`
  font-size: ${TEXT_LG}px;
  font-weight: 300;
  margin-bottom: ${BASE_SIZE_UNIT * 9}px;
`

export const FilecoinLogo = styled.img`
  width: ${BASE_SIZE_UNIT * 24}px;
  margin-top: ${BASE_SIZE_UNIT * 9}px;
  margin-bottom: ${BASE_SIZE_UNIT * 3}px;
`

export const MessageCreator = styled.div`
  grid-area: message-creator;
  background-color: ${WHITE};
`

export const SectionHeader = styled.div`
  text-align: center;
  color: ${GRAY};
`

export const MessageForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${WHITE};
  padding: ${BASE_SIZE_UNIT * 3}px;
  height: ${BASE_SIZE_UNIT * 50}px;
`

export const InputLabel = styled.div`
  font-weight: bold;
  margin-bottom: ${BASE_SIZE_UNIT}px;
  color: ${GRAY};
`

export const AvailableBalanceLabel = styled.div`
  font-weight: bold;
  margin-bottom: ${BASE_SIZE_UNIT * 2}px;
  color: ${GRAY};
`

export const ButtonBase = styled.button`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  disabled: ${props => props.disabled};
  background: ${props => (props.disabled ? GRAY : FILECOIN_BLUE)};
  color: ${WHITE};
  border: 0;
  border-radius: 4px;
  width: ${BASE_SIZE_UNIT * 24}px;
  height: ${BASE_SIZE_UNIT * 6}px;
  &:focus {
    outline: 0;
  }
`

export const SendButton = styled(ButtonBase)`
  align-self: center;
  justify-self: flex-end;
`

export const TransactionHistory = styled.div`
  grid-area: transaction-history;
`

export const Transaction = styled.div`
  display: grid;
  background-color: ${WHITE};
  padding: ${BASE_SIZE_UNIT * 3}px;
  margin-bottom: ${BASE_SIZE_UNIT * 3}px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: ${BASE_SIZE_UNIT * 14}px auto auto;
  grid-template-areas:
    'transaction-amount transaction-status'
    'transaction-gas transaction-actor-address'
    'transaction-date transaction-message-hash';
`

export const TransactionAmount = styled.div`
  grid-area: transaction-amount;
  font-size: ${BASE_SIZE_UNIT * 6}px;
  font-weight: 300;
  position: relative;
  bottom: ${BASE_SIZE_UNIT * 2}px;
`

export const TransactionStatus = styled.div`
  grid-area: transaction-status;
  text-align: right;
  color: ${WHITE};
  font-weight: bold;
`

export const TransactionStatusText = styled.span`
  background-color: ${GRAY};
  padding: ${BASE_SIZE_UNIT}px ${BASE_SIZE_UNIT}px;
  position: relative;
  top: ${BASE_SIZE_UNIT}px;
`

export const TransactionGas = styled.div`
  grid-area: transaction-gas;
`

export const TransactionActorAddress = styled.div`
  grid-area: transaction-actor-address;
  text-align: right;
`

export const TransactionDate = styled.div`
  grid-area: transaction-date;
`

export const TransactionMessageHash = styled.div`
  grid-area: transaction-message-hash;
  text-align: right;
`

export const EmptyHistoryText = styled.div`
  margin-top: ${BASE_SIZE_UNIT * 6}px;
  margin-bottom: ${BASE_SIZE_UNIT * 6}px;
  font-size: ${TEXT_MD}px;
  background-color: ${WHITE};
  height: ${BASE_SIZE_UNIT * 20}px;
  text-align: center;
  padding-top: ${BASE_SIZE_UNIT * 6}px;
`

export const MessageReview = styled.div`
  margin-top: ${BASE_SIZE_UNIT * 5}px;
  font-size: ${TEXT_SM}px;
  text-align: center;
`

export const MessageReviewSubText = styled.div`
  margin-top: ${BASE_SIZE_UNIT * 6}px;
  margin-bottom: ${BASE_SIZE_UNIT * 5}px;
  font-size: ${TEXT_XSM}px;
`

export const OnboardingContainer = styled.div`
  background-color: ${WHITE};
  border: 1px ${BLACK};
  margin-top ${BASE_SIZE_UNIT * 5}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${BASE_SIZE_UNIT * 72}px;
  width: 40vw;
`

export const UnderlineOnHover = styled(SectionHeader)`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

export const CheckboxInputLabel = styled.label`
  color: ${props => (props.disabled ? GRAY : BLACK)};
  font-size: ${TEXT_XSM}px;
`

export const Checkbox = styled.input`
  margin: ${BASE_SIZE_UNIT}px ${BASE_SIZE_UNIT * 2}px ${BASE_SIZE_UNIT}px
    ${BASE_SIZE_UNIT}px;
`
