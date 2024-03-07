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
