import React, { useState, useEffect } from 'react';
import { 
  PlaneTakeoff, 
  Accessibility, 
  Luggage, 
  RefreshCcw, 
  Coffee, 
  Volume2, 
  ChevronLeft, 
  ChevronRight,
  RotateCw,
  List,
  CreditCard
} from 'lucide-react';

// 机场常用语数据字典
const airportData = [
  {
    id: 'special-needs',
    title: '老人与轮椅帮助 (Special Needs)',
    icon: <Accessibility size={20} />,
    cards: [
      { zh: "你好，我不会说英语，请问有会说中文的工作人员吗？", en: "Hello, I don't speak English. Is there any staff member who speaks Chinese?" },
      { zh: "我年纪大了，腿脚不便，需要轮椅服务。", en: "I am elderly and have mobility issues. I need wheelchair service." },
      { zh: "我已经预订了轮椅，请问在哪里等？", en: "I have booked a wheelchair. Where should I wait for it?" },
      { zh: "请帮我推轮椅，非常感谢。", en: "Please help push my wheelchair. Thank you very much." }
    ]
  },
  {
    id: 'ywg-departure',
    title: '第一段：温尼伯出发 (YWG Departure)',
    icon: <PlaneTakeoff size={20} />,
    cards: [
      { zh: "你好，我要乘坐AC299航班飞往温哥华，请帮我办理值机。", en: "Hello, I am taking flight AC299 to Vancouver. Please help me check in." },
      { zh: "这是我的护照和行程单。", en: "Here is my passport and itinerary." },
      { zh: "请安排轮椅把我送到AC299的登机口。", en: "Please arrange a wheelchair to take me to the gate for flight AC299." },
      { zh: "请问登机口在几号？", en: "What is the gate number?" }
    ]
  },
  {
    id: 'yvr-arrival',
    title: '第二段：温哥华到达与行李 (YVR Arrival)',
    icon: <Luggage size={20} />,
    cards: [
      { zh: "我已经到了温哥华，请推我去提取行李的地方。", en: "I have arrived in Vancouver. Please push me to the baggage claim area." },
      { zh: "我年纪大了拿不动行李，能帮我把行李从转盘上拿下来吗？", en: "I am elderly and cannot lift heavy things. Could you please help me take my luggage off the carousel?" },
      { zh: "我的行李还没出来，能帮我看看吗？", en: "My luggage hasn't come out yet. Could you help me check?" },
      { zh: "我需要在机场内休息，等待加航去北京的飞机，我在哪里等？", en: "I need to rest inside the airport and wait for my Air Canada flight to Beijing. Where can I wait?" }
    ]
  },
  {
    id: 'yvr-transit',
    title: '第三段：温哥华转机回国 (YVR to Beijing)',
    icon: <RefreshCcw size={20} />,
    cards: [
      { zh: "你好，我要办理AC29航班飞往北京的值机和托运。", en: "Hello, I need to check in and drop off my baggage for flight AC29 to Beijing." },
      { zh: "请问轮椅服务在哪里？我需要轮椅推我去AC29的登机口。", en: "Where is the wheelchair service? I need a wheelchair to take me to the gate for flight AC29." },
      { zh: "请问AC29航班在几号登机口？", en: "Which gate is flight AC29 boarding at?" },
      { zh: "距离登机还有很久，请问附近有可以坐下休息的地方吗？", en: "There is a long time before boarding. Is there a place nearby where I can sit and rest?" },
      { zh: "什么时候开始登机？", en: "What time does boarding start?" }
    ]
  },
  {
    id: 'in-flight',
    title: '机上求助 (In-flight Help)',
    icon: <Coffee size={20} />,
    cards: [
      { zh: "能给我一杯温水吗？", en: "Could I have a cup of warm water, please?" },
      { zh: "我觉得有点冷，能给我一条毛毯吗？", en: "I feel a bit cold. Could I have a blanket, please?" },
      { zh: "请问洗手间在哪里？", en: "Excuse me, where is the lavatory?" },
      { zh: "请帮我把随身行李放上去/拿下来。", en: "Could you help me put my bag up / take my bag down?" },
      { zh: "我不舒服，需要帮助。", en: "I don't feel well and need help." }
    ]
  }
];

