const _Vector = class {
	public x: number;
	public y: number;

	constructor();
	constructor(x: number, y: number);
	constructor(pos: Position);
	constructor(x?: number | Position, y?: number) {
		x = x || 0;

		if(typeof(x) === "object") {
			this.x = x.x;
			this.y = x.y;
			return;
		}

		this.x = x;
		this.y = y || this.x;
	}

	public set(x: number, y: number): Vector;
	public set(b: number): Vector;
	public set(b: Vector): Vector;
	public set(b: Position): Vector;
	public set(x: number | Vector | Position, y?: number) {
		if(x instanceof Vector || typeof(x) === "object") {
			this.x = x.x;
			this.y = x.y;
			return this;
		}

		this.x = x;
		this.y = y || x;
		return this;
	}

	/**
	 * Sets x and y to 0.
	 * @returns Self.
	 */
	public zeroize(): Vector {
		this.x = 0;
		this.y = 0;
		return this;
	}

	/**
	 * Unitizes vector. (turns it into a unit vector)
	 * @returns Self.
	 */
	public unitize(): Vector {
		const mag = Math.sqrt(this.x * this.x + this.y * this.y);
		this.x = this.x / mag;
		this.y = this.y / mag;
		return this;
	}

	/**
	 * Rounds vector to closest whole numbers.
	 * @returns Self.
	 */
	public round(): Vector {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	}

	/**
	 * Rounds vector up.
	 * @returns Self.
	 */
	public ceil(): Vector {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	}

	/**
	 * Rounds vector down.
	 * @returns Self.
	 */
	public floor(): Vector {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	}

	public add(x: number, y: number): Vector;
	public add(b: number): Vector;
	public add(b: Vector): Vector;
	public add(x: number | Vector, y?: number): Vector {
		if(x instanceof Vector) {
			this.x += x.x;
			this.y += x.y;
			return this;
		}

		this.x += x;
		this.y += y === undefined ? x : y;
		return this;
	}

	public subtract(x: number, y: number): Vector;
	public subtract(b: number): Vector;
	public subtract(b: Vector): Vector;
	public subtract(x: number | Vector, y?: number): Vector {
		if(x instanceof Vector) {
			this.x -= x.x;
			this.y -= x.y;
			return this;
		}

		this.x -= x;
		this.y -= y === undefined ? x : y;
		return this;
	}

	public multiply(x: number, y: number): Vector;
	public multiply(b: number): Vector;
	public multiply(b: Vector): Vector;
	public multiply(x: number | Vector, y?: number): Vector {
		if(x instanceof Vector) {
			this.x *= x.x;
			this.y *= x.y;
			return this;
		}

		this.x *= x;
		this.y *= y === undefined ? x : y;
		return this;
	}

	public divide(x: number, y: number): Vector;
	public divide(b: number): Vector;
	public divide(b: Vector): Vector;
	public divide(x: number | Vector, y?: number): Vector {
		if(x instanceof Vector) {
			this.x /= x.x;
			this.y /= x.y;
			return this;
		}

		this.x /= x;
		this.y /= y === undefined ? x : y;
		return this;
	}
};

declare global {
	interface Position {
		x: number;
		y: number;
	}

	var Vector: typeof _Vector;
	interface Vector extends InstanceType<typeof _Vector> {}
}

globalThis.Vector = _Vector;

export {};