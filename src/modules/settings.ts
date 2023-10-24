type SETTINGS_TYPE =
	"toggle" | "multiple" |
	"string" | "int" | "float" |
	"string-choice" | "int-choice" | "float-choice" |
	"int-range" | "float-range" |
	"function" | "custom";

type SettingsOption =
	SettingsToggleOption |
	SettingsIntRangeOption | SettingsFloatRangeOption |
	SettingsFunctionOption | SettingsCustomOption;

const _settings = class {
	public static chalk : Array<SettingsCategory | SettingsOption> = [];
	public static tree = [];
};

const _SettingsNamespace = class {
	public tree = [];

	public add_category(): SettingsNamespace {
		return this;
	}

	public add_option(): SettingsNamespace {
		return this;
	}
};

const _SettingsCategory = class {
	public tree = [];

	public add_option(): SettingsCategory {
		return this;
	}
};

const _SettingsManager = class {
	constructor() {}

	public set(): SettingsManager {
		return this;
	}
};

const _SettingsToggleOption = class {
	public value        : boolean;
	public defaultValue : boolean;

	constructor(defaultValue: boolean) {
		this.defaultValue = defaultValue;
		this.value = defaultValue;
	}

	public toggle(): void {
		this.value = !this.value;
	}
};

const _SettingsMultipleOption = class {
	public values : { [key: string]: boolean };
	public defaultValues : { [key: string]: boolean };

	constructor(defaultValues: { [key: string]: boolean } = {}) {
		this.defaultValues = defaultValues;
		this.values = defaultValues;
	}

	get(key: string): boolean {
		return this.values[key] ? true : false;
	}

	/**
	 * Cannot create new choices, set the choices 
	 * with the default values in the constructor.
	 * @param key Choice name.
	 * @param value Enabled/disabled.
	 */
	set(key: string, value: boolean): void {
		if(this.values[key] !== undefined)
			this.values[key] = value;
	}
};

const _SettingsIntRangeOption = class {
	public _min          : number;
	public _max          : number;
	public _defaultValue : number;
	public _value        : number;
	public _step         : number;

	public set min(value: number)
	{ this._min = round_step(value, this._step); }
	public get min()
	{ return this._min; }

	public set max(value: number)
	{ this._max = round_step(value, this._step); }
	public get max()
	{ return this._max; }

	public set defaultValue(value: number)
	{ this._defaultValue = round_step(value, this._step); }
	public get defaultValue()
	{ return this._defaultValue; }

	public set value(value: number)
	{ this._value = round_step(value, this._step); }
	public get value()
	{ return this._value; }

	public set step(value: number)
	{ this._step = Math.abs(Math.round(value)); }
	public get step()
	{ return this._step; }

	constructor(min: number = 0, max: number = 100, defaultValue: number = 0, step: number = 1) {
		this._min = round_step(min, step);
		this._max = round_step(max, step);
		this._defaultValue = Math.round(defaultValue);
		this._value = this._defaultValue;
		this._step = Math.abs(Math.round(step));
	}

	public up() {
		this.value += this._step;
	}

	public down() {
		this.value += this._step;
	}
};

const _SettingsFloatRangeOption = class {
	public _min          : number;
	public _max          : number;
	public _defaultValue : number;
	public step          : number;
	public _value        : number;

	public set min(value: number) // https://stackoverflow.com/a/6138087
	{ this._min = round_step_precise(value, this.step); }
	public get min()
	{ return this._min; }

	public set max(value: number)
	{ this._max = round_step_precise(value, this.step); }
	public get max()
	{ return this._max; }

	public set defaultValue(value: number)
	{ this._defaultValue = round_step_precise(value, this.step); }
	public get defaultValue()
	{ return this._defaultValue; }

	public set value(value: number)
	{ this._value = round_step_precise(value, this.step); }
	public get value()
	{ return this._value; }

	constructor(min: number = 0.0, max: number = 100.0, defaultValue: number = 0.0, step: number = 0.1) {
		this._min = round_step_precise(min, step);
		this._max = round_step_precise(max, step);
		this._defaultValue = round_step_precise(defaultValue, step);
		this._value = this._defaultValue;
		this.step = step;
	}

	public up() {
		this.value += this.step;
	}

	public down() {
		this.value += this.step;
	}
};

const _SettingsFuncionOption = class {
	public name : string;
	public description : string;
	public callback : () => void;

	constructor(name: string, description: string, callback: () => void) {
		this.name = name;
		this.description = description;
		this.callback = callback;
	}

	public call(): void {
		return this.callback();
	}
};

const _SettingsCustomOption = class<T> {
	public data : { [key: string]: any } = {};
	public value : T;
	public defaultValue: T;

	public builder : () => HTMLDivElement = function(): HTMLDivElement {
		return document.createElement("div");
	};

	constructor(defaultValue: T) {
		this.value = defaultValue;
		this.defaultValue = defaultValue;
	}

	public set_builder(builder: () => HTMLDivElement): SettingsCustomOption {
		this.builder = builder;
		return this;
	}

	public set_data(key: string, data: any): SettingsCustomOption {
		this.data[key] = data;
		return this;
	}
};

let op = new SettingsCustomOption("shit");

op.set_builder(function() {


	return document.createElement("div");
});

// https://stackoverflow.com/a/29728685
const count_decimals = (x: number): number => {
	x = Math.abs(x);
	let i = 0;
	
	while(x % 1 > 0 && i < 3) {
		++i;
		x *= 10;
	}

	return i;
};

const round_step = (x: number, step: number): number => {
	return Math.round(x / step) * step;
};

const round_step_precise = (x: number, step: number): number => {
	const mult = Math.pow(10, count_decimals(step));
	x *= mult;
	step *= mult;
	return Math.round(x / step) * step / mult;
};

declare global {
	var settings: typeof _settings;
	interface settings extends InstanceType<typeof _settings> {}

	var SettingsToggleOption: typeof _SettingsToggleOption;
	interface SettingsToggleOption extends InstanceType<typeof _SettingsToggleOption> {}

	var SettingsNamespace: typeof _SettingsNamespace;
	interface SettingsNamespace extends InstanceType<typeof _SettingsNamespace> {}

	var SettingsCategory: typeof _SettingsCategory;
	interface SettingsCategory extends InstanceType<typeof _SettingsCategory> {}
	
	var SettingsManager: typeof _SettingsManager;
	interface SettingsManager extends InstanceType<typeof _SettingsManager> {}

	var SettingsIntRangeOption: typeof _SettingsIntRangeOption;
	interface SettingsIntRangeOption extends InstanceType<typeof _SettingsIntRangeOption> {}

	var SettingsFloatRangeOption: typeof _SettingsFloatRangeOption;
	interface SettingsFloatRangeOption extends InstanceType<typeof _SettingsFloatRangeOption> {}

	var SettingsFunctionOption: typeof _SettingsFuncionOption;
	interface SettingsFunctionOption extends InstanceType<typeof _SettingsFuncionOption> {}

	var SettingsCustomOption: typeof _SettingsCustomOption;
	interface SettingsCustomOption extends InstanceType<typeof _SettingsCustomOption> {}
}

globalThis.settings = _settings;
globalThis.SettingsManager = _SettingsManager;

export {};