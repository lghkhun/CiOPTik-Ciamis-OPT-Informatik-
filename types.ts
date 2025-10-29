export interface OPTData {
  id: number;
  komoditas: 'Padi' | 'Palawija' | 'Buah';
  jenis_opt: string;
  provinsi: string;
  kab_kota: string; // Kecamatan
  tahun: number;
  periode: string;
  tanggal_update: string;
  luas_komoditas: number;
  luas_serangan_ringan: number;
  luas_serangan_sedang: number;
  luas_serangan_berat: number;
  luas_serangan_puso: number;
  pengendalian_pm: number;
  pengendalian_kimia: number;
  pengendalian_nabati: number;
  pengendalian_ah: number;
  pengendalian_cl: number;
  luas_terancam: number;
  status: 'Not Approved' | 'Approved';
}

export interface FilterState {
  tahun: string;
  periode: string;
  jenis_opt: string;
  kab_kota: string;
  komoditas: string;
}

export interface DetailItem {
  text: string;
  imageUrl: string | null;
}

export interface InformasiOPT {
  id: string;
  category: 'Hama' | 'Penyakit';
  title: string;
  scientific_name?: string;
  image_url: string | null;
  description: string;
  details: {
    [key: string]: DetailItem[];
  };
}

export interface Feedback {
  id: string;
  name: string;
  email?: string;
  whatsapp?: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read';
}