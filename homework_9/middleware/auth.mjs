export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({ message: 'Unauthorized' })
}

export function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    if (req.isAuthenticated() && req.user) {
      return next()
    }
    res.status(403).json({ message: 'Forbidden' })
  }
}
/*
export function ensureManager(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'manager') {
    if (req.isAuthenticated() && req.user) {
      return next()
    }
    res.status(403).json({ message: 'Forbidden' })
  }
}
export function ensureGuest(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'guest') {
    if (req.isAuthenticated() && req.user) {
      return next()
    }
    res.status(403).json({ message: 'Forbidden' })
  }
}
*/