export default function AirportFlashcards() {
  const [viewMode, setViewMode] = useState('list'); // 'flashcard' 或 'list'
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentCategory = airportData[currentCategoryIndex];
  const currentCard = currentCategory.cards[currentCardIndex];

  // 切换分类时重置卡片状态
  const handleCategoryChange = (index) => {
    setCurrentCategoryIndex(index);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handlePrevCategory = () => {
    if (currentCategoryIndex > 0) {
      handleCategoryChange(currentCategoryIndex - 1);
    }
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < airportData.length - 1) {
      handleCategoryChange(currentCategoryIndex + 1);
    }
  };

  // 切换上一张/下一张
  const handleNext = () => {
    if (currentCardIndex < currentCategory.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 150); // 稍微延迟以等待翻转动画
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(prev => prev - 1), 150);
    }
  };

  // 翻转卡片
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // 朗读英文
  const speakText = (text, e) => {
    if (e) e.stopPropagation(); // 阻止触发卡片翻转
    
    if ('speechSynthesis' in window) {
      // 停止当前正在播放的语音
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // 稍微放慢语速，方便听清
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("抱歉，您的浏览器不支持语音朗读功能。");
    }
  };

  // 键盘左右键控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode !== 'flashcard') return; // 只有在闪卡模式下才响应键盘翻页
      if (e.key === 'ArrowRight' && currentCardIndex < currentCategory.cards.length - 1) {
        setIsFlipped(false);
        setTimeout(() => setCurrentCardIndex((prev) => prev + 1), 150);
      }
      if (e.key === 'ArrowLeft' && currentCardIndex > 0) {
        setIsFlipped(false);
        setTimeout(() => setCurrentCardIndex((prev) => prev - 1), 150);
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCardIndex, currentCategoryIndex, currentCategory.cards.length, viewMode]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-200">
      
      {/* 顶部标题栏 */}
      <header className="bg-blue-600 text-white p-6 shadow-md z-10 sticky top-0">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PlaneTakeoff size={28} className="text-blue-200" />
            <h1 className="text-2xl font-bold tracking-wide">机场英语通</h1>
          </div>
          
          {/* 视图切换按钮 */}
          <div className="flex w-full sm:w-auto items-center bg-blue-700/50 p-1 rounded-lg self-start sm:self-auto">
            <button 
              onClick={() => setViewMode('flashcard')}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${viewMode === 'flashcard' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'}`}
            >
              <CreditCard size={18} />
              闪卡模式
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'}`}
            >
              <List size={18} />
              全部列表
            </button>
          </div>
        </div>
      </header>

      {viewMode === 'flashcard' ? (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
          
          {/* 左侧：分类导航 (桌面端) / 顶部导航 (移动端) */}
          <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">场景分类 Categories</h2>
            <div className="md:hidden flex items-center justify-between gap-3 mb-2 px-2">
              <button
                onClick={handlePrevCategory}
                disabled={currentCategoryIndex === 0}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> 上一场景
              </button>
              <span className="text-xs text-slate-500">左右滑动或点按钮切换</span>
              <button
                onClick={handleNextCategory}
                disabled={currentCategoryIndex === airportData.length - 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                下一场景 <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex md:flex-col overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
              {airportData.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(index)}
                  className={`flex items-center gap-3 px-4 py-4 md:py-3 min-h-[56px] rounded-xl whitespace-nowrap md:whitespace-normal transition-all duration-200 text-left ${
                    currentCategoryIndex === index 
                      ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200 font-medium' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <span className={`${currentCategoryIndex === index ? 'text-blue-600' : 'text-slate-400'}`}>
                    {category.icon}
                  </span>
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧：闪卡区域 */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            
            <div className="w-full flex justify-between items-center mb-6 px-2 text-slate-500 font-medium">
              <span className="bg-slate-200 px-3 py-1 rounded-full text-xs uppercase tracking-widest">
                {currentCategory.id}
              </span>
              <span>{currentCardIndex + 1} / {currentCategory.cards.length}</span>
            </div>

            {/* 3D 翻转卡片容器 */}
            <div 
              className="relative w-full max-w-lg aspect-[4/3] md:aspect-[3/2] cursor-pointer group perspective"
              onClick={toggleFlip}
              style={{ perspective: '1000px' }}
            >
              <div 
                className={`w-full h-full relative transition-transform duration-500 preserve-3d shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                
                {/* 正面：中文 */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center p-8 text-center backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-slate-400 mb-6 font-medium tracking-widest text-sm">CHINESE</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                    {currentCard.zh}
                  </h3>
                  <div className="absolute bottom-6 flex items-center gap-2 text-slate-400 text-sm">
                    <RotateCw size={16} /> 点击翻转看英文
                  </div>
                </div>

                {/* 背面：英文 */}
                <div 
                  className="absolute inset-0 w-full h-full bg-blue-50 rounded-2xl border-2 border-blue-100 flex flex-col items-center justify-center p-8 text-center backface-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="text-blue-400 mb-6 font-medium tracking-widest text-sm">ENGLISH</div>
                  <h3 className="text-2xl md:text-4xl font-bold text-blue-900 leading-tight mb-8">
                    {currentCard.en}
                  </h3>
                  
                  {/* 朗读按钮 */}
                  <button 
                    onClick={(e) => speakText(currentCard.en, e)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                      isSpeaking 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <Volume2 size={20} className={isSpeaking ? 'animate-pulse' : ''} />
                    {isSpeaking ? '朗读中...' : '点击发音'}
                  </button>
                </div>

              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center gap-6 mt-10">
              <button 
                onClick={handlePrev}
                disabled={currentCardIndex === 0}
                className="p-4 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={28} />
              </button>
              
              <div className="text-slate-400 text-sm font-medium">
                支持键盘 <kbd className="bg-slate-100 px-2 py-1 rounded border border-slate-200 mx-1">←</kbd> <kbd className="bg-slate-100 px-2 py-1 rounded border border-slate-200 mx-1">→</kbd> 翻页
              </div>

              <button 
                onClick={handleNext}
                disabled={currentCardIndex === currentCategory.cards.length - 1}
                className="p-4 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={28} />
              </button>
            </div>

          </div>
        </main>
      ) : (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
          <div className="space-y-10">
            {airportData.map((category) => (
              <section key={category.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <span className="text-blue-600 bg-blue-50 p-2 rounded-lg">{category.icon}</span>
                  {category.title}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.cards.map((card, idx) => (
                    <div key={idx} className="group bg-slate-50 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors flex flex-col justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-800 text-lg mb-2">{card.zh}</p>
                        <p className="text-blue-800 font-medium">{card.en}</p>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={(e) => speakText(card.en, e)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-medium transition-colors"
                        >
                          <Volume2 size={18} />
                          朗读
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}