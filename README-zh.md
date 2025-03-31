# dev-torun
node.js监听目录变化，延时执行命令

配置说明
- `config.listen_dir`：监听目录变化
- `config.task_delay`：延迟时间(秒)执行任务；终端输出倒计时
- `config.task_cmd`：执行任务；当`config.listen_dir`修改保存后：
  - 当前有任务在执行：等到执行成功后，再次倒计时后执行任务
  - 当前没有任务执行：开始倒计时，然后执行任务
- `config.task_done`：`config.task_cmd`执行成功的回调函数

使用场景

- 组件库自动构建`build`
- 成功回调后，使用 [yalc](https://www.npmjs.com/package/yalc) `publish`，然后在`task_done`回调里面在对应项目路径(`project_cwd`)执行`yalc update`，一般情况下项目会重新构建，第一次有问题的话重启对应项目试试
> **背景**：由于组件库使用`npm link`会有一些奇奇怪怪的问题。
> 这里使用`yalc`来本地模拟真实的`npm包`安装，对项目的影响基本可以忽略；`.gitignore`加上`.yalc`,`package.json`注意一下那个包的版本引用即可


[English](./README.md) | 中文

## 安装

```bash
npm i @zr-lib/dev-torun
```

## 使用

确保在项目下已经执行过 `yalc link your-package`

- 在项目根目录新建 `dev-torun.config.js`
```javascript
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/** @type {import('@zr-lib/dev-torun/types').DevToRunConfig} */
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

- 添加 `npm scripts`
```json
{
  "scripts": {
    "dev-torun": "dev-torun"
  }
}
```

- 终端执行命令

```bash
npm run dev-torun
```

## 实现 

### 监听变化

使用 [chokidar](https://www.npmjs.com/package/chokidar) 监听变化

在 `src/index.js`

```javascript
const chokidar = require('chokidar');
const { handleTask } = require('./dev-torun.js');
const { config, listenStr } = require('./config-tool.js');

module.exports = function devToRun() {
  console.log(listenStr);

  chokidar
    .watch(config.listen_dir, { awaitWriteFinish: { stabilityThreshold: 100 } })
    .on('change', (filepath) => {
      const changeFilePath = `\n\n📢 ${filepath} changed. ${new Date().toLocaleString()}`;
      console.log(changeFilePath);
      handleTask();
    });
};
```

### 终端倒计时

在 `src/dev-torun.js`

```javascript
let countTimer;
/** 终端倒计时 */
function startCountDown(startCount, cb = () => {}) {
  function handleCount(currentCount) {
    if (currentCount <= 0) return cb();
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`⏱️ ==== Waiting: ${currentCount}s ====`, 'utf-8');
    countTimer = setTimeout(() => handleCount(currentCount - 1), 1000);
  }
  handleCount(startCount);
}
```

### 执行任务

task_cmd 支持`&&`串行

在 `src/dev-torun.js`

```javascript
let isTaskRunning = false;
/** 执行任务 */
function runTask(command = '') {
  console.log(`\n\n🌟=====Running:[${command}]=====🌟\n`);
  isTaskRunning = true;
  const taskError = execSync(command, { stdio: 'inherit' });
  if (taskError) throw taskError;
  isTaskRunning = false;

  if (config.task_done) config.task_done();
  console.log(listenStr);
  if (hasNextTask) handleTask();
}

let hasNextTask = false;
function handleTask() {
  hasNextTask = isTaskRunning;
  // 当前有任务在执行，待正常执行结束后将继续执行最新任务
  if (isTaskRunning) return;
  if (countTimer) clearTimeout(countTimer);
  startCountDown(config.task_delay, () => runTask(config.task_cmd));
}
```

### 配置类型 DevToRunConfig
`jsDoc`类型，直接`require('dev-torun/jsTypes/config.types.js');`即可，查看下面 `dev-torun.config.js`使用方式

在 `src/jsTypes/config.types.js`

```javascript
/**
 * @typedef {object} DevToRunConfig
 * @property {string} listen_dir 监听目录(listen directory)
 * @property {number} task_delay 任务延迟/秒(task delay/seconds)
 * @property {string} task_cmd 执行的命令`bash`，支持`&&`串行 (bash command, support `&&`)
 * @property {Function} task_done `task_cmd`执行成功之后的回调(callback after `task_cmd` successed)
 */
```
