import React, { useState } from "react";
import { Link } from "react-router-dom";
import PaginatedList from "./Pagination";
import Dialog from "../ui/Dialog";
import PaceCalculator from "../ui/PaceCalculator";
import post from "/src/assets/poster.svg";

const TrainingSection = () => {
  const Mockup_articles = [
    {
      title: "Running Training Plan",
      date: "Sat, 30 June 2026",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCyb7jpNkTvKNfQri9bRDwNdkGZUAQeQuiaOec87z6ZqS4f3UPrPc8yaiWf7Ixx2Ghf3AIKgRQrBL0KP0QVpb0QJOP0GMrCwsd7R0HWlCXjGQoioJPDRjbiuYCUGOO2ak85x_7mz7EeYQbX-9kCaeH5ETrwphDL-DPcuNgqrFBntdahaEAE3WHk898JMTzLoUXnmLZ7b4R4B0uqfpuLAw9oT3L5UiIVHWDUvPHXMxinTGryMwRG6xkfpGoLOrdCyDD6uZpou3sW9Vg",
    },
    {
      title: "Running schedule",
      date: "Fri, 11 Nov 2026",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA654JWAeJkSBqmCDPdPncR21_2wm8KKZo0TA6uPQudqjzeuR-zljOBMh8A-k0Iw-URvwpvXr-R-HZj1_-v0K0L8IKhfQWQBXiTQ5X3kGkPX1mF_2BPJADBpQxsz_Z_SME2p8movi_cwE7aJCcpNWksfcwF2d_th6I1B8ZoXfUBkyMORFRfq06gZyZFsy7BJDht8wIXgfwSkVeK_8kCbHh9A-QGh-nYoX6IyfjNbLuAfdpoMTDg0aks7AONVQGA-N1VCZjtmDPWGfQ",
    },
    {
      title: "How to run a marathon",
      date: "Fri, 11 Nov 2026",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCUxh5zonejyI4Erp2-8Vz6stNXPnIce5i-LitBdqqEZTHVzYslsxthhj9S5smJRRZBJe7qYd4pQACaH3thJiNhmCvBhPz6zTA3ZXQ1X-cPFEFUtRD60OdD1pafNJSar08EVULX_FhnN6Lq2V21eNl-iOP4o5lYJ0H1vDAmyO46ULAE4zMzuUo_5_ybs6xVOf18REZN3gs24KiIGvgFawUuZ5XfYk6sheCWK0aMQTgL5mTcxCiMiQx0V5S_PO8FHVAKoWcFd-i7kk4",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isPaceOpen, setIsPaceOpen] = useState(false);

  return (
    <section className="pb-24 max-w-container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
      {/* Training */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-10 tracking-tight">
          TRAINING
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1B4332] to-[#56B685] rounded-2xl p-6 h-24 shadow-md cursor-pointer hover:opacity-95 transition-all">
            <button
              onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
              className="w-full flex justify-between"
            >
              <Dialog
                Component={<img src={post} alt="poster" />}
                isOpen={isOpen}
                CustomStyle={"w-auto h-auto"}
              />
              <div className="text-white">
               

                <h4 className="font-bold text-base leading-tight">
                  Running Training Plan
                </h4>
                <p className="text-white/70 text-[11px] italic font-medium">
                  Training
                </p>

                {/* </Link> */}
              </div>
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  edit_note
                </span>
              </div>
            </button>
          </div>
          <button
            onClick={() => setIsPaceOpen(true)}
            className="flex items-center justify-between bg-gradient-to-r from-[#206649] to-[#4EB086] rounded-2xl p-6 h-24 shadow-md cursor-pointer hover:opacity-95 transition-all w-full text-left"
          >
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
          </button>
          {/* <div className="flex items-center justify-between bg-gradient-to-r from-[#145341] to-[#3B927B] rounded-2xl p-6 h-24 shadow-md cursor-pointer hover:opacity-95 transition-all">
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
          </div> */}
        </div>
      </div>

      {/* Tips & Tricks */}
      <div>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-primary tracking-tight">
            TIPS & TRICKS
          </h2>
        </div>
        <PaginatedList />
      </div>

      {/* Pace Calculator Modal */}
      {isPaceOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsPaceOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-bold">Pace Calculator</h2>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setIsPaceOpen(false)}
              >
                ✕
              </button>
            </div>
            <PaceCalculator />
          </div>
        </div>
      )}
    </section>
  );
};

export default TrainingSection;
