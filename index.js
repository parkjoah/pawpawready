const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/dbconnect');
const authRoutes = require('./routes/auth');

// MongoDB 연결
connectDB();

const app = express();

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우트 설정
app.use('/auth', authRoutes);
// app.use("/community", communityRoutes);

// 루트 경로 처리
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the App</h1><p><a href="/auth/register">Register</a> | <a href="/auth/login">Login</a></p>');
});

// HTTP 서버 생성
const server = http.createServer(app);

// 서버 실행
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
