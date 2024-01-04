import classes from "./LoadingIndicator.module.css";

const LoadingIndicator = function (props) {
  const styles = `${classes.loading} + ${props.className}`;

  return <div className={styles}></div>;
};

export default LoadingIndicator;
