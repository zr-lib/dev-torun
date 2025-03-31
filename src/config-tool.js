const path = require('path');
const fs = require('fs');

const configFilePath = path.resolve(process.cwd() + '/dev-torun.config.js');

if (!fs.existsSync(configFilePath)) {
  console.log('Error: ', configFilePath, 'not found!');
  const exampleConfig = path.resolve(__dirname, '../dev-torun-example.config.js');
  console.log(
    'Touch "dev-torun.config.js", and fill the content like this: \n',
    fs.readFileSync(exampleConfig, { encoding: 'utf-8' })
  );
  process.exit(1);
}

/** @type {import('../types').DevToRunConfig} */
const config = {
  listen_dir: '',
  task_delay: 10,
  task_cmd: '',
  ...require(configFilePath)
};

exports.config = config;
exports.listenStr = `🎲 listen_dir: [${config.listen_dir}], task_cmd: [${config.task_cmd}]`;
