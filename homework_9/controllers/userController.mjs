import express from 'express'
import UsersDBService from '../models/user/UsersDBService.mjs'
import TypesDBService from '../models/type/TypesDBService.mjs'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs';

class UserController {
  static async usersList(req, res) {
    try {
      const filters = {}
      for (const key in req.query) {
        if (req.query[key]) filters[key] = req.query[key]
      }

      const dataList = await UsersDBService.getList(filters)

      res.render('usersList', {
        users: dataList,
        user: req.user,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async registerForm(req, res) {
    try {
      const id = req.params.id
      let user = null
      if (id) {
        //отримати об"єкт за id
        user = await UsersDBService.getById(id)
      }
      const types = await TypesDBService.getList()

      //відредерити сторінку з формою
      res.render('register', {
        errors: [],
        data: user,
        types,
        user: req.user,
      })
    } catch (err) {
      console.log('Body:', req.body),
      console.log('Query:', req.query)
      res.status(500).json({ error: err.message })
    }
  }
  static async registerUser(req, res) {
    const errors = validationResult(req)
    const data = req.body
    const types = await TypesDBService.getList()

    if (!errors.isEmpty()) {
      if (req.params.id) data.id = req.params.id
      return res.status(400).render('register', {
        errors: errors.array(),
        data,
        types,
        user: req.user,
      })
    }

    try {
      const dataObj = { ...req.body }
      if (req.file) dataObj.img = req.file.filename

      // Обробка для існуючого користувача (редагування)
      if (req.params.id) {
        const existingUser = await UsersDBService.getById(req.params.id)

        // Хешуємо пароль, якщо він змінений
        if (dataObj.password && dataObj.password !== existingUser.password) {
          const salt = await bcrypt.genSalt(10)
          dataObj.password = await bcrypt.hash(dataObj.password, salt)
        } else {
          dataObj.password = existingUser.password // Пароль не змінюємо
        }

        await UsersDBService.update(req.params.id, dataObj)
      } else {
        // Хешуємо пароль для нового користувача
        const salt = await bcrypt.genSalt(10)
        dataObj.password = await bcrypt.hash(dataObj.password, salt)

        await UsersDBService.create(dataObj)
      }

      res.redirect('/users')
    } catch (err) {
      console.error(err)
      res.status(500).render('register', {
        errors: [{ msg: err.message }],
        data,
        types,
        user: req.user,
      })
    }
  }

  static async deleteUser(req, res) {
    try {
      await UsersDBService.deleteById(req.body.id)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete user' })
    }
  }
}

export default UserController
