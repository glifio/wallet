import styled from 'styled-components'

export const Wrapper = styled.div`
  display: grid;
  font-size: 13px;
  grid-template-columns: 1fr 550px 1fr;
  grid-template-rows: auto 3fr 310px auto;
  grid-template-areas:
    'left-gutter account-header right-gutter'
    'left-gutter balance-banner right-gutter'
    'left-gutter message-creator right-gutter'
    'left-gutter transaction-history right-gutter';
`

export const Header = styled.div`
  background-color: white;
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr 550px 1fr;
  margin-bottom: 30px;
  grid-template-areas: 'left-gutter app-title right-gutter';
`

export const AppTitle = styled.div`
  grid-area: app-title;
  // grid-column: 2 / 3;
  margin: 15px 0px;
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
  grid-column-gap: 15px;
  margin-bottom: 15px;
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
  color: #bababa;
  font-weight: bold;
`

export const AccountDetail = styled.div`
  grid-area: accountDetails;
  background-color: white;
  padding: 7px 12px;
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
  background-color: white;
  border: 0;
`

export const BalanceBanner = styled.button`
  grid-area: balance-banner;
  background-color: white;
  border: 0;
`

export const BalanceInBanner = styled.div`
  font-size: 30px;
  font-weight: 300;
  margin-bottom: 45px;
`

export const FilecoinLogo = styled.img`
  width: 120px;
  margin-top: 45px;
  margin-bottom: 15px;
`

export const MessageCreator = styled.div`
  grid-area: message-creator;
  background-color: white;
`

export const SectionHeader = styled.div`
  text-align: center;
  color: #bababa;
`

export const MessageForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  padding: 15px;
  height: 250px;
`

export const InputLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #bababa;
`

export const AvailableBalanceLabel = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  color: #bababa;
`

export const SendButton = styled.button`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  disabled: ${props => props.disabled};
  background: ${props => (props.disabled ? 'grey' : '#61d6d9')};
  color: white;
  border: 0;
  border-radius: 4px;
  width: 120px;
  align-self: center;
  justify-self: flex-end;
  height: 30px;
`

export const TransactionHistory = styled.div`
  grid-area: transaction-history;
`

export const Transaction = styled.div`
  display: grid;
  background-color: white;
  padding: 15px;
  margin-bottom: 15px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 70px auto auto;
  grid-template-areas:
    'transaction-amount transaction-status'
    'transaction-gas transaction-actor-address'
    'transaction-date transaction-message-hash';
`

export const TransactionAmount = styled.div`
  grid-area: transaction-amount;
  font-size: 30px;
  font-weight: 300;
  position: relative;
  bottom: 11px;
`

export const TransactionStatus = styled.div`
  grid-area: transaction-status;
  text-align: right;
  color: white;
  font-weight: bold;
`

export const TransactionStatusText = styled.span`
  background-color: #bababa;
  padding: 5px 10px;
  position: relative;
  top: 4px;
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
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 22px;
  background-color: white;
  height: 100px;
  text-align: center;
  padding-top: 32px;
`

export const MessageReview = styled.div`
  margin-top: 25px;
  font-size: 18px;
  text-align: center;
`

export const MessageReviewSubText = styled.div`
  margin-top: 30px;
  margin-bottom: 25px;
  font-size: 13px;
`

export const OnboardingContainer = styled.div`
  background-color: white;
  border: 1px black;
  margin-top 78px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 360px;
  width: 30vw;
`

export const UnderlineOnHover = styled(SectionHeader)`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

export const CheckboxInputLabel = styled.label`
  color: ${props => (props.disabled ? '#bababa' : 'black')};
  font-size: 15px;
`

export const Checkbox = styled.input`
  margin: 5px 10px 5px 5px;
`

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
