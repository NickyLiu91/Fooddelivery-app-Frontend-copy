module.exports = {
  'env': {
    'browser': true,
    'jest': true,
    'es6': true,
    'node': true,
  },
  'extends': [
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
    'arrow-parens': 0,
    'import/first': 0,
    'no-console': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'react/no-did-mount-set-state': 0,
  },
  'settings': {
    'import/resolver': {
      'node': {
        'moduleDirectory': ['node_modules', 'src/']
      }
    }
  }
};
