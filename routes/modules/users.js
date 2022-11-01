const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

//登錄頁面
router.get('/login', (req, res) => {
  res.render('login')
})

//提交登錄表單
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

//註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

//提交註冊表單
router.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body

  User.findOne({ email })
    .then(user => {
      //若已註冊，資料庫有資料
      if (user) {
        console.log('User aleady exists')
        res.render('register', {
          email,
          password,
          confirmPassword
        })
      } else {
        //若為尚未註冊過的新資料
        console.log('creating new member')
        return User.create({
          email,
          password,
          confirmPassword
        })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
})

//登出
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router