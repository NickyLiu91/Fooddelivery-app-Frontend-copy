module.exports = {
  'env': {
    'browser': true,
    'jest': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'react-app',
    'airbnb',
  ],
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    }
  },
  'rules': {
    'no-underscore-dangle': ['error', { 'allow': ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] }],
    'import/order': ['off'], // Relative imports can precede absolute ones in components
  },
  'settings': {
    'import/resolver': {
      'node': {
        'moduleDirectory': ['node_modules', 'src/']
      }
    }
  }
};
