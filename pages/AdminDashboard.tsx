import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import { OPTData, FilterState, InformasiOPT, Feedback, DetailItem } from '../types';
import { getOptData, addOptData, updateOptData, deleteOptData, OPTDataInput } from '../services/dataService';
import { getInformasiData, updateInformasiData, uploadOptImage } from '../services/informasiService';
import { getFeedback, markAsRead } from '../services/feedbackService';
import { EditIcon, DeleteIcon, ApproveIcon, PlusIcon } from '../components/Icons';
import Modal from '../components/Modal';
import { useDebounce } from '../hooks/useDebounce';
import HighlightText from '../components/HighlightText';

type EnrichedOPTData = OPTData & { 
    luasSeranganTotal: number; 
    luasPengendalianTotal: number;
};

const KECAMATAN_OPTIONS = [
    'Banjarsari', 'Banjaranyar', 'Baregbeg', 'Ciamis', 'Cidolog', 'Cijeungjing',
    'Cikoneng', 'Cimaragas', 'Cipaku', 'Cisaga', 'Cihaurbeuti', 'Jatinagara',
    'Kawali', 'Lakbok', 'Lumbung', 'Pamarican', 'Panawangan', 'Panjalu',
    'Panumbangan', 'Purwadadi', 'Rajadesa', 'Rancah', 'Sadananya', 'Sindangkasih',
    'Sukadana', 'Sukamantri', 'Tambaksari'
].sort();

const JENIS_OPT_OPTIONS = [
    "Penggerek Batang", 
    "Wereng Batang Coklat (WBC)", 
    "Tikus", 
    "Blast", 
    "Hawar Daun Bakteri (BLB)",
    "Ulat Grayak",
    "Lalat Buah"
].sort();


