module.exports = {
  preset: "jest-expo",
  rootDir: ".",
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
