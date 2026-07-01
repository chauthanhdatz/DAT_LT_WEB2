import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Link as LinkIcon, Sparkles } from 'lucide-react';
import { blogPosts } from './blogData';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundPost = blogPosts.find(p => p.id === parseInt(id));
    if (foundPost) {
      setPost(foundPost);
    } else {
      navigate('/blog');
    }
  }, [id, navigate]);

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-24 pb-20">
      
      {/* Article Header */}
      <div className="container mx-auto px-4 max-w-4xl mb-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 font-bold mb-8 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 w-fit"
        >
          <ArrowLeft size={18} />
          Trở về Cẩm Nang
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm font-bold shadow-md shadow-orange-500/20">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <Calendar size={16} /> {post.date}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <Clock size={16} /> {post.readTime}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-tight mb-8">
          {post.title}
        </h1>

        <div className="flex items-center justify-between border-y border-slate-200 py-6 mb-10">
          <div className="flex items-center gap-4">
            <img src={post.authorAvatar} alt={post.author} className="w-14 h-14 rounded-full shadow-sm object-cover" />
            <div>
              <p className="font-bold text-slate-800 text-lg">{post.author}</p>
              <p className="text-slate-500 text-sm">Chuyên gia nội dung tại DatCMS.Pets</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all">
              <Facebook size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50 transition-all">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all">
              <LinkIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 max-w-5xl mb-16">
        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border-4 border-white">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 max-w-3xl">
        <article 
          className="blog-content prose prose-lg prose-slate max-w-none 
          prose-headings:font-black prose-headings:text-slate-800 
          prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
          prose-li:text-slate-600 prose-li:mb-2
          prose-strong:text-slate-800 prose-strong:font-black"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-8 rounded-[2rem] border border-orange-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles size={80} className="text-orange-500" />
             </div>
            <img src={post.authorAvatar} alt={post.author} className="w-24 h-24 rounded-full shadow-lg border-4 border-white object-cover relative z-10" />
            <div className="relative z-10">
              <h4 className="text-xl font-black text-slate-800 mb-2">Được viết bởi {post.author}</h4>
              <p className="text-slate-600 mb-4">
                Với nhiều năm kinh nghiệm trong lĩnh vực chăm sóc thú cưng, {post.author} luôn mang đến những kiến thức thiết thực và khoa học nhất để giúp bạn nuôi dưỡng các bé yêu khỏe mạnh.
              </p>
              <button className="px-6 py-2 rounded-full bg-white text-orange-600 font-bold border border-orange-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                Xem thêm bài viết
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .blog-content .lead {
          font-size: 1.25rem;
          color: #475569;
          font-weight: 500;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }
        .blog-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .blog-content li::marker {
          color: #f97316;
        }
      `}</style>
    </div>
  );
}
