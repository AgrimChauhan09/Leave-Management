import { verifyJwt } from "../shared/auth.js";
import { User } from "../models/User.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization ?? "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
    }

    const decoded = verifyJwt(token);
    const user = await User.findById(decoded.sub).select("_id name email role");
    if (!user) return next(Object.assign(new Error("Unauthorized"), { status: 401 }));

    req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email };
    return next();
  } catch (_e) {
    return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
  }
}

export function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, _res, next) => {
    if (!req.user) return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
    if (!allowed.includes(req.user.role)) return next(Object.assign(new Error("Forbidden"), { status: 403 }));
    return next();
  };
}

