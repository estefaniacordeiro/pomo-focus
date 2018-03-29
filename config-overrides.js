const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config, env) {
  // do something with the webpack config....
  config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css'}], config);
  return config;
}