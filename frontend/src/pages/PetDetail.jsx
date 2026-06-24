import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petAPI, adoptionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PetDetail.css';

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    petAPI.getById(id).then(res => { setPet(res.data); setLoading(false); })
      .catch(() => { setLoading(false); navigate('/pets'); });
  }, [id]);

  const handleAdopt = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await adoptionAPI.create({ petId: pet.id, message });
      setAlert({ type: 'success', text: '✅ Yêu cầu nhận nuôi đã được gửi!' });
      setShowModal(false);
      setMessage('');
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra' });
    }
    setSubmitting(false);
  };

  if (loading) return <div className="page"><div className="loading"><div className="spinner"></div></div></div>;
  if (!pet) return null;

  const formatAge = (m) => {
    if (!m) return 'N/A';
    return m < 12 ? `${m} tháng` : `${Math.floor(m/12)} năm ${m%12 > 0 ? m%12 + ' tháng' : ''}`;
  };

  return (
    <div className="page">
      <div className="container">
        {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}
        
        <div className="pet-detail">
          <div className="pet-detail-image">
            <img src={pet.imageUrl ? (pet.imageUrl.startsWith('http') ? pet.imageUrl : `http://localhost:8080${pet.imageUrl}`) : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'} 
              alt={pet.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'; }} />
          </div>
          
          <div className="pet-detail-info">
            <div className="pet-detail-header">
              <h1>{pet.name}</h1>
              <span className={`badge badge-${pet.status?.toLowerCase()}`}>
                {pet.status === 'AVAILABLE' ? '🟢 Cần nhà' : pet.status === 'PENDING' ? '🟡 Đang xử lý' : '🟣 Đã nhận nuôi'}
              </span>
            </div>
            <p className="pet-detail-breed">{pet.breed || 'Không rõ giống'}</p>

            <div className="info-grid">
              <div className="info-item glass-card">
                <span className="info-icon">🐾</span>
                <div><div className="info-label">Loài</div><div className="info-value">{pet.species === 'DOG' ? 'Chó' : 'Mèo'}</div></div>
              </div>
              <div className="info-item glass-card">
                <span className="info-icon">{pet.gender === 'MALE' ? '♂️' : '♀️'}</span>
                <div><div className="info-label">Giới tính</div><div className="info-value">{pet.gender === 'MALE' ? 'Đực' : 'Cái'}</div></div>
              </div>
              <div className="info-item glass-card">
                <span className="info-icon">📅</span>
                <div><div className="info-label">Tuổi</div><div className="info-value">{formatAge(pet.ageMonths)}</div></div>
              </div>
              <div className="info-item glass-card">
                <span className="info-icon">📏</span>
                <div><div className="info-label">Kích thước</div><div className="info-value">{pet.size === 'SMALL' ? 'Nhỏ' : pet.size === 'MEDIUM' ? 'Vừa' : 'Lớn'}</div></div>
              </div>
            </div>

            <div className="health-tags">
              <span className={`health-tag ${pet.vaccinated ? 'active' : ''}`}>
                {pet.vaccinated ? '✅' : '❌'} Tiêm phòng
              </span>
              <span className={`health-tag ${pet.neutered ? 'active' : ''}`}>
                {pet.neutered ? '✅' : '❌'} Triệt sản
              </span>
            </div>

            <div className="pet-description">
              <h3>Mô tả</h3>
              <p>{pet.description || 'Chưa có mô tả'}</p>
            </div>

            <div className="shelter-info glass-card">
              <h4>🏠 Trạm cứu hộ</h4>
              <p className="shelter-name">{pet.shelterName}</p>
              {pet.shelterAddress && <p className="shelter-detail">📍 {pet.shelterAddress}</p>}
              {pet.shelterPhone && <p className="shelter-detail">📞 {pet.shelterPhone}</p>}
            </div>

            {pet.status === 'AVAILABLE' && (
              <button className="btn btn-primary btn-lg adopt-btn" onClick={() => setShowModal(true)}>
                💝 Nhận nuôi {pet.name}
              </button>
            )}
          </div>
        </div>

        {/* Adoption Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal glass-card animate-fadeInUp" onClick={e => e.stopPropagation()}>
              <h2>💝 Yêu cầu nhận nuôi {pet.name}</h2>
              <p className="modal-desc">Hãy chia sẻ lý do bạn muốn nhận nuôi bé</p>
              <textarea className="form-textarea" placeholder="Tôi muốn nhận nuôi bé vì..."
                value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="btn btn-primary" onClick={handleAdopt} disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
