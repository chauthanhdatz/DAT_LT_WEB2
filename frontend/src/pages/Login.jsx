import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
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
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
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
            <h1>Đăng nhập</h1>
            <p>Chào mừng quay lại PawFund!</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên đăng nhập</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nhập tên đăng nhập..."
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-input"
                placeholder="Nhập mật khẩu..."
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="auth-switch">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>

          <div className="auth-demo">
            <p>🔑 Tài khoản demo:</p>
            <div className="demo-accounts">
              <button onClick={() => setForm({ username: 'user1', password: 'user123' })} className="demo-btn">
                👤 User (user1 / user123)
              </button>
              <button onClick={() => setForm({ username: 'shelter1', password: 'shelter123' })} className="demo-btn">
                🏠 Shelter (shelter1 / shelter123)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
