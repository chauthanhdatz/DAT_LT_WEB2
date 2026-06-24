import { useState, useEffect } from 'react';
import { petAPI } from '../services/api';
import PetCard from '../components/PetCard';
import { Search } from 'lucide-react';
import './PetList.css';

export default function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ species: '', gender: '', petSize: '', search: '' });

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = { page, size: 12 };
      if (filters.species) params.species = filters.species;
      if (filters.gender) params.gender = filters.gender;
      if (filters.petSize) params.petSize = filters.petSize;
      if (filters.search) params.search = filters.search;
      const res = await petAPI.getAll(params);
      setPets(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPets(); }, [page, filters]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">🐾 Thú cưng cần mái ấm</h1>
        <p className="page-subtitle">Tìm người bạn bốn chân hoàn hảo cho bạn</p>

        {/* Filters */}
        <div className="filters glass-card p-6 mb-8 border border-slate-100 shadow-sm rounded-2xl">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all shadow-sm text-slate-700" placeholder="Tìm kiếm theo tên, giống..." value={filters.search} onChange={(e) => handleFilter('search', e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {[{v:'', l:'Tất cả loài'}, {v:'DOG', l:'🐶 Chó'}, {v:'CAT', l:'🐱 Mèo'}].map(s => (
                <button key={s.v} onClick={() => handleFilter('species', s.v)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filters.species === s.v ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{s.l}</button>
              ))}
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {[{v:'', l:'Mọi giới tính'}, {v:'MALE', l:'♂️ Đực'}, {v:'FEMALE', l:'♀️ Cái'}].map(s => (
                <button key={s.v} onClick={() => handleFilter('gender', s.v)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filters.gender === s.v ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{s.l}</button>
              ))}
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {[{v:'', l:'Mọi kích cỡ'}, {v:'SMALL', l:'Nhỏ'}, {v:'MEDIUM', l:'Vừa'}, {v:'LARGE', l:'Lớn'}].map(s => (
                <button key={s.v} onClick={() => handleFilter('petSize', s.v)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filters.petSize === s.v ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{s.l}</button>
              ))}
            </div>
            {(filters.species || filters.gender || filters.petSize || filters.search) && (
              <button className="px-4 py-1.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1" onClick={() => { setFilters({ species: '', gender: '', petSize: '', search: '' }); setPage(0); }}>✕ Xóa bộ lọc</button>
            )}
          </div>
        </div>

        {/* Pet Grid */}
        {loading ? (
          <div className="grid grid-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="glass-card overflow-hidden h-[380px] animate-pulse">
                <div className="h-48 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-10 bg-slate-200 rounded-xl mt-6" />
                </div>
              </div>
            ))}
          </div>
        ) : pets.length > 0 ? (
          <>
            <div className="grid grid-4">
              {pets.map(pet => <PetCard key={pet.id} pet={pet} />)}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button className="btn btn-sm btn-secondary" disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}>← Trước</button>
                <span className="page-info">Trang {page + 1} / {totalPages}</span>
                <button className="btn btn-sm btn-secondary" disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}>Tiếp →</button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">🐾</div>
            <h3>Không tìm thấy thú cưng nào</h3>
            <p>Thử thay đổi bộ lọc hoặc chờ backend khởi động</p>
          </div>
        )}
      </div>
    </div>
  );
}
