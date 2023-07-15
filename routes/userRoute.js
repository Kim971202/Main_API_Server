let express = require("express");
let router = express.Router();

router.get("/userList", async (req, res, next) =>{
    console.log("user List")
});

module.exports = router;