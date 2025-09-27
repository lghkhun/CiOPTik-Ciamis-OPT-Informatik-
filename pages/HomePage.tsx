
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { ChartBarIcon, SparklesIcon, DatabaseIcon } from '../components/Icons';

const features = [
    {
        name: 'Pelaporan Data Real-time',
        description: 'Sistem pelaporan yang efisien untuk mengumpulkan data serangan OPT dari seluruh wilayah Kabupaten Ciamis.',
        icon: DatabaseIcon,
    },
    {
        name: 'Visualisasi Interaktif',
        description: 'Analisis data menjadi lebih mudah dengan grafik dan diagram yang dinamis dan interaktif.',
        icon: ChartBarIcon,
    },
    {
        name: 'Analisis Cerdas AI',
        description: 'Dapatkan wawasan mendalam dan prediksi tren serangan OPT didukung oleh teknologi AI Gemini.',
        icon: SparklesIcon,
    },
];

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-20 sm:py-24 lg:py-32">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                            Selamat Datang di CiOPTik
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-green-100">
                           CiOPTik (Ciamis OPT Informatik): Sistem Pelaporan, Rekapitulasi, dan Analisis Data Serangan OPT di Kabupaten Ciamis.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link 
                                to="/data"
                                className="w-full sm:w-auto inline-block px-8 py-3 bg-white text-green-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
                            >
                                Lihat Data Publik
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 sm:py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800">Fitur Utama Kami</h2>
                            <p className="mt-4 text-lg text-gray-600">Alat canggih untuk memonitor dan menganalisis data OPT secara efektif.</p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature) => (
                                <div key={feature.name} className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                                        <feature.icon className="w-6 h-6" aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold text-gray-900">{feature.name}</h3>
                                    <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="bg-gray-100 py-16 sm:py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                           Siap Menjelajahi Data?
                        </h2>
                        <p className="mt-4 text-lg leading-6 text-gray-600">
                           Akses data publik terkini dan mulai analisis Anda sekarang.
                        </p>
                        <Link
                            to="/data"
                            className="mt-8 inline-block rounded-md border border-transparent bg-green-600 px-10 py-3 text-base font-medium text-white shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
                        >
                            Mulai Analisis Data
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t">
                <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Dinas Pertanian dan Ketahanan Pangan Kabupaten Ciamis. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;