import "./SignUpForm.css";
import Button from "../../UI/Button";

function SignUpForm() {
  return (
    <div className="signup">
      <div className="signup-container">
        <h1>Save time, save money !</h1>
        <h3>Sign up and we'll send the best deals to you</h3>
        <div className="signup-form">
          <input
            className="signup-form-input"
            type="text"
            placeholder="Your Email"
          />
          <Button className="btn-subcribe">Subcribe</Button>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
