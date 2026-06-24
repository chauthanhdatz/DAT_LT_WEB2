import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationAPI, shelterAPI, campaignAPI } from '../services/api';
import './Donate.css';

export default function Donate() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campaignIdParam = searchParams.get('campaign');

  const [shelters, setShelters] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ shelterId: '', campaignId: campaignIdParam || '', amount: '', message: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    shelterAPI.getAll().then(r => setShelters(r.data)).catch(() => {});
    donationAPI.getAll().then(r => setDonations(r.data)).catch(() => {});
    if (campaignIdParam) {
      campaignAPI.getById(campaignIdParam).then(r => {
        setCampaign(r.data);
        if (r.data.shelter) {
          setForm(prev => ({ ...prev, shelterId: r.data.shelter.id }));
        }
      }).catch(() => {});
    }
  }, [campaignIdParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setLoading(true);
    try {
      const payload = { amount: Number(form.amount), message: form.message };
      if (form.shelterId) payload.shelterId = Number(form.shelterId);
      if (form.campaignId) payload.campaignId = Number(form.campaignId);
      
      await donationAPI.create(payload);
      setAlert({ type: 'success', text: '💝 Cảm ơn bạn đã quyên góp!' });
      setForm({ shelterId: '', campaignId: '', amount: '', message: '' });
      donationAPI.getAll().then(r => setDonations(r.data));
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra' });
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">💝 Quyên góp</h1>
        <p className="page-subtitle">Mỗi đóng góp đều tạo nên sự khác biệt cho các bé thú cưng</p>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

        <div className="donate-layout">
          <div className="donate-form-container glass-card animate-fadeInUp">
            <h2>Gửi quyên góp</h2>
            <form onSubmit={handleSubmit}>
              {campaign && (
                <div className="mb-4 p-3 bg-pink-50 border border-pink-200 rounded-xl text-sm">
                  <span className="font-bold text-pink-600">Đang quyên góp cho chiến dịch:</span><br/>
                  <span className="text-slate-700">{campaign.title}</span>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Trạm cứu hộ *</label>
                <select className="form-select" value={form.shelterId} onChange={e => setForm({...form, shelterId: e.target.value})} required disabled={!!campaign}>
                  <option value="">Chọn trạm cứu hộ...</option>
                  {shelters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Số tiền (VNĐ) *</label>
                <input type="number" className="form-input" placeholder="100000" min="1000"
                  value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
                <div className="amount-presets">
                  {[50000, 100000, 200000, 500000].map(a => (
                    <button key={a} type="button" className="preset-btn" onClick={() => setForm({...form, amount: a})}>
                      {a.toLocaleString('vi-VN')}₫
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Lời nhắn</label>
                <textarea className="form-textarea" placeholder="Lời nhắn đến trạm cứu hộ..."
                  value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={loading}>
                {loading ? 'Đang xử lý...' : '💝 Quyên góp'}
              </button>
            </form>
          </div>

          <div className="donate-history">
            <h2>Lịch sử quyên góp</h2>
            {donations.length > 0 ? (
              <div className="donation-list">
                {donations.slice(0, 10).map(d => (
                  <div key={d.id} className="donation-item glass-card">
                    <div className="di-info">
                      <span className="di-user">👤 {d.username}</span>
                      <span className="di-arrow">→</span>
                      <span className="di-shelter">🏠 {d.campaignTitle ? `Chiến dịch: ${d.campaignTitle}` : d.shelterName}</span>
                    </div>
                    <div className="di-amount">{Number(d.amount).toLocaleString('vi-VN')}₫</div>
                    {d.message && <p className="di-message">"{d.message}"</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state"><div className="icon">💰</div><h3>Chưa có quyên góp nào</h3></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
