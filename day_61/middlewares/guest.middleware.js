//Kiểm tra user chưa đăng nhập
//Loại bỏ việc gọi middleware này ở trang logout
module.exports = (req, res, next) => {
  const pathname = req.baseUrl + req.path;

  if (!req.user || pathname === "/auth/logout") {
    return next();
  }
  return res.redirect("/");
};
