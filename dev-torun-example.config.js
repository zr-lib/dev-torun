const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/** @type {import('./types').DevToRunConfig} */
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
