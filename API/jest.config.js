module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testTimeout: 15000,
  reporters: [
    'default',
    ['jest-html-reporters', { publicPath: './reports', filename: 'api-report.html' }],
  ],
};