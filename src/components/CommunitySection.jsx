import React from 'react';

const CommunitySection = () => {
  return (
    <section className="py-20 max-w-container mx-auto px-6">
      <h2 className="text-2xl font-bold text-primary mb-10 tracking-tight">RUNNING COMMUNITY</h2>
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Clubs */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Club 1 */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-all">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6 ring-8 ring-emerald-50">
              <span className="material-symbols-outlined text-[#FDE047] text-5xl">directions_run</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">RUNNING CLUBS</h3>
            <p className="text-gray-400 text-xs mb-6 font-medium">252 members</p>
            <button className="px-8 py-2 rounded-full border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all mb-8">Join now</button>
            <div className="flex -space-x-3 mt-auto">
              <img alt="U1" className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ9AI-pQb9fE-3Zia1iE2-q8D8TM9pjHNDtoyaNZ6f0BfMEpSWJKoFTfN6CpWctR5U5LcJUvqhtx1pM6yqyb80qfte-Za2e03G6vDEARukZuap5L0PU4YRGey13OjOuf3qyhld--7K1v2KQkAuGBxfv9XcA8000WQF5Uat1RF7jxW0DfozpKbY3qp38amAvPrwj_sJvv7OiltXVPvs9-6b8ivIESNcpw1gN9VkcZIXNbPU82Q7vpA6D2SbD4zmRuu9rHuA4Z5kOqo" />
              <img alt="U2" className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMtWzXVCz_etXq4ED8Npmzg8EAhhBEq-KlqujJxKg7vzGEMJsaXlYfA8pQ1G91YX3xPzSbMW8fM8b6g4mETsCMw88s_9gQAzNFHeAvUti-qVo4bv9yhv8FLfJpRbNdPa6HycTU0kkOOlgpw3fdkVxjVAC4ZqyarWAW4uNI-abp4U9nm50oHEXNDlPJ6YIrwYptn1SMTSeKoJGsjsUJAi09vBCiFUdRulvU8vFyA3nZdGnMaS5Lb-ESNUH-4GflDj1LkcRJIeYb-eY" />
              <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold">+12</div>
            </div>
          </div>

          {/* Club 2 */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
            <div className="h-44 relative">
              <img alt="Race" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfIOC_SxDHq_LscojrkOZ9cGEwKLTYTU8ctEi4ibt2_3N5bLFObGs0c41fOZp_4hSlcYlM-sV1Zg3JFj6CpROYmeRgHGg49RbEC16fdoO7j6uXZt8WQfrTnHLEKnSZfk7rCDe7TOeRe0AfyLFsrX75zScIgTEijVFSL3qxWO-bndkiq8lVDsJBxQ86cpSSnLE6FAr-oW5zmpzX5f7dg_rtzR02a1rgDqklHZSlV_ybTAEbl_Sz5FI2TZbwrfhTupcSviVwKjPGlC4" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-md">
                <img alt="Leader" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMtWzXVCz_etXq4ED8Npmzg8EAhhBEq-KlqujJxKg7vzGEMJsaXlYfA8pQ1G91YX3xPzSbMW8fM8b6g4mETsCMw88s_9gQAzNFHeAvUti-qVo4bv9yhv8FLfJpRbNdPa6HycTU0kkOOlgpw3fdkVxjVAC4ZqyarWAW4uNI-abp4U9nm50oHEXNDlPJ6YIrwYptn1SMTSeKoJGsjsUJAi09vBCiFUdRulvU8vFyA3nZdGnMaS5Lb-ESNUH-4GflDj1LkcRJIeYb-eY" />
              </div>
            </div>
            <div className="p-8 pt-10 text-center flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Training support</h3>
              <p className="text-gray-400 text-xs mb-6 font-medium">56 members</p>
              <button className="bg-accent text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#48a174] transition-all mb-8">Join now</button>
              <div className="flex justify-center gap-4 mt-auto">
                <span className="material-symbols-outlined text-[#86EFAC] text-xl">spa</span>
                <span className="material-symbols-outlined text-[#86EFAC] text-xl">volunteer_activism</span>
                <span className="material-symbols-outlined text-[#86EFAC] text-xl">forest</span>
              </div>
            </div>
          </div>

          {/* Club 3 */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
            <div className="h-44 relative group">
              <img alt="Runners" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ9AI-pQb9fE-3Zia1iE2-q8D8TM9pjHNDtoyaNZ6f0BfMEpSWJKoFTfN6CpWctR5U5LcJUvqhtx1pM6yqyb80qfte-Za2e03G6vDEARukZuap5L0PU4YRGey13OjOuf3qyhld--7K1v2KQkAuGBxfv9XcA8000WQF5Uat1RF7jxW0DfozpKbY3qp38amAvPrwj_sJvv7OiltXVPvs9-6b8ivIESNcpw1gN9VkcZIXNbPU82Q7vpA6D2SbD4zmRuu9rHuA4Z5kOqo" />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full flex items-center gap-1.5 text-[9px] text-white font-bold border border-white/20 uppercase tracking-tighter">
                <span className="material-symbols-outlined text-xs">group</span> Forum
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Discussion Forum</h3>
              <h4 className="text-sm font-bold text-gray-800 leading-snug mb-2">Running activities</h4>
              <p className="text-gray-400 text-[10px] mb-4 italic font-medium">88 members, 1k posts</p>
              <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">Running activities forum for runners</p>
            </div>
          </div>
        </div>

        {/* Right: Activity Feed */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-2xl">directions_run</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold text-gray-900">Running activities</span>
                  <span className="text-[10px] text-gray-400 font-medium">7 min ago</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-[11px] text-gray-600 leading-relaxed">
                  Running activities forum for runners
                </div>
              </div>
            </div>
            {/* Shortened feed items for brevity */}
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-2xl">directions_run</span>
              </div>
              <div className="flex-1 pb-4 border-b border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Running activities</span>
                  <span className="text-[10px] text-gray-400 font-medium">10 min ago</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <img alt="User" className="w-11 h-11 rounded-full shrink-0 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ9AI-pQb9fE-3Zia1iE2-q8D8TM9pjHNDtoyaNZ6f0BfMEpSWJKoFTfN6CpWctR5U5LcJUvqhtx1pM6yqyb80qfte-Za2e03G6vDEARukZuap5L0PU4YRGey13OjOuf3qyhld--7K1v2KQkAuGBxfv9XcA8000WQF5Uat1RF7jxW0DfozpKbY3qp38amAvPrwj_sJvv7OiltXVPvs9-6b8ivIESNcpw1gN9VkcZIXNbPU82Q7vpA6D2SbD4zmRuu9rHuA4Z5kOqo" />
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <span className="text-sm font-bold text-gray-900">MinhDev</span>
                  <p className="text-[10px] text-gray-400 font-medium">1 min ago</p>
                </div>
                <span className="material-symbols-outlined text-gray-300">more_horiz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
