import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getAiAnalysis } from '../services/geminiService';
import { OPTData } from '../types';
// FIX: Changed import from 'loadData' to 'getOptData' as 'loadData' is not exported from dataService.
import { getOptData } from '../services/dataService';
import { ThumbUpIcon, ThumbDownIcon } from '../components/Icons';
import CustomTooltip from '../components/CustomTooltip';

interface AnalysisResult {
    summary: string;
}

const AiAnalysis: React.FC = () => {
  const [data, setData] = useState<OPTData[]>([]);
  const [prompt, setPrompt] = useState('Berikan analisis umum terkait tren serangan OPT.');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  useEffect(() => {
    // FIX: Replaced synchronous `loadData` with asynchronous `getOptData` to fetch data.
    const fetchData = async () => {
      try {
        const loadedData = await getOptData();
        setData(loadedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      }
    };
    fetchData();
  }, []);

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    setError('');
    setAnalysis(null);
    setFeedback(null); // Reset feedback on new analysis
    try {
      const result = await getAiAnalysis(data, prompt);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    if (!analysis) return;
    setFeedback(type);
    // In a real application, you would send this to a logging service or database.
    console.log('Feedback Submitted:', {
        feedback: type,
        prompt: prompt,
        summary: analysis.summary,
    });
    alert('Thank you for your feedback!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Analisis AI dengan Gemini</h1>
          <p className="text-gray-500 mb-6">Dapatkan wawasan dari data serangan OPT menggunakan kecerdasan buatan.</p>

          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Masukkan Permintaan Analisis Anda
            </label>
            <textarea
              id="prompt"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Fokus analisis pada komoditas Kopi di Bandung."
            />
          </div>

          <button
            onClick={handleGenerateAnalysis}
            disabled={loading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Menganalisis...' : 'Hasilkan Analisis'}
          </button>

          {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
        </div>

        {loading && (
          <div className="mt-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">AI sedang berpikir, mohon tunggu sebentar...</p>
          </div>
        )}
        
        {analysis && (
          <div className="mt-8 space-y-8">
            {/* Summary */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Analisis</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{analysis.summary}</p>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2 text-center">Was this summary helpful?</p>
                <div className="flex justify-center items-center space-x-4">
                    <button
                        onClick={() => handleFeedback('positive')}
                        disabled={feedback !== null}
                        className={`p-2 rounded-full transition-colors duration-200 ${feedback === 'positive' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'} disabled:cursor-not-allowed disabled:opacity-70`}
                        aria-label="Helpful"
                    >
                        <ThumbUpIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => handleFeedback('negative')}
                        disabled={feedback !== null}
                        className={`p-2 rounded-full transition-colors duration-200 ${feedback === 'negative' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'} disabled:cursor-not-allowed disabled:opacity-70`}
                        aria-label="Not helpful"
                    >
                        <ThumbDownIcon className="w-6 h-6" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AiAnalysis;
