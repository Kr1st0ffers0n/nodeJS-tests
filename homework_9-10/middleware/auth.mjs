export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({ message: 'Unauthorized' })
}
// ===== Універсальний метод визначення ролей =====
export function ensureRole(roles) {
  return (req, res, next) => {
    if (!req.isAuthenticated() || !req.user || !roles.includes(req.user.type.role)) {
      return res.status(403).json({ message: 'Forbidden' }) // Якщо ролі не збігаються
    }
    next() // Якщо все гаразд, переходимо до наступного middleware або контролера
  }
}

/*
// ==== Для адміна =======
export function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.type.role === 'admin') {
    console.log(req.user.type.role);
      return next()
  }
  res.status(403).json({ message: 'Forbidden' })
}

// === Для менеджера =======
export function ensureManager(req, res, next) {
  if (req.isAuthenticated() && req.user.type.role === 'manager') {
    if (req.isAuthenticated() && req.user) {
      return next()
    }
    res.status(403).json({ message: 'Forbidden' })
  }
}

// ===== Для гостя =======
export function ensureGuest(req, res, next) {
  if (req.isAuthenticated() && req.user.type.role === 'guest') {
    if (req.isAuthenticated() && req.user) {
      return next()
    }
    res.status(403).json({ message: 'Forbidden' })
  }
}
*/
// !!! ===== Зразок об'єкта в БД
/*
_id: 675076829254d6f6be78a219,  ------- тип ObjectId
title: "admin",
permissions: {
  ===== колекція юзерів ======
  users {
    read: true
    add: true
    edit: true
    delete: true
  },
  ===== колекція продуктів =======
  products {
    read: true
    add: true
    edit: true
    delete: true
    role: "admin"
  }
}
*/