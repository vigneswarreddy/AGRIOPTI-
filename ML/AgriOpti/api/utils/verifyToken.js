import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import logger from "./logger.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user.id === req.params.userId || req.user.role === "admin") {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};

export const verifyRole = (roles) => (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (roles.includes(req.user.role)) {
            next();
        } else {
            return next(createError(403, "You are not authorized for this action!"));
        }
    });
};
