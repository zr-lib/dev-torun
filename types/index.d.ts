export type DevToRunConfig = {
	/** 监听目录(listen directory) */
	listen_dir: string;
	/** 任务延迟/秒(task delay/seconds) */
	task_delay: number;
	/** 执行的命令`bash`，支持`&&`串行 (bash command, support `&&`) */
	task_cmd: string;
	/** `task_cmd`执行成功之后的回调(callback after `task_cmd` successed) */
	task_done: () => void;
}
