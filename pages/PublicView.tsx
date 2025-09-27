
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { OPTData, FilterState } from '../types';
import { loadData } from '../services/dataService';
import { getPublicAiAnalysis } from '../services/geminiService';
import { ChatBubbleIcon, DownloadIcon, SendIcon } from '../components/Icons';
import Modal from '../components/Modal';
import { useDebounce } from '../hooks/useDebounce';
import HighlightText from '../components/HighlightText';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { GoogleGenAI, Chat } from '@google/genai';


type EnrichedOPTData = OPTData & { luasSeranganTotal: number; luasPengendalianTotal: number };

interface PublicAnalysisResult {
    summary: string;
    barChartData: { name: string; "Luas Serangan": number }[];
    lineChartData: { name: string; "Luas Serangan": number }[];
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const OPT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#F97316'];


const PublicView: React.FC = () => {
  const [data, setData] = useState<OPTData[]>(() => {
    const allData = loadData();
    return allData.filter(item => item.status === 'Approved');
  });
  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = localStorage.getItem('publicView_filters');
    const allData = loadData();
    const latestYear = Math.max(...allData.map(d => d.tahun), new Date().getFullYear());
    
    if (saved) {
        const parsed = JSON.parse(saved);
        if (allData.some(d => d.tahun.toString() === parsed.tahun)) {
            return parsed;
        }
    }
    
    return {
      tahun: latestYear.toString(),
      periode: 'Semua',
      jenisOpt: 'Semua',
    };
  });
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('publicView_searchTerm') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isDebouncing = searchTerm !== debouncedSearchTerm;
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  
  const [analysis, setAnalysis] = useState<PublicAnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  // AI Chatbox State
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const tableSectionRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Initialize AI Chat Session
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const session = ai.chats.create({
        model: "gemini-2.5-flash",
    });
    setChatSession(session);
    
    const dataContext = JSON.stringify(data.map(d => ({
        jenisOpt: d.jenisOpt,
        kabKota: d.kabKota,
        tahun: d.tahun,
        periode: d.periode,
        luasSerangan: d.luasSeranganRingan + d.luasSeranganSedang + d.luasSeranganBerat + d.luasSeranganPuso,
    })), null, 2);
    
    session.sendMessage({ message: `You are an expert data analyst for agricultural pest data in Ciamis Regency, Indonesia. Your role is to answer questions based ONLY on the following dataset. Be helpful and answer in Indonesian. Here is the data context:\n\n${dataContext}` });
    
    setChatHistory([{ role: 'model', text: 'Halo! Saya asisten AI Anda. Silakan ajukan pertanyaan mengenai data serangan OPT yang ditampilkan.' }]);
  }, [data]);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('publicView_filters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('publicView_searchTerm', searchTerm);
  }, [searchTerm]);

  const tahunOptions = useMemo(() => ['Semua', ...Array.from(new Set(data.map(item => item.tahun.toString()))).sort((a,b) => b.localeCompare(a))], [data]);
    
  const periodeOptions = useMemo(() => {
      if (filters.tahun === 'Semua') return ['Semua'];
      const filtered = data.filter(item => item.tahun.toString() === filters.tahun);
      return ['Semua', ...Array.from(new Set(filtered.map(item => item.periode)))];
  }, [data, filters.tahun]);

  const jenisOptOptions = useMemo(() => {
      let filtered = data;
      if (filters.tahun !== 'Semua') {
          filtered = filtered.filter(item => item.tahun.toString() === filters.tahun);
      }
      if (filters.periode !== 'Semua') {
          filtered = filtered.filter(item => item.periode === filters.periode);
      }
      return ['Semua', ...Array.from(new Set(filtered.map(item => item.jenisOpt)))];
  }, [data, filters.tahun, filters.periode]);

  useEffect(() => { setFilters(f => ({ ...f, periode: 'Semua', jenisOpt: 'Semua' })); }, [filters.tahun]);
  useEffect(() => { setFilters(f => ({ ...f, jenisOpt: 'Semua' })); }, [filters.periode]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };


  const filteredData = useMemo(() => {
    const searchTermLower = debouncedSearchTerm.toLowerCase();
    
    let result = data.filter(item => {
      const { tahun, periode, jenisOpt } = filters;
      return (
        (tahun === 'Semua' || item.tahun.toString() === tahun) &&
        (periode === 'Semua' || item.periode === periode) &&
        (jenisOpt === 'Semua' || item.jenisOpt === jenisOpt)
      );
    });

    if (searchTermLower) {
      result = result.filter(item => 
        Object.values(item).some(value => 
          value.toString().toLowerCase().includes(searchTermLower)
        )
      );
    }
    
    return result;
  }, [data, filters, debouncedSearchTerm]);

  const enrichedFilteredData = useMemo((): EnrichedOPTData[] => {
    return filteredData.map(item => ({
        ...item,
        luasSeranganTotal: item.luasSeranganRingan + item.luasSeranganSedang + item.luasSeranganBerat + item.luasSeranganPuso,
        luasPengendalianTotal: item.pengendalianPM + item.pengendalianKimia + item.pengendalianNabati + item.pengendalianAH + item.pengendalianCL,
    }));
  }, [filteredData]);

  const chartSummaryData = useMemo(() => {
    const aggregation = filteredData.reduce((acc, item) => {
        const key = item.jenisOpt;
        if (!acc[key]) {
            acc[key] = { name: key, 'Luas Serangan': 0, 'Luas Pengendalian': 0 };
        }
        
        const luasSeranganTotal = item.luasSeranganRingan + item.luasSeranganSedang + item.luasSeranganBerat + item.luasSeranganPuso;
        const luasPengendalianTotal = item.pengendalianPM + item.pengendalianKimia + item.pengendalianNabati + item.pengendalianAH + item.pengendalianCL;

        acc[key]['Luas Serangan'] += luasSeranganTotal;
        acc[key]['Luas Pengendalian'] += luasPengendalianTotal;
        
        return acc;
    }, {} as { [key: string]: { name: string; 'Luas Serangan': number; 'Luas Pengendalian': number } });

    return Object.values(aggregation);
  }, [filteredData]);
  
  const { optTrendData, uniqueOpts } = useMemo(() => {
    const periodData = new Map<string, any>();
    const uniqueOptsSet = new Set<string>();

    const monthOrder = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus"];
    const partOrder = ["(1-15)", "(16-31)", "(16-28)", "(16-30)"];

    const getPeriodSortKey = (periode: string): number => {
        for(let i=0; i < monthOrder.length; i++) {
            if (periode.startsWith(monthOrder[i])) {
                let partValue = 0;
                for (let j=0; j < partOrder.length; j++) {
                    if(periode.endsWith(partOrder[j])) {
                        partValue = j + 1;
                        break;
                    }
                }
                return i * 10 + partValue;
            }
        }
        return 999;
    };
    
    const sortedFilteredData = [...filteredData].sort((a,b) => {
        if (a.tahun !== b.tahun) return a.tahun - b.tahun;
        return getPeriodSortKey(a.periode) - getPeriodSortKey(b.periode);
    });

    sortedFilteredData.forEach(item => {
      const periodName = `${item.tahun}-${item.periode}`;
      uniqueOptsSet.add(item.jenisOpt);
      const entry = periodData.get(periodName) || { name: periodName };
      
      const luasSerangan = item.luasSeranganRingan + item.luasSeranganSedang + item.luasSeranganBerat + item.luasSeranganPuso;
      entry[item.jenisOpt] = (entry[item.jenisOpt] || 0) + luasSerangan;

      periodData.set(periodName, entry);
    });
    
    const uniqueOpts = Array.from(uniqueOptsSet);
    const optTrendData = Array.from(periodData.values());

    return { optTrendData, uniqueOpts };

  }, [filteredData]);

  const handleDownload = () => {
    console.log("Downloading data for...", { name: 'Public User', instansi: 'Public', keperluan: 'Research'});
    alert("Fungsi download excel akan diimplementasikan di sini.");
    setDownloadModalOpen(false);
  };
  
  const handleGenerateAnalysis = async () => {
    if (filteredData.length === 0) {
        alert("Tidak ada data untuk dianalisis. Silakan ubah filter Anda.");
        return;
    }
    setAnalysisLoading(true);
    setAnalysisError('');
    setAnalysis(null);
    try {
      const result = await getPublicAiAnalysis(filteredData);
      setAnalysis(result);
    } catch (err: any) {
      setAnalysisError(err.message || 'An unknown error occurred.');
    } finally {
      setAnalysisLoading(false);
    }
  };
  
  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatSession || chatLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
        const response = await chatSession.sendMessage({ message: userMessage.text });
        const modelMessage: ChatMessage = { role: 'model', text: response.text };
        setChatHistory(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Chat Error:", error);
        const errorMessage: ChatMessage = { role: 'model', text: 'Maaf, terjadi kesalahan saat memproses permintaan Anda.' };
        setChatHistory(prev => [...prev, errorMessage]);
    } finally {
        setChatLoading(false);
    }
  };
  
  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const payload = data.activePayload[0].payload;
      const opt = payload.name;
      if (opt) {
        setFilters(prev => ({ ...prev, jenisOpt: opt }));
        tableSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const showLoader = isDebouncing;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
            {/* AI Analysis Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Analisis AI Cepat</h2>
                <p className="text-gray-500 mb-6">Dapatkan wawasan dari data yang ditampilkan di bawah dengan satu klik.</p>
                 <button
                    onClick={handleGenerateAnalysis}
                    disabled={analysisLoading}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {analysisLoading ? 'Menganalisis...' : 'Hasilkan Analisis AI untuk Data Terfilter'}
                </button>
                {analysisError && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{analysisError}</div>}
                 {analysisLoading && (
                  <div className="mt-6 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">AI sedang menganalisis data, mohon tunggu...</p>
                  </div>
                )}
                {analysis && (
                    <div className="mt-8 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Analisis</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{analysis.summary}</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="p-4 border rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Total Serangan per Komoditas</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={analysis.barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(79, 70, 229, 0.1)'}} />
                                        <Legend />
                                        <Bar dataKey="Luas Serangan" fill="#4F46E5" onClick={handleBarClick} cursor="pointer" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Tren Luas Serangan</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={analysis.lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="Luas Serangan" stroke="#10B981" strokeWidth={2} activeDot={{ r: 8, cursor: 'pointer' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Data Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Data Serangan OPT</h1>
                <p className="text-gray-500 mb-6">Data yang telah disetujui dan dipublikasikan.</p>
                
                <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
                    <div className="flex-grow">
                        <label htmlFor="search-public" className="block text-sm font-medium text-gray-700 mb-1">Global Search</label>
                        <input
                            id="search-public"
                            type="text"
                            placeholder="Search anything..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        />
                    </div>
                    <div className="flex-shrink-0">
                        <button onClick={() => setDownloadModalOpen(true)} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105">
                            <DownloadIcon className="h-5 w-5 mr-2" />
                            Download Excel
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <FilterSelect label="Tahun" name="tahun" value={filters.tahun} options={tahunOptions} onChange={handleFilterChange} />
                    <FilterSelect label="Periode" name="periode" value={filters.periode} options={periodeOptions} onChange={handleFilterChange} />
                    <FilterSelect label="Jenis OPT" name="jenisOpt" value={filters.jenisOpt} options={jenisOptOptions} onChange={handleFilterChange} />
                </div>

                {/* Interactive Chart Section */}
                <div className="mb-8 p-6 border rounded-lg bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Ringkasan Luas Serangan vs. Pengendalian per Jenis OPT (Ha)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartSummaryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                            <Legend />
                            <Bar dataKey="Luas Serangan" fill="#EF4444" onClick={handleBarClick} cursor="pointer" />
                            <Bar dataKey="Luas Pengendalian" fill="#10B981" onClick={handleBarClick} cursor="pointer" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mb-8 p-6 border rounded-lg bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Tren Serangan per Jenis OPT (Ha)</h3>
                     <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={optTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ bottom: 0 }} />
                            {uniqueOpts.map((opt, index) => (
                                <Line 
                                    key={opt} 
                                    type="monotone" 
                                    dataKey={opt} 
                                    stroke={OPT_COLORS[index % OPT_COLORS.length]} 
                                    strokeWidth={2} 
                                    activeDot={{ r: 8 }} 
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>


                <div ref={tableSectionRef} className="overflow-x-auto relative shadow rounded-lg">
                  {showLoader && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10 rounded-lg">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                  )}
                  <table className="min-w-full bg-white divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      <tr>
                        <th rowSpan={3} className="px-2 py-3 border-r">No</th>
                        <th rowSpan={3} className="px-4 py-3 border-r">Jenis OPT</th>
                        <th rowSpan={3} className="px-4 py-3 border-r">Kecamatan</th>
                        <th colSpan={5} className="py-2 border-b border-r">Luas Keadaan Serangan OPT (Ha)</th>
                        <th colSpan={6} className="py-2 border-b border-r">Luas Pengendalian (Ha)</th>
                        <th rowSpan={3} className="px-2 py-3 border-r">Luas Terancam</th>
                        <th rowSpan={3} className="px-4 py-3">Tanggal Update</th>
                      </tr>
                      <tr>
                        <th rowSpan={2} className="px-2 py-2 border-b border-r">Ringan</th>
                        <th rowSpan={2} className="px-2 py-2 border-b border-r">Sedang</th>
                        <th rowSpan={2} className="px-2 py-2 border-b border-r">Berat</th>
                        <th rowSpan={2} className="px-2 py-2 border-b border-r">Puso</th>
                        <th rowSpan={2} className="px-2 py-2 border-b border-r bg-gray-200">Jml</th>
                        <th rowSpan={2} className="px-2 py-2 border-b border-r">PM</th>
                        <th colSpan={2} className="py-1 border-b border-r">Pestisida</th>
                        <th colSpan={2} className="py-1 border-b border-r">Non Pestisida</th>
                        <th rowSpan={2} className="px-2 py-2 border-b border-r bg-gray-200">Jml</th>
                      </tr>
                      <tr>
                        <th className="px-2 py-2 border-b border-r">Kimia</th>
                        <th className="px-2 py-2 border-b border-r">Nabati</th>
                        <th className="px-2 py-2 border-b border-r">AH</th>
                        <th className="px-2 py-2 border-b border-r">CL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {!showLoader && enrichedFilteredData.length > 0 ? enrichedFilteredData.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 text-center text-gray-900">
                          <td className="px-2 py-2 whitespace-nowrap">{index + 1}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-left"><HighlightText text={item.jenisOpt} highlight={debouncedSearchTerm} /></td>
                          <td className="px-4 py-2 whitespace-nowrap text-left"><HighlightText text={item.kabKota} highlight={debouncedSearchTerm} /></td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.luasSeranganRingan.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.luasSeranganSedang.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.luasSeranganBerat.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.luasSeranganPuso.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap font-bold bg-gray-50">{item.luasSeranganTotal.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.pengendalianPM.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.pengendalianKimia.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.pengendalianNabati.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.pengendalianAH.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.pengendalianCL.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap font-bold bg-gray-50">{item.luasPengendalianTotal.toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{item.luasTerancam.toFixed(2)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{item.tanggalUpdate}</td>
                        </tr>
                      )) : null}
                      {!showLoader && enrichedFilteredData.length === 0 && (
                        <tr>
                          <td colSpan={17} className="px-6 py-10 text-center text-sm text-gray-500">No data available for the selected filters.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
      </main>

      <button
        onClick={() => setChatModalOpen(true)}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        aria-label="Open AI Chat Analyzer"
      >
          <ChatBubbleIcon className="w-8 h-8" />
      </button>
      
      <Modal isOpen={isChatModalOpen} onClose={() => setChatModalOpen(false)} title="AI Chat Analyzer">
        <div className="flex flex-col h-[60vh]">
            <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50 rounded-md">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {chatLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t">
                <form onSubmit={handleChatSend} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ketik pertanyaan Anda..."
                        className="flex-grow w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        disabled={chatLoading}
                    />
                    <button type="submit" className="flex-shrink-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400" disabled={chatLoading || !chatInput.trim()}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isDownloadModalOpen} onClose={() => setDownloadModalOpen(false)} title="Form Permintaan Data">
        <form onSubmit={(e) => { e.preventDefault(); handleDownload(); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama</label>
              <input type="text" name="nama" id="nama" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="instansi" className="block text-sm font-medium text-gray-700">Instansi</label>
              <input type="text" name="instansi" id="instansi" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="keperluan" className="block text-sm font-medium text-gray-700">Keperluan</label>
              <textarea name="keperluan" id="keperluan" rows={3} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setDownloadModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Download</button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

interface FilterSelectProps {
    label: string;
    name: string;
    value: string;
    options: (string | number)[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, name, value, options, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
            {options.map(opt => <option key={opt.toString()} value={opt.toString()}>{opt}</option>)}
        </select>
    </div>
);


export default PublicView;
