import cloneDeep from 'lodash.clonedeep';

import { WALLET_LIST, SWITCH_ACCOUNT, ERROR, NEW_ACCOUNT } from './actionTypes';

import {
  initialState,
  newAccount,
  switchAccount,
  walletList,
  error
} from './states';

export default (state = initialState, action) => {
  switch (action.type) {
    case WALLET_LIST: {
      return walletList(cloneDeep(state), action.payload);
    }
    case SWITCH_ACCOUNT: {
      return switchAccount(cloneDeep(state), action.payload);
    }
    case NEW_ACCOUNT: {
      return newAccount(cloneDeep(state), action.payload)
    }
    case ERROR: {
      return error(cloneDeep(state), action.error)
    }
    default:
      return state;
  }
};
