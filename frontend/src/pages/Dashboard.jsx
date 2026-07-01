import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { shelterAPI, petAPI, adoptionAPI, userAPI, statsAPI, reportAPI } from '../services/api';
import { 
  LayoutDashboard, Users, Home, PawPrint, FileText, 
  Settings, LogOut, Plus, Trash2, Edit, CheckCircle, 
  XCircle, Search, AlertCircle, UploadCloud, ChevronDown, ChevronUp, Image as ImageIcon, Heart
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender 
} from '@tanstack/react-table';
import toast, { Toaster } from 'react-hot-toast';
import './Dashboard.css';

const COLORS = ['#14b8a6', '#f97316', '#f472b6', '#34d399', '#fbbf24'];

const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-2xl">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-600">{entry.name === 'donations' ? 'Quyên góp' : entry.name === 'adoptions' ? 'Nhận nuôi' : entry.name}</span>
            </div>
            <span className="font-bold text-slate-800">
              {entry.name === 'donations' ? formatVND(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [stats, setStats] = useState({});
  const [shelters, setShelters] = useState([]);
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals/Forms
  const [showShelterModal, setShowShelterModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [shelterForm, setShelterForm] = useState({ name:'', description:'', address:'', phone:'', email:'' });
  const [petForm, setPetForm] = useState({ name:'', species:'DOG', breed:'', ageMonths:'', gender:'MALE', size:'MEDIUM', description:'', vaccinated:false, neutered:false, shelterId:'' });
  
  // Image Upload State
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await statsAPI.get();
        setStats(res.data);
      }
      
      if (activeTab === 'shelters' || activeTab === 'overview') {
        const s = isAdmin ? await shelterAPI.getAll() : await shelterAPI.getMy();
        setShelters(isAdmin ? s.data.content || s.data : s.data);
      }
      
      if (activeTab === 'pets' || activeTab === 'overview') {
        const p = await petAPI.getAll({ page: 0, size: 500 });
        setPets(p.data.content || []);
      }
      
      if (activeTab === 'adoptions' || activeTab === 'overview') {
        if (isAdmin) {
            const req = await adoptionAPI.getMy(); 
            setRequests(req.data.content || req.data);
        } else {
            const s = await shelterAPI.getMy();
            if (s.data && s.data.length > 0) {
              const r = await adoptionAPI.getByShelter(s.data[0].id);
              setRequests(r.data);
            }
        }
      }
      
      if (isAdmin && activeTab === 'users') {
        const u = await userAPI.getAll();
        setUsers(u.data);
      }
      
      if (isAdmin && activeTab === 'reports') {
        const r = await reportAPI.getAll();
        setReports(r.data);
      }
    } catch(e) {
      toast.error('Lỗi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Image Drag & Drop Logic ---
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };
  const handleImageSelect = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // --- Handlers ---
  const handleCreateShelter = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Đang tạo trạm...');
    try {
      await shelterAPI.create(shelterForm);
      toast.success('Tạo trạm cứu hộ thành công!', { id: loadingToast });
      setShowShelterModal(false);
      setShelterForm({ name:'', description:'', address:'', phone:'', email:'' });
      fetchData();
    } catch(err) { toast.error('Có lỗi xảy ra', { id: loadingToast }); }
  };

  const handleDeleteShelter = async (id) => {
    if(!window.confirm('Xóa trạm cứu hộ này?')) return;
    try {
      await shelterAPI.delete(id);
      toast.success('Đã xóa trạm cứu hộ');
      fetchData();
    } catch(err) { toast.error('Không thể xóa trạm'); }
  };

  const handleCreatePet = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Đang thêm thú cưng...');
    const fd = new FormData();
    Object.entries(petForm).forEach(([k,v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    try {
      await petAPI.create(fd);
      toast.success('Thêm thú cưng thành công!', { id: loadingToast });
      setShowPetModal(false);
      setImage(null);
      setImagePreview(null);
      fetchData();
    } catch(err) { toast.error('Có lỗi xảy ra', { id: loadingToast }); }
    finally { setIsSubmitting(false); }
  };

  const handleDeletePet = async (id) => {
    if(!window.confirm('Xóa thú cưng này?')) return;
    try {
      await petAPI.delete(id);
      toast.success('Đã xóa thú cưng');
      fetchData();
    } catch(err) { toast.error('Không thể xóa thú cưng'); }
  };

  const handleAdoption = async (id, status, rejectReason = '') => {
    try {
      await adoptionAPI.updateStatus(id, status, rejectReason);
      toast.success(status === 'APPROVED' ? 'Đã duyệt yêu cầu' : 'Đã từ chối yêu cầu');
      fetchData();
    } catch(err) { toast.error('Lỗi xử lý'); }
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm('Xóa người dùng này?')) return;
    try {
      await userAPI.delete(id);
      toast.success('Đã xóa người dùng');
      fetchData();
    } catch(err) { toast.error('Không thể xóa người dùng'); }
  };

  const handleReport = async (id, status) => {
    try {
      await reportAPI.updateStatus(id, status, 'Đã xử lý bởi Admin');
      toast.success('Đã cập nhật trạng thái báo cáo');
      fetchData();
    } catch(err) { toast.error('Lỗi xử lý'); }
  };

  // --- Tanstack Table Components ---
  const DataTable = ({ data, columns }) => {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
      data,
      columns,
      state: { sorting, globalFilter, rowSelection },
      onSortingChange: setSorting,
      onGlobalFilterChange: setGlobalFilter,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: 10 } },
    });

    return (
      <div className="table-container bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="search-bar relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tìm kiếm tất cả..."
            />
          </div>
          {Object.keys(rowSelection).length > 0 && (
            <button className="text-sm bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-red-200">
              <Trash2 size={16}/> Xóa ({Object.keys(rowSelection).length}) dòng đã chọn
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 font-medium border-b border-slate-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-4 cursor-pointer select-none hover:bg-slate-200/50 transition-colors" onClick={header.column.getToggleSortingHandler()}>
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: <ChevronUp size={14}/>, desc: <ChevronDown size={14}/> }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr><td colSpan={columns.length} className="p-8 text-center text-slate-500 italic">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 text-sm">
          <span className="text-slate-600">Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <div className="flex gap-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 border border-slate-300 rounded bg-white disabled:opacity-50">Trước</button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 border border-slate-300 rounded bg-white disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>
    );
  };

  // --- Table Columns ---
  const userColumns = useMemo(() => [
    { id: 'select', header: ({table}) => <input type="checkbox" checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />, cell: ({row}) => <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} /> },
    { accessorKey: 'username', header: 'Người dùng', cell: ({row}) => (
        <div className="flex items-center gap-3">
          <img src={row.original.avatarUrl || `https://ui-avatars.com/api/?name=${row.original.username}&background=random`} alt="" className="w-10 h-10 rounded-full"/>
          <div><p className="font-bold text-slate-800 m-0">{row.original.fullName || row.original.username}</p><span className="text-xs text-slate-500">@{row.original.username}</span></div>
        </div>
    )},
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Vai trò', cell: ({getValue}) => <span className={`px-3 py-1 rounded-full text-xs font-bold role-${getValue().toLowerCase()}`}>{getValue()}</span> },
    { accessorKey: 'createdAt', header: 'Ngày tạo', cell: ({getValue}) => new Date(getValue()).toLocaleDateString('vi-VN') },
    { id: 'actions', header: 'Thao tác', cell: ({row}) => <button onClick={() => handleDeleteUser(row.original.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button> }
  ], []);

  const petColumns = useMemo(() => [
    { id: 'select', header: ({table}) => <input type="checkbox" checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />, cell: ({row}) => <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} /> },
    { accessorKey: 'name', header: 'Thú cưng', cell: ({row}) => (
      <div className="flex items-center gap-3">
        <img src={row.original.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'} alt="" className="w-12 h-12 rounded-lg object-cover"/>
        <div><p className="font-bold text-slate-800 m-0">{row.original.name}</p><span className="text-xs text-slate-500">{row.original.species === 'DOG' ? 'Chó' : 'Mèo'} • {row.original.breed}</span></div>
      </div>
    )},
    { accessorKey: 'status', header: 'Trạng thái', cell: ({getValue}) => <span className={`px-3 py-1 rounded-full text-xs font-bold status-${getValue()}`}>{getValue() === 'AVAILABLE' ? 'Chưa nhận' : 'Đã nhận'}</span> },
    { id: 'actions', header: 'Thao tác', cell: ({row}) => (
      <div className="flex gap-2">
        <button className="p-2 text-primary hover:bg-indigo-50 rounded-full"><Edit size={18}/></button>
        <button onClick={() => handleDeletePet(row.original.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button>
      </div>
    )}
  ], []);


  // Renderers
  const renderOverview = () => {
    const pieData = [
      { name: 'Chó', value: pets.filter(p => p.species === 'DOG').length },
      { name: 'Mèo', value: pets.filter(p => p.species === 'CAT').length },
    ];
    const barData = [
      { name: 'Chờ nhận nuôi', uv: stats.availablePets || 0 },
      { name: 'Đã nhận nuôi', uv: stats.adoptedPets || 0 },
    ];
    // Mock trend data
    const trendData = [
      { name: 'T1', adoptions: 4, donations: 200000 },
      { name: 'T2', adoptions: 7, donations: 500000 },
      { name: 'T3', adoptions: 5, donations: 300000 },
      { name: 'T4', adoptions: 12, donations: 1200000 },
    ];

    if (isLoading) return <SkeletonLoader type="overview" />;

    return (
      <div className="tab-content fade-in space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h2>
            <p className="text-slate-500">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center"><PawPrint size={28}/></div>
            <div><h3 className="text-3xl font-extrabold text-slate-800">{stats.totalPets || 0}</h3><p className="text-slate-500 text-sm font-medium">Tổng Thú Cưng</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center"><Heart size={28}/></div>
            <div><h3 className="text-3xl font-extrabold text-slate-800">{stats.adoptedPets || 0}</h3><p className="text-slate-500 text-sm font-medium">Đã Nhận Nuôi</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center"><Home size={28}/></div>
            <div><h3 className="text-3xl font-extrabold text-slate-800">{stats.totalShelters || 0}</h3><p className="text-slate-500 text-sm font-medium">Trạm Cứu Hộ</p></div>
          </div>
          {isAdmin && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center"><Users size={28}/></div>
              <div><h3 className="text-3xl font-extrabold text-slate-800">{stats.totalUsers || 0}</h3><p className="text-slate-500 text-sm font-medium">Người Dùng</p></div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Xu hướng hoạt động</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} yAxisId="left" />
                  <YAxis axisLine={false} tickLine={false} yAxisId="right" orientation="right" />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line yAxisId="left" type="monotone" dataKey="adoptions" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316'}} activeDot={{r: 6}} name="adoptions" />
                  <Line yAxisId="right" type="monotone" dataKey="donations" stroke="#7c3aed" strokeWidth={3} dot={{r: 4, fill: '#7c3aed'}} name="donations" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Tỉ lệ loài vật</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></span> {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="sidebar bg-slate-900 text-slate-300">
        <div className="sidebar-header border-slate-800">
          <PawPrint size={28} className="text-indigo-400" />
          <h2 className="text-white">DatCMS.Pets<span className="text-indigo-400">.</span></h2>
        </div>
        
        <div className="sidebar-user border-slate-800">
          <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName||user?.username}&background=random`} alt="User" />
          <div className="su-info">
            <p className="su-name text-white">{user?.fullName || user?.username}</p>
            <p className="su-role text-slate-400">{user?.role}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={20} /> Tổng quan</button>
          {isAdmin && <button className={`nav-item ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('users')}><Users size={20} /> Người dùng</button>}
          {isAdmin && <button className={`nav-item ${activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('reports')}><AlertCircle size={20} /> Báo cáo</button>}
          <button className={`nav-item ${activeTab === 'shelters' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('shelters')}><Home size={20} /> Trạm cứu hộ</button>
          <button className={`nav-item ${activeTab === 'pets' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('pets')}><PawPrint size={20} /> Thú cưng</button>
          <button className={`nav-item ${activeTab === 'adoptions' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('adoptions')}><FileText size={20} /> Đơn nhận nuôi</button>
        </nav>

        <div className="sidebar-footer border-slate-800">
          <button className="nav-item text-red-400 hover:bg-red-500/10 w-full" onClick={logout}><LogOut size={20} /> Đăng xuất</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content bg-slate-50">
        <header className="content-header border-slate-200 bg-white">
          <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab === 'overview' ? 'Dashboard' : activeTab}</h1>
          <div className="header-actions">
            <button className="btn-icon"><AlertCircle size={20}/></button>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'overview' && renderOverview()}
          
          {activeTab === 'pets' && (
            <div className="tab-content fade-in space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Quản lý thú cưng</h2>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm" onClick={() => {
                  if(shelters.length === 0) { toast.error('Bạn cần tạo trạm cứu hộ trước!'); return; }
                  setPetForm({...petForm, shelterId: shelters[0].id});
                  setShowPetModal(true);
                }}><Plus size={18} /> Thêm thú cưng</button>
              </div>
              {isLoading ? <SkeletonLoader type="table" /> : <DataTable data={pets} columns={petColumns} />}
            </div>
          )}

          {activeTab === 'users' && isAdmin && (
            <div className="tab-content fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Quản lý người dùng</h2>
              {isLoading ? <SkeletonLoader type="table" /> : <DataTable data={users} columns={userColumns} />}
            </div>
          )}

          {activeTab === 'reports' && isAdmin && (
            <div className="tab-content fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Quản lý báo cáo</h2>
              {isLoading ? <SkeletonLoader type="table" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports.map(r => (
                    <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{r.status}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl mb-4 flex-1">
                        <p className="font-semibold text-slate-800 mb-1">Loại: {r.reportType}</p>
                        <p className="text-slate-600 italic text-sm mb-2">"{r.reason}"</p>
                        <p className="text-xs text-slate-500">Mục tiêu ID: {r.targetId}</p>
                      </div>
                      {r.status === 'PENDING' && (
                        <div className="flex gap-3 mt-auto">
                          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold" onClick={() => handleReport(r.id, 'RESOLVED')}>Đã xử lý</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {reports.length === 0 && <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">Không có báo cáo nào.</div>}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'shelters' && (
             <div className="tab-content fade-in space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Quản lý trạm cứu hộ</h2>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm" onClick={() => setShowShelterModal(true)}><Plus size={18} /> Thêm trạm</button>
              </div>
              {isLoading ? <SkeletonLoader type="table" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shelters.map(s => (
                    <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"><Edit size={16}/></button>
                         {(isAdmin || true) && <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" onClick={() => handleDeleteShelter(s.id)}><Trash2 size={16}/></button>}
                      </div>
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mb-4">🏠</div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{s.name}</h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{s.description || 'Chưa có mô tả'}</p>
                      <div className="space-y-2 text-sm text-slate-600">
                        <p>📍 {s.address}</p>
                        <p>📞 {s.phone}</p>
                        <p>✉️ {s.email}</p>
                      </div>
                    </div>
                  ))}
                  {shelters.length === 0 && <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">Chưa có trạm cứu hộ nào.</div>}
                </div>
              )}
             </div>
          )}

          {activeTab === 'adoptions' && (
            <div className="tab-content fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Yêu cầu nhận nuôi</h2>
              {isLoading ? <SkeletonLoader type="table" /> : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {requests.map(r => (
                    <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4 items-center">
                          <img src={r.pet?.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'} alt="" className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm text-slate-500">Yêu cầu nhận nuôi</p>
                            <h3 className="font-bold text-lg text-slate-800">{r.pet?.name}</h3>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold status-${r.status}`}>{r.status}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl mb-4 flex-1">
                        <p className="font-semibold text-slate-800 mb-1">Từ: {r.user?.fullName || r.user?.username}</p>
                        <p className="text-slate-600 text-sm mb-2">Email: {r.user?.email} • SĐT: {r.user?.phone || 'Chưa cập nhật'}</p>
                        <p className="text-slate-600 italic text-sm">Lời nhắn: "{r.message}"</p>
                      </div>
                      {r.status === 'PENDING' && (
                        <div className="flex gap-3">
                          <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl font-semibold flex justify-center items-center gap-2" onClick={() => handleAdoption(r.id, 'APPROVED')}><CheckCircle size={18}/> Duyệt</button>
                          <button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-xl font-semibold flex justify-center items-center gap-2" onClick={() => { const reason = prompt('Lý do từ chối (tùy chọn):'); if(reason !== null) handleAdoption(r.id, 'REJECTED', reason); }}><XCircle size={18}/> Từ chối</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {requests.length === 0 && <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">Chưa có yêu cầu nào.</div>}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Pet Modal with Drag & Drop Upload */}
      {showPetModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-3xl animate-slideUp">
            <div className="modal-header">
              <h2>Thêm Thú Cưng Mới</h2>
              <button className="btn-icon" onClick={() => setShowPetModal(false)}><XCircle size={24}/></button>
            </div>
            <form onSubmit={handleCreatePet}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload Column */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh thú cưng *</label>
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${imagePreview ? 'border-orange-400 bg-orange-50/30' : 'border-slate-300 hover:border-orange-400 hover:bg-slate-50'}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full p-2 group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-sm" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white font-medium gap-2">
                           <Edit size={16}/> Thay đổi ảnh
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); fileInputRef.current.value=''; }} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"><UploadCloud size={32}/></div>
                        <p className="font-semibold text-slate-700 mb-1">Click hoặc kéo thả ảnh vào đây</p>
                        <p className="text-xs text-slate-500">Hỗ trợ JPG, PNG (Max 5MB)</p>
                      </div>
                    )}
                    <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={(e) => e.target.files[0] && handleImageSelect(e.target.files[0])} required/>
                  </div>
                </div>

                {/* Info Column */}
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Tên thú cưng *</label><input required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" value={petForm.name} onChange={e=>setPetForm({...petForm,name:e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Loài</label><select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={petForm.species} onChange={e=>setPetForm({...petForm,species:e.target.value})}><option value="DOG">Chó</option><option value="CAT">Mèo</option></select></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Giống</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={petForm.breed} onChange={e=>setPetForm({...petForm,breed:e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Tuổi (Tháng)</label><input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={petForm.ageMonths} onChange={e=>setPetForm({...petForm,ageMonths:e.target.value})} /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label><select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={petForm.gender} onChange={e=>setPetForm({...petForm,gender:e.target.value})}><option value="MALE">Đực</option><option value="FEMALE">Cái</option></select></div>
                  </div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Trạm cứu hộ *</label><select required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={petForm.shelterId} onChange={e=>setPetForm({...petForm,shelterId:e.target.value})}>{shelters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                  
                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700"><input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300" checked={petForm.vaccinated} onChange={e=>setPetForm({...petForm,vaccinated:e.target.checked})}/> Đã tiêm phòng</label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700"><input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300" checked={petForm.neutered} onChange={e=>setPetForm({...petForm,neutered:e.target.checked})}/> Đã triệt sản</label>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-6 flex justify-end gap-3">
                <button type="button" className="px-6 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors" onClick={() => setShowPetModal(false)} disabled={isSubmitting}>Hủy</button>
                <button type="submit" className="px-6 py-2 rounded-xl font-semibold bg-teal-500 text-white hover:bg-teal-600 transition-colors shadow-sm flex items-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Đang xử lý...</> : 'Thêm thú cưng'}
                </button>
              </div>
            </form>
            {isSubmitting && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 rounded-2xl"></div>}
          </div>
        </div>
      )}

      {/* Shelter Modal */}
      {showShelterModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl animate-slideUp">
            <div className="modal-header">
              <h2>Thêm Trạm Cứu Hộ Mới</h2>
              <button className="btn-icon" onClick={() => setShowShelterModal(false)}><XCircle size={24}/></button>
            </div>
            <form onSubmit={handleCreateShelter} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Tên trạm *</label><input required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={shelterForm.name} onChange={e=>setShelterForm({...shelterForm,name:e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={shelterForm.address} onChange={e=>setShelterForm({...shelterForm,address:e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Điện thoại</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={shelterForm.phone} onChange={e=>setShelterForm({...shelterForm,phone:e.target.value})} /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={shelterForm.email} onChange={e=>setShelterForm({...shelterForm,email:e.target.value})} /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label><textarea className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" rows={3} value={shelterForm.description} onChange={e=>setShelterForm({...shelterForm,description:e.target.value})}></textarea></div>
              <div className="mt-6 border-t border-slate-100 pt-6 flex justify-end gap-3">
                <button type="button" className="px-6 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors" onClick={() => setShowShelterModal(false)}>Hủy</button>
                <button type="submit" className="px-6 py-2 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton Loader Component
const SkeletonLoader = ({ type }) => {
  if (type === 'overview') return (
    <div className="space-y-6">
      <div className="w-48 h-8 bg-slate-200 rounded-lg animate-pulse mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 h-72 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="h-72 bg-slate-200 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  );
  if (type === 'table') return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="h-16 bg-slate-50 border-b border-slate-200"></div>
      {[1,2,3,4,5].map(i => (
        <div key={i} className="flex p-4 border-b border-slate-100 gap-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2 py-1"><div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div><div className="h-3 bg-slate-200 rounded w-1/6 animate-pulse"></div></div>
        </div>
      ))}
    </div>
  );
  return null;
}
