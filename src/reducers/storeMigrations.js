// create migration every time when:
// 1. permissions update
// 2. change store structure
const migrations = {
  0: state => ({
    ...state,
    auth: {},
  }),
};

const lastVersion = Object.keys(migrations)[Object.keys(migrations).length - 1];

export { migrations, lastVersion };
