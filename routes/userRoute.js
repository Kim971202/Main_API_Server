let express = require("express");
let router = express.Router();
const pool = require("../DB/pool");
const jwt = require("../utils/token");

//Token Test
router.get("/token", async (req, res) => {
  const user = "myUser@email.com";

  const jwtToken = await jwt.sign(user);

  return res.status(200).send(jwtToken.token);
});

//사용자 조회
router.get("/getUserList", async (req, res, next) => {
  let {
    serviceKey = "111111111", // 서비스 인증키
    numOfRows = 10, //           페이지 당 결과수
    pageNo = 1, //               페이지 번호
    dongCode = "101", //        동코드
    hoCode = "101", //          호코드
    doubleDataFlag = "Y", //     2배수 데이터 사용여부
    userType = "1", //        유저타입: ALL: 모든 유저, 0: 클라우드 유저, 1: 로컬유저
  } = req.query;

  console.log(
    serviceKey,
    numOfRows,
    pageNo,
    dongCode,
    hoCode,
    doubleDataFlag,
    userType
  );
  console.log(req.query); // 요청 본문 출력

  try {
    //ALL인 경우만 %으로 검색 그 외 경우는 받은값 그대로 검색
    if (userType === "ALL") userType = "%";

    const sql1 = `SELECT user_idx AS userIdx, user_name AS userName, user_age AS userAge, user_nick_name AS userNickName, 
                         DATE_FORMAT(insert_dtime, '%Y%m%d') AS insertDtime,
                         CASE
                                WHEN user_type = 0
                                THEN 'Cloud User'
                                WHEN user_type = 1
                                THEN 'Local User'
                                ELSE 'ERROR NO USER TYPE'
                        END AS userType
                  FROM t_user
                  WHERE user_type LIKE '${userType}'`;

    console.log("sql1=>" + sql1);
    const data1 = await pool.query(sql1);
    let resultList = data1[0];

    const sql2 = `SELECT COUNT(user_idx) AS count FROM t_user`;
    const data2 = await pool.query(sql2);
    let resultCount = data2[0];

    let jsonResult = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      numOfRows,
      pageNo,
      totalCount: resultCount[0].count + "",
      doubleDataFlag,
      data: {
        items: resultList,
      },
    };

    return res.json(jsonResult);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//사용자 정보 변경(관리자 권한으로 사용자 NickName 변경)
router.post("/postUserNickName", async (req, res, next) => {
  let { serviceKey = "", userIdx = "", userNickName = "" } = req.body;

  console.log(serviceKey, userIdx, userNickName);

  try {
    // Nickname이 NULL일 경우
    if (userNickName == "") {
      return res.json({
        resultCode: "01",
        resultMsg: "Parameter Error or NULL",
      });
    }

    const sql = `UPDATE t_user SET user_nick_name = '${userNickName}'
                 WHERE user_idx = ${userIdx}`;
    console.log("sql: " + sql);
    const data = await pool.query(sql);
    console.log("data[0]: " + data[0]);

    let jsonResult = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
    };

    return res.json(jsonResult);
  } catch (error) {
    return res.status(500).json(error);
  }
});
module.exports = router;
