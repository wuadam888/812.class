const express = require('express');
const cors = require('cors');
const app = express();

// --- 中介軟體 (Middleware) ---
app.use(cors()); // 允許所有跨來源請求 (開發時方便，正式環境可能要設定更嚴謹)
app.use(express.json()); // 讓 Express 能夠解析請求中 JSON 格式的資料

// --- 暫時用記憶體儲存資料 (注意：伺服器重啟資料會消失！) ---
// 把原本在 HTML 裡的帳號搬過來
let accounts = [
      { username: '81201', password: '123456', isAdmin: false },
      { username: '81202', password: '123456', isAdmin: false },
      { username: '81203', password: '123456', isAdmin: false },
      { username: '81206', password: '123456', isAdmin: false },
      { username: '81208', password: '123456', isAdmin: false },
      { username: '81209', password: '123456', isAdmin: false },
      { username: '81213', password: '123456', isAdmin: false },
      { username: '81226', password: '123456', isAdmin: true },
      { username: '81227', password: '123456', isAdmin: false },
      { username: '81229', password: '123456', isAdmin: false },
      { username: '81230', password: '123456', isAdmin: false },
      { username: '81231', password: '123456', isAdmin: false },
      { username: '81232', password: '123456', isAdmin: false },
      { username: '81233', password: '123456', isAdmin: false },
      { username: '81234', password: '123456', isAdmin: false },
      { username: '81237', password: '123456', isAdmin: false }
];
let posts = []; // 文章也先存在記憶體

// --- API 路由 (Endpoints) ---

// 測試路由：確認伺服器是否活著
app.get('/', (req, res) => {
  res.send('哈囉！812 後端伺服器運行中！');
});

// 登入 API
app.post('/login', (req, res) => {
  const { username, password } = req.body; // 取得從前端送來的帳密
  console.log('Login attempt:', username); // 在後端印出log，方便除錯

  const account = accounts.find(acc => acc.username === username && acc.password === password);

  if (account) {
    console.log('Login successful for:', username);
    // 只回傳必要的用戶資訊，不要回傳密碼！
    res.json({ username: account.username, isAdmin: account.isAdmin });
  } else {
    console.log('Login failed for:', username);
    // 使用 401 Unauthorized 狀態碼表示驗證失敗
    res.status(401).json({ message: '帳號或密碼錯誤' });
  }
});

// 取得所有文章 API
app.get('/posts', (req, res) => {
  // 把最新的文章放前面
  res.json([...posts].reverse());
});

// 新增文章 API
app.post('/posts', (req, res) => {
  // **注意：** 這裡需要驗證使用者是否登入！
  // 暫時先假設前端會傳送 author 過來，之後要改成用 token 驗證
  const { content, author } = req.body;
  if (!content || !author) {
    return res.status(400).json({ message: '缺少文章內容或作者' });
  }

  const newPost = {
    id: Date.now(), // 簡單用時間戳當 ID
    author: author,
    content: content,
    date: new Date().toLocaleString()
  };
  posts.push(newPost);
  console.log('New post added by:', author);
  // 回傳 201 Created 狀態碼表示資源成功建立
  res.status(201).json(newPost);
});

// **(其他 API，例如刪除文章、改密碼，可以之後再加)**

// --- 啟動伺服器 ---
const PORT = process.env.PORT || 3000; // Render 會提供 PORT 環境變數
app.listen(PORT, () => {
  console.log(`伺服器正在監聽 port ${PORT}...`);
});