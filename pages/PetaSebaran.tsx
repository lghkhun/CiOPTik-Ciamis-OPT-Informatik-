import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import { LeafIcon } from '../components/Icons';
import { loadData } from '../services/dataService';
import { OPTData } from '../types';

interface MapFilterState {
  tahun: string;
  periode: string;
  jenisOpt: string;
}

type RiskLevel = 'Rendah' | 'Sedang' | 'Tinggi' | 'N/A';

const kecamatanHotspots = [
    { name: 'Sukamantri', top: '5%', left: '32%', width: '12%', height: '8%' },
    { name: 'Panawangan', top: '10%', left: '42%', width: '14%', height: '8%' },
    { name: 'Panumbangan', top: '18%', left: '18%', width: '15%', height: '10%' },
    { name: 'Panjalu', top: '20%', left: '28%', width: '10%', height: '8%' },
    { name: 'Lumbung', top: '24%', left: '35%', width: '10%', height: '8%' },
    { name: 'Kawali', top: '23%', left: '42%', width: '10%', height: '8%' },
    { name: 'Jatinagara', top: '27%', left: '48%', width: '12%', height: '8%' },
    { name: 'Rajadesa', top: '25%', left: '55%', width: '12%', height: '8%' },
    { name: 'Rancah', top: '30%', left: '65%', width: '12%', height: '10%' },
    { name: 'Cihaurbeuti', top: '30%', left: '15%', width: '14%', height: '10%' },
    { name: 'Sadananya', top: '35%', left: '25%', width: '12%', height: '8%' },
    { name: 'Cipaku', top: '34%', left: '42%', width: '12%', height: '10%' },
    { name: 'Baregbeg', top: '43%', left: '35%', width: '10%', height: '8%' },
    { name: 'Sukadana', top: '38%', left: '55%', width: '12%', height: '10%' },
    { name: 'Tambaksari', top: '35%', left: '73%', width: '13%', height: '10%' },
    { name: 'Cisaga', top: '45%', left: '68%', width: '12%', height: '10%' },
    { name: 'Sindangkasih', top: '43%', left: '18%', width: '14%', height: '8%' },
    { name: 'Cikoneng', top: '45%', left: '28%', width: '12%', height: '8%' },
    { name: 'Ciamis', top: '50%', left: '35%', width: '10%', height: '8%' },
    { name: 'Cijeungjing', top: '51%', left: '45%', width: '14%', height: '8%' },
    { name: 'Cimaragas', top: '58%', left: '48%', width: '12%', height: '8%' },
    { name: 'Cidolog', top: '65%', left: '42%', width: '12%', height: '10%' },
    { name: 'Pamarican', top: '68%', left: '50%', width: '15%', height: '12%' },
    { name: 'Lakbok', top: '60%', left: '75%', width: '12%', height: '8%' },
    { name: 'Purwadadi', top: '65%', left: '68%', width: '14%', height: '10%' },
    { name: 'Banjarsari', top: '78%', left: '58%', width: '15%', height: '12%' },
    { name: 'Banjaranyar', top: '80%', left: '45%', width: '15%', height: '12%' },
];

const PetaSebaran: React.FC = () => {
    const [data, setData] = useState<OPTData[]>([]);
    const [filters, setFilters] = useState<MapFilterState>({
        tahun: '2025',
        periode: 'Semua',
        jenisOpt: 'Semua',
    });
    const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);

    useEffect(() => {
        const allData = loadData();
        const approvedData = allData.filter(item => item.status === 'Approved');
        setData(approvedData);
    }, []);

    // --- Cascading Filter Logic ---
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

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // --- Data Aggregation for Map ---
    const riskData = useMemo(() => {
        const result: { [key: string]: { risk: RiskLevel, totalSerangan: number, totalPengendalian: number, reports: number } } = {};

        const filteredData = data.filter(item => 
            (filters.tahun === 'Semua' || item.tahun.toString() === filters.tahun) &&
            (filters.periode === 'Semua' || item.periode === filters.periode) &&
            (filters.jenisOpt === 'Semua' || item.jenisOpt === filters.jenisOpt)
        );

        kecamatanHotspots.forEach(hotspot => {
            const kecamatanData = filteredData.filter(d => d.kabKota === hotspot.name);
            const totalSerangan = kecamatanData.reduce((acc, curr) => acc + curr.luasSeranganRingan + curr.luasSeranganSedang + curr.luasSeranganBerat + curr.luasSeranganPuso, 0);
            const totalPengendalian = kecamatanData.reduce((acc, curr) => acc + curr.pengendalianPM + curr.pengendalianKimia + curr.pengendalianNabati + curr.pengendalianAH + curr.pengendalianCL, 0);
            
            let risk: RiskLevel = 'N/A';
            if (totalSerangan > 50) risk = 'Tinggi';
            else if (totalSerangan > 10) risk = 'Sedang';
            else if (totalSerangan > 0) risk = 'Rendah';
            
            result[hotspot.name] = {
                risk,
                totalSerangan,
                totalPengendalian,
                reports: kecamatanData.length,
            };
        });

        return result;

    }, [data, filters]);

    const getRiskColor = (risk: RiskLevel) => {
        switch (risk) {
            case 'Tinggi': return 'bg-red-100 border-red-300 text-red-800';
            case 'Sedang': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'Rendah': return 'bg-green-100 border-green-300 text-green-800';
            default: return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };
    
    const getRiskOverlayColor = (risk: RiskLevel) => {
        switch (risk) {
            case 'Tinggi': return 'bg-red-500/40 border-red-700 hover:bg-red-500/60';
            case 'Sedang': return 'bg-yellow-400/40 border-yellow-600 hover:bg-yellow-400/60';
            case 'Rendah': return 'bg-green-500/40 border-green-700 hover:bg-green-500/60';
            default: return 'bg-gray-500/20 border-gray-500 hover:bg-gray-500/40';
        }
    };

    const selectedKecamatanData = selectedKecamatan ? riskData[selectedKecamatan] : null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Peta Sebaran OPT</h1>
                    <p className="text-gray-500 mb-6">Visualisasi data serangan OPT per kecamatan di Kabupaten Ciamis.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                         <FilterSelect label="Tahun" name="tahun" value={filters.tahun} options={tahunOptions} onChange={handleFilterChange} />
                         <FilterSelect label="Periode" name="periode" value={filters.periode} options={periodeOptions} onChange={handleFilterChange} />
                         <FilterSelect label="Jenis OPT" name="jenisOpt" value={filters.jenisOpt} options={jenisOptOptions} onChange={handleFilterChange} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 p-4 border rounded-lg bg-gray-50/50">
                            <div className="relative w-full max-w-3xl mx-auto aspect-[4/3]">
                                <img 
                                    src="https://i.ibb.co/bF0Zz1p/peta-ciamis.png" 
                                    alt="Peta Kabupaten Ciamis"
                                    className="absolute top-0 left-0 w-full h-full object-contain"
                                />
                                {kecamatanHotspots.map(hotspot => {
                                    const data = riskData[hotspot.name] || { risk: 'N/A', totalSerangan: 0, reports: 0 };
                                    return (
                                        <div
                                            key={hotspot.name}
                                            onClick={() => setSelectedKecamatan(hotspot.name)}
                                            style={{ 
                                                top: hotspot.top, 
                                                left: hotspot.left,
                                                width: hotspot.width,
                                                height: hotspot.height,
                                            }}
                                            className={`absolute flex items-center justify-center p-1 rounded-md cursor-pointer transition-all duration-200 border
                                                ${getRiskOverlayColor(data.risk)}
                                                ${selectedKecamatan === hotspot.name ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                                            `}
                                            title={hotspot.name}
                                            aria-label={`Select ${hotspot.name}`}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <span className="text-white text-[7px] sm:text-[9px] font-bold text-shadow-sm" style={{textShadow: '1px 1px 2px black'}}>{hotspot.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                             <div className="p-4 border rounded-lg bg-white shadow-sm sticky top-24">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Wilayah</h3>
                                {selectedKecamatan && selectedKecamatanData ? (
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-bold text-green-700">{selectedKecamatan}</h4>
                                        <p><strong>Status Risiko:</strong> <span className={`px-2 py-0.5 rounded-full text-sm ${getRiskColor(selectedKecamatanData.risk)}`}>{selectedKecamatanData.risk}</span></p>
                                        <p><strong>Total Laporan:</strong> {selectedKecamatanData.reports} laporan</p>
                                        <p><strong>Total Serangan:</strong> {selectedKecamatanData.totalSerangan.toFixed(2)} Ha</p>
                                        <p><strong>Total Pengendalian:</strong> {selectedKecamatanData.totalPengendalian.toFixed(2)} Ha</p>
                                        <p className="text-xs text-gray-500 pt-4">Data berdasarkan filter yang dipilih. Klik kecamatan lain untuk melihat detailnya.</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <LeafIcon className="h-12 w-12 mx-auto text-gray-300" />
                                        <p className="mt-2">Pilih sebuah kecamatan pada peta untuk melihat detail informasi.</p>
                                    </div>
                                )}
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">Legenda</h4>
                                    <div className="space-y-1">
                                        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-red-500/40 mr-2 border border-red-700"></div><span>Risiko Tinggi (&gt; 50 Ha)</span></div>
                                        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-yellow-400/40 mr-2 border border-yellow-600"></div><span>Risiko Sedang (10-50 Ha)</span></div>
                                        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-green-500/40 mr-2 border border-green-700"></div><span>Risiko Rendah (&gt; 0 Ha)</span></div>
                                        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-gray-500/20 mr-2 border border-gray-500"></div><span>Data Tidak Tersedia</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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
            {options.map(opt => <option key={opt.toString()} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default PetaSebaran;