const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'operator' | 'informasi' | 'feedback'>('operator');
  const [loading, setLoading] = useState({ operator: true, informasi: true, feedback: true });
  
  // State for Report Data
  const [data, setData] = useState<OPTData[]>([]);
  const [filters, setFilters] = useState<Omit<FilterState, 'kab_kota'>>(() => {
    const saved = localStorage.getItem('adminDashboard_filters');
    if (saved) return JSON.parse(saved);
    return { tahun: new Date().getFullYear().toString(), periode: 'Semua', jenis_opt: 'Semua', komoditas: 'Semua' };
  });
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('adminDashboard_searchTerm') || '');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<OPTData | null>(null);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [dataToApprove, setDataToApprove] = useState<OPTData | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<OPTData | null>(null);

  // State for Information Content
  const [informasiData, setInformasiData] = useState<InformasiOPT[]>([]);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<InformasiOPT | null>(null);

  // State for Feedback
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isDebouncing = searchTerm !== debouncedSearchTerm;

  const fetchData = useCallback(async () => {
    try {
        setLoading(prev => ({...prev, operator: true}));
        const optData = await getOptData();
        setData(optData);
    } catch(error) { console.error(error); } finally { setLoading(prev => ({...prev, operator: false}));}
  }, []);

  const fetchInformasi = useCallback(async () => {
    try {
        setLoading(prev => ({...prev, informasi: true}));
        const infoData = await getInformasiData();
        setInformasiData(infoData);
    } catch(error) { console.error(error); } finally { setLoading(prev => ({...prev, informasi: false}));}
  }, []);

  const fetchFeedback = useCallback(async () => {
    try {
        setLoading(prev => ({...prev, feedback: true}));
        const feedback = await getFeedback();
        setFeedbackData(feedback);
    } catch(error) { console.error(error); } finally { setLoading(prev => ({...prev, feedback: false}));}
  }, []);

  useEffect(() => {
    fetchData();
    fetchInformasi();
    fetchFeedback();
  }, [fetchData, fetchInformasi, fetchFeedback]);

  useEffect(() => { localStorage.setItem('adminDashboard_filters', JSON.stringify(filters)); }, [filters]);
  useEffect(() => { localStorage.setItem('adminDashboard_searchTerm', searchTerm); }, [searchTerm]);
  
  const newFeedbackCount = useMemo(() => feedbackData.filter(f => f.status === 'new').length, [feedbackData]);

  const komoditasOptions = useMemo(() => ['Semua', 'Padi', 'Palawija', 'Buah'], []);
  const tahunOptions = useMemo(() => ['Semua', ...Array.from(new Set(data.map(item => item.tahun.toString()))).sort((a, b) => b.localeCompare(a))], [data]);
  const periodeOptions = useMemo(() => ['Semua', ...Array.from(new Set(data.map(item => item.periode)))], [data]);
  const jenisOptOptions = useMemo(() => ['Semua', ...Array.from(new Set(data.map(item => item.jenis_opt)))], [data]);

  useEffect(() => { setFilters(f => ({ ...f, periode: 'Semua', jenis_opt: 'Semua' })); }, [filters.tahun]);
  useEffect(() => { setFilters(f => ({ ...f, jenis_opt: 'Semua' })); }, [filters.periode]);
  useEffect(() => { setFilters(f => ({ ...f, tahun: 'Semua', periode: 'Semua', jenis_opt: 'Semua' })); }, [filters.komoditas]);

  const filteredData = useMemo(() => {
    const searchTermLower = debouncedSearchTerm.toLowerCase();
    let result = data.filter(item => {
      const { tahun, periode, jenis_opt, komoditas } = filters;
      return (
        (komoditas === 'Semua' || item.komoditas === komoditas) &&
        (tahun === 'Semua' || item.tahun.toString() === tahun) &&
        (periode === 'Semua' || item.periode === periode) &&
        (jenis_opt === 'Semua' || item.jenis_opt === jenis_opt)
      );
    });
    if (searchTermLower) {
      result = result.filter(item => Object.values(item).some(value => String(value).toLowerCase().includes(searchTermLower)));
    }
    return result;
  }, [data, filters, debouncedSearchTerm]);

  const enrichedFilteredData = useMemo((): EnrichedOPTData[] => filteredData.map(item => ({...item, luasSeranganTotal: item.luas_serangan_ringan + item.luas_serangan_sedang + item.luas_serangan_berat + item.luas_serangan_puso, luasPengendalianTotal: item.pengendalian_pm + item.pengendalian_kimia + item.pengendalian_nabati + item.pengendalian_ah + item.pengendalian_cl, })), [filteredData]);

  const tableTotals = useMemo(() => enrichedFilteredData.reduce((acc, item) => ({
    luas_serangan_ringan: acc.luas_serangan_ringan + item.luas_serangan_ringan,
    luas_serangan_sedang: acc.luas_serangan_sedang + item.luas_serangan_sedang,
    luas_serangan_berat: acc.luas_serangan_berat + item.luas_serangan_berat,
    luas_serangan_puso: acc.luas_serangan_puso + item.luas_serangan_puso,
    luasSeranganTotal: acc.luasSeranganTotal + item.luasSeranganTotal,
    pengendalian_pm: acc.pengendalian_pm + item.pengendalian_pm,
    pengendalian_kimia: acc.pengendalian_kimia + item.pengendalian_kimia,
    pengendalian_nabati: acc.pengendalian_nabati + item.pengendalian_nabati,
    pengendalian_ah: acc.pengendalian_ah + item.pengendalian_ah,
    pengendalian_cl: acc.pengendalian_cl + item.pengendalian_cl,
    luasPengendalianTotal: acc.luasPengendalianTotal + item.luasPengendalianTotal,
    luas_terancam: acc.luas_terancam + item.luas_terancam
  }), { luas_serangan_ringan: 0, luas_serangan_sedang: 0, luas_serangan_berat: 0, luas_serangan_puso: 0, luasSeranganTotal: 0, pengendalian_pm: 0, pengendalian_kimia: 0, pengendalian_nabati: 0, pengendalian_ah: 0, pengendalian_cl: 0, luasPengendalianTotal: 0, luas_terancam: 0 }), [enrichedFilteredData]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const openAddModal = () => { setEditingData(null); setModalOpen(true); };
  const openEditModal = (item: OPTData) => { setEditingData(item); setModalOpen(true); };
  const openApproveModal = (item: OPTData) => { setDataToApprove(item); setApproveModalOpen(true); };
  const openDeleteModal = (item: OPTData) => { setDataToDelete(item); setDeleteModalOpen(true); };
  
  const handleDelete = async () => {
    if (!dataToDelete) return;
    await deleteOptData(dataToDelete.id);
    setData(currentData => currentData.filter(item => item.id !== dataToDelete.id));
    setDeleteModalOpen(false);
    setDataToDelete(null);
  };

  const handleSave = async (formData: OPTDataInput) => {
    try {
        if (editingData) {
            const updated = await updateOptData(editingData.id, formData);
            setData(data.map(d => d.id === updated.id ? updated : d));
        } else {
            const added = await addOptData(formData);
            setData([...data, added]);
        }
        setModalOpen(false);
    } catch (error: any) {
        console.error("Save operation failed:", error);
        alert(
            `Gagal menyimpan data!\n\n` +
            `Error: ${error.message}\n\n` +
            `Penyebab Umum:\n` +
            `1. Kebijakan Keamanan (Row Level Security) di Supabase untuk tabel 'opt_data' belum diatur dengan benar untuk pengguna yang login.\n` +
            `2. Pastikan Anda telah menjalankan KEMBALI seluruh skrip SQL dari file README.md.\n` +
            `3. Periksa koneksi internet Anda.`
        );
    }
  };

  const handleApprove = async () => {
    if(dataToApprove) {
        const updated = await updateOptData(dataToApprove.id, { status: 'Approved' });
        setData(data.map(d => d.id === updated.id ? updated : d));
    }
    setApproveModalOpen(false);
  };
  
  const openEditInfoModal = (info: InformasiOPT) => { setEditingInfo(info); setInfoModalOpen(true); };

  const handleSaveInfo = async (updatedInfo: InformasiOPT) => {
    const saved = await updateInformasiData(updatedInfo.id, {
        image_url: updatedInfo.image_url,
        details: updatedInfo.details,
    });
    setInformasiData(informasiData.map(info => info.id === saved.id ? saved : info));
    setInfoModalOpen(false);
  };

  const handleMarkFeedbackAsRead = async (id: string) => {
    await markAsRead(id);
    setFeedbackData(feedbackData.map(fb => fb.id === id ? { ...fb, status: 'read' } : fb));
  };

  const showLoader = isDebouncing || loading.operator;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('operator')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'operator' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Operator Dashboard</button>
                <button onClick={() => setActiveTab('informasi')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'informasi' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Manajemen Informasi</button>
                <button onClick={() => setActiveTab('feedback')} className={`relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'feedback' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Feedback Pengguna {newFeedbackCount > 0 && <span className="absolute top-2 right-[-1rem] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{newFeedbackCount}</span>}
                </button>
            </nav>
        </div>

        {activeTab === 'operator' && (
            <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
                <div className="flex justify-between items-start mb-6"><h1 className="text-2xl font-bold text-gray-800">Manajemen Data Serangan OPT</h1><button onClick={openAddModal} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"><PlusIcon className="h-5 w-5 mr-2" /> Tambah Data</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <FilterSelect label="Komoditas" name="komoditas" value={filters.komoditas} options={komoditasOptions} onChange={handleFilterChange} />
                    <FilterSelect label="Tahun" name="tahun" value={filters.tahun} options={tahunOptions} onChange={handleFilterChange} />
                    <FilterSelect label="Periode" name="periode" value={filters.periode} options={periodeOptions} onChange={handleFilterChange} />
                    <FilterSelect label="Jenis OPT" name="jenis_opt" value={filters.jenis_opt} options={jenisOptOptions} onChange={handleFilterChange} />
                    <div className="w-full"><label htmlFor="search-admin" className="block text-sm font-medium text-gray-700 mb-1">Global Search</label><input id="search-admin" type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md" /></div>
                </div>
                <div className="overflow-x-auto relative shadow rounded-lg">
                  {showLoader && <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10 rounded-lg"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}
                  <table className="min-w-full bg-white divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      <tr>
                        <th rowSpan={3} className="px-2 py-3 border-r">No</th><th rowSpan={3} className="px-4 py-3 border-r">Komoditas</th><th rowSpan={3} className="px-4 py-3 border-r">Kecamatan</th><th colSpan={5} className="py-2 border-b border-r">Luas Keadaan Serangan OPT (Ha)</th><th colSpan={6} className="py-2 border-b border-r">Luas Pengendalian (Ha)</th><th rowSpan={3} className="px-2 py-3 border-r">Luas Terancam</th><th rowSpan={3} className="px-3 py-3 border-r">Status</th><th rowSpan={3} className="px-4 py-3">Actions</th>
                      </tr>
                      <tr>
                        <th rowSpan={2} className="px-2 py-2 border-b border-r">Ringan</th><th rowSpan={2} className="px-2 py-2 border-b border-r">Sedang</th><th rowSpan={2} className="px-2 py-2 border-b border-r">Berat</th><th rowSpan={2} className="px-2 py-2 border-b border-r">Puso</th><th rowSpan={2} className="px-2 py-2 border-b border-r bg-gray-200">Jml</th><th rowSpan={2} className="px-2 py-2 border-b border-r">PM</th><th colSpan={2} className="py-1 border-b border-r">Pestisida</th><th colSpan={2} className="py-1 border-b border-r">Non Pestisida</th><th rowSpan={2} className="px-2 py-2 border-b border-r bg-gray-200">Jml</th>
                      </tr>
                      <tr>
                        <th className="px-2 py-2 border-b border-r">Kimia</th><th className="px-2 py-2 border-b border-r">Nabati</th><th className="px-2 py-2 border-b border-r">AH</th><th className="px-2 py-2 border-b border-r">CL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {!showLoader && enrichedFilteredData.length > 0 ? enrichedFilteredData.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 text-gray-900">
                          <td className="px-2 py-2 text-center whitespace-nowrap">{index + 1}</td><td className="px-4 py-2 whitespace-nowrap text-left"><HighlightText text={item.komoditas} highlight={debouncedSearchTerm} /></td><td className="px-4 py-2 whitespace-nowrap text-left"><HighlightText text={item.kab_kota} highlight={debouncedSearchTerm} /></td>
                          <td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_serangan_ringan}</td><td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_serangan_sedang}</td><td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_serangan_berat}</td><td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_serangan_puso}</td><td className="px-2 py-2 text-center whitespace-nowrap font-bold bg-gray-50">{item.luasSeranganTotal.toFixed(2)}</td>
                          <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_pm}</td><td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_kimia}</td><td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_nabati}</td><td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_ah}</td><td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalian_cl}</td><td className="px-2 py-2 text-center whitespace-nowrap font-bold bg-gray-50">{item.luasPengendalianTotal.toFixed(2)}</td>
                          <td className="px-2 py-2 text-center whitespace-nowrap">{item.luas_terancam}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-center"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}><HighlightText text={item.status} highlight={debouncedSearchTerm} /></span></td>
                          <td className="px-4 py-2 whitespace-nowrap text-center"><div className="flex items-center justify-center space-x-3"><button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900" title="Edit"><EditIcon className="w-5 h-5"/></button><button onClick={() => openDeleteModal(item)} className="text-red-600 hover:text-red-900" title="Delete"><DeleteIcon className="w-5 h-5"/></button>{item.status !== 'Approved' && (<button onClick={() => openApproveModal(item)} className="text-green-600 hover:text-green-900" title="Approve"><ApproveIcon className="w-5 h-5"/></button>)}</div></td>
                        </tr>
                      )) : null}
                      {!showLoader && enrichedFilteredData.length === 0 && (<tr><td colSpan={17} className="px-6 py-10 text-center text-sm text-gray-500">No data available.</td></tr>)}
                    </tbody>
                    <tfoot className="bg-gray-100 font-bold text-gray-800 text-sm">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right">Total</td>
                        <td className="px-2 py-3 text-center">{tableTotals.luas_serangan_ringan.toFixed(2)}</td><td className="px-2 py-3 text-center">{tableTotals.luas_serangan_sedang.toFixed(2)}</td><td className="px-2 py-3 text-center">{tableTotals.luas_serangan_berat.toFixed(2)}</td><td className="px-2 py-3 text-center">{tableTotals.luas_serangan_puso.toFixed(2)}</td><td className="px-2 py-3 text-center bg-gray-200">{tableTotals.luasSeranganTotal.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.pengendalian_pm.toFixed(2)}</td><td className="px-2 py-3 text-center">{tableTotals.pengendalian_kimia.toFixed(2)}</td><td className="px-2 py-3 text-center">{tableTotals.pengendalian_nabati.toFixed(2)}</td><td className="px-2 py-3 text-center">{tableTotals.pengendalian_ah.toFixed(2)}</td><td className="px-2 py-3 text-center">{tableTotals.pengendalian_cl.toFixed(2)}</td><td className="px-2 py-3 text-center bg-gray-200">{tableTotals.luasPengendalianTotal.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center">{tableTotals.luas_terancam.toFixed(2)}</td>
                        <td colSpan={2} className="px-4 py-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
            </div>
        )}
        
        {activeTab === 'informasi' && (
            <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
                <h2 className="text-xl font-bold text-gray-800">Manajemen Informasi Halaman Publik</h2><p className="text-gray-500 mb-6">Edit gambar untuk setiap item OPT yang ditampilkan di halaman Informasi.</p>
                <div className="overflow-x-auto shadow rounded-lg">
                  {loading.informasi ? <div className="text-center p-8">Loading...</div> :
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                        <thead className="bg-gray-100"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis OPT</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar Utama</th><th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th></tr></thead>
                        <tbody className="divide-y divide-gray-200">{informasiData.map(info => (<tr key={info.id}><td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{info.title}</td><td className="px-6 py-4 whitespace-nowrap">{info.image_url ? <img src={info.image_url} alt={info.title} className="h-16 w-24 object-cover rounded-md" /> : <span className="text-gray-500 text-sm">No image</span>}</td><td className="px-6 py-4 whitespace-nowrap text-center"><button onClick={() => openEditInfoModal(info)} className="text-blue-600 hover:text-blue-900 font-medium">Edit Gambar</button></td></tr>))}</tbody>
                    </table>}
                </div>
            </div>
        )}

        {activeTab === 'feedback' && (
            <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
                <h2 className="text-xl font-bold text-gray-800">Feedback Pengguna</h2><p className="text-gray-500 mb-6">Masukan, pertanyaan, dan saran yang dikirim oleh pengunjung.</p>
                <div className="space-y-4">
                    {loading.feedback ? <div className="text-center p-8">Loading...</div> : feedbackData.length > 0 ? (
                        feedbackData.map(fb => (<div key={fb.id} className={`p-4 rounded-lg border ${fb.status === 'new' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center space-x-3 flex-wrap"><h3 className="font-semibold text-gray-900">{fb.name}</h3>{fb.email && <a href={`mailto:${fb.email}`} className="text-sm text-blue-600 hover:underline">{fb.email}</a>}{fb.whatsapp && <span className="text-sm text-gray-600 border-l pl-3 ml-3">WA: {fb.whatsapp}</span>}{fb.status === 'new' && <span className="px-2 py-0.5 text-xs font-semibold text-white bg-green-500 rounded-full">Baru</span>}</div>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(fb.timestamp).toLocaleString('id-ID')}</p>
                                    </div>
                                    {fb.status === 'new' && (<button onClick={() => handleMarkFeedbackAsRead(fb.id)} className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Tandai Sudah Dibaca</button>)}
                                </div>
                                <p className="mt-3 text-gray-700 whitespace-pre-wrap">{fb.message}</p>
                            </div>))) : (<p className="text-center text-gray-500 py-8">Belum ada feedback yang masuk.</p>)}
                </div>
            </div>
        )}

      </main>

      {isModalOpen && <DataFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initialData={editingData} />}
      {isApproveModalOpen && <ApproveDataModal isOpen={isApproveModalOpen} onClose={() => setApproveModalOpen(false)} onApprove={handleApprove} dataToApprove={dataToApprove} />}
      {isInfoModalOpen && <InformasiFormModal isOpen={isInfoModalOpen} onClose={() => setInfoModalOpen(false)} onSave={handleSaveInfo} initialData={editingInfo} />}
      
      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onClose={() => { setDeleteModalOpen(false); setDataToDelete(null); }} title="Konfirmasi Hapus Data">
            <div>
                <p className="text-gray-700">Anda yakin ingin menghapus data ini?</p>
                {dataToDelete && (<div className="mt-3 p-3 bg-gray-50 rounded-md border text-sm space-y-1"><p><strong>Komoditas:</strong> {dataToDelete.komoditas}</p><p><strong>Jenis OPT:</strong> {dataToDelete.jenis_opt}</p><p><strong>Kecamatan:</strong> {dataToDelete.kab_kota}</p><p><strong>Periode:</strong> {dataToDelete.periode} {dataToDelete.tahun}</p></div>)}
                <p className="text-sm font-semibold text-red-600 mt-4">Tindakan ini tidak dapat diurungkan.</p>
                <div className="flex justify-end space-x-2 mt-6 pt-4 border-t"><button type="button" onClick={() => { setDeleteModalOpen(false); setDataToDelete(null); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Ya, Hapus Data</button></div>
            </div>
        </Modal>
      )}
    </div>
  );
};

