const User = require("../models/user");

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
        const user = new User({
          username: username,
          password: password,
          fullName: fullName,
          phoneNumber: phone,
          email: email,
          isAdmin: false,
        });

        //Lưu user mới
        user
          .save()
          .then(() => {
            res.status(201).json("Tạo tài khoản thành công");
          })
          .catch((err) => {
            console.log(err);
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

  User.findOne({ username: username, password: password })
    .then((user) => {
      if (!user) {
        res
          .status(401)
          .json("Thông tin đăng nhập chưa chính xác, vui lòng thử lại");
      }

      if (user) {
        const data = {
          username: username,
          email: user.email,
          id: user._id,
        };

        res.status(201).json(data);
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.postAdminLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username, password: password })
    //Kiểm tra xem có người dùng nào có thông tin trùng khớp không
    .then((user) => {
      if (!user) {
        res
          .status(401)
          .json("Thông tin đăng nhập chưa chính xác, vui lòng thử lại");
      }

      //Nếu có người dùng và là admin thì cho đăng nhập
      if (user && user.isAdmin) {
        console.log(user.isAdmin);
        const data = {
          username: username,
          email: user.email,
          id: user._id,
        };

        return res.status(201).json(data);
      }

      //Nếu có người dùng không phải admin thì báo lỗi
      if (user && !user.isAdmin) {
        return res
          .status(401)
          .json("Bạn không phải admin, hãy quay lại khi bạn là admin :)");
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

// Thông tin người dùng để đưa vào phần đặt phòng
exports.getUserInfo = (req, res, next) => {
  const token = req.query.token;

  User.findOne({ _id: token })
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
