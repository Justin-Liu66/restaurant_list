const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
  res.render('register')
})

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

module.exports = router