const ApproveDataModal: React.FC<{isOpen: boolean, onClose: () => void, onApprove: () => void, dataToApprove: OPTData | null}> = ({ isOpen, onClose, onApprove, dataToApprove }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Data OPT"><div className="space-y-4"><p>Anda akan menyetujui data untuk: <br /> <strong className="font-semibold">{dataToApprove?.komoditas} - {dataToApprove?.jenis_opt}</strong></p><p className="text-sm text-gray-600">Data yang telah disetujui akan ditampilkan ke publik.</p><div className="flex justify-end space-x-2 pt-2"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button><button onClick={onApprove} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Approve Data</button></div></div></Modal>
);

const ImageUploader: React.FC<{
    label: string;
    imageUrl: string | null;
    identifier: string;
    isUploading: boolean;
    onFileSelect: (file: File | null, identifier: string) => void;
}> = ({ label, imageUrl, identifier, isUploading, onFileSelect }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center gap-4">
                {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-24 h-16 object-cover rounded-md border bg-gray-100" />
                ) : (
                    <div className="w-24 h-16 flex items-center justify-center rounded-md border bg-gray-100 text-xs text-gray-500">No Image</div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={(e) => onFileSelect(e.target.files ? e.target.files[0] : null, identifier)}
                    className="hidden"
                    aria-label={`Upload image for ${label}`}
                />
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-wait"
                >
                    {isUploading ? 'Uploading...' : 'Ubah'}
                </button>
                {isUploading && <div className="w-5 h-5 border-2 border-t-transparent border-green-600 rounded-full animate-spin"></div>}
            </div>
        </div>
    );
};


const InformasiFormModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (data: InformasiOPT) => void, initialData: InformasiOPT | null}> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<InformasiOPT | null>(initialData);
    const [uploading, setUploading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setFormData(initialData);
        setUploading({}); // Reset loading state when modal opens with new data
    }, [initialData]);

    const handleImageUpload = async (file: File | null, identifier: string) => {
        if (!file || !formData) return;

        setUploading(prev => ({ ...prev, [identifier]: true }));
        try {
            const publicUrl = await uploadOptImage(file);
            
            if (identifier === 'main-image') {
                setFormData({ ...formData, image_url: publicUrl });
            } else {
                const [_, sectionKey, indexStr] = identifier.split('-');
                const index = parseInt(indexStr, 10);
                
                const newDetails = { ...formData.details };
                const newItems = [...(newDetails[sectionKey] as DetailItem[])];
                newItems[index] = { ...newItems[index], imageUrl: publicUrl };
                newDetails[sectionKey] = newItems;

                setFormData({ ...formData, details: newDetails });
            }
        } catch (error) {
            console.error(`Failed to upload image for ${identifier}:`, error);
            alert('Gagal mengunggah gambar. Pastikan Anda telah membuat bucket "opt-images" di Supabase Storage.');
        } finally {
            setUploading(prev => ({ ...prev, [identifier]: false }));
        }
    };
    
    if (!formData) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit Gambar untuk ${formData.title}`}>
            <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
                    {/* Main Image */}
                    <div className="p-4 border rounded-lg">
                        <ImageUploader
                            label="Gambar Utama (Thumbnail)"
                            imageUrl={formData.image_url}
                            identifier="main-image"
                            isUploading={!!uploading['main-image']}
                            onFileSelect={handleImageUpload}
                        />
                    </div>
                    
                    <hr/>
                    
                    {/* Detail Images */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Gambar Rincian</h3>
                        <div className="space-y-6">
                            {Object.entries(formData.details).map(([sectionKey, items]) => (
                                <div key={sectionKey} className="p-4 border rounded-lg bg-gray-50/50">
                                    <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4 capitalize">{sectionKey.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                    <div className="space-y-4">
                                        {(items as DetailItem[]).map((item, index) => {
                                            const identifier = `details-${sectionKey}-${index}`;
                                            return (
                                                <div key={identifier} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pb-4 border-b last:border-b-0 last:pb-0">
                                                    <div className="prose prose-sm max-w-none text-gray-800 pt-1">
                                                        {item.text.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                                                            part.startsWith('**') && part.endsWith('**') ? 
                                                            <strong key={i}>{part.slice(2, -2)}</strong> : 
                                                            part
                                                        )}
                                                    </div>
                                                    <ImageUploader
                                                        label={`Gambar untuk "${item.text.substring(0, 20)}..."`}
                                                        imageUrl={item.imageUrl}
                                                        identifier={identifier}
                                                        isUploading={!!uploading[identifier]}
                                                        onFileSelect={handleImageUpload}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
                    <button type="submit" disabled={Object.values(uploading).some(v => v)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">Simpan Perubahan</button>
                </div>
            </form>
        </Modal>
    );
};

const FilterSelect: React.FC<{label: string, name: string, value: string, options: (string | number)[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;}> = ({ label, name, value, options, onChange }) => (<div><label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label><select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">{options.map(opt => <option key={String(opt)} value={String(opt)}>{opt}</option>)}</select></div>);

const DataFormModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (data: OPTDataInput) => void, initialData: OPTData | null}> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<Partial<OPTDataInput>>(initialData || { komoditas: 'Padi', provinsi: 'Jawa Barat', tanggal_update: new Date().toISOString().split('T')[0], tahun: new Date().getFullYear(), periode: 'Januari (1-15)', jenis_opt: JENIS_OPT_OPTIONS[0], kab_kota: KECAMATAN_OPTIONS[0], luas_komoditas: 0, luas_serangan_ringan: 0, luas_serangan_sedang: 0, luas_serangan_berat: 0, luas_serangan_puso: 0, pengendalian_pm: 0, pengendalian_kimia: 0, pengendalian_nabati: 0, pengendalian_ah: 0, pengendalian_cl: 0, luas_terancam: 0 });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData as OPTDataInput); };
    return (<Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Data OPT' : 'Tambah Data OPT'}><form onSubmit={handleSubmit}><div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Komoditas" name="komoditas" value={formData.komoditas || 'Padi'} onChange={handleChange} required><option>Padi</option><option>Palawija</option><option>Buah</option></SelectField>
              <SelectField label="Jenis OPT" name="jenis_opt" value={formData.jenis_opt || ''} onChange={handleChange} required>{JENIS_OPT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</SelectField>
              <SelectField label="Kecamatan" name="kab_kota" value={formData.kab_kota || ''} onChange={handleChange} required>{KECAMATAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</SelectField>
              <InputField label="Tanggal Update" name="tanggal_update" value={formData.tanggal_update || ''} onChange={handleChange} type="date" required />
              <InputField label="Tahun" name="tahun" value={formData.tahun ?? ''} onChange={handleChange} type="number" required />
              <SelectField label="Periode" name="periode" value={formData.periode || 'Januari (1-15)'} onChange={handleChange} required><option>Januari (1-15)</option><option>Januari (16-31)</option><option>Februari (1-15)</option><option>Februari (16-28)</option><option>Maret (1-15)</option><option>Maret (16-31)</option><option>April (1-15)</option><option>April (16-30)</option><option>Mei (1-15)</option><option>Mei (16-31)</option><option>Juni (1-15)</option><option>Juni (16-30)</option><option>Juli (1-15)</option><option>Juli (16-31)</option><option>Agustus (1-15)</option><option>Agustus (16-31)</option></SelectField>
            </div>
            <details className="p-3 bg-gray-50 rounded-lg border"><summary className="font-semibold cursor-pointer text-gray-700">Luas Keadaan Serangan (Ha)</summary><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 pt-2 border-t"><InputField label="Ringan" name="luas_serangan_ringan" value={formData.luas_serangan_ringan ?? ''} onChange={handleChange} type="number" /><InputField label="Sedang" name="luas_serangan_sedang" value={formData.luas_serangan_sedang ?? ''} onChange={handleChange} type="number" /><InputField label="Berat" name="luas_serangan_berat" value={formData.luas_serangan_berat ?? ''} onChange={handleChange} type="number" /><InputField label="Puso" name="luas_serangan_puso" value={formData.luas_serangan_puso ?? ''} onChange={handleChange} type="number" /></div></details>
            <details className="p-3 bg-gray-50 rounded-lg border" open><summary className="font-semibold cursor-pointer text-gray-700">Luas Pengendalian (Ha)</summary><div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 pt-2 border-t"><InputField label="PM" name="pengendalian_pm" value={formData.pengendalian_pm ?? ''} onChange={handleChange} type="number" /><InputField label="Kimia" name="pengendalian_kimia" value={formData.pengendalian_kimia ?? ''} onChange={handleChange} type="number" /><InputField label="Nabati" name="pengendalian_nabati" value={formData.pengendalian_nabati ?? ''} onChange={handleChange} type="number" /><InputField label="AH" name="pengendalian_ah" value={formData.pengendalian_ah ?? ''} onChange={handleChange} type="number" /><InputField label="CL" name="pengendalian_cl" value={formData.pengendalian_cl ?? ''} onChange={handleChange} type="number" /></div></details>
            <InputField label="Luas Terancam (Ha)" name="luas_terancam" value={formData.luas_terancam ?? ''} onChange={handleChange} type="number" />
        </div><div className="flex justify-end space-x-2 pt-4 mt-4 border-t"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Simpan</button></div></form></Modal>);
};
const InputField: React.FC<{label:string, name:string, value:string|number, onChange: any, required?:boolean, type?:string}> = ({label, name, value, onChange, required=false, type='text'}) => (<div><label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label><input type={type} name={name} id={name} value={value} onChange={onChange} required={required} min={type === 'number' ? '0' : undefined} step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" /></div>);
const SelectField: React.FC<{label: string, name: string, value: string, onChange: any, required?: boolean, children: React.ReactNode}> = ({ label, name, value, onChange, required = false, children }) => (<div><label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label><select id={name} name={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">{children}</select></div>);

export default AdminDashboard;