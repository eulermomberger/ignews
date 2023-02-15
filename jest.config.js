module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/customtypes/', '/.slicemachine/'],
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/setupTests.ts'
  ],
  transform: {
    '^.+\\.(js|jax|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '\\.(scss|css|sass)$': 'identity-obj-proxy'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.tsx',
    '!src/**/*.spec.tsx',
    '!src/**/_app.tsx',
    '!src/**/_document.tsx'
  ],
  coverageReporters: ['lcov', 'json']
};
