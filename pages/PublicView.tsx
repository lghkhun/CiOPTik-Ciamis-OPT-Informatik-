import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { OPTData, FilterState } from '../types';
import { getOptData } from '../services/dataService';
import { addFeedback } from '../services/feedbackService';
import { getPublicAiAnalysis } from '../services/geminiService';
import { ChatBubbleIcon, DownloadIcon, SendIcon, SparklesIcon, CloseIcon, DatabaseIcon } from '../components/Icons';
import Modal from '../components/Modal';
import { useDebounce } from '../hooks/useDebounce';
import HighlightText from '../components/HighlightText';
import { Chat } from '@google/genai';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { ai as geminiAi } from '../services/geminiClient';

declare var XLSX: any;

type EnrichedOPTData = OPTData & { luasSeranganTotal: number; luasPengendalianTotal: number };

interface PublicAnalysisResult {
    summary: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;
    const processInlineFormatting = (line: string) => { const parts = line.split(/(\*\*.*?\*\*)/g); return (<>{parts.map((part, index) => { if (part.startsWith('**') && part.endsWith('**')) { return <strong key={index}>{part.slice(2, -2)}</strong>; } return part; })}</>); };
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: { content: React.ReactNode; type: 'ul' | 'ol' }[] = [];
    const flushList = () => { if (listItems.length === 0) return; const listKey = `list-${elements.length}`; if (listItems[0].type === 'ul') { elements.push(<ul key={listKey} className="list-disc list-inside pl-4 my-1 space-y-1">{listItems.map((item, index) => <li key={index}>{item.content}</li>)}</ul>); } else { elements.push(<ol key={listKey} className="list-decimal list-inside pl-4 my-1 space-y-1">{listItems.map((item, index) => <li key={index}>{item.content}</li>)}</ol>); } listItems = []; };
    lines.forEach((line, index) => { const trimmedLine = line.trim(); const ulMatch = trimmedLine.match(/^[-*]\s+(.*)/); const olMatch = trimmedLine.match(/^\d+\.\s+(.*)/); if (ulMatch) { if (listItems.length > 0 && listItems[0].type !== 'ul') { flushList(); } listItems.push({ content: processInlineFormatting(ulMatch[1]), type: 'ul' }); } else if (olMatch) { if (listItems.length > 0 && listItems[0].type !== 'ol') { flushList(); } listItems.push({ content: processInlineFormatting(olMatch[1]), type: 'ol' }); } else { flushList(); if (trimmedLine.length > 0) { elements.push(<div key={`p-${index}`}>{processInlineFormatting(line)}</div>); } } });
    flushList();
    return <>{elements}</>;
};

// Full period order for correct chart sorting
const PERIODE_ORDER = [
    'Januari (1-15)', 'Januari (16-31)', 'Februari (1-15)', 'Februari (16-28)', 'Maret (1-15)', 'Maret (16-31)',
    'April (1-15)', 'April (16-30)', 'Mei (1-15)', 'Mei (16-31)', 'Juni (1-15)', 'Juni (16-30)',
    'Juli (1-15)', 'Juli (16-31)', 'Agustus (1-15)', 'Agustus (16-31)', 'September (1-15)', 'September (16-30)',
    'Oktober (1-15)', 'Oktober (16-31)', 'November (1-15)', 'November (16-30)', 'Desember (1-15)', 'Desember (16-31)'
];

const suggestionQuestions = [
    "Apa tren utama dari data yang ditampilkan ini?",
    "Wilayah (kecamatan) mana yang paling terdampak serangan?",
    "Komoditas dan jenis OPT apa yang paling dominan?",
];

const chatSuggestionQuestions = [
    "Berapa total luas serangan di data ini?",
    "Kecamatan mana yang memiliki serangan paling parah?",
    "Apa saja jenis OPT yang dilaporkan?"
];


const PublicView: React.FC = () => {
  const [data, setData] = useState<OPTData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [hasInitialData, setHasInitialData] = useState(false); // New state for diagnostics
  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = localStorage.getItem('publicView_filters');
    const defaultFilters = { tahun: new Date().getFullYear().toString(), periode: 'Semua', jenis_opt: 'Semua', kab_kota: 'Semua', komoditas: 'Semua' };
    return saved ? { ...defaultFilters, ...JSON.parse(saved) } : defaultFilters;
  });
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('publicView_searchTerm') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isDebouncing = searchTerm !== debouncedSearchTerm;
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  
  const [analysis, setAnalysis] = useState<PublicAnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const [isChatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [isFeedbackWidgetOpen, setFeedbackWidgetOpen] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackWhatsapp, setFeedbackWhatsapp] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const allData = await getOptData();
        const approvedData = allData.filter(item => item.status === 'Approved');
        setData(approvedData);
        setHasInitialData(approvedData.length > 0); // Set diagnostic state

        const yearsInData = new Set(approvedData.map(d => d.tahun.toString()));
        setFilters(currentFilters => {
            if (yearsInData.size > 0 && !yearsInData.has(currentFilters.tahun)) {
                return { ...currentFilters, tahun: String(Math.max(...Array.from(yearsInData).map(Number))) };
            }
            return currentFilters;
        });

      } catch (error) {
        console.error("Failed to load data from Supabase", error);
        setHasInitialData(false); // Assume no data on error
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const searchTermLower = debouncedSearchTerm.toLowerCase();
    
    let result = data.filter(item => {
      const { tahun, periode, jenis_opt, kab_kota, komoditas } = filters;
      return (
        (tahun === 'Semua' || item.tahun.toString() === tahun) &&
        (periode === 'Semua' || item.periode === periode) &&
        (jenis_opt === 'Semua' || item.jenis_opt === jenis_opt) &&
        (kab_kota === 'Semua' || item.kab_kota === kab_kota) &&
        (komoditas === 'Semua' || item.komoditas === komoditas)
      );
    });

    if (searchTermLower) {
      result = result.filter(item => Object.values(item).some(value => value.toString().toLowerCase().includes(searchTermLower)));
    }
    return result;
  }, [data, filters, debouncedSearchTerm]);

  const openChat = () => {
      setChatWidgetOpen(true);
      setChatLoading(true);
      setChatHistory([]);
      setChatSession(null);
  
      // Defer session creation to allow UI to update
      setTimeout(() => {
          try {
              const dataContext = JSON.stringify(filteredData.map(d => ({
                  komoditas: d.komoditas,
                  jenis_opt: d.jenis_opt,
                  kab_kota: d.kab_kota,
                  tahun: d.tahun,
                  periode: d.periode,
                  luasSerangan: d.luas_serangan_ringan + d.luas_serangan_sedang + d.luas_serangan_berat + d.luas_serangan_puso,
              })), null, 2);
  
              const systemInstruction = `You are a helpful AI assistant specialized in analyzing agricultural pest data for Ciamis Regency. Your name is Analis AI CiOPTik. You must respond in Indonesian. The user is currently viewing a dataset with the following context. Use this data to answer their questions. Data:\n${dataContext}`;
  
              const session = geminiAi.chats.create({
                  model: "gemini-2.5-flash",
                  config: { systemInstruction },
              });
  
              const filterSummary = [
                  filters.tahun !== 'Semua' && `Tahun: ${filters.tahun}`,
                  filters.komoditas !== 'Semua' && `Komoditas: ${filters.komoditas}`,
                  filters.periode !== 'Semua' && `Periode: ${filters.periode}`,
                  filters.jenis_opt !== 'Semua' && `Jenis OPT: ${filters.jenis_opt}`,
                  filters.kab_kota !== 'Semua' && `Kecamatan: ${filters.kab_kota}`,
                  debouncedSearchTerm && `Pencarian: "${debouncedSearchTerm}"`,
              ].filter(Boolean).join(', ');
  
              const welcomeMessage = `Halo! Saya Analis AI CiOPTik. Saat ini kita sedang melihat data untuk: **${filterSummary || 'Semua Data'}**. Silakan bertanya tentang data ini, tren, atau strategi penanganan OPT.`;
              setChatSession(session);
              setChatHistory([{ role: 'model', text: welcomeMessage }]);
          } catch (error) {
              console.error("Chat Initialization Error:", error);
              setChatHistory([{ role: 'model', text: 'Maaf, Analis AI tidak dapat dimuat saat ini. Silakan coba lagi nanti.' }]);
          } finally {
              setChatLoading(false);
          }
      }, 100);
  };
  useEffect(() => { if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; } }, [chatHistory]);
  useEffect(() => { localStorage.setItem('publicView_filters', JSON.stringify(filters)); }, [filters]);
  useEffect(() => { localStorage.setItem('publicView_searchTerm', searchTerm); }, [searchTerm]);

  const komoditasOptions = useMemo(() => ['Semua', ...Array.from(new Set(data.map(item => item.komoditas)))], [data]);
  const tahunOptions = useMemo(() => ['Semua', ...Array.from(new Set(data.map(item => item.tahun.toString()))).sort((a, b) => b.localeCompare(a))], [data]);
  const periodeOptions = useMemo(() => { let filtered = data; if (filters.tahun !== 'Semua') { filtered = filtered.filter(item => item.tahun.toString() === filters.tahun); } return ['Semua', ...Array.from(new Set(filtered.map(item => item.periode)))]; }, [data, filters.tahun]);
  const jenisOptOptions = useMemo(() => { let filtered = data; if (filters.tahun !== 'Semua') { filtered = filtered.filter(item => item.tahun.toString() === filters.tahun); } if (filters.periode !== 'Semua') { filtered = filtered.filter(item => item.periode === filters.periode); } return ['Semua', ...Array.from(new Set(filtered.map(item => item.jenis_opt)))]; }, [data, filters.tahun, filters.periode]);
  const kecamatanOptions = useMemo(() => { let filtered = data; if (filters.tahun !== 'Semua') { filtered = filtered.filter(item => item.tahun.toString() === filters.tahun); } if (filters.periode !== 'Semua') { filtered = filtered.filter(item => item.periode === filters.periode); } if (filters.jenis_opt !== 'Semua') { filtered = filtered.filter(item => item.jenis_opt === filters.jenis_opt); } return ['Semua', ...Array.from(new Set(filtered.map(item => item.kab_kota)))]; }, [data, filters.tahun, filters.periode, filters.jenis_opt]);
  
  useEffect(() => { setFilters(f => ({ ...f, periode: 'Semua', jenis_opt: 'Semua', kab_kota: 'Semua' })); }, [filters.tahun]);
  useEffect(() => { setFilters(f => ({ ...f, jenis_opt: 'Semua', kab_kota: 'Semua' })); }, [filters.periode]);
  useEffect(() => { setFilters(f => ({ ...f, kab_kota: 'Semua' })); }, [filters.jenis_opt]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, [e.target.name]: e.target.value });
  
  const enrichedFilteredData = useMemo((): EnrichedOPTData[] => {
    return filteredData.map(item => {
        const luasSeranganTotal = 
            Number(item.luas_serangan_ringan || 0) +
            Number(item.luas_serangan_sedang || 0) +
            Number(item.luas_serangan_berat || 0) +
            Number(item.luas_serangan_puso || 0);
        
        const luasPengendalianTotal =
            Number(item.pengendalian_pm || 0) +
            Number(item.pengendalian_kimia || 0) +
            Number(item.pengendalian_nabati || 0) +
            Number(item.pengendalian_ah || 0) +
            Number(item.pengendalian_cl || 0);

        return {
            ...item,
            luasSeranganTotal,
            luasPengendalianTotal
        };
    });
  }, [filteredData]);
  
  const chartData = useMemo(() => {
    if (enrichedFilteredData.length === 0) {
      return { trenSeranganVsPengendalian: [] };
    }

    const periodeMap = new Map<string, { totalSerangan: number; totalPengendalian: number }>();
    enrichedFilteredData.forEach(d => {
      const current = periodeMap.get(d.periode) || { totalSerangan: 0, totalPengendalian: 0 };
      current.totalSerangan += d.luasSeranganTotal;
      current.totalPengendalian += d.luasPengendalianTotal;
      periodeMap.set(d.periode, current);
    });

    const trenSeranganVsPengendalian = Array.from(periodeMap.entries())
      .map(([periode, totals]) => ({ periode, ...totals }))
      .sort((a, b) => PERIODE_ORDER.indexOf(a.periode) - PERIODE_ORDER.indexOf(b.periode));

    return { trenSeranganVsPengendalian };
  }, [enrichedFilteredData]);
  
  const tableTotals = useMemo(() => {
    const initialTotals = { 
        luas_serangan_ringan: 0, luas_serangan_sedang: 0, luas_serangan_berat: 0, 
        luas_serangan_puso: 0, luasSeranganTotal: 0, pengendalian_pm: 0, 
        pengendalian_kimia: 0, pengendalian_nabati: 0, pengendalian_ah: 0, 
        pengendalian_cl: 0, luasPengendalianTotal: 0, luas_terancam: 0 
    };

    return enrichedFilteredData.reduce((acc, item) => {
        acc.luas_serangan_ringan += Number(item.luas_serangan_ringan || 0);
        acc.luas_serangan_sedang += Number(item.luas_serangan_sedang || 0);
        acc.luas_serangan_berat += Number(item.luas_serangan_berat || 0);
        acc.luas_serangan_puso += Number(item.luas_serangan_puso || 0);
        acc.luasSeranganTotal += Number(item.luasSeranganTotal || 0);
        acc.pengendalian_pm += Number(item.pengendalian_pm || 0);
        acc.pengendalian_kimia += Number(item.pengendalian_kimia || 0);
        acc.pengendalian_nabati += Number(item.pengendalian_nabati || 0);
        acc.pengendalian_ah += Number(item.pengendalian_ah || 0);
        acc.pengendalian_cl += Number(item.pengendalian_cl || 0);
        acc.luasPengendalianTotal += Number(item.luasPengendalianTotal || 0);
        acc.luas_terancam += Number(item.luas_terancam || 0);
        return acc;
    }, initialTotals);
  }, [enrichedFilteredData]);

  const handleDownload = (format: 'xlsx' | 'csv') => {
    const dataToExport = enrichedFilteredData.map(item => ({
        Komoditas: item.komoditas,
        'Jenis OPT': item.jenis_opt,
        Kecamatan: item.kab_kota,
        Tahun: item.tahun,
        Periode: item.periode,
        'Luas Serangan Ringan (Ha)': item.luas_serangan_ringan,
        'Luas Serangan Sedang (Ha)': item.luas_serangan_sedang,
        'Luas Serangan Berat (Ha)': item.luas_serangan_berat,
        'Luas Serangan Puso (Ha)': item.luas_serangan_puso,
        'Total Luas Serangan (Ha)': item.luasSeranganTotal,
        'Pengendalian PM (Ha)': item.pengendalian_pm,
        'Pengendalian Kimia (Ha)': item.pengendalian_kimia,
        'Pengendalian Nabati (Ha)': item.pengendalian_nabati,
        'Pengendalian AH (Ha)': item.pengendalian_ah,
        'Pengendalian CL (Ha)': item.pengendalian_cl,
        'Total Luas Pengendalian (Ha)': item.luasPengendalianTotal,
        'Luas Terancam (Ha)': item.luas_terancam,
        'Tanggal Update': item.tanggal_update,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data OPT Ciamis');
    
    const fileName = `Data_OPT_Ciamis_${new Date().toISOString().split('T')[0]}.${format}`;
    XLSX.writeFile(wb, fileName);
    setDownloadModalOpen(false);
  };

  const handleGenerateAnalysis = async (question?: string) => {
    setAnalysisLoading(true);
    setAnalysisError('');
    setAnalysis(null);
    try {
      const result = await getPublicAiAnalysis(filteredData, filters, question);
      setAnalysis(result);
    } catch (err: any) {
      setAnalysisError(err.message || 'An unknown error occurred.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSendChat = async (message?: string) => {
    const currentMessage = message || chatInput;
    if (!currentMessage.trim() || !chatSession || chatLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', text: currentMessage };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
        const response = await chatSession.sendMessageStream({ message: currentMessage });
        let modelResponse = '';
        for await (const chunk of response) {
            modelResponse += chunk.text;
            setChatHistory(prev => {
                const newHistory = [...prev];
                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage && lastMessage.role === 'model') {
                    lastMessage.text = modelResponse;
                } else {
                    newHistory.push({ role: 'model', text: modelResponse });
                }
                return newHistory;
            });
        }
    } catch (error) {
        console.error("Chat Error:", error);
        const errorMessage: ChatMessage = { role: 'model', text: 'Maaf, terjadi kesalahan saat berkomunikasi dengan AI.' };
        setChatHistory(prev => [...prev, errorMessage]);
    } finally {
        setChatLoading(false);
    }
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackMessage) {
        alert("Nama dan Pesan wajib diisi.");
        return;
    }
    try {
        await addFeedback({
            name: feedbackName,
            email: feedbackEmail || undefined,
            whatsapp: feedbackWhatsapp || undefined,
            message: feedbackMessage,
        });
        setFeedbackSubmitted(true);
        setTimeout(() => {
            setFeedbackWidgetOpen(false);
            setFeedbackSubmitted(false);
            // Reset fields
            setFeedbackName('');
            setFeedbackEmail('');
            setFeedbackWhatsapp('');
            setFeedbackMessage('');
        }, 3000);
    } catch (error) {
        console.error("Feedback submission error:", error);
        alert("Gagal mengirim feedback.");
    }
  };

  const showLoader = loadingData || isDebouncing;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Data Publik Serangan OPT</h1>
                    <p className="text-gray-500 mt-1">Data yang telah disetujui untuk ditampilkan ke publik.</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setDownloadModalOpen(true)} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <DownloadIcon className="h-5 w-5 mr-2" /> Download
                    </button>
                </div>
            </div>

            <div className="bg-green-50/50 p-4 rounded-lg border border-green-200">
                <div className="flex flex-col items-center gap-4">
                    <button onClick={() => handleGenerateAnalysis()} disabled={analysisLoading || filteredData.length === 0} className="w-full md:w-auto flex items-center justify-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
                        <SparklesIcon className="h-5 w-5 mr-2" /> {analysisLoading ? 'Menganalisis...' : 'Buat Ringkasan Analisis dengan AI'}
                    </button>
                    {filteredData.length > 0 && !analysisLoading && (
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-2">Atau, coba salah satu pertanyaan ini:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {suggestionQuestions.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleGenerateAnalysis(q)}
                                        className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {analysisError && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{analysisError}</div>}
            
            {analysis && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg relative">
                     <button onClick={() => setAnalysis(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><CloseIcon className="w-5 h-5"/></button>
                     <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center"><SparklesIcon className="h-5 w-5 mr-2"/> Hasil Analisis AI</h3>
                     <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none">
                        <FormattedText text={analysis.summary} />
                     </div>
                </div>
            )}
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-8 pt-6 border-t">
                <FilterSelect label="Komoditas" name="komoditas" value={filters.komoditas} options={komoditasOptions} onChange={handleFilterChange} />
                <FilterSelect label="Tahun" name="tahun" value={filters.tahun} options={tahunOptions} onChange={handleFilterChange} />
                <FilterSelect label="Periode" name="periode" value={filters.periode} options={periodeOptions} onChange={handleFilterChange} />
                <FilterSelect label="Jenis OPT" name="jenis_opt" value={filters.jenis_opt} options={jenisOptOptions} onChange={handleFilterChange} />
                <FilterSelect label="Kecamatan" name="kab_kota" value={filters.kab_kota} options={kecamatanOptions} onChange={handleFilterChange} />
                <div className="w-full"><label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Global Search</label><input id="search" type="text" placeholder="Cari..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md" /></div>
            </div>

            {enrichedFilteredData.length > 0 && !showLoader && (
              <div className="bg-white p-6 rounded-xl shadow-lg border mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Visualisasi Data</h2>
                <div className="w-full" style={{ minHeight: '400px' }}>
                    <h3 className="font-semibold text-center mb-4">Tren Serangan vs. Pengendalian per Periode</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData.trenSeranganVsPengendalian} margin={{ top: 5, right: 30, left: 20, bottom: 90 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="periode" angle={-45} textAnchor="end" interval={0} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="totalSerangan" name="Total Serangan (Ha)" stroke="#F97316" strokeWidth={2} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="totalPengendalian" name="Total Pengendalian (Ha)" stroke="#10B981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="overflow-x-auto relative shadow rounded-lg mt-8">
              {showLoader && <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10 rounded-lg"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}
              <table className="min-w-full bg-white divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    <tr>
                        <th rowSpan={3} className="px-2 py-3 border-r">No</th>
                        <th rowSpan={3} className="px-4 py-3 border-r">Komoditas</th>
                        <th rowSpan={3} className="px-4 py-3 border-r">Kecamatan</th>
                        <th colSpan={5} className="py-2 border-b border-r">Luas Keadaan Serangan OPT (Ha)</th>
                        <th colSpan={6} className="py-2 border-b border-r">Luas Pengendalian (Ha)</th>
                        <th rowSpan={3} className="px-2 py-3">Luas Terancam</th>
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
                    <tr key={item.id} className="hover:bg-gray-50 text-gray-900">
                        <td className="px-2 py-2 text-center whitespace-nowrap">{index + 1}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-left"><HighlightText text={item.komoditas} highlight={debouncedSearchTerm} /></td>
                        <td className="px-4 py-2 whitespace-nowrap text-left"><HighlightText text={item.kab_kota} highlight={debouncedSearchTerm} /></td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_serangan_ringan}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_serangan_sedang}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_serangan_berat}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_serangan_puso}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap font-bold bg-gray-50">{item.luasSeranganTotal.toFixed(2)}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_pm}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_kimia}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_nabati}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_ah}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_cl}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap font-bold bg-gray-50">{item.luasPengendalianTotal.toFixed(2)}</td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_terancam}</td>
                    </tr>
                  )) : null}
                  {!showLoader && filteredData.length === 0 && (
                    <tr><td colSpan={16} className="px-6 py-10 text-center text-sm text-gray-500">
                      {loadingData ? 'Memuat data...' : 
                       !hasInitialData ? 
                       <div className="text-center max-w-lg mx-auto"><DatabaseIcon className="h-12 w-12 text-yellow-400 mx-auto" /><h3 className="text-lg font-semibold text-gray-800 mt-2">Database Kosong atau Gagal Terhubung</h3><p className="mt-1">Koneksi ke Supabase berhasil, tetapi tidak ada data 'Approved' yang ditemukan. Ini biasanya terjadi jika skrip SQL belum dijalankan.</p><p className="mt-2 text-xs text-gray-500"><strong>Langkah Perbaikan:</strong> Buka file `README.md`, salin seluruh skrip SQL, dan jalankan di SQL Editor Supabase Anda.</p></div> : 
                       'Tidak ada data yang cocok dengan filter Anda.'}
                    </td></tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-100 font-bold text-gray-800 text-sm">
                    <tr>
                        <td colSpan={3} className="px-4 py-3 text-right">Total Keseluruhan</td>
                        <td className="px-2 py-3 text-center">{tableTotals.luas_serangan_ringan.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.luas_serangan_sedang.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.luas_serangan_berat.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.luas_serangan_puso.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center bg-gray-200">{tableTotals.luasSeranganTotal.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.pengendalian_pm.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.pengendalian_kimia.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.pengendalian_nabati.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.pengendalian_ah.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.pengendalian_cl.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center bg-gray-200">{tableTotals.luasPengendalianTotal.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.luas_terancam.toFixed(2)}</td>
                    </tr>
                </tfoot>
              </table>
            </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 space-y-3 z-40">
        <button onClick={openChat} className="flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110" title="Tanya AI"><SparklesIcon className="w-8 h-8"/></button>
        <button onClick={() => setFeedbackWidgetOpen(true)} className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110" title="Beri Masukan"><ChatBubbleIcon className="w-8 h-8"/></button>
      </div>
      
      {isChatWidgetOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border flex flex-col z-40 h-[600px]">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-xl">
                <h3 className="font-bold text-gray-800">Analis AI CiOPTik</h3>
                <button onClick={() => setChatWidgetOpen(false)} className="text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6"/></button>
            </div>
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <FormattedText text={msg.text} />
                        </div>
                    </div>
                ))}
                {chatHistory.length === 1 && !chatLoading && (
                    <div className="p-2 space-y-2">
                        <p className="text-xs text-gray-500 font-semibold">Saran Pertanyaan:</p>
                        <div className="flex flex-col items-start gap-2">
                            {chatSuggestionQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendChat(q)}
                                    className="px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-lg hover:bg-green-200 transition-colors text-left"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="h-1"></div>
            </div>
            {chatLoading && <div className="p-4 border-t text-sm text-gray-500 italic">Analis AI sedang mengetik...</div>}
            <div className="p-2 border-t flex items-center gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendChat()} placeholder="Ketik pertanyaan Anda..." className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500" disabled={chatLoading} />
                <button onClick={() => handleSendChat()} disabled={chatLoading || !chatInput.trim()} className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400">
                    <SendIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
      )}

      {isFeedbackWidgetOpen && (
         <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border flex flex-col z-40">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-xl"><h3 className="font-bold text-gray-800">Beri Masukan</h3><button onClick={() => setFeedbackWidgetOpen(false)} className="text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6"/></button></div>
            {feedbackSubmitted ? (<div className="p-8 text-center"><h4 className="font-semibold text-green-700">Terima Kasih!</h4><p className="text-sm text-gray-600 mt-1">Masukan Anda telah kami terima.</p></div>) : (
                <form onSubmit={handleSendFeedback} className="p-4 space-y-3"><input type="text" placeholder="Nama Anda*" value={feedbackName} onChange={e => setFeedbackName(e.target.value)} required className="w-full px-3 py-2 border rounded-md text-sm" /><input type="email" placeholder="Email (Opsional)" value={feedbackEmail} onChange={e => setFeedbackEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" /><input type="text" placeholder="No. Whatsapp (Opsional)" value={feedbackWhatsapp} onChange={e => setFeedbackWhatsapp(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" /><textarea placeholder="Pesan Anda*" value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} rows={4} required className="w-full px-3 py-2 border rounded-md text-sm"></textarea><button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold">Kirim Masukan</button></form>
            )}
         </div>
      )}

      <Modal isOpen={isDownloadModalOpen} onClose={() => setDownloadModalOpen(false)} title="Download Data">
          <p className="text-sm text-gray-600 mb-4">Pilih format file untuk mengunduh data yang sedang ditampilkan (sesuai filter).</p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => handleDownload('xlsx')} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">Excel (.xlsx)</button>
            <button onClick={() => handleDownload('csv')} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">CSV (.csv)</button>
          </div>
      </Modal>

    </div>
  );
};

const FilterSelect: React.FC<{label: string, name: string, value: string, options: (string | number)[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;}> = ({ label, name, value, options, onChange }) => (<div><label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label><select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">{options.map(opt => <option key={String(opt)} value={String(opt)}>{opt}</option>)}</select></div>);

export default PublicView;
