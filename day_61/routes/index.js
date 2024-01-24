var express = require("express");
var router = express.Router();
const sendMail = require("../utils/mail");
const homeController = require("../controllers/home.controller");
/* GET home page. */
router.get("/", homeController.index);

router.get("/send-mail", async (req, res) => {
  const info = await sendMail(
    "hoangan@fullstack.edu.vn",
    "Hello F8",
    `Tôi là giảng viên tại F8 <img style="display:block" src="https://online.unicode.vn/test.php?email=hoangan111@fullstack.edu.vn" width="1" height="1" alt="A" title="A"/>`,
  );
  console.log(info);
  res.send("Gửi email");
});

module.exports = router;
