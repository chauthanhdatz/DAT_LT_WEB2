import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { shelterAPI } from '../services/api';
import { MapPin, Phone, Mail, Shield, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

export default function Shelters() {
  const { isAuthenticated } = useAuth();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shelterAPI.getAll()
      .then(res => { setShelters(res.data); setLoading(false); })
      .catch(() => {
        // Mock data fallback
        setShelters([
          { id: 1, name: 'Trạm Cứu Hộ Sài Gòn', address: '123 Nguyễn Văn A, Q.1, TP.HCM', phone: '028-1234-5678', email: 'saigon@rescue.com', description: 'Trạm cứu hộ động vật lớn nhất khu vực phía Nam, hoạt động từ năm 2018 với hơn 500 ca cứu hộ thành công.', status: 'APPROVED' },
          { id: 2, name: 'Hội Mèo Việt Nam', address: '45 Lê Lợi, Hà Nội', phone: '024-9876-5432', email: 'meo@vietnam.com', description: 'Tổ chức phi lợi nhuận chuyên cứu hộ và tái định cư cho mèo hoang, mèo bị bỏ rơi trên toàn quốc.', status: 'APPROVED' },
          { id: 3, name: 'Trạm Cứu Hộ Đà Nẵng', address: '78 Trần Phú, Hải Châu, Đà Nẵng', phone: '0236-345-6789', description: 'Trạm cứu hộ mới thành lập, đang trong quá trình xây dựng cơ sở vật chất.', status: 'PENDING' },
        ]);
        setLoading(false);
      });
  }, []);

  const statusMap = {
    APPROVED: { label: 'Đã xác nhận', icon: <CheckCircle size={13}/>, cls: 'text-green-400 bg-green-400/10 border-green-400/20' },
    PENDING: { label: 'Chờ duyệt', icon: <Clock size={13}/>, cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    BANNED: { label: 'Đã khóa', icon: <XCircle size={13}/>, cls: 'text-red-400 bg-red-400/10 border-red-400/20' },
  };

  if (loading) return <div className="page"><div className="loading"><div className="spinner" /></div></div>;

  return (
    <main className="page">
      <div className="container">
        <header className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-4">
                <Shield size={12} /> Trạm Cứu Hộ Đã Xác Nhận
              </div>
              <h1 className="page-title">Mạng Lưới Cứu Hộ</h1>
              <p className="page-subtitle">Các trạm cứu hộ động vật được xác minh và hoạt động minh bạch trên toàn quốc</p>
            </div>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-full text-sm hover:scale-105 transition-transform shadow-lg"
              >
                <Plus size={16}/> Đăng Ký Trạm
              </Link>
            )}
          </div>
        </header>

        {shelters.length > 0 ? (
          <div className="grid grid-3">
            {shelters.map(shelter => {
              const st = statusMap[shelter.status] || statusMap.PENDING;
              return (
                <article key={shelter.id} className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  <div className="h-44 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden relative">
                    <img
                      src={shelter.imageUrl ? (shelter.imageUrl.startsWith('http') ? shelter.imageUrl : `http://localhost:8080${shelter.imageUrl}`) : 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'}
                      alt={shelter.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'; }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${st.cls}`}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{shelter.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">{shelter.description || 'Trạm cứu hộ động vật đang hoạt động.'}</p>
                    <div className="space-y-2">
                      {shelter.address && (
                        <div className="flex items-start gap-2 text-xs text-slate-500">
                          <MapPin size={13} className="mt-0.5 text-indigo-400 flex-shrink-0"/>
                          <span>{shelter.address}</span>
                        </div>
                      )}
                      {shelter.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone size={13} className="text-green-500"/>
                          <a href={`tel:${shelter.phone}`} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">{shelter.phone}</a>
                        </div>
                      )}
                      {shelter.email && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail size={13} className="text-pink-500"/>
                          <a href={`mailto:${shelter.email}`} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">{shelter.email}</a>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">🏠</div>
            <h3>Chưa có trạm cứu hộ nào</h3>
            <p>Các trạm cứu hộ đang trong quá trình được duyệt</p>
          </div>
        )}
      </div>
    </main>
  );
}

