import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PawPrint, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isShelter, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/pets', label: 'Nhận Nuôi' },
    { to: '/lost-pets', label: 'Thú Lạc' },
    { to: '/shelters', label: 'Trạm Cứu Hộ' },
    { to: '/campaigns', label: 'Chiến Dịch' },
    { to: '/donate', label: 'Quyên Góp' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <PawPrint size={20} className="text-white" fill="currentColor" />
            </div>
            <span className={`text-xl font-black tracking-widest uppercase ${scrolled ? 'text-slate-800' : 'text-slate-800 drop-shadow-sm'} transition-colors`}>
              PawFund
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full font-bold text-[15px] transition-all ${
                    active 
                      ? 'bg-orange-50 text-orange-600' 
                      : 'text-slate-600 hover:bg-orange-50/50 hover:text-orange-500'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative group/user">
                <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-full bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-sm">
                    {user?.fullName?.[0] || user?.username?.[0] || '?'}
                  </div>
                  <span className="font-bold text-slate-700 text-sm max-w-[100px] truncate">
                    {user?.fullName || user?.username}
                  </span>
                </div>

                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 overflow-hidden py-2 z-50">
                  {(isShelter || user?.role === 'ADMIN') && (
                    <Link to="/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-orange-500 hover:bg-orange-50 transition-colors">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-orange-500 hover:bg-orange-50 transition-colors">
                    <User size={18} /> Hồ sơ
                  </Link>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={18} /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 rounded-full font-bold text-[15px] text-slate-600 hover:text-orange-600 transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-full font-bold text-[15px] text-white bg-gradient-to-r from-orange-400 to-pink-500 hover:scale-105 transition-transform shadow-md shadow-orange-500/20">
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col h-full pt-24 px-6 pb-8">
          <nav className="flex flex-col gap-2 flex-1">
            {navLinks.map(link => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                    active 
                      ? 'bg-orange-50 text-orange-600' 
                      : 'text-slate-600 hover:bg-orange-50/50 hover:text-orange-500'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 pt-6 mt-6">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                {(isShelter || user?.role === 'ADMIN') && (
                  <Link to="/dashboard" className="flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-bold text-slate-600 hover:text-orange-500 hover:bg-orange-50">
                    <LayoutDashboard size={22} className="text-orange-400" /> Dashboard
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-bold text-slate-600 hover:text-orange-500 hover:bg-orange-50">
                  <User size={22} className="text-orange-400" /> Hồ sơ
                </Link>
                <button onClick={logout} className="flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-bold text-red-500 hover:bg-red-50 text-left w-full">
                  <LogOut size={22} /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="px-6 py-4 rounded-2xl text-lg font-bold text-center text-slate-700 bg-slate-100 hover:bg-slate-200">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-6 py-4 rounded-2xl text-lg font-bold text-center text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow-md shadow-orange-500/20">
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}