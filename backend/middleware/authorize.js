// @desc    Authorize user roles
// @param   ...roles - Array of allowed roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

module.exports = authorize;