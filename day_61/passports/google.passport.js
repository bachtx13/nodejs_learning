const { Provider, User } = require("../models/index");
const GoogleStrategy = require("passport-google-oauth20");
module.exports = new GoogleStrategy(
  {
    clientID:
      "831047813879-lm276r5sqqjogb3aovlrgjm1va07godf.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ["profile", "email"],
    state: true,
  },
  async (accessToken, refreshToken, profile, cb) => {
    // console.log(profile);
    const {
      displayName: name,
      emails: [{ value: email }],
    } = profile;

    //Kiểm tra provider
    //- Nếu tồn tại --> Lấy provider cũ
    //- Nếu không tồn tại --> Thêm mới provider
    const provider = await Provider.findOrCreate({
      where: { name: "google" },
      defaults: {
        name: "google",
      },
    });
    //Kiểm tra user
    // - Nếu tồn tại --> Lấy user cũ
    // - Nếu không tồn tại --> Thêm user mới

    const user = await User.findOrCreate({
      where: { email, provider_id: provider[0].id },
      defaults: {
        fullname: name,
        email,
        status: true,
        provider_id: provider[0].id,
      },
    });
    cb(null, user[0]);
  },
);
