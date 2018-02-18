import { Router } from "express";

export class ErrorHandleRouter {
	private _router: Router = Router();

	public get(path, handler) {
		return this._router.get(path, wrapper(handler));
	}

	public post(path, handler) {
		return this._router.post(path, wrapper(handler));
	}

	public delete(path, handler) {
		return this._router.delete(path, wrapper(handler));
	}

	public patch(path, handler) {
		return this._router.patch(path, wrapper(handler));
	}

	public get router() {
		return this._router;
	}
}

// catch rejected promises and forward to express's default error handler
const wrapper = func => (req, res, next) => {
	const promise = func(req, res, next);

	if (promise.catch) {
		promise.catch(err => next(err));
	}
};
