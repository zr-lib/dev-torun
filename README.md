# dev-torun
watch dir and run command, config, callback.

A tool for lib, development then building

English | [中文](./README-zh.md)

## Install

```bash
npm i @zr-lib/dev-torun
```

## Usage

- add npm scripts
```json
{
  "scripts": {
    "dev-torun": "dev-torun"
  }
}
```

- run in terminal

```bash
npm run dev-torun
```

## Example

dev-torun.config.js

```js
require('@zr-lib/dev-torun/jsTypes/config.types.js');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/** @type {DevToRunConfig} */
module.exports = {
  listen_dir: './src/',
  task_delay: 5,
  task_cmd: npmCmd + ' run build && yalc publish',
  task_done: () => {
    // console.log(`\n🚀 task_done. ${new Date().toLocaleString()}\n`);
    const path = require('path');
    const { execSync } = require('child_process');
    const project_cwd = path.resolve(__dirname, '../your-project');
    // yalc update, (make sure has run 'yalc link your-package')
    const updateError = execSync('yalc update --replace', { stdio: 'inherit', cwd: project_cwd });
    if (updateError) throw updateError;
    else console.log('\n');
  }
};
```
