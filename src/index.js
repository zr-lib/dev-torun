const chokidar = require('chokidar');
const { handleTask } = require('./dev-torun.js');
const { config, listenStr } = require('./config-tool.js');

module.exports = function devToRun() {
  console.log(listenStr);

  // TODO: 无变化时不触发任务，看看chokidar参数配置
  chokidar
    .watch(config.listen_dir, { awaitWriteFinish: { stabilityThreshold: 100 } })
    .on('change', (filepath) => {
      const changeFilePath = `\n\n📢 ${filepath} changed. ${new Date().toLocaleString()}`;
      console.log(changeFilePath);
      handleTask();
    });
};
