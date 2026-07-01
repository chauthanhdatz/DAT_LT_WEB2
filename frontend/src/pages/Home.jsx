import { useRef, useEffect } from 'react';
import heroVideo from '../assets/hero-video.mp4';

export default function Home() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative">
      <video
        ref={videoRef}
        src={heroVideo}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'contrast(1.15) saturate(1.2) brightness(1.05)',
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Lớp phủ mờ nhẹ để đảm bảo chữ luôn nổi bật trên nền sáng */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0"></div>

      {/* Nội dung chữ chính giữa - Đơn giản, hiện đại, không sến */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4">

        {/* Khu vực tiêu đề có "vẽ" thêm chó mèo bằng SVG thuần */}
        <div className="relative mb-6 flex items-center justify-center">

          {/* VẼ CON MÈO (Bên trái tiêu đề - ẩn trên mobile, hiện từ màn md) */}
          <div className="absolute -left-20 bottom-2 hidden md:block opacity-70 animate-bounce" style={{ animationDuration: '3.5s' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5c.5 0 .9.3 1.2.7l1.7 2.3c.5.7 1.4.9 2.1.4.8-.5 1.7-.3 2.2.5.5.8.3 1.8-.5 2.2-.6.4-.8 1.2-.6 1.9.3.9 0 1.9-.8 2.3-.7.4-1.1 1.2-1 2 .2 1-.4 1.9-1.4 2-1 0-1.7.7-1.9 1.6-.2.9-1.1 1.4-2 1.1-.3-.1-.6-.3-.8-.5H8.8c-.2.2-.5.4-.8.5-.9.3-1.8-.2-2-1.1-.2-.9-.9-1.6-1.9-1.6-1-.1-1.6-1-1.4-2 .1-.8-.3-1.6-1-2-.8-.4-1.1-1.4-.8-2.3.2-.7 0-1.5-.6-1.9-.8-.4-1-1.4-.5-2.2.5-.8 1.4-1 2.2-.5.7.5 1.6.3 2.1-.4l1.7-2.3c.3-.4.7-.7 1.2-.7h2.4z" />
              {/* Tai mèo */}
              <path d="M4.5 7.5L2 3l5 2M19.5 7.5L22 3l-5 2" />
              {/* Mắt mèo */}
              <circle cx="9.5" cy="13.5" r="1" fill="white" />
              <circle cx="14.5" cy="13.5" r="1" fill="white" />
              {/* Mũi miệng */}
              <path d="M12 15.5l-.5-.5h1l-.5.5zm0 0c-.3.5-.7.5-1 .5m1-.5c.3.5.7.5 1 .5" />
            </svg>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] uppercase mx-4">
            DATCMS.PETS
          </h1>

          {/* VẼ CON CHÓ (Bên phải tiêu đề - ẩn trên mobile, hiện từ màn md) */}
          <div className="absolute -right-20 bottom-2 hidden md:block opacity-70 animate-bounce" style={{ animationDuration: '4s' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Khuôn mặt chó */}
              <path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" />
              {/* Tai cụp hai bên */}
              <path d="M3.5 8.5c0 0-1.5 2.5-1.5 4.5s2 3 2 3M20.5 8.5c0 0 1.5 2.5 1.5 4.5s-2 3-2 3" />
              {/* Mắt chó */}
              <circle cx="9" cy="10.5" r="1.2" fill="white" />
              <circle cx="15" cy="10.5" r="1.2" fill="white" />
              {/* Mũi to tròn */}
              <ellipse cx="12" cy="13.5" rx="1.5" ry="1" fill="white" />
              {/* Miệng cười */}
              <path d="M10.5 15.5c.5.5 1 .8 1.5.8s1-.3 1.5-.8" />
            </svg>
          </div>

        </div>

        {/* Dấu chân (Paw print) vẽ bằng SVG nằm ngay trên thanh ngang */}
        <div className="flex flex-col items-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="opacity-80 mb-2 drop-shadow-md">
            <circle cx="12" cy="14" r="3.5" />
            <circle cx="7.5" cy="8.5" r="2" />
            <circle cx="12" cy="6.5" r="2" />
            <circle cx="16.5" cy="8.5" r="2" />
          </svg>
          <div className="w-20 h-1 bg-white drop-shadow-lg rounded-full opacity-80"></div>
        </div>

        <h2 className="text-xl md:text-3xl font-bold text-gray-50 tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-4 uppercase">
          Trung Tâm Cứu Hộ & Phúc Lợi Động Vật
        </h2>

        <p className="text-base md:text-lg font-medium text-gray-200 drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)] max-w-2xl leading-relaxed">
          Hành động thực tế vì quyền lợi động vật. Cứu trợ y tế khẩn cấp và tìm kiếm mái ấm vĩnh cửu cho thú cưng bị bỏ rơi.
        </p>
      </div>

    </div>
  );
}