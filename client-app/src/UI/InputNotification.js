import classes from "./InputNotification.module.css";

const InputNotification = function (props) {
  // Thêm thông báo nếu người dùng không nhập địa điểm
  const styles = `${classes.notification} ${props.className}`;
  return (
    <div className={styles}>
      <p>Vui lòng nhập địa điểm để bắt đầu tìm kiếm</p>
    </div>
  );
};

export default InputNotification;
