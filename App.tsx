import React, { useState } from 'react';
import { Search, MapPin, Sparkles, BookOpen, Library, Clapperboard, BrainCircuit, Heart, Telescope, ArrowRight, History } from 'lucide-react';
import { fetchGuideContent, generateSpotImage } from './services/geminiService';
import { AppState, GuideContent } from './types';

const App: React.FC = () => {
  const [spotName, setSpotName] = useState('');
  const [state, setState] = useState<AppState>({
    isLoading: false,
    guide: null,
    error: null,
    imageUrl: null,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotName.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, guide: null, imageUrl: null }));

    try {
      const [guide, image] = await Promise.all([
        fetchGuideContent(spotName),
        generateSpotImage(spotName)
      ]);
      setState({ isLoading: false, guide, imageUrl: image, error: null });
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, isLoading: false, error: '矮油，知识星球信号弱，请再试一次！' }));
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-yellow-200">
      {/* Header - Bubbly Style */}
      <header className="bg-yellow-400 p-8 rounded-b-[60px] shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-6 left-10"><Sparkles className="text-white w-8 h-8" /></div>
          <div className="absolute bottom-6 right-10"><Heart className="text-white w-8 h-8 fill-white" /></div>
        </div>
        <h1 className="text-4xl font-cute text-white drop-shadow-sm flex items-center justify-center gap-3">
          人文行者
        </h1>
        <p className="text-yellow-900 mt-2 font-cute tracking-widest opacity-80">
          万物皆书卷 · 行路即读史
        </p>
      </header>

      {/* Search Section - Capsule Style */}
      <div className="max-w-xl mx-auto px-4 -mt-8 relative z-10">
        <form onSubmit={handleSearch} className="relative group shadow-2xl rounded-full">
          <input
            type="text"
            value={spotName}
            onChange={(e) => setSpotName(e.target.value)}
            placeholder="今天去哪个古迹探险？"
            className="w-full h-16 pl-14 pr-4 rounded-full border-4 border-white focus:border-yellow-300 outline-none transition-all text-xl font-cute shadow-inner"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-500 w-6 h-6" />
          <button
            type="submit"
            disabled={state.isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-400 text-white h-12 px-8 rounded-full hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 font-cute text-lg shadow-md"
          >
            {state.isLoading ? '穿越中...' : '出发'}
          </button>
        </form>
      </div>

      <main className="max-w-2xl mx-auto px-4 mt-12">
        {state.isLoading && (
          <div className="flex flex-col items-center justify-center py-24 animate-bounce">
            <div className="w-20 h-20 bg-yellow-400 rounded-[30%] flex items-center justify-center mb-6 shadow-xl rotate-12">
              <Telescope className="text-white w-10 h-10" />
            </div>
            <p className="text-yellow-800 font-cute text-2xl">正在整理历史文献...</p>
          </div>
        )}

        {state.error && (
          <div className="bg-white p-10 rounded-[40px] border-4 border-dashed border-red-200 text-center text-red-500 shadow-xl">
            <p className="text-xl font-cute">{state.error}</p>
          </div>
        )}

        {!state.isLoading && !state.guide && !state.error && (
          <div className="text-center py-20 opacity-50 space-y-4">
            <div className="bg-white w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-inner border-4 border-dashed border-gray-200">
               <BookOpen size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-cute text-xl">输入景点名称，开启深度探索</p>
          </div>
        )}

        {state.guide && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Hero Card */}
            <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl border-8 border-white group">
              {state.imageUrl && (
                <div className="relative">
                  <img src={state.imageUrl} alt={state.guide.name} className="w-full h-80 object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 text-white">
                    <MapPin size={18} className="fill-orange-400 text-orange-400" />
                    <span className="font-cute text-lg">{state.guide.name}</span>
                  </div>
                </div>
              )}
              <div className="p-8 bg-gradient-to-br from-white to-orange-50">
                <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-4">
                  核心人文定位
                </div>
                <h2 className="text-2xl font-cute text-gray-800 leading-relaxed mb-2">
                  “{state.guide.card}”
                </h2>
              </div>
            </div>

            {/* History Section - Blue Theme */}
            <Section 
              icon={<HistoryIcon />} 
              title="史海钩沉" 
              bgColor="bg-blue-50" 
              borderColor="border-blue-100"
              textColor="text-blue-900"
              tag="历史脉络"
            >
              <div className="space-y-4">
                {state.guide.origin.map((s, i) => (
                  <div key={i} className="flex gap-3 items-start bg-white/60 p-3 rounded-2xl border border-blue-100 shadow-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs font-bold mt-1">
                      {i+1}
                    </span>
                    <p className="text-lg leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Aesthetic Section - Green Theme */}
            <Section 
              icon={<Library className="text-green-500" />} 
              title="美学与文学" 
              bgColor="bg-green-50" 
              borderColor="border-green-100"
              textColor="text-green-900"
              tag="艺术鉴赏"
            >
              <div className="space-y-4">
                {state.guide.gossip.map((s, i) => (
                  <div key={i} className="relative pl-8 py-2">
                    <div className="absolute left-0 top-3 w-4 h-4 bg-green-400 rounded-sm rotate-45"></div>
                    <p className="text-lg font-medium leading-relaxed italic border-l-2 border-green-200 pl-4">
                      {s}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Media Section - Purple Theme */}
            <Section 
              icon={<Clapperboard className="text-purple-500" />} 
              title="当代回响" 
              bgColor="bg-purple-50" 
              borderColor="border-purple-100"
              textColor="text-purple-900"
              tag="文化符号"
            >
              <div className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-sm flex items-start gap-4">
                <div className="text-3xl">📡</div>
                <p className="text-lg leading-relaxed">{state.guide.media}</p>
              </div>
            </Section>

            {/* Critical Inquiry - Pink/Orange Theme */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-4">
                  <BrainCircuit className="text-pink-500" />
                  <h3 className="text-2xl font-cute text-gray-800">思辨时刻</h3>
               </div>
               <div className="grid grid-cols-1 gap-4">
                 {state.guide.interaction.map((q, i) => (
                   <div key={i} className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-[40px] border-4 border-white shadow-xl hover:scale-[1.02] transition-transform">
                     <div className="flex gap-4">
                        <div className="bg-white w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center text-2xl flex-shrink-0">
                          {i === 0 ? '🤔' : '🌍'}
                        </div>
                        <div>
                          <p className="text-xl font-cute text-pink-900 leading-snug">{q}</p>
                          <div className="mt-3 flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-widest">
                            Deep Inquiry <ArrowRight size={12} />
                          </div>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </main>

      <div className="h-20"></div>

      {/* Simplified Cute Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 z-50"></footer>
    </div>
  );
};

// HistoryIcon correctly uses the imported 'History' component from lucide-react.
const HistoryIcon = () => (
  <div className="relative">
    <History className="text-blue-500" />
    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
  </div>
);

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  tag: string;
  children: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const Section: React.FC<SectionProps> = ({ icon, title, tag, children, bgColor, borderColor, textColor }) => {
  return (
    <section className={`${bgColor} rounded-[48px] p-8 border-4 border-white shadow-xl relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 bg-white/30 px-4 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest opacity-50">
        {tag}
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:rotate-12 transition-transform">
          {icon}
        </div>
        <h3 className={`text-2xl font-cute ${textColor}`}>{title}</h3>
      </div>
      <div className={textColor}>
        {children}
      </div>
    </section>
  );
};

export default App;
