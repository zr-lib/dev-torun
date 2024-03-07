const { spawn } = require('child_process');
const { config, listenStr } = require('./config-tool.js');
const readline = require('readline');

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

let isTaskRunning = false;
/** 执行任务 */
function runTask(cmdStr = '') {
  console.log(`\n\n✨ ====Running: [${cmdStr}]==== ✨\n`);
  isTaskRunning = true;
  const [command, ...args] = cmdStr.split(' ');
  const taskSp = spawn(command, args, { stdio: 'inherit', cwd: process.cwd() });
  taskSp.on('close', (e) => {
    isTaskRunning = false;
    console.log(`\n✅ Done. ${new Date().toLocaleString()}\n`);
    if (config.task_done) config.task_done();

    setTimeout(() => console.log(listenStr), 1000);
    if (hasNextTask) handleTask();
  });
  taskSp.on('error', (e) => {
    isTaskRunning = false;
    console.warn(1, e.toString());
    process.exit(1);
  });
}

let hasNextTask = false;
function handleTask() {
  hasNextTask = isTaskRunning;
  // 当前有任务在执行，待正常执行结束后将继续执行最新任务
  if (isTaskRunning) return;
  if (countTimer) clearTimeout(countTimer);
  startCountDown(config.task_delay, () => runTask(config.task_cmd));
}

exports.handleTask = handleTask;
