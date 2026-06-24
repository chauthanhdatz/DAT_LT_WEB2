import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', fullName: '', phone: '', role: 'USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      const data = res.data.data;
      login({
        userId: data.userId,
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      }, data.token);
      navigate('/');
    } catch (err) {
      const errData = err.response?.data;
      if (typeof errData === 'object' && !errData.message) {
        setError(Object.values(errData).join(', '));
      } else {
        setError(errData?.message || 'Đăng ký thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card glass-card animate-fadeInUp">
          <div className="auth-header">
            <span className="auth-icon">🐾</span>
            <h1>Đăng ký</h1>
            <p>Tham gia cộng đồng yêu thú cưng!</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tên đăng nhập *</label>
                <input type="text" className="form-input" placeholder="username"
                  value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" className="form-input" placeholder="email@example.com"
                  value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input type="text" className="form-input" placeholder="Nguyễn Văn A"
                value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input type="text" className="form-input" placeholder="0901234567"
                  value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Loại tài khoản</label>
                <select className="form-select" value={form.role}
                  onChange={(e) => setForm({...form, role: e.target.value})}>
                  <option value="USER">Người dùng</option>
                  <option value="SHELTER">Trạm cứu hộ</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu *</label>
              <input type="password" className="form-input" placeholder="Ít nhất 6 ký tự"
                value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>

          <p className="auth-switch">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
