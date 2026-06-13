import runner from "/public/video/runner.mp4";
import { Link } from "react-router";
const Hero = () => {
  return (
    <section className="relative h-[720px] w-full overflow-hidden mx-auto max-w-[1440px] md:rounded-[3rem] mt-4">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay={true}
          className="w-full h-full object-cover"
          loop
          muted
        >
          <source src={runner} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="relative z-10 max-w-container mx-auto h-full px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl text-white">
          <h1 className="text-display-hero font-extrabold mb-6 leading-[1.05]">
            Run a Mile
            <br />
            Change Your Life
          </h1>
          <p className="text-body-lg opacity-90 mb-10 max-w-lg leading-relaxed font-light">
            Join thousands of runners, explore new routes, and improve your
            health and well-being. Every step counts in our collective effort to
            create a healthier generation.
          </p>
          <div className="flex gap-4">
            <Link to={"/Event"}>
              <button className="bg-accent text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#48a174] transition-all home-btn">
                <span className="material-symbols-outlined">
                  directions_run
                </span>
                <span className="">New Run </span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Community Impact Sidebar */}
        <div className="glass-dark p-10 rounded-[3rem] w-full md:w-[460px] text-white text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/20 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="material-symbols-outlined text-xs">group</span>{" "}
            Community impact
          </div>
          <h3 className="text-2xl font-bold mb-8">Community achievements</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="stat-grid-item">
              <span className="material-symbols-outlined text-[#86EFAC] mb-3 text-3xl">
                trending_up
              </span>
              <div className="text-2xl font-bold">5.000.000+</div>
              <div className="text-[10px] opacity-60 uppercase tracking-widest mt-1 font-bold">
                Km
              </div>
            </div>
            <div className="stat-grid-item">
              <span className="material-symbols-outlined text-[#FDE047] mb-3 text-3xl">
                emoji_events
              </span>
              <div className="text-2xl font-bold">50.000+</div>
              <div className="text-[10px] opacity-60 uppercase tracking-widest mt-1 font-bold">
                Athlete
              </div>
            </div>
            <div className="stat-grid-item">
              <span className="material-symbols-outlined text-[#60A5FA] mb-3 text-3xl">
                explore
              </span>
              <div className="text-2xl font-bold">1.000+</div>
              <div className="text-[10px] opacity-60 uppercase tracking-widest mt-1 font-bold">
                Distance
              </div>
            </div>
            <div className="stat-grid-item">
              <span className="material-symbols-outlined text-[#FB923C] mb-3 text-3xl">
                stars
              </span>
              <div className="text-2xl font-bold">130+</div>
              <div className="text-[10px] opacity-60 uppercase tracking-widest mt-1 font-bold">
                Tournament
              </div>
            </div>
          </div>
          <div className="bg-black/20 border border-white/10 rounded-full py-3 px-6 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[#4ADE80] text-sm">
              target
            </span>
            <span className="text-xs font-medium opacity-80 italic tracking-wide">
              Target: 10 million km
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
