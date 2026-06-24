import { Link } from 'react-router-dom';
import './PetCard.css';

export default function PetCard({ pet }) {
  const getSpeciesEmoji = (species) => species === 'DOG' ? '🐶' : '🐱';
  const getGenderIcon = (gender) => gender === 'MALE' ? '♂️' : '♀️';
  
  const formatAge = (months) => {
    if (!months) return 'N/A';
    if (months < 12) return `${months} tháng`;
    const years = Math.floor(months / 12);
    const remaining = months % 12;
    return remaining > 0 ? `${years} năm ${remaining} tháng` : `${years} năm`;
  };

  return (
    <Link to={`/pets/${pet.id}`} className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 overflow-hidden shrink-0">
        <img 
          src={pet.imageUrl ? (pet.imageUrl.startsWith('http') ? pet.imageUrl : `http://localhost:8080${pet.imageUrl}`) : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'} 
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400';
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${pet.species === 'DOG' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
            {getSpeciesEmoji(pet.species)} {pet.species === 'DOG' ? 'Chó' : 'Mèo'}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${pet.status === 'AVAILABLE' ? 'bg-green-100 text-green-600' : pet.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}`}>
            {pet.status === 'AVAILABLE' ? 'Cần nhà' : pet.status === 'PENDING' ? 'Đang xử lý' : 'Đã nhận nuôi'}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{pet.name}</h3>
        <p className="text-sm text-slate-500 font-medium mb-3 truncate">{pet.breed || 'Không rõ giống'}</p>
        <div className="flex gap-3 text-xs text-slate-600 font-medium mb-4 flex-wrap">
          <span className="flex items-center gap-1">{getGenderIcon(pet.gender)} {pet.gender === 'MALE' ? 'Đực' : 'Cái'}</span>
          <span className="flex items-center gap-1">📅 {formatAge(pet.ageMonths)}</span>
          <span className="flex items-center gap-1">📏 {pet.size === 'SMALL' ? 'Nhỏ' : pet.size === 'MEDIUM' ? 'Vừa' : 'Lớn'}</span>
        </div>
        <div className="flex gap-2 flex-wrap mb-4 mt-auto">
          {pet.vaccinated && <span className="px-2 py-1 rounded-md bg-teal-50 text-teal-600 text-[10px] font-bold border border-teal-100">✅ Đã tiêm phòng</span>}
          {pet.neutered && <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">✅ Đã triệt sản</span>}
        </div>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 mt-auto">
        <span className="text-xs text-slate-500 font-medium truncate flex-1 mr-2">🏠 {pet.shelterName}</span>
        <span className="text-xs font-bold text-orange-500 group-hover:text-orange-600 whitespace-nowrap">Xem chi tiết →</span>
      </div>
    </Link>
  );
}
