
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  FlaskConical, 
  Activity, 
  FileText, 
  DollarSign, 
  Clock, 
  Zap, 
  MessageSquare, 
  ChevronRight, 
  BrainCircuit,
  TrendingUp,
  RefreshCcw,
  Target
} from 'lucide-react';
import { PipelineMetrics, AnalysisResult, AIScenario } from './types';
import { TRADITIONAL_BENCHMARKS, AI_STRATEGIC_SCENARIO } from './constants';
import { analyzePipelineStrategy, chatWithStrategist } from './services/geminiService';
import MetricCard from './components/MetricCard';
import PipelineVisualizer from './components/PipelineVisualizer';
import TaskList from './components/TaskList';

// Gemini SDK compatible message format
interface ChatMessage {
    role: 'user' | 'model';
    parts: [{ text: string }];
}

const App: React.FC = () => {
  const [aiBoost, setAiBoost] = useState(25); // Percentage for manual mode
  const [selectedScenario, setSelectedScenario] = useState<'manual' | 'strategic'>('manual');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const calculateEnhanced = useCallback((): PipelineMetrics => {
    if (selectedScenario === 'strategic') {
      const s = AI_STRATEGIC_SCENARIO;
      return {
        discoveryYears: TRADITIONAL_BENCHMARKS.discoveryYears * (1 - s.discoveryBoost / 100),
        preClinicalYears: TRADITIONAL_BENCHMARKS.preClinicalYears * (1 - s.discoveryBoost / 100),
        clinicalPhase1Years: TRADITIONAL_BENCHMARKS.clinicalPhase1Years * (1 - s.clinicalBoost / 100),
        clinicalPhase2Years: TRADITIONAL_BENCHMARKS.clinicalPhase2Years * (1 - s.clinicalBoost / 100),
        clinicalPhase3Years: TRADITIONAL_BENCHMARKS.clinicalPhase3Years * (1 - s.clinicalBoost / 100),
        regulatoryYears: TRADITIONAL_BENCHMARKS.regulatoryYears * (1 - s.regulatoryBoost / 100),
        costPerDrug: TRADITIONAL_BENCHMARKS.costPerDrug * (1 - s.costReduction / 100),
        successRate: TRADITIONAL_BENCHMARKS.successRate * 1.5, // 50% relative increase in success
      };
    }

    // Manual slider logic
    const factor = (100 - aiBoost) / 100;
    return {
      discoveryYears: TRADITIONAL_BENCHMARKS.discoveryYears * factor,
      preClinicalYears: TRADITIONAL_BENCHMARKS.preClinicalYears * factor,
      clinicalPhase1Years: TRADITIONAL_BENCHMARKS.clinicalPhase1Years * factor,
      clinicalPhase2Years: TRADITIONAL_BENCHMARKS.clinicalPhase2Years * factor,
      clinicalPhase3Years: TRADITIONAL_BENCHMARKS.clinicalPhase3Years * factor,
      regulatoryYears: TRADITIONAL_BENCHMARKS.regulatoryYears * factor,
      costPerDrug: TRADITIONAL_BENCHMARKS.costPerDrug * factor,
      successRate: TRADITIONAL_BENCHMARKS.successRate + (aiBoost / 5), // Hypothetical uplift
    };
  }, [aiBoost, selectedScenario]);

  const enhancedMetrics = calculateEnhanced();

  const handleRunAnalysis = async () => {
    setLoading(true);
    const query = selectedScenario === 'strategic' 
      ? `Analyze the impact of the Bain Strategic Transformation scenario which targets 30% discovery boost and 40% regulatory improvement.`
      : `How can we achieve a ${aiBoost}% reduction in R&D bottlenecks using AI-first principles?`;
      
    try {
      const result = await analyzePipelineStrategy(query);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("AI analysis failed. Please check your API key configuration.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToAI = async (messageText: string) => {
    if (!messageText.trim()) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', parts: [{ text: messageText }] }];
    setChatHistory(newHistory);
    setChatMessage('');
    
    try {
      const aiResponse = await chatWithStrategist(messageText, chatHistory);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: aiResponse || "No response received." }] }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "I'm having trouble connecting to the strategy core right now." }] }]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageToAI(chatMessage);
  };

  const handleReRunMessage = async (msg: ChatMessage) => {
    const text = msg.parts[0].text;
    if (msg.role === 'user') {
      await sendMessageToAI(text);
    } else {
      await sendMessageToAI(`Can you elaborate more on this: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Controls */}
      <aside className={`w-full md:w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 transition-all ${isSidebarOpen ? '' : 'hidden'}`}>
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <BrainCircuit size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Djimit</h1>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Optimization Mode</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setSelectedScenario('manual')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${selectedScenario === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Manual
                </button>
                <button 
                  onClick={() => setSelectedScenario('strategic')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${selectedScenario === 'strategic' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Strategic
                </button>
              </div>
            </div>

            {selectedScenario === 'manual' ? (
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-4">
                  AI Adoption Intensity: <span className="text-blue-600">{aiBoost}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={aiBoost} 
                  onChange={(e) => setAiBoost(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
                  <span>Incremental</span>
                  <span>Transformational</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-900 rounded-xl text-white border border-slate-800 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-3 text-blue-400">
                  <Target size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">{AI_STRATEGIC_SCENARIO.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Discovery Boost</span>
                    <span className="text-emerald-400">+{AI_STRATEGIC_SCENARIO.discoveryBoost}%</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Clinical Accel</span>
                    <span className="text-emerald-400">+{AI_STRATEGIC_SCENARIO.clinicalBoost}%</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Regulatory Improv</span>
                    <span className="text-emerald-400">+{AI_STRATEGIC_SCENARIO.regulatoryBoost}%</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Cost Reduction</span>
                    <span className="text-emerald-400">{AI_STRATEGIC_SCENARIO.costReduction}%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-800 font-medium leading-relaxed">
                "Breaking the bottleneck requires moving beyond experimentation to scaling GenAI across the enterprise."
                <span className="block mt-2 font-bold text-blue-900 text-[10px] uppercase">— Djimit Insight</span>
              </p>
            </div>

            <button 
              onClick={handleRunAnalysis}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Zap size={18} />
                  Run Scenario Analysis
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-auto">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Benchmarks Source</div>
            <div className="flex flex-col gap-2">
                <div className="text-xs text-slate-500 flex justify-between">
                    <span>Avg. Cost/Drug</span>
                    <span className="font-mono">$2.3B</span>
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                    <span>Avg. Success Rate</span>
                    <span className="font-mono">10%</span>
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                    <span>Cycle Time</span>
                    <span className="font-mono">15 Yrs</span>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">R&D Innovation Dashboard</h2>
            <p className="text-slate-500 mt-1">
              Accelerating the path from molecule to market with Djimit AI 
              <span className="text-blue-600 font-semibold ml-2">— {selectedScenario === 'strategic' ? 'Strategic Mode' : 'Manual Mode'}</span>
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold flex items-center gap-2">
              <TrendingUp size={16} />
              Live Insights Active
            </div>
          </div>
        </header>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            label="Est. Cost per Drug" 
            value={`$${(enhancedMetrics.costPerDrug / 1000).toFixed(2)}B`} 
            change={`${(TRADITIONAL_BENCHMARKS.costPerDrug - enhancedMetrics.costPerDrug).toFixed(0)}M`}
            isNegative={true}
            icon={<DollarSign size={24} />}
          />
          <MetricCard 
            label="Total Cycle Time" 
            value={`${(Object.values(enhancedMetrics).slice(0, 6) as number[]).reduce((a, b) => a + b, 0).toFixed(1)} Yrs`} 
            change={`${((Object.values(TRADITIONAL_BENCHMARKS).slice(0, 6) as number[]).reduce((a, b) => a + b, 0) - (Object.values(enhancedMetrics).slice(0, 6) as number[]).reduce((a, b) => a + b, 0)).toFixed(1)} Yrs`}
            isNegative={true}
            icon={<Clock size={24} />}
          />
          <MetricCard 
            label="Success Rate" 
            value={`${enhancedMetrics.successRate.toFixed(1)}%`} 
            change={`${(enhancedMetrics.successRate - TRADITIONAL_BENCHMARKS.successRate).toFixed(1)}%`}
            isNegative={false}
            icon={<Activity size={24} />}
          />
          <MetricCard 
            label="Pipeline Efficiency" 
            value={`${selectedScenario === 'strategic' ? '135%' : (100 + aiBoost).toFixed(0) + '%'}`} 
            change={selectedScenario === 'strategic' ? '+35%' : `+${aiBoost}%`}
            isNegative={false}
            icon={<Zap size={24} />}
          />
        </div>

        {/* Charts and Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PipelineVisualizer traditional={TRADITIONAL_BENCHMARKS} enhanced={enhancedMetrics} />
            
            {/* Gemini Strategy Output */}
            {analysis ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-6 text-blue-600">
                  <BrainCircuit size={28} />
                  <h3 className="text-xl font-bold">Deep Strategy Analysis</h3>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Executive Summary</h4>
                    <p className="text-slate-600 leading-relaxed">{analysis.executiveSummary}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Critical Bottlenecks</h4>
                      <ul className="space-y-3">
                        {analysis.bottleneckAnalysis.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-slate-700 text-sm">
                            <span className="text-rose-500 shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Strategic Interventions</h4>
                      <TaskList tasks={analysis.strategicRecommendations} />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-wrap gap-8 items-center justify-around">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Reduction</p>
                      <p className="text-xl font-bold text-slate-900">{analysis.impactProjection.timeSaved}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cost Savings</p>
                      <p className="text-xl font-bold text-slate-900">{analysis.impactProjection.costSaved}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">NPV Improvement</p>
                      <p className="text-xl font-bold text-emerald-600">{analysis.impactProjection.npvIncrease}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
                <BrainCircuit size={48} className="text-slate-300 mb-4" />
                <h4 className="text-lg font-semibold text-slate-400">Run Scenario Analysis to view deep insights</h4>
                <p className="text-sm text-slate-400 mt-2 max-w-xs text-center">
                  AI will evaluate the {selectedScenario === 'strategic' ? 'Strategic Transformation' : aiBoost + '% adoption'} model against industry benchmarks.
                </p>
              </div>
            )}
          </div>

          {/* Chat / Assistant Sidebar (Internal) */}
          <div className="bg-slate-900 rounded-2xl shadow-2xl flex flex-col h-[600px] lg:h-auto overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Djimit Strategy Partner</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-slate-400 font-medium">Context Active</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center py-8">
                  <BrainCircuit size={32} className="text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm px-4">Ask Djimit about discovery, clinical trials, or regulatory automation.</p>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    onClick={() => handleReRunMessage(msg)}
                    className={`group relative max-w-[85%] p-3 rounded-2xl text-sm cursor-pointer transition-all hover:ring-2 hover:ring-blue-400/50 active:scale-95 ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.parts[0].text}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-slate-700">
                        {msg.role === 'user' ? 'Click to re-run query' : 'Click to expand point'}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-slate-800/50 border-t border-slate-800">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Inquire strategy..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 text-center">
                History-aware • Click messages to re-run
              </p>
            </form>
          </div>
        </div>

        {/* Action Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-lg flex items-center justify-center mb-4 transition-colors">
                    <FlaskConical size={20} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Discovery Boost</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Leverage protein folding and molecule modeling to reduce pre-clinical lead times.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-lg flex items-center justify-center mb-4 transition-colors">
                    <FileText size={20} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Clinical Protocol Auto-Gen</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Optimize trial designs using LLMs to analyze historical trial failure data.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-lg flex items-center justify-center mb-4 transition-colors">
                    <BrainCircuit size={20} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Regulatory Auto-Drafting</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Automate Clinical Study Reports (CSR) to save months in regulatory filings.</p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
