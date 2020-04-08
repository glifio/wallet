import React from 'react'
import cloneDeep from 'lodash.clonedeep'

import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { Provider } from 'react-redux'

import { initializeStore } from '../test-utils/index'
import { initialState } from '../store/states'

const presets = {
  preOnboard: cloneDeep(initialState),
  postOnboard: cloneDeep({ ...initialState, wallets: [] })
}
const preOnboard = {}
const postOnboard = {}

const composeAppTree = (preset = presets[preOnboard], options = {}) => {
  const state = {}
}
