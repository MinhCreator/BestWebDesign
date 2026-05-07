import React from 'react';
import { Link } from 'react-router-dom';

const TrainingSection = () => {
  const articles = [
    {
      title: "Running Training Plan",
      date: "Sat, 30 June 2026",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyb7jpNkTvKNfQri9bRDwNdkGZUAQeQuiaOec87z6ZqS4f3UPrPc8yaiWf7Ixx2Ghf3AIKgRQrBL0KP0QVpb0QJOP0GMrCwsd7R0HWlCXjGQoioJPDRjbiuYCUGOO2ak85x_7mz7EeYQbX-9kCaeH5ETrwphDL-DPcuNgqrFBntdahaEAE3WHk898JMTzLoUXnmLZ7b4R4B0uqfpuLAw9oT3L5UiIVHWDUvPHXMxinTGryMwRG6xkfpGoLOrdCyDD6uZpou3sW9Vg"
    },
    {
      title: "Running schedule",
      date: "Fri, 11 Nov 2026",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA654JWAeJkSBqmCDPdPncR21_2wm8KKZo0TA6uPQudqjzeuR-zljOBMh8A-k0Iw-URvwpvXr-R-HZj1_-v0K0L8IKhfQWQBXiTQ5X3kGkPX1mF_2BPJADBpQxsz_Z_SME2p8movi_cwE7aJCcpNWksfcwF2d_th6I1B8ZoXfUBkyMORFRfq06gZyZFsy7BJDht8wIXgfwSkVeK_8kCbHh9A-QGh-nYoX6IyfjNbLuAfdpoMTDg0aks7AONVQGA-N1VCZjtmDPWGfQ"
    },
    {
      title: "How to run a marathon",
      date: "Fri, 11 Nov 2026",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUxh5zonejyI4Erp2-8Vz6stNXPnIce5i-LitBdqqEZTHVzYslsxthhj9S5smJRRZBJe7qYd4pQACaH3thJiNhmCvBhPz6zTA3ZXQ1X-cPFEFUtRD60OdD1pafNJSar08EVULX_FhnN6Lq2V21eNl-iOP4o5lYJ0H1vDAmyO46ULAE4zMzuUo_5_ybs6xVOf18REZN3gs24KiIGvgFawUuZ5XfYk6sheCWK0aMQTgL5mTcxCiMiQx0V5S_PO8FHVAKoWcFd-i7kk4"
    }
  ];

  return (
    <section className="pb-24 max-w-container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
      {/* Training */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-10 tracking-tight">
          TRAINING
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1B4332] to-[#56B685] rounded-2xl p-6 h-24 shadow-md cursor-pointer hover:opacity-95 transition-all">
            <div className="text-white">
              <Link
                to={"https://github.com/MinhCreator/BestWebDesign"}
                className={""}
                target="_blank"
              >
                <h4 className="font-bold text-base leading-tight">
                  Running Training Plan
                </h4>
                <p className="text-white/70 text-[11px] italic font-medium">
                  Training
                </p>
              </Link>
            </div>
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                edit_note
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gradient-to-r from-[#206649] to-[#4EB086] rounded-2xl p-6 h-24 shadow-md cursor-pointer hover:opacity-95 transition-all">
            <div className="text-white">
              <h4 className="font-bold text-base leading-tight">
                Pace Calculator
              </h4>
              <p className="text-white/70 text-[11px] italic font-medium">
                Pace
              </p>
            </div>
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                calculate
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gradient-to-r from-[#145341] to-[#3B927B] rounded-2xl p-6 h-24 shadow-md cursor-pointer hover:opacity-95 transition-all">
            <div className="text-white">
              <h4 className="font-bold text-base leading-tight">
                Progress Analysis
              </h4>
              <p className="text-white/70 text-[11px] italic font-medium">
                Progress
              </p>
            </div>
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                analytics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips & Tricks */}
      <div>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-primary tracking-tight">
            TIPS & TRICKS
          </h2>
          <button className="text-xs font-bold text-primary px-4 py-1.5 border border-primary/20 rounded-lg hover:bg-primary/5 transition-all">
            All
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="aspect-[1.2] rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100 shadow-sm">
                <img
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={article.image}
                />
              </div>
              <h4 className="text-[11px] font-bold text-gray-900 leading-snug line-clamp-2">
                {article.title}
              </h4>
              <p className="text-[9px] text-gray-400 mt-2 italic font-medium">
                {article.date}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="bg-primary text-white px-12 py-2.5 rounded-xl text-xs font-bold hover:bg-[#153427] transition-all shadow-md">
            All
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;
