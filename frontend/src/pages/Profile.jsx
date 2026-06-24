import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page pt-20">
      <div className="container max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center animate-fadeInUp relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-400 to-pink-500"></div>
          
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-black text-orange-500 shadow-md border-4 border-white z-10 mt-16 mb-4">
            {user.fullName?.[0] || user.username?.[0] || '?'}
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-2 z-10">{user.fullName || user.username}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold z-10 mb-8 ${user.role?.toLowerCase() === 'shelter' ? 'bg-purple-100 text-purple-600' : user.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {user.role === 'USER' ? '👤 Người dùng' : user.role === 'SHELTER' ? '🏠 Trạm cứu hộ' : '⚙️ Admin'}
          </span>
          
          <div className="w-full px-8 pb-8 space-y-4 text-sm z-10">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-500 font-medium">Tên đăng nhập</span>
              <span className="font-bold text-slate-800">{user.username}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-500 font-medium">Email</span>
              <span className="font-bold text-slate-800">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="text-slate-500 font-medium">Số điện thoại</span>
                <span className="font-bold text-slate-800">{user.phone}</span>
              </div>
            )}
            
            <button className="mt-4 w-full py-3.5 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-colors z-10 flex items-center justify-center gap-2" onClick={handleLogout}>
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
