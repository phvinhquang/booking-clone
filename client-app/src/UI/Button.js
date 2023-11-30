import "./Button.css";

function Button(props) {
  const classes = "button-primary " + props.className;
  return (
    <button type="button" className={classes} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default Button;
