import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span>🐾</span> PawFund
            </div>
            <p>Kết nối yêu thương, tìm mái ấm cho thú cưng bị bỏ rơi.</p>
          </div>
          
          <div className="footer-links">
            <h4>Khám phá</h4>
            <Link to="/pets">Thú cưng cần nhà</Link>
            <Link to="/shelters">Trạm cứu hộ</Link>
            <Link to="/lost-pets">Tìm thú lạc</Link>
            <Link to="/donate">Quyên góp</Link>
            <a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noopener noreferrer">API Docs (Swagger)</a>
          </div>

          <div className="footer-links">
            <h4>Tài khoản</h4>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
            <Link to="/profile">Hồ sơ</Link>
          </div>

          <div className="footer-links">
            <h4>Liên hệ</h4>
            <p>📧 contact@pawfund.com</p>
            <p>📞 0901-234-567</p>
            <p>📍 TP. Hồ Chí Minh, Việt Nam</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 PawFund. Made with 💜 for pets.</p>
        </div>
      </div>
    </footer>
  );
}
