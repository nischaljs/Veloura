// jest.config.ts
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/node_modules/**"],
};
