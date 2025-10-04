import AppError from "../utils/AppError.js";

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError("You are not authenticated", 401));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError(`You are not an ${allowedRoles.join('or ')}`, 403));
        }
        next();
    }
}