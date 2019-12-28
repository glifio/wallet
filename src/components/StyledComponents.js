import styled from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  font-size: 13px;
  background-color: #F7F7F7;
  grid-template-columns: 1fr 550px 1fr;
  grid-template-rows: 78px auto 3fr 3fr auto;
  grid-template-areas:
  "header header header"
  "left-gutter account-header right-gutter"
  "left-gutter balance-banner right-gutter"
  "left-gutter message-creator right-gutter"
  "left-gutter transaction-history right-gutter"
`;

export const Header = styled.div`
  background-color: white;
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr 550px 1fr;
  margin-bottom: 30px;
  grid-template-areas: "left-gutter app-title right-gutter"
`;

export const AppTitle = styled.div`
  grid-area: app-title;
  // grid-column: 2 / 3;
  margin: 15px 0px;
`;

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
  "accountLabel right-gutter"
  "accountDetails switchAccountButton"
`;

export const AccountDetailWrapper = styled.div`
  grid-area: accountDetails;
`;

export const AccountLabel = styled.div`
  grid-area: accountLabel;
  color: #BABABA;
  font-weight: bold;
`;

export const AccountDetail = styled.div`
  grid-area: accountDetails;
  background-color: white;  
  padding: 7px 12px;
`;

export const AccountAddress = styled.div`
  word-wrap: break-word;
`;

export const AccountBalance = styled.span`
  font-weight: bold;
`;

export const SwitchAccountButton = styled.button`
  grid-area: switchAccountButton;
  background-color: white;
  border: 0;
`;

export const BalanceBanner = styled.button`
  grid-area: balance-banner;
  background-color: white;
  border: 0;
`;

export const BalanceInBanner = styled.div`
  font-size: 30px;
  font-weight: 300;
  margin-bottom: 45px;
`;

export const FilecoinLogo = styled.img`
  width: 120px;
  margin-top: 45px;
  margin-bottom: 15px;
`;

export const MessageCreator = styled.div`
  grid-area: message-creator;
  background-color: white;
  margin-bottom: 30px;
`;

export const SectionHeader = styled.div`
  text-align: center;
  color: #BABABA;
`;

export const MessageForm = styled.div`
display: grid;
background-color: white;
padding: 15px;
grid-template-columns: 1fr 1fr 1fr 1fr;
grid-template-rows: auto auto 70px;
grid-template-areas:
"to-input to-input to-input to-input"
"available-balance available-balance amount-input amount-input"
"left-gutter cancel-button send-button right-gutter"
`;

export const ToInput = styled.div`
  grid-area: to-input;
`;

export const InputLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #BABABA;
`;

export const AvailableBalance = styled.div`
  grid-area: available-balance;
`;

export const AvailableBalanceLabel = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  color: #BABABA;
`;

export const AmountInput = styled.div`
  grid-area: amount-input;
`;

export const CancelButton = styled.button`
  grid-area: cancel-button;
  background: white;
  border: 1px solid gray;
  margin-right: 10px;
  margin-top: 30px;
  border-radius: 4px;
`;

export const SendButton = styled.button`
  grid-area: send-button;
  background: gray;
  color: white;
  border: 0;
  margin-top: 30px;
  border-radius: 4px;
`;

export const TransactionHistory = styled.div`
  grid-area: transaction-history;
`;

export const Transaction = styled.div`
  display: grid;
  background-color: white;
  padding: 15px;
  margin-bottom: 15px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 70px auto auto;
  grid-template-areas: 
  "transaction-amount transaction-status"
  "transaction-gas transaction-actor-address"
  "transaction-date transaction-message-hash"
`;

export const TransactionAmount = styled.div`
  grid-area: transaction-amount;
  font-size: 30px;
  font-weight: 300;
  position: relative;
  bottom: 11px;
`;

export const TransactionStatus = styled.div`
  grid-area: transaction-status;
  text-align: right;
  color: white;
  font-weight: bold;
`;

export const TransactionStatusText = styled.span`
  background-color: #BABABA;
  padding: 5px 10px;
  position: relative;
  top: 4px;
`;

export const TransactionGas = styled.div`
  grid-area: transaction-gas;
`;

export const TransactionActorAddress = styled.div`
  grid-area: transaction-actor-address;
  text-align: right;
`;

export const TransactionDate = styled.div`
  grid-area: transaction-date;
`;

export const TransactionMessageHash = styled.div`
  grid-area: transaction-message-hash;
  text-align: right;
`;

export const EmptyHistoryText = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 22px;
  background-color: white;
  height: 100px;
  text-align: center;
  padding-top: 32px;
`;

export const MessageReview = styled.div`
  grid-area: to-input;
  margin-top: 10px;
  font-size: 22px;
  text-align: center;
`;

export const MessageReviewSubText = styled.div`
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 13px;
`;
