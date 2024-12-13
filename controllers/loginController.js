const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");


//get login page
//get/
const getLogin = (req,res) =>{
    res.render("login");
};


// login user
// post /
const loginUser = asyncHandler(async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.json({ message: `일치하는 사용자가 없습니다` });
    }

    // 평문 비밀번호 직접 비교
    if (password !== user.password) {
        return res.json({ message: "비밀번호가 맞지 않습니다" });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/success");
});





//REGISTER PAGE
//GET /register
const getRegister = (req,res) =>{
    res.render("register");
}

// register user
// post / register
const registerUser = asyncHandler(async(req,res)=>{
    const { username, password, password2, email } = req.body;
    if (password === password2) {
        // 기존의 해시 코드 제거
        // const hashedPassword = await bcrypt.hash(password, 10);
        // const user = await User.create({ username, password: hashedPassword, email });

        // 평문 비밀번호로 저장
        const user = await User.create({ username, password, email });
        res.json({ message: "Register successful", user });
    } else {
        res.send("register failed");
    }
});

module.exports = {getLogin, loginUser, getRegister,registerUser};
