/**
 * @typedef {object} DevToRunConfig
 * @property {string} listen_dir 监听目录(listen directory)
 * @property {number} task_delay 任务延迟/秒(task delay/seconds)
 * @property {string} task_cmd 执行的命令`bash`，支持`&&`串行 (bash command, support `&&`)
 * @property {Function} task_done `task_cmd`执行成功之后的回调(callback after `task_cmd` successed)
 */
