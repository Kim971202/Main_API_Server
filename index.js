const express = require("express");

const app = express();
const port = 3000; // 서버 포트번호

const userRoute = require("./routes/userRoute");

app.use("/user", userRoute);


app.listen(port, () => {
  console.log(`서버가 실행됩니다. http://localhost:${port}`);
});
