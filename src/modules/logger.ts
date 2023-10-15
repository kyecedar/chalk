enum LOG_STATUS {
	INFO,
	SUCCESS,
	WARNING,
	ERROR,
	FATAL,
}

const log_to_terminal = (_status: LOG_STATUS, ...args: any[]) => {
	for(const _arg in args) {
	}
};

const _logger = {
	/**
	 * Logs to terminal and browser console.
	 */
	info: function(...args: any[]) {
		log_to_terminal(LOG_STATUS.INFO, args);
		console.log(...args);
	},

	success: function(...args: any[]) {
		log_to_terminal(LOG_STATUS.SUCCESS, args);
		console.log(args);
	},

	warn: function(...args: any[]) {
		log_to_terminal(LOG_STATUS.WARNING, args);
		console.warn(args);
	},

	error: function(...args: any[]) {
		log_to_terminal(LOG_STATUS.ERROR, args);
		console.error(...args);
	},

	fatal: function(...args: any[]) {
		log_to_terminal(LOG_STATUS.FATAL, args);
		console.error(...args);
	}
};



declare global {
	var logger: typeof _logger;
}

globalThis.logger = _logger;

export {};