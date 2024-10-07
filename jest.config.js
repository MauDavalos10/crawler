module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      diagnostics: true,
    },
    NODE_ENV: "test",
  },
  moduleNameMapper: {
    "^Components/(.+)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  verbose: true,
};
