const express = require("express");

const app = express();
const port = 3000; // 서버 포트번호

const userRoute = require("./routes/userRoute");

/**
 * API 응답시 req 받는을때 사용하는 Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoute);

app.listen(port, "0.0.0.0", () => {
  console.log(`서버가 실행됩니다. http://localhost:${port}`);
});
