import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Target, Heart, Clock, TrendingUp, Plus, CheckCircle } from 'lucide-react';
import api from '../services/api';

function CampaignCard({ campaign }) {
  const progress = campaign.goalAmount > 0
    ? Math.min(100, Math.round((campaign.currentAmount / campaign.goalAmount) * 100))
    : 0;

  const formatVND = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const statusColor = {
    ACTIVE: 'text-green-400 bg-green-400/10 border-green-400/20',
    COMPLETED: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    CLOSED: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  };
  const statusLabel = { ACTIVE: 'Đang kêu gọi', COMPLETED: 'Đã đạt mục tiêu', CLOSED: 'Đã đóng' };

  return (
    <article className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      <div className="relative h-48 bg-gradient-to-br from-pink-500/20 to-indigo-500/20 flex items-center justify-center overflow-hidden">
        {campaign.imageUrl ? (
          <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <Megaphone size={64} className="text-white/20" />
        )}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor[campaign.status] || statusColor.ACTIVE}`}>
            {statusLabel[campaign.status] || campaign.status}
          </span>
        </div>
        {campaign.status === 'COMPLETED' && (
          <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/60 backdrop-blur-sm">
            <CheckCircle size={48} className="text-green-400" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">{campaign.title}</h3>
        {campaign.shelter && (
          <p className="text-xs text-indigo-500 font-bold mb-3">📍 {campaign.shelter.name}</p>
        )}
        <p className="text-sm text-slate-600 mb-5 line-clamp-2">{campaign.description}</p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-slate-500 font-medium">Đã quyên góp</span>
            <span className="text-sm font-bold text-pink-500">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-800 font-bold">{formatVND(campaign.currentAmount || 0)}</span>
            <span className="text-xs text-slate-400 font-medium">/ {formatVND(campaign.goalAmount)}</span>
          </div>
        </div>

        {campaign.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4">
            <Clock size={12} />
            <span>Hạn: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}</span>
          </div>
        )}

        <Link
          to={`/donate?campaign=${campaign.id}`}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 font-bold text-sm hover:bg-pink-100 transition-all group/btn"
        >
          <Heart size={15} className="group-hover/btn:scale-110 transition-transform text-pink-500" />
          Quyên Góp Ngay
        </Link>
      </div>
    </article>
  );
}

export default function Campaigns() {
  const { isAuthenticated, isShelter } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ACTIVE');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns');
        setCampaigns(res.data);
      } catch (e) {
        // fallback mock data
        setCampaigns([
          { id: 1, title: 'Chiến dịch chữa trị cho 20 chú chó bị thương', description: 'Hỗ trợ chi phí phẫu thuật và điều trị cho những bé chó bị tai nạn giao thông được cứu hộ tháng này.', goalAmount: 50000000, currentAmount: 35000000, status: 'ACTIVE', shelter: { name: 'Trạm Cứu Hộ Sài Gòn' } },
          { id: 2, title: 'Xây dựng khu vui chơi cho mèo', description: 'Cải thiện không gian sinh hoạt cho 50 bé mèo đang chờ nhận nuôi tại trạm bằng hệ thống chuồng và đồ chơi hiện đại.', goalAmount: 30000000, currentAmount: 30000000, status: 'COMPLETED', shelter: { name: 'Hội Mèo Việt' } },
          { id: 3, title: 'Tiêm phòng đại trà mùa hè 2025', description: 'Chương trình tiêm vaccine dại, care và các bệnh nguy hiểm miễn phí cho tất cả thú cưng tại trạm trước mùa hè.', goalAmount: 20000000, currentAmount: 8000000, status: 'ACTIVE', shelter: { name: 'Trạm Cứu Hộ Hà Nội' } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filtered = filter === 'ALL' ? campaigns : campaigns.filter(c => c.status === filter);
  const totalRaised = campaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0);
  const activeCount = campaigns.filter(c => c.status === 'ACTIVE').length;

  return (
    <main className="page">
      <div className="container">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-bold mb-6">
            <Megaphone size={14} />
            Chiến Dịch Gây Quỹ
          </div>
          <h1 className="page-title">Cùng Chung Tay Cứu Hộ</h1>
          <p className="page-subtitle max-w-2xl mx-auto">
            Mỗi đóng góp của bạn là một sinh mệnh được cứu. Hãy chọn chiến dịch phù hợp và chung tay với các trạm cứu hộ.
          </p>
        </header>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: <Megaphone size={20}/>, value: campaigns.length, label: 'Tổng chiến dịch', color: 'text-indigo-400' },
            { icon: <TrendingUp size={20}/>, value: activeCount, label: 'Đang kêu gọi', color: 'text-green-400' },
            { icon: <Heart size={20}/>, value: new Intl.NumberFormat('vi-VN').format(totalRaised) + 'đ', label: 'Đã gây quỹ', color: 'text-pink-400' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-5 text-center">
              <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs + action */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 bg-slate-100 border border-slate-200 rounded-full p-1 shadow-sm">
            {[['ALL', 'Tất cả'], ['ACTIVE', 'Đang kêu gọi'], ['COMPLETED', 'Đã đạt mục tiêu']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filter === val ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {isShelter && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold rounded-full text-sm hover:scale-105 transition-transform shadow-lg shadow-pink-500/20"
            >
              <Plus size={16} /> Tạo Chiến Dịch
            </Link>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>Không có chiến dịch nào</h3>
            <p>Chưa có chiến dịch gây quỹ nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map(c => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        )}
      </div>
    </main>
  );
}
