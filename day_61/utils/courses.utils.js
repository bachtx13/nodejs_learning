module.exports = {
  isCourse: (user, courseId) => {
    //user: Object
    //courseId: Khóa học cần kiểm tra
    const result = user.courses.find((item) => +item.id === +courseId);
    return result ? true : false;
  },
};
