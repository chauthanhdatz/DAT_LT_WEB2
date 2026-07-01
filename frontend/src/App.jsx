import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PetList from './pages/PetList';
import PetDetail from './pages/PetDetail';
import Shelters from './pages/Shelters';
import Donate from './pages/Donate';
import LostPets from './pages/LostPets';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Campaigns from './pages/Campaigns';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-[#fafaf9] relative">
          <Navbar />
          <main className="flex-1 lg:pl-[180px] w-full flex flex-col min-h-screen transition-all duration-300 relative z-0">
            <div className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pets" element={<PetList />} />
                <Route path="/pets/:id" element={<PetDetail />} />
                <Route path="/shelters" element={<Shelters />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/lost-pets" element={<LostPets />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
              </Routes>
            </div>
            <Footer />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

