module.exports = {
    roots: ["<rootDir>"],
    transform: {
      "^.+\\.ts$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    modulePathIgnorePatterns: [
      "<rootDir>/node_modules",
      "<rootDir>/dist",
    ],
    preset: "ts-jest",
    coverageReporters: ['lcov', 'text-summary', 'clover']
  };
  