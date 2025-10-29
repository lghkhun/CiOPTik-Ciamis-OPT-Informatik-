import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { InformationCircleIcon } from '../components/Icons';
import { getInformasiData } from '../services/informasiService';
import { InformasiOPT, DetailItem } from '../types';

const DetailAccordion: React.FC<{ title: string; content: DetailItem[] }> = ({ title, content }) => {
    if (!content || content.length === 0) {
        return (
            <details className="py-2" open>
                <summary className="font-semibold text-gray-800 text-md cursor-pointer hover:text-green-600 list-item">{title}</summary>
                <div className="text-sm text-gray-500 italic mt-2 pl-4 border-l-2 border-green-200">
                    Informasi detail tidak tersedia.
                </div>
            </details>
        );
    }

    return (
        <details className="py-2" open>
            <summary className="font-semibold text-gray-800 text-md cursor-pointer hover:text-green-600 list-item">{title}</summary>
            <div className="text-sm text-gray-700 space-y-2 mt-2 pl-4 border-l-2 border-green-200">
                {content.length > 1 ? (
                    <ul className="list-disc list-outside ml-5 space-y-4">
                        {content.map((item, index) => (
                           <li key={index}>
                             <span className="prose prose-sm max-w-none">
                                {item.text.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                                   part.startsWith('**') && part.endsWith('**') ? 
                                   <strong key={i}>{part.slice(2, -2)}</strong> : 
                                   part
                                 )}
                             </span>
                             {item.imageUrl && <img src={item.imageUrl} alt={`Detail for ${item.text.substring(0, 20)}`} className="mt-2 rounded-lg shadow-sm w-full max-w-xs object-cover border" />}
                           </li>
                        ))}
                    </ul>
                ) : (
                    <div className="prose prose-sm max-w-none">
                        <p>
                            {content[0].text.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                               part.startsWith('**') && part.endsWith('**') ? 
                               <strong key={i}>{part.slice(2, -2)}</strong> : 
                               part
                             )}
                        </p>
                        {content[0].imageUrl && <img src={content[0].imageUrl} alt={`Detail for ${content[0].text.substring(0, 20)}`} className="mt-2 rounded-lg shadow-sm w-full max-w-xs object-cover border" />}
                    </div>
                )}
            </div>
        </details>
    );
};

const OPTCard: React.FC<{ data: InformasiOPT }> = ({ data }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
        <img 
            src={data.image_url || 'https://i.ibb.co/bF0Zz1p/peta-ciamis.png'} 
            alt={data.title} 
            className="w-full h-48 object-cover bg-gray-100" 
        />
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-800">{data.title}</h3>
            {data.scientific_name && <p className="text-sm text-gray-500 italic mb-2">{data.scientific_name}</p>}
            <p className="text-gray-600 text-sm mb-4 flex-grow">{data.description}</p>
            <div className="divide-y divide-gray-200">
                {Object.entries(data.details).map(([key, value]) => (
                    <DetailAccordion key={key} title={key.replace(/([A-Z])/g, ' $1').trim()} content={value as DetailItem[]} />
                ))}
            </div>
        </div>
    </div>
);

const InformasiPage: React.FC = () => {
  const [hamaData, setHamaData] = useState<InformasiOPT[]>([]);
  const [penyakitData, setPenyakitData] = useState<InformasiOPT[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hama' | 'penyakit'>('hama');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allData = await getInformasiData();
        setHamaData(allData.filter(item => item.category === 'Hama'));
        setPenyakitData(allData.filter(item => item.category === 'Penyakit'));
      } catch (error) {
        console.error("Failed to load information data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const definitions = { opt: 'OPT adalah semua organisme yang dapat merusak, mengganggu kehidupan, atau menyebabkan kematian pada tumbuhan.', optUtama: 'Organisme Pengganggu Tumbuhan yang selalu ada dan menyebabkan kerugian secara ekonomi dengan persentase luas serangan yang lebih besar daripada OPT lainnya baik di tingkat nasional maupun lokal.', };
  const causes = { hama: 'Hama adalah organisme (hewan) yang dapat merusak tanaman dan merugikan secara ekonomi.', penyakit: 'Penyakit tanaman adalah kondisi ketika sel dan jaringan tanaman tidak berfungsi normal, disebabkan oleh patogen (jamur, bakteri, virus).', gulma: 'Tumbuhan yang tumbuh di sekitar tanaman budidaya yang pertumbuhannya tidak dikehendaki dan umumnya merugikan.', };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-12">
          
          <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-8"><div className="flex-shrink-0"><InformationCircleIcon className="h-20 w-20 text-green-600" /></div><div><h1 className="text-3xl font-bold text-gray-800 mb-2">Informasi Organisme Pengganggu Tumbuhan (OPT)</h1><p className="text-gray-600 leading-relaxed">Pelajari definisi, penyebab, gejala, dan mekanisme serangan untuk meningkatkan kewaspadaan dan strategi pengendalian yang efektif.</p></div></div>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Definisi & Penyebab</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-gray-700">
                <div><h3 className="font-semibold text-lg text-gray-800">OPT</h3><p>{definitions.opt}</p></div>
                <div><h3 className="font-semibold text-lg text-gray-800">Hama</h3><p>{causes.hama}</p></div>
                <div><h3 className="font-semibold text-lg text-gray-800">OPT Utama</h3><p>{definitions.optUtama}</p></div>
                <div><h3 className="font-semibold text-lg text-gray-800">Penyakit Tanaman</h3><p>{causes.penyakit}</p></div>
                <div><h3 className="font-semibold text-lg text-gray-800">Gulma</h3><p>{causes.gulma}</p></div>
            </div>
          </section>
          
          <section>
            <div className="text-center"><h2 className="text-3xl font-bold text-gray-800">CONTOH OPT</h2><p className="text-gray-500 mt-2">Berikut adalah beberapa contoh hama dan penyakit yang umum dijumpai.</p></div>
            <div className="mt-8">
                <div className="border-b border-gray-200"><nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs"><button onClick={() => setActiveTab('hama')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm uppercase ${activeTab === 'hama' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Hama</button><button onClick={() => setActiveTab('penyakit')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm uppercase ${activeTab === 'penyakit' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Penyakit</button></nav></div>
                <div className="mt-8">
                  {loading ? (
                    <div className="text-center py-10 text-gray-500">Memuat informasi...</div>
                  ) : (
                    <>
                      {activeTab === 'hama' && (
                        hamaData.length > 0 ?
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{hamaData.map(opt => <OPTCard key={opt.id} data={opt} />)}</div> :
                        <p className="text-center text-gray-500 py-10">Data hama tidak ditemukan. Silakan jalankan skrip SQL dari file README.</p>
                      )}
                      {activeTab === 'penyakit' && (
                         penyakitData.length > 0 ?
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{penyakitData.map(opt => <OPTCard key={opt.id} data={opt} />)}</div> :
                        <p className="text-center text-gray-500 py-10">Data penyakit tidak ditemukan. Silakan jalankan skrip SQL dari file README.</p>
                      )}
                    </>
                  )}
                </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default InformasiPage;