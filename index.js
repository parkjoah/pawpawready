const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
const connectDB = require('./config/dbconnect');
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/loginRoutes')
const session = require('express-session');
const flash = require('connect-flash');

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
app.use(flash()); //플래시
app.use(session({ //세션
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  
}));

// CORS 설정 추가
app.use(cors());

// 라우트 설정
app.use('/auth', authRoutes);
// app.use("/community", communityRoutes);

app.use('/login',loginRoutes);


// 기본 경로
app.get('/', (req, res) => {
  res.redirect('/login')
});


// HTTP 서버 생성
const server = http.createServer(app);

// 서버 실행
const PORT = 9093; // SSH 포트와 동일하게 설정 가능
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
