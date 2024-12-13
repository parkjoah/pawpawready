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

//로그인 Success : 메인 화면
router.get('/success',(req,res)=>{
  // if (!req.session.user) {
  //   return res.redirect('/login');
  // }
  res.render('success', { user: req.session.user });
})



// 회원가입 처리
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

     // 사용자 존재 여부 확인
     const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register');
    }
     //비밀번호해시
    const hashedPassword = await bcrypt.hash(password, 10);
     //새 사용자 저장하기 
    const user = new User({ username, password: hashedPassword , email});
    await user.save();

    // 회원가입 성공 후 로그인 페이지로 리다이렉트
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.status(500).render('register');
  }
});

// 로그인 처리
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {

      return res.render('login');
    }
    // 로그인 성공 시 세션에 사용자 정보 저장
    req.session.user = { username: user.username };

    res.redirect('success');
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    res.status(500).render('login');
  }
});

module.exports = router;
