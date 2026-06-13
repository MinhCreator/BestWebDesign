import { Link } from "react-router-dom";
import "../../style/footer.css";
const Footer = () => {
  return (
    <footer className="footer-component">
      <div className="footer-container footer-content">
        <div className="footer-brand">
          <h2>
            <img src="public/brand-logo.svg" width="15%" alt="Logo" />
            <span className="text-[#2194c1]"> ENDURANCE </span>|
            <span className="text-[#135261]">HUB</span>
          </h2>
          <p>
            © 2024 Endurance Hub. Run a Mile, Change Your Life. Join the
            movement today.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h3>About Us</h3>
            <ul>
              <li>
                <Link to="/Team">Team</Link>
              </li>
              <li>Terms & Conditions</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3>Help</h3>
            <ul>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h3>Service</h3>
            <ul>
              <li>Coupons</li>
              <li>Wish List</li>
              <li>Notifications</li>
            </ul>
          </div>
          <div>
            <h3>Social Media</h3>
            <ul className="social-list">
              <li>
                <img
                  src="src/assets/icon/facebook.svg"
                  alt="Facebook"
                  className="social-icon"
                />
                <span>
                  <a
                    href="https://www.facebook.com/minh.quan.ngo.932383"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </span>
              </li>
              <li>
                <img
                  src="src/assets/icon/instagram.svg"
                  alt="Instagram"
                  className="social-icon"
                />
                <span>Instagram</span>
              </li>
              <li>
                <img
                  src="src/assets/icon/youtube.svg"
                  alt="Youtube"
                  className="social-icon"
                />
                <span>
                  <a
                    href="https://www.youtube.com/channel/UChYwzphrJLJKzu_tmLtxM2Q"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Youtube
                  </a>
                </span>
              </li>
              <li>
                <img
                  src="src/assets/icon/github.svg"
                  alt="Github"
                  className="social-icon github-icon"
                />
                <span>
                  <a
                    href="https://github.com/MinhCreator/BestWebDesign"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-container footer-bottom">
        <p>Copyright © 2026 Endurance Hub®. All rights reserved.</p>
        <div className="legal">
          <span>Privacy Policy</span> • <span>Sitemap</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
