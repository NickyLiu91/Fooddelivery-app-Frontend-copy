// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const getClientEnvironment = require('../config/env');
const paths = require('../config/paths');

const getEnvFileCode = () => {
  const publicUrl = paths.servedPath.slice(0, -1);
  const env = getClientEnvironment(publicUrl);

  return `window.ENV = ${
    JSON.stringify(env.raw, null, 2)
  }`;
};

const writeEnvFile = () => {
  const envFilePath = paths.appBuildEnv;
  const envFileCode = getEnvFileCode();

  fs.outputFile(envFilePath, envFileCode)
    .catch((err) => {
      console.error(err);
    });
};

writeEnvFile();
