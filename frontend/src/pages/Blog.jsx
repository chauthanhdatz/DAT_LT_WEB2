import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { blogPosts } from './blogData';

export default function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative px-4 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 opacity-70"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="container mx-auto max-w-5xl relative z-10 text-center py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-orange-600 font-bold mb-6">
            <Sparkles size={18} />
            <span>DatCMS.Pets Blog</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight mb-6 leading-tight">
            Cẩm Nang <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Chăm Sóc Thú Cưng</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Khám phá những kiến thức hữu ích, bí quyết dinh dưỡng và mẹo làm đẹp để thú cưng của bạn luôn khỏe mạnh, vui vẻ mỗi ngày.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
          {blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="group flex flex-col bg-white rounded-[2rem] border border-slate-100/50 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-sm font-bold text-slate-700 shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col p-8 md:p-10">
                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={16} className="text-orange-400" /> {post.date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1.5"><Clock size={16} className="text-pink-400" /> {post.readTime}</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 leading-snug mb-4 group-hover:text-orange-500 transition-colors">
                  <Link to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-slate-600 line-clamp-3 leading-relaxed mb-8 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                    <span className="font-bold text-slate-700 text-sm">{post.author}</span>
                  </div>
                  <Link 
                    to={`/blog/${post.id}`} 
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
