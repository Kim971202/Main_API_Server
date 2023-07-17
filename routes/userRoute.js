let express = require("express");
let router = express.Router();
const pool = require("../DB/pool");

router.get("/getUserList", async (req, res, next) => {
  let {
    serviceKey = "111111111", // 서비스 인증키
    numOfRows = 10, //           페이지 당 결과수
    pageNo = 1, //               페이지 번호
    dongCode = "101", //        동코드
    hoCode = "101", //          호코드
    doubleDataFlag = "Y", //     2배수 데이터 사용여부
    userType = "ALL", //        유저타입: ALL: 모든 유저, 0: 클라우드 유저, 1: 로컬유저
  } = req.query;

  console.log(serviceKey, numOfRows, pageNo, dongCode, hoCode, doubleDataFlag);

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

module.exports = router;
