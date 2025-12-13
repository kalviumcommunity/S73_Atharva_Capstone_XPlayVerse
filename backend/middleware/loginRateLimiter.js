import rateLimit from "express-rate-limit";

const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 5 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

export default loginRateLimiter;
