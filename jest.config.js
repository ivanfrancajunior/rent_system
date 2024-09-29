/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],
  verbose: true,
  forceExit: true,
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  // clearMocks: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
