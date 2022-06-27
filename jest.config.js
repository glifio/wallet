/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    'multiformats/basics':
      '<rootDir>/node_modules/multiformats/cjs/src/basics.js',
    'multiformats/cid': '<rootDir>/node_modules/multiformats/cjs/src/cid.js',
    multiformats: '<rootDir>/node_modules/multiformats/cjs/src/index.js',
    '@ipld/dag-cbor': '<rootDir>/node_modules/@ipld/dag-cbor/cjs/index.js',
    cborg: '<rootDir>/node_modules/cborg/cjs/cborg.js',
    uint8arrays: '<rootDir>/node_modules/uint8arrays/cjs/src/index.js'
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],
  clearMocks: true,
  fakeTimers: {
    enableGlobally: true
  }
}
