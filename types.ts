export interface OPTData {
  id: number;
  komoditas: string;
  jenisOpt: string;
  provinsi: string;
  kabKota: string; // Kecamatan
  tahun: number;
  periode: string;
  tanggalUpdate: string;
  luasKomoditas: number;
  luasSeranganRingan: number;
  luasSeranganSedang: number;
  luasSeranganBerat: number;
  luasSeranganPuso: number;
  pengendalianPM: number;
  pengendalianKimia: number;
  pengendalianNabati: number;
  pengendalianAH: number;
  pengendalianCL: number;
  luasTerancam: number;
  status: 'Not Approved' | 'Approved';
}

export interface FilterState {
  tahun: string;
  periode: string;
  jenisOpt: string;
}
