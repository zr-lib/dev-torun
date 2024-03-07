# dev-torun
watch dir and run command, config, callback.

A tool for lib, development then building

[中文](./README-zh.md)

## Install

```bash
npm i @zr-lib/check-model
```

## Usage

- add npm scripts
```json
{
  //...
  "scripts": {
    "dev-torun": "dev-torun"
  }
  //...
}
```

- run in terminal

```bash
npm run dev-torun
```

## Example

dev-torun.config.js

```js
require('dev-torun/jsTypes/config.types.js');

/** @type {DevToRunConfig} */
module.exports = {
  listen_dir: './src/',
  task_delay: 5,
  task_cmd: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run build`,
  task_done: () => {
    // console.log(`🚀 task_done callback. ${new Date().toLocaleString()}\n`);
    const { execSync, exec } = require('child_process');
    // lib: yalc publish
    const publishEx = execSync('yalc publish', { stdio: 'inherit' });
    if (publishEx) throw publishEx;

    const path = require('path');
    const project_cwd = path.resolve(process.cwd(), '../your-project');
    // project: yalc update
    const updateEx = execSync('yalc update', { stdio: 'inherit', cwd: project_cwd });
    if (updateEx) throw updateEx;
    else console.log('\n');
  }
};

```
