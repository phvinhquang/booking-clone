require("dotenv").config();

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postRegister = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const phone = req.body.phone;
  const email = req.body.email;

  //Tìm trong database xem có user nào có username hoặc email giống với request chưa
  User.find({ $or: [{ username: username }, { email: email }] })
    .then((user) => {
      //Nếu có thì báo lỗi
      if (user.length !== 0) {
        if (user[0].username === username) {
          return res
            .status(409)
            .json(
              "Tên người dùng này đã tồn tại. Bạn hãy chọn tên người dùng khác"
            );
        }

        if (user[0].email === email) {
          return res
            .status(409)
            .json(
              "Email này đã được đăng kí bởi người dùng khác. Bạn hãy dùng email khác"
            );
        }
      }

      // Nếu không có thì tạo user mới
      if (user.length === 0) {
        // Mã hóa password với bcrypt
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              username: username,
              password: hashedPassword,
              fullName: fullName,
              phoneNumber: phone,
              email: email,
              isAdmin: false,
            });
            //Lưu user mới
            return user.save();
          })
          .then(() => {
            res.status(201).json("Tạo tài khoản thành công");
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let userId;
  let email;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        const err = new Error(
          "Thông tin đăng nhập chưa chính xác, vui lòng thử lại"
        );
        err.statusCode = 401;
        throw err;
      }

      if (user) {
        userId = user._id;
        email = user.email;
        return bcrypt.compare(password, user.password);
      }
    })
    .then((isMatch) => {
      if (!isMatch) {
        const err = new Error("Thông tin đăng nhập không đúng");
        err.statusCode = 403;
        throw err;
      }
      // Nếu pass đúng thì tạo jwt gửi xuống
      // Tạo jwt ở đây
      const token = jwt.sign(
        { userId: userId.toString() },
        process.env.ACCESS_TOKEN,
        { expiresIn: "2d" }
      );
      const data = {
        username: username,
        email: email,
        // id: userId,
      };

      res.status(201).json({ userData: data, token: token });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postAdminLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let userId;
  let email;

  User.findOne({ username: username })
    //Kiểm tra xem có người dùng nào có thông tin trùng khớp không
    .then((user) => {
      if (!user) {
        res
          .status(401)
          .json("Thông tin đăng nhập chưa chính xác, vui lòng thử lại");
      }

      //Nếu có người dùng không phải admin thì báo lỗi
      if (user && !user.isAdmin) {
        return res
          .status(401)
          .json("Bạn không phải admin, hãy quay lại khi bạn là admin :)");
      }

      //Nếu có người dùng và là admin thì cho đăng nhập
      if (user && user.isAdmin) {
        userId = user._id;
        email = user.email;
        return bcrypt.compare(password, user.password);
      }
    })
    .then((isMatch) => {
      if (!isMatch) {
        const err = new Error("Thông tin đăng nhập không đúng");
        err.statusCode = 403;
        throw err;
      }

      // Nếu pass đúng thì tạo jwt gửi xuống
      const token = jwt.sign(
        { userId: userId.toString() },
        process.env.ACCESS_TOKEN,
        { expiresIn: "2d" }
      );
      const data = {
        username: username,
        email: email,
      };

      res.status(201).json({ userData: data, token: token });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Thông tin người dùng để đưa vào phần đặt phòng
exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.userId })
    .then((user) => {
      const data = {
        username: user.username,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      };

      res.status(200).json(data);
    })
    .catch(() => res.status(404).json("User not found"));
};
