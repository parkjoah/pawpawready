const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// 회원가입 화면
router.get('/register', (req, res) => {
  res.render('register');
});

// 로그인 화면
router.get('/login', (req, res) => {
  res.render('login');
});

// 회원가입 처리
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.render('success', { message: 'Registration successful!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Registration failed');
  }
});

// 로그인 처리
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).render('success', { message: 'Invalid credentials' });
    }
    res.render('success', { message: 'Login successful!' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Login failed');
  }
});

module.exports = router;
