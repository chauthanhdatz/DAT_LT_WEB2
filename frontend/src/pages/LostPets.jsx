import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { lostPetAPI } from '../services/api';
import { MapPin, Phone, Search, Plus, AlertTriangle, CheckCircle } from 'lucide-react';

export default function LostPets() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [lostPets, setLostPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('ALL');
  const [form, setForm] = useState({
    petName: '', species: 'DOG', breed: '', description: '',
    location: '', contactPhone: '', postType: 'LOST'
  });
  const [image, setImage] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    setLoading(true);
    lostPetAPI.getAll()
      .then(r => { setLostPets(r.data); setLoading(false); })
      .catch(() => {
        // mock data
        setLostPets([
          { id: 1, petName: 'Cún Vàng', species: 'DOG', breed: 'Corgi', description: 'Bé corgi màu vàng cam, đeo vòng cổ đỏ. Bị lạc gần công viên Lê Văn Tám.', location: 'Q.1, TP.HCM', contactPhone: '0901-234-567', postType: 'LOST', status: 'ACTIVE', imageUrl: null },
          { id: 2, petName: 'Mèo Trắng Nhỏ', species: 'CAT', breed: 'Anh lông ngắn', description: 'Tìm thấy bé mèo trắng đốm xám khoảng 4 tháng tuổi, rất thân thiện.', location: 'Q.3, TP.HCM', contactPhone: '0912-345-678', postType: 'FOUND', status: 'ACTIVE', imageUrl: null },
          { id: 3, petName: 'Alaska', species: 'DOG', description: 'Bé Alaska size lớn, đã được tìm về nhà rồi!', location: 'Hà Nội', contactPhone: '0933-456-789', postType: 'LOST', status: 'RESOLVED', imageUrl: null },
        ]);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    try {
      await lostPetAPI.create(fd);
      setAlert({ type: 'success', text: '✅ Đã đăng thông tin thành công!' });
      setShowForm(false);
      setForm({ petName: '', species: 'DOG', breed: '', description: '', location: '', contactPhone: '', postType: 'LOST' });
      setImage(null);
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra, thử lại sau.' });
    }
    setTimeout(() => setAlert(null), 4000);
  };

  const filtered = lostPets.filter(lp => {
    if (tab === 'ALL') return true;
    if (tab === 'LOST') return lp.postType === 'LOST' && lp.status === 'ACTIVE';
    if (tab === 'FOUND') return lp.postType === 'FOUND' && lp.status === 'ACTIVE';
    if (tab === 'RESOLVED') return lp.status === 'RESOLVED';
    return true;
  });

  const speciesLabel = s => s === 'DOG' ? '🐶 Chó' : s === 'CAT' ? '🐱 Mèo' : '🐾 Khác';

  return (
    <main className="page">
      <div className="container">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-4">
              <AlertTriangle size={12}/> Thú Cưng Lạc & Tìm Thấy
            </div>
            <h1 className="page-title">Tìm Kiếm & Trao Trả</h1>
            <p className="page-subtitle">Giúp các bé thú cưng trở về với gia đình. Đăng bài nếu bạn lạc mất hoặc nhặt được thú cưng.</p>
          </div>
          <button
            onClick={() => isAuthenticated ? setShowForm(!showForm) : navigate('/login')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full text-sm hover:scale-105 transition-transform shadow-lg shadow-red-500/20"
          >
            <Plus size={16}/> Đăng Thông Tin
          </button>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type} mb-6`}>{alert.text}</div>
        )}

        {/* Form */}
        {showForm && (
          <div className="glass-card p-6 mb-8 animate-fadeInUp">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Plus size={18} className="text-pink-500"/> Đăng thông tin thú cưng
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Post type selection */}
              <div className="flex gap-3 mb-2">
                {[['LOST', '🔴 Thú cưng của tôi bị lạc'], ['FOUND', '🟢 Tôi nhặt được thú cưng']].map(([v, l]) => (
                  <button
                    key={v} type="button"
                    onClick={() => setForm({...form, postType: v})}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${form.postType === v ? (v === 'LOST' ? 'bg-red-50 border-red-400 text-red-600 shadow-sm' : 'bg-green-50 border-green-400 text-green-600 shadow-sm') : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'}`}
                  >{l}</button>
                ))}
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Tên thú cưng *</label>
                  <input type="text" className="form-input" placeholder="Bé Cam, Miu, ..." value={form.petName} onChange={e => setForm({...form, petName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Loài *</label>
                  <select className="form-select" value={form.species} onChange={e => setForm({...form, species: e.target.value})}>
                    <option value="DOG">🐶 Chó</option>
                    <option value="CAT">🐱 Mèo</option>
                    <option value="OTHER">🐾 Khác</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Giống (nếu biết)</label>
                  <input type="text" className="form-input" placeholder="Corgi, Anh lông ngắn,..." value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">SĐT liên hệ *</label>
                  <input type="tel" className="form-input" placeholder="09xx-xxx-xxx" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Địa điểm lạc/tìm thấy *</label>
                <input type="text" className="form-input" placeholder="Công viên, quận, tỉnh thành..." value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả (màu lông, đặc điểm nhận dạng...)</label>
                <textarea className="form-textarea" rows={3} placeholder="Bé màu vàng cam, đeo vòng cổ đỏ, có tên khắc trên vòng..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Hình ảnh</label>
                <input type="file" className="form-input" accept="image/*" onChange={e => setImage(e.target.files[0])} />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">📢 Đăng ngay</button>
              </div>
            </form>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 bg-slate-100 border border-slate-200 rounded-full p-1 mb-8 w-fit shadow-sm">
          {[['ALL','Tất cả'],['LOST','🔴 Bị lạc'],['FOUND','🟢 Tìm thấy'],['RESOLVED','✅ Đã xử lý']].map(([v,l]) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${tab === v ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >{l}</button>
          ))}
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="loading"><div className="spinner"/></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-3">
            {filtered.map(lp => (
              <article key={lp.id} className={`glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${lp.status === 'RESOLVED' ? 'opacity-60' : ''}`}>
                <div className="h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 overflow-hidden relative">
                  {lp.imageUrl ? (
                    <img
                      src={lp.imageUrl.startsWith('http') ? lp.imageUrl : `http://localhost:8080${lp.imageUrl}`}
                      alt={lp.petName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.style.display='none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {lp.species === 'DOG' ? '🐶' : lp.species === 'CAT' ? '🐱' : '🐾'}
                    </div>
                  )}
                  {lp.status === 'RESOLVED' && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[3px]">
                      <div className="border-4 border-red-500 text-red-500 font-black text-xl px-5 py-2 rounded-lg transform -rotate-12 uppercase tracking-widest shadow-lg bg-white/90 whitespace-nowrap">
                        Đã về nhà 🏠
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-2 z-20">
                    {lp.status !== 'RESOLVED' && (
                      <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${lp.postType === 'LOST' ? 'bg-red-400/20 border-red-400/30 text-red-400' : 'bg-green-400/20 border-green-400/30 text-green-400'}`}>
                        {lp.postType === 'LOST' ? '🔴 Bị lạc' : '🟢 Tìm thấy'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{lp.petName}</h3>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">{speciesLabel(lp.species)}</span>
                  </div>
                  {lp.breed && <p className="text-xs text-indigo-500 font-bold mb-3">{lp.breed}</p>}
                  {lp.description && <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">{lp.description}</p>}
                  <div className="space-y-2">
                    {lp.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={13} className="text-orange-500"/> {lp.location}
                      </div>
                    )}
                    {lp.contactPhone && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={13} className="text-green-500"/>
                        <a href={`tel:${lp.contactPhone}`} className="text-slate-600 hover:text-slate-900 transition-colors font-bold">{lp.contactPhone}</a>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon"><Search size={48} /></div>
            <h3>Không có bài đăng nào</h3>
            <p>Hãy là người đầu tiên đăng thông tin để giúp đỡ các bé thú cưng</p>
          </div>
        )}
      </div>
    </main>
  );
}

