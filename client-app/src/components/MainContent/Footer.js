import "./Footer.css";
import footerData from "../../data/footer.json";

function Footer() {
  return (
    // Sử dụng map trong map để hiển thị item trong footer
    <div className="footer-container">
      <div className="footer-flex">
        {footerData.map((footerCol, i) => (
          <div key={i} className="grid-col">
            {footerCol.col_values.map((item, i) => (
              <div className="footer-item" key={i}>
                <a href="#">{item}</a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Footer;
