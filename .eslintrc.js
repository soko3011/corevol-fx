// module.exports = {
//   root: true,
//   env: {
//     node: true
//   },
//   extends: [
//     "plugin:vue/essential",
//     "eslint:recommended"
//     //'@vue/standard'
//   ],
//   parserOptions: {
//     parser: "babel-eslint"
//   },
//   rules: {
//     "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
//     "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
//   }
// };

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
