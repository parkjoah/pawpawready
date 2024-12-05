const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// 회원가입 화면
router.get('/register', (req, res) => {
  res.render('register',{ message: null });
});

// 로그인 화면
router.get('/login', (req, res) => {
  res.render('login', { message: null });
});

//로그인 Success : 메인 화면
router.get('/success',(req,res)=>{
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('success', { user: req.session.user });
})



// 회원가입 처리
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

     // 사용자 존재 여부 확인
     const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { message: '이미 존재하는 사용자입니다.' });
    }
     //비밀번호해시
    const hashedPassword = await bcrypt.hash(password, 10);
     //새 사용자 저장하기 
    const user = new User({ username, password: hashedPassword });
    await user.save();

    // 회원가입 성공 후 로그인 페이지로 리다이렉트
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.status(500).render('register', { message: '회원가입 실패. 다시 시도해주세요.' });
  }
});

// 로그인 처리
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {

      return res.render('login', { message: '잘못된 아이디 또는 비밀번호입니다.' });
    }
    // 로그인 성공 시 세션에 사용자 정보 저장
    req.session.user = { username: user.username };

    res.redirect('success');
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    res.status(500).render('login', { message: '로그인 실패. 다시 시도해주세요.' });
  }
});

module.exports = router;
