import Header from "../../components/Header/Header";
import Footer from "../../components/MainContent/Footer";
import Authentication from "../../components/Authentication/Authentication";

import styles from "./Auth.module.css";

const Auth = () => {
  return (
    <div>
      <Header showJustTop={true} showNav={true} />
      <div className={styles.container}>
        <Authentication />
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
