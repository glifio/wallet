module.exports = {
  collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '@zondax/filecoin-signer-wasm':
      '<rootDir>/test-utils/mocks/mock-filecoin-signer-wasm.js',
    dayjs: '<rootDir>/test-utils/mocks/mock-dates.js',
    'next/router': '<rootDir>/test-utils/mocks/mock-routing.js',
    '@openworklabs/filecoin-number':
      '<rootDir>/test-utils/mocks/mock-filecoin-number.js',
    '@openworklabs/filecoin-wallet-provider':
      '<rootDir>/test-utils/mocks/mock-wallet-provider.js'
  },
  setupFilesAfterEnv: ['./jest.setup.js']
}
