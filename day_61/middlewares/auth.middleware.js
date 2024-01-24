//Kiểm tra trạng thái đăng nhập
//Nếu chưa đăng nhập --> redirect về /auth/login
//Nếu đăng nhập --> next()
module.exports = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.redirect("/auth/login");
};
