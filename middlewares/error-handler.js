
export function notFoundError(req, res, next) {
    const err = new Error("Not Found");
    res.status(404);
    next(err);
}
export function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500).json({ message: err.message });
}