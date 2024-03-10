const { execSync } = require('child_process');
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

exports.handleTask = handleTask;
