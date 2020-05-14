// create migration every time when:
// 1. permissions update
// 2. change store structure
const migrations = {
  0: state => ({
    ...state,
    auth: {},
  }),
  1: state => ({
    ...state,
    auth: {},
  }),
  2: state => ({
    ...state,
    auth: {},
  }),
  3: state => ({
    ...state,
    auth: {},
  }),
  4: state => ({
    ...state,
    auth: {
      authenticated: false,
    },
  }),
  5: state => ({
    ...state,
    auth: {
      authenticated: false,
    },
  }),
  6: state => ({
    ...state,
    auth: {
      authenticated: false,
    },
  }),
  7: state => ({
    ...state,
    auth: {
      authenticated: false,
      user: {
        restaurant: {},
      },
    },
  }),
};

const lastVersion = Object.keys(migrations)[Object.keys(migrations).length - 1];

export { migrations, lastVersion };
