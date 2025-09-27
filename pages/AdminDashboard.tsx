
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import { OPTData, FilterState } from '../types';
import { loadData, saveData } from '../services/dataService';
import { EditIcon, DeleteIcon, ApproveIcon, PlusIcon, UploadIcon } from '../components/Icons';
import Modal from '../components/Modal';
import { useDebounce } from '../hooks/useDebounce';
import HighlightText from '../components/HighlightText';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';

type EnrichedOPTData = OPTData & { 
    luasSeranganTotal: number; 
    luasPengendalianTotal: number;
};

const PIE_CHART_COLORS = ['#10B981', '#F59E0B'];

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
    "Hawar Daun Bakteri (BLB)"
].sort();


const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<OPTData[]>(() => loadData());
  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = localStorage.getItem('adminDashboard_filters');
    if (saved) {
      return JSON.parse(saved);
    }
    const allData = loadData();
    const latestYear = Math.max(...allData.map(d => d.tahun), new Date().getFullYear());
    return {
      tahun: latestYear.toString(),
      periode: 'Semua',
      jenisOpt: 'Semua',
    };
  });
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('adminDashboard_searchTerm') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isDebouncing = searchTerm !== debouncedSearchTerm;
  const [isModalOpen, setModalOpen] = useState(false);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<OPTData | null>(null);
  const [dataToApprove, setDataToApprove] = useState<OPTData | null>(null);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    localStorage.setItem('adminDashboard_filters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('adminDashboard_searchTerm', searchTerm);
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
          String(value).toLowerCase().includes(searchTermLower)
        )
      );
    }
    
    return result;
  }, [data, filters, debouncedSearchTerm]);

  const chartData = useMemo(() => {
    const barChartMap = new Map<string, { name: string; 'Luas Serangan': number; 'Luas Pengendalian': number }>();
    
    filteredData.forEach(item => {
        const entry = barChartMap.get(item.jenisOpt) || { name: item.jenisOpt, 'Luas Serangan': 0, 'Luas Pengendalian': 0 };
        entry['Luas Serangan'] += item.luasSeranganRingan + item.luasSeranganSedang + item.luasSeranganBerat + item.luasSeranganPuso;
        entry['Luas Pengendalian'] += item.pengendalianPM + item.pengendalianKimia + item.pengendalianNabati + item.pengendalianAH + item.pengendalianCL;
        barChartMap.set(item.jenisOpt, entry);
    });
    const barChartData = Array.from(barChartMap.values());

    const pieChartData = [
        { name: 'Approved', value: filteredData.filter(d => d.status === 'Approved').length },
        { name: 'Not Approved', value: filteredData.filter(d => d.status === 'Not Approved').length },
    ].filter(d => d.value > 0);

    return { barChartData, pieChartData };
  }, [filteredData]);

  const enrichedFilteredData = useMemo((): EnrichedOPTData[] => {
    return filteredData.map(item => ({
        ...item,
        luasSeranganTotal: item.luasSeranganRingan + item.luasSeranganSedang + item.luasSeranganBerat + item.luasSeranganPuso,
        luasPengendalianTotal: item.pengendalianPM + item.pengendalianKimia + item.pengendalianNabati + item.pengendalianAH + item.pengendalianCL,
    }));
  }, [filteredData]);


  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingData(null);
    setModalOpen(true);
  };
  
  const openEditModal = (item: OPTData) => {
    setEditingData(item);
    setModalOpen(true);
  };

  const openApproveModal = (item: OPTData) => {
    setDataToApprove(item);
    setApproveModalOpen(true);
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this data? This action cannot be undone.')) {
        setData(data.filter(item => item.id !== id));
    }
  };

  const handleSave = (formData: OPTData) => {
    if(editingData) {
        setData(data.map(d => d.id === formData.id ? formData : d));
    } else {
        const newId = Math.max(...data.map(d => d.id), 0) + 1;
        const newData = {...formData, id: newId };
        setData([...data, newData]);
    }
    setModalOpen(false);
  };

  const handleApprove = () => {
    if(dataToApprove) {
        setData(data.map(d => d.id === dataToApprove.id ? {...d, status: 'Approved'} : d));
    }
    setFileName('');
    setApproveModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
      if (!selectedFile) {
          alert("Please select a file first.");
          return;
      }

      if (!window.confirm(`Are you sure you want to upload and add data from ${selectedFile.name}?`)) {
          return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
          const csvText = event.target?.result as string;
          if (!csvText) {
              alert("File is empty or could not be read.");
              return;
          }

          try {
              const lines = csvText.split(/\r\n|\n/);
              const headers = lines[0].split(',').map(h => h.trim());
              const newRecords: OPTData[] = [];
              const maxId = Math.max(...data.map(d => d.id), 0);

              for (let i = 1; i < lines.length; i++) {
                  const line = lines[i];
                  if (!line.trim()) continue;

                  const values = line.split(',');
                  const record = headers.reduce((obj, header, index) => {
                      // @ts-ignore
                      obj[header] = values[index]?.trim();
                      return obj;
                  }, {} as { [key in keyof OPTData]: any });

                  const newRecord: OPTData = {
                      id: maxId + i,
                      komoditas: String(record.komoditas),
                      jenisOpt: String(record.jenisOpt),
                      provinsi: String(record.provinsi || 'Jawa Barat'),
                      kabKota: String(record.kabKota),
                      tahun: parseInt(record.tahun, 10),
                      periode: String(record.periode),
                      tanggalUpdate: String(record.tanggalUpdate),
                      luasKomoditas: parseFloat(record.luasKomoditas) || 0,
                      luasSeranganRingan: parseFloat(record.luasSeranganRingan) || 0,
                      luasSeranganSedang: parseFloat(record.luasSeranganSedang) || 0,
                      luasSeranganBerat: parseFloat(record.luasSeranganBerat) || 0,
                      luasSeranganPuso: parseFloat(record.luasSeranganPuso) || 0,
                      pengendalianPM: parseFloat(record.pengendalianPM) || 0,
                      pengendalianKimia: parseFloat(record.pengendalianKimia) || 0,
                      pengendalianNabati: parseFloat(record.pengendalianNabati) || 0,
                      pengendalianAH: parseFloat(record.pengendalianAH) || 0,
                      pengendalianCL: parseFloat(record.pengendalianCL) || 0,
                      luasTerancam: parseFloat(record.luasTerancam) || 0,
                      status: 'Not Approved'
                  };
                  
                  if (!newRecord.komoditas || !newRecord.jenisOpt || isNaN(newRecord.tahun)) {
                      throw new Error(`Invalid data on line ${i + 1}.`);
                  }

                  newRecords.push(newRecord);
              }

              setData(prevData => [...prevData, ...newRecords]);
              alert(`${newRecords.length} records successfully uploaded.`);
              setSelectedFile(null);

          } catch (error: any) {
              console.error("CSV Parsing Error:", error);
              alert(`Failed to parse CSV: ${error.message}`);
          }
      };

      reader.readAsText(selectedFile);
  };

  const showLoader = isDebouncing;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Operator Dashboard</h1>
                    <p className="text-gray-500">Manajemen Data Serangan OPT</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={openAddModal} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none">
                        <PlusIcon className="h-5 w-5 mr-2" /> Tambah Data
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-6 border rounded-lg bg-gray-50/50">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Luas Serangan vs. Pengendalian per Jenis OPT (Ha)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                            <Legend />
                            <Bar dataKey="Luas Serangan" fill="#EF4444" />
                            <Bar dataKey="Luas Pengendalian" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Distribusi Status Data</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={chartData.pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} (${(Number(percent ?? 0) * 100).toFixed(0)}%)`}>
                                {chartData.pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="my-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Upload Data via CSV</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Import multiple data entries at once. Ensure the CSV headers match the required data structure. All imported data will have a status of 'Not Approved'.
                </p>
                <div className="flex items-center space-x-4">
                    <label htmlFor="csv-upload" className="flex-shrink-0 cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <span>Choose File</span>
                        <input id="csv-upload" name="csv-upload" type="file" accept=".csv" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <span className="flex-grow text-sm text-gray-600 truncate">
                        {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                    <button 
                        onClick={handleUpload} 
                        disabled={!selectedFile}
                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <UploadIcon className="h-5 w-5 mr-2" /> Upload
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <FilterSelect label="Tahun" name="tahun" value={filters.tahun} options={tahunOptions} onChange={handleFilterChange} />
                <FilterSelect label="Periode" name="periode" value={filters.periode} options={periodeOptions} onChange={handleFilterChange} />
                <FilterSelect label="Jenis OPT" name="jenisOpt" value={filters.jenisOpt} options={jenisOptOptions} onChange={handleFilterChange} />
                <div className="w-full lg:col-span-1">
                    <label htmlFor="search-admin" className="block text-sm font-medium text-gray-700 mb-1">Global Search</label>
                    <input
                        id="search-admin"
                        type="text"
                        placeholder="Search anything..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto relative shadow rounded-lg">
              {showLoader && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              )}
              <table className="min-w-full bg-white divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  <tr>
                    <th rowSpan={3} className="px-2 py-3 border-r">No</th>
                    <th rowSpan={3} className="px-4 py-3 border-r">Kecamatan</th>
                    <th colSpan={5} className="py-2 border-b border-r">Luas Keadaan Serangan OPT (Ha)</th>
                    <th colSpan={6} className="py-2 border-b border-r">Luas Pengendalian (Ha)</th>
                    <th rowSpan={3} className="px-2 py-3 border-r">Luas Terancam</th>
                    <th rowSpan={3} className="px-3 py-3 border-r">Status</th>
                    <th rowSpan={3} className="px-4 py-3">Actions</th>
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
                      <td className="px-4 py-2 whitespace-nowrap text-left"><HighlightText text={item.kabKota} highlight={debouncedSearchTerm} /></td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.luasSeranganRingan.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.luasSeranganSedang.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.luasSeranganBerat.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.luasSeranganPuso.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap font-bold bg-gray-50">{item.luasSeranganTotal.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalianPM.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalianKimia.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalianNabati.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalianAH.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.pengendalianCL.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap font-bold bg-gray-50">{item.luasPengendalianTotal.toFixed(2)}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.luasTerancam.toFixed(2)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          <HighlightText text={item.status} highlight={debouncedSearchTerm} />
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-3">
                            {item.status !== 'Approved' && (
                                <>
                                    <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900" title="Edit"><EditIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900" title="Delete"><DeleteIcon className="w-5 h-5"/></button>
                                    <button onClick={() => openApproveModal(item)} className="text-green-600 hover:text-green-900" title="Approve"><ApproveIcon className="w-5 h-5"/></button>
                                </>
                            )}
                          </div>
                      </td>
                    </tr>
                  )) : null }
                  {!showLoader && enrichedFilteredData.length === 0 && (
                     <tr>
                      <td colSpan={17} className="px-6 py-10 text-center text-sm text-gray-500">No data available for the selected filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </main>

      {isModalOpen && <DataFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initialData={editingData} />}
      
      <Modal isOpen={isApproveModalOpen} onClose={() => setApproveModalOpen(false)} title="Approve Data OPT">
        <div className="space-y-4">
            <p>Anda akan menyetujui data untuk: <br /> <strong className="font-semibold">{dataToApprove?.komoditas} - {dataToApprove?.jenisOpt}</strong></p>
            <p className="text-sm text-gray-600">Harap upload berkas/bukti approve. Data yang telah disetujujui tidak dapat diubah atau dihapus.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700">Berkas / Bukti Approve</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}/>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    {fileName && <p className="text-sm text-green-700 pt-2">{fileName}</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setApproveModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleApprove} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Approve Data</button>
            </div>
        </div>
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
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


interface DataFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: OPTData) => void;
    initialData: OPTData | null;
}

const DataFormModal: React.FC<DataFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<Partial<OPTData>>(initialData || { 
        komoditas: 'Padi',
        provinsi: 'Jawa Barat', 
        status: 'Not Approved',
        tanggalUpdate: new Date().toISOString().split('T')[0],
        tahun: new Date().getFullYear(),
        periode: 'Januari (1-15)',
        jenisOpt: JENIS_OPT_OPTIONS[0],
        kabKota: KECAMATAN_OPTIONS[0],
        luasKomoditas: 0,
        luasSeranganRingan: 0,
        luasSeranganSedang: 0,
        luasSeranganBerat: 0,
        luasSeranganPuso: 0,
        pengendalianPM: 0,
        pengendalianKimia: 0,
        pengendalianNabati: 0,
        pengendalianAH: 0,
        pengendalianCL: 0,
        luasTerancam: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Handle validation for all numeric inputs
        if (e.currentTarget instanceof HTMLInputElement && e.currentTarget.type === 'number') {
            // Treat empty string as 0, otherwise parse the float value
            const parsedValue = value === '' ? 0 : parseFloat(value);
            
            // Ensure the number is not negative and handle non-numeric inputs (which become NaN)
            // If the value is NaN or less than 0, default to 0. Otherwise, use the parsed value.
            const validatedValue = !isNaN(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
            
            setFormData({ ...formData, [name]: validatedValue });
        } else {
            // Handle non-numeric inputs (e.g., dropdowns, date)
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as OPTData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Data OPT' : 'Tambah Data OPT'}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField label="Jenis OPT" name="jenisOpt" value={formData.jenisOpt || ''} onChange={handleChange} required>
                          {JENIS_OPT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </SelectField>
                      <SelectField label="Kecamatan" name="kabKota" value={formData.kabKota || ''} onChange={handleChange} required>
                          {KECAMATAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </SelectField>
                      <InputField label="Tanggal Update" name="tanggalUpdate" value={formData.tanggalUpdate || ''} onChange={handleChange} type="date" required />
                      <InputField label="Tahun" name="tahun" value={formData.tahun ?? ''} onChange={handleChange} type="number" required />
                      <SelectField label="Periode" name="periode" value={formData.periode || 'Januari (1-15)'} onChange={handleChange} required>
                        <option>Januari (1-15)</option><option>Januari (16-31)</option>
                        <option>Februari (1-15)</option><option>Februari (16-28)</option>
                        <option>Maret (1-15)</option><option>Maret (16-31)</option>
                        <option>April (1-15)</option><option>April (16-30)</option>
                        <option>Mei (1-15)</option><option>Mei (16-31)</option>
                        <option>Juni (1-15)</option><option>Juni (16-30)</option>
                        <option>Juli (1-15)</option><option>Juli (16-31)</option>
                        <option>Agustus (1-15)</option><option>Agustus (16-31)</option>
                      </SelectField>
                  </div>

                  <details className="p-3 bg-gray-50 rounded-lg border">
                      <summary className="font-semibold cursor-pointer text-gray-700">Luas Keadaan Serangan (Ha)</summary>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 pt-2 border-t">
                          <InputField label="Ringan" name="luasSeranganRingan" value={formData.luasSeranganRingan ?? ''} onChange={handleChange} type="number" />
                          <InputField label="Sedang" name="luasSeranganSedang" value={formData.luasSeranganSedang ?? ''} onChange={handleChange} type="number" />
                          <InputField label="Berat" name="luasSeranganBerat" value={formData.luasSeranganBerat ?? ''} onChange={handleChange} type="number" />
                          <InputField label="Puso" name="luasSeranganPuso" value={formData.luasSeranganPuso ?? ''} onChange={handleChange} type="number" />
                      </div>
                  </details>

                  <details className="p-3 bg-gray-50 rounded-lg border" open>
                      <summary className="font-semibold cursor-pointer text-gray-700">Luas Pengendalian (Ha)</summary>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 pt-2 border-t">
                          <InputField label="PM" name="pengendalianPM" value={formData.pengendalianPM ?? ''} onChange={handleChange} type="number" />
                          <InputField label="Kimia" name="pengendalianKimia" value={formData.pengendalianKimia ?? ''} onChange={handleChange} type="number" />
                          <InputField label="Nabati" name="pengendalianNabati" value={formData.pengendalianNabati ?? ''} onChange={handleChange} type="number" />
                          <InputField label="AH" name="pengendalianAH" value={formData.pengendalianAH ?? ''} onChange={handleChange} type="number" />
                          <InputField label="CL" name="pengendalianCL" value={formData.pengendalianCL ?? ''} onChange={handleChange} type="number" />
                      </div>
                  </details>

                  <InputField label="Luas Terancam (Ha)" name="luasTerancam" value={formData.luasTerancam ?? ''} onChange={handleChange} type="number" />
                </div>

                 <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Simpan</button>
                </div>
            </form>
        </Modal>
    );
};

const InputField: React.FC<{label:string, name:string, value:string|number, onChange: any, required?:boolean, type?:string}> = ({label, name, value, onChange, required=false, type='text'}) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input 
            type={type} 
            name={name} 
            id={name} 
            value={value} 
            onChange={onChange} 
            required={required} 
            min={type === 'number' ? '0' : undefined}
            step="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" 
        />
    </div>
);

const SelectField: React.FC<{label: string, name: string, value: string, onChange: any, required?: boolean, children: React.ReactNode}> = ({ label, name, value, onChange, required = false, children }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
            {children}
        </select>
    </div>
);

export default AdminDashboard;