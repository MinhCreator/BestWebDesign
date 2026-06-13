import React from 'react';
import jogging from "@/assets/image/jogging.png";
const RaceSlider = () => {
  const races = [
    {
      title: "Coming Soon",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBfIOC_SxDHq_LscojrkOZ9cGEwKLTYTU8ctEi4ibt2_3N5bLFObGs0c41fOZp_4hSlcYlM-sV1Zg3JFj6CpROYmeRgHGg49RbEC16fdoO7j6uXZt8WQfrTnHLEKnSZfk7rCDe7TOeRe0AfyLFsrX75zScIgTEijVFSL3qxWO-bndkiq8lVDsJBxQ86cpSSnLE6FAr-oW5zmpzX5f7dg_rtzR02a1rgDqklHZSlV_ybTAEbl_Sz5FI2TZbwrfhTupcSviVwKjPGlC4",
      highlight: false,
    },
    {
      title: "Giải Sapa Marathon Sắp Tới",
      subtitle: "02/07/2026",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCExpwg0wRdur3Mth3mlcM3AsUwcZhA9GRnn0nyigBVIlyvMk7cOTQRWtLCQKC8Mt-qk7F1S4xILsWTy_vMNS0fh_hKS_MqsAt4as7PI898TydAYlkG5quF3d67XJ2sfWH5zCOJ1svoiBk4_Pa5dQMGonhwmZ1ccNiGo6J0NcYPUaXbPSiaVoom5i2YJY9bWVdvrtdxdSxV7QFby0DRNK6NeF7V6KsdZy_fvwRgp850uTp8I-DStcky9X1npTNKbjuqt_CQaarMid8",
      highlight: true,
    },
    {
      title: "TRAINING",
      promo: "Training Plan",
      date: "02/02/2026",
      image: jogging,
      isTraining: true,
    },
  ];

  return (
    <section className="py-16 bg-[#f8faf9]">
      <div className="max-w-container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-primary tracking-tight">UPCOMING</h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-400 hover:text-primary transition-all shadow-sm">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-400 hover:text-primary transition-all shadow-sm">
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {races.map((race, index) => (
            <div 
              key={index}
              className={`relative rounded-[2rem] overflow-hidden aspect-[4/3] group cursor-pointer ${race.highlight ? 'shadow-lg ring-4 ring-accent/10' : race.isTraining ? 'bg-[#0E4631]' : ''}`}
            >
              <img 
                alt={race.title} 
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${race.isTraining ? 'opacity-40' : ''}`} 
                src={race.image} 
              />
              {race.isTraining ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
                  <h4 className="text-[#FDE047] font-bold uppercase tracking-tight text-sm mb-2">RUNNING PLAN</h4>
                  <h3 className="text-4xl font-black text-white mb-2 leading-none">{race.title}</h3>
                  <p className="text-white font-bold text-lg mb-4">{race.promo}</p>
                  <p className="text-white/60 text-xs italic">{race.date}</p>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold text-white mb-1">{race.title}</h3>
                  {race.subtitle && <p className="text-white/70 text-sm italic font-light">{race.subtitle}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-10 h-2.5 bg-accent rounded-full"></div>
          <div className="w-3 h-2.5 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-2.5 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default RaceSlider;
