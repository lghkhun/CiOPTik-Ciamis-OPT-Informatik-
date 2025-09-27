
import React from 'react';
import Header from '../components/Header';
import { InformationCircleIcon, LeafIcon, EggIcon, LarvaIcon, PupaIcon, AdultInsectIcon, ArrowRightIcon, BabyMouseIcon, AdultMouseIcon, SporeIcon, LeafSpotIcon, SporeReleaseIcon, BacteriaIcon, InfectedLeafIcon, WaterDropIcon } from '../components/Icons';

const optData = [
  {
    title: 'Penggerek Batang Padi',
    types: [
      'Penggerek batang padi kuning (Scirpophaga interculas)',
      'Penggerek batang padi putih (Scirpophaga innotata)',
      'Penggerek batang padi bergaris (Chilo suppressalis)',
      'Penggerek batang padi bergaris merah jambu (Sesamia inferens)',
    ],
    gejala: 'Sundep (anakan kerdil atau mati) dan beluk (malai hampa).',
    mekanisme: 'Larva memakan sistem pembuluh tanaman di dalam batang.',
  },
  {
    title: 'Wereng Batang Coklat (WBC)',
    namaIlmiah: 'Nilaparvata lugens',
    gejala: 'Tanaman menguning dan cepat kering, mengumpul pada satu lokasi dan melingkat (disebut hopperburn).',
    mekanisme: 'Menghisap cairan tanaman pada sistem pembuluh tanaman.',
  },
  {
    title: 'Tikus',
    namaIlmiah: 'Rattus sp.',
    gejala: 'Merusak pada semua fase pertumbuhan, dapat menyebabkan kerusakan besar jika serangan terjadi setelah pembentukan primordia.',
    mekanisme: 'Memakan titik tumbuh, atau memotong pangkal batang untuk memakan butir gabah. Menyerang pada malam hari dan bersembunyi di lubang pada siang hari.',
  },
  {
    title: 'Blast',
    namaIlmiah: 'Pyricularia grisea',
    gejala: 'Bercak berbentuk belah ketupat pada daun, berkembang menjadi warna abu-abu pada bagian tengah.',
    mekanisme: 'Infeksi jamur yang menyebar melalui spora dan menyerang daun, batang, dan malai.',
  },
  {
    title: 'Hawar Daun Bakteri (BLB)',
    namaIlmiah: 'Xanthomonas campestris pv. Oryzae',
    gejala: 'Bercak berwarna kuning sampai putih berawal dari terbentuknya garis lembab berair pada bagian tepi daun.',
    mekanisme: 'Bakteri menginfeksi masuk ke sistem vaskular tanaman melalui akar dan daun yang rusak.',
  },
];

const LifecycleStage: React.FC<{ icon: React.FC<any>, title: string, duration: string }> = ({ icon: Icon, title, duration }) => (
    <div className="flex flex-col items-center text-center w-24">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 border">
            <Icon className="w-10 h-10 text-gray-600" />
        </div>
        <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{duration}</p>
    </div>
);

const InformasiPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-12">
          {/* About Section */}
          <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-20 w-20 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Tentang Platform CiOPTik</h1>
                <p className="text-gray-600 leading-relaxed">
                  <strong>CiOPTik (Ciamis OPT Informatik)</strong> adalah Sistem Pelaporan, Rekapitulasi, dan Analisis Data Serangan Organisme Pengganggu Tumbuhan (OPT) yang dirancang khusus untuk wilayah Kabupaten Ciamis. Platform ini bertujuan untuk memodernisasi proses pengumpulan data, menyediakan visualisasi yang interaktif, dan memanfaatkan kecerdasan buatan (AI) untuk analisis mendalam. Dengan adanya sistem ini, diharapkan para pemangku kepentingan dapat membuat keputusan yang lebih cepat dan tepat dalam upaya pengendalian OPT, sehingga dapat meningkatkan ketahanan pangan dan kesejahteraan petani di Kabupaten Ciamis.
                </p>
              </div>
            </div>
          </section>
          
          {/* OPT Information Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Materi Organisme Pengganggu Tumbuhan (OPT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {optData.map((opt, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                   <div className="flex items-center mb-4">
                     <LeafIcon className="h-6 w-6 text-green-500 mr-3" />
                     <h3 className="text-xl font-bold text-gray-800">{opt.title}</h3>
                   </div>

                  <div className="space-y-3 text-gray-700 text-sm flex-grow">
                    {opt.namaIlmiah && <p><strong>Nama Ilmiah:</strong> <em className="italic">{opt.namaIlmiah}</em></p>}
                    {opt.types && (
                      <div>
                        <strong>Jenis:</strong>
                        <ul className="list-disc list-inside pl-2 mt-1">
                          {opt.types.map((type, i) => <li key={i}>{type}</li>)}
                        </ul>
                      </div>
                    )}
                    <p><strong>Gejala:</strong> {opt.gejala}</p>
                    <p><strong>Mekanisme:</strong> {opt.mekanisme}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Life Cycle Section */}
           <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Siklus Hidup OPT Umum</h2>
                <div className="space-y-10">
                    {/* Penggerek Batang Padi */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center sm:text-left">Siklus Hidup: Penggerek Batang Padi</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-4 flex-wrap">
                            <LifecycleStage icon={EggIcon} title="Telur" duration="5-8 Hari" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={LarvaIcon} title="Larva" duration="20-30 Hari" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={PupaIcon} title="Pupa" duration="6-10 Hari" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={AdultInsectIcon} title="Dewasa (Imago)" duration="5-10 Hari" />
                        </div>
                    </div>
                    {/* Wereng Batang Coklat */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center sm:text-left">Siklus Hidup: Wereng Batang Coklat</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-4 flex-wrap">
                            <LifecycleStage icon={EggIcon} title="Telur" duration="7-9 Hari" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={LarvaIcon} title="Nimfa" duration="13-15 Hari" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={AdultInsectIcon} title="Dewasa (Imago)" duration="14-28 Hari" />
                        </div>
                    </div>
                    {/* Tikus */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center sm:text-left">Siklus Hidup: Tikus</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-4 flex-wrap">
                            <LifecycleStage icon={AdultMouseIcon} title="Masa Bunting" duration="21-24 Hari" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={BabyMouseIcon} title="Anak Lahir" duration="Menyusu 21 Hari" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={AdultMouseIcon} title="Dewasa" duration="Siap Kawin 6-8 Minggu" />
                        </div>
                    </div>
                    {/* Blast */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center sm:text-left">Siklus Penyakit: Blast (Pyricularia grisea)</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-4 flex-wrap">
                            <LifecycleStage icon={SporeIcon} title="Spora & Infeksi" duration="< 24 Jam" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={LeafSpotIcon} title="Lesi Muncul" duration="3-5 Hari" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={SporeReleaseIcon} title="Sporulasi" duration="Menyebar Kembali" />
                        </div>
                    </div>
                    {/* Hawar Daun Bakteri (BLB) */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center sm:text-left">Siklus Penyakit: Hawar Daun Bakteri (BLB)</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-4 flex-wrap">
                            <LifecycleStage icon={BacteriaIcon} title="Bakteri Masuk" duration="Melalui Luka" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={InfectedLeafIcon} title="Gejala Muncul" duration="3-5 Hari" />
                            <ArrowRightIcon className="w-8 h-8 text-gray-400 rotate-90 sm:rotate-0" />
                            <LifecycleStage icon={WaterDropIcon} title="Penyebaran" duration="Via Percikan Air" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </main>
    </div>
  );
};

export default InformasiPage;
