import { OPTData } from '../types';

const STORAGE_KEY = 'cioptik_opt_data';

let idCounter = 1;

const createEntry = (
  kecamatan: string, 
  jenisOpt: string, 
  periode: string,
  tahun: number,
  serangan: {r: number, s: number, b: number, p: number}, 
  pengendalian: {pm: number, k: number, n: number, ah: number, cl: number},
  luasTerancam: number,
  tanggal: string
): OPTData => {
    return {
        id: idCounter++,
        komoditas: 'Padi',
        jenisOpt: jenisOpt,
        provinsi: 'Jawa Barat',
        kabKota: kecamatan,
        tahun: tahun,
        periode: periode,
        tanggalUpdate: tanggal,
        luasKomoditas: 0, 
        luasSeranganRingan: Math.max(0, serangan.r),
        luasSeranganSedang: Math.max(0, serangan.s),
        luasSeranganBerat: Math.max(0, serangan.b),
        luasSeranganPuso: Math.max(0, serangan.p),
        pengendalianPM: Math.max(0, pengendalian.pm),
        pengendalianKimia: Math.max(0, pengendalian.k),
        pengendalianNabati: Math.max(0, pengendalian.n),
        pengendalianAH: Math.max(0, pengendalian.ah),
        pengendalianCL: Math.max(0, pengendalian.cl),
        luasTerancam: Math.max(0, luasTerancam),
        status: 'Approved',
    };
};

const mockOptData: OPTData[] = [
    // --- JANUARI 2025 ---
    // 1-15
    createEntry("Cikoneng", "Penggerek Batang", "Januari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:9,cl:0}, 15, "2025-01-15"),
    createEntry("Lumbung", "Penggerek Batang", "Januari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 106, "2025-01-15"),
    createEntry("Panumbangan", "Penggerek Batang", "Januari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:3,k:0,n:0,ah:6,cl:0}, 20, "2025-01-15"),
    createEntry("Sukadana", "Wereng Batang Coklat (WBC)", "Januari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 99, "2025-01-15"),
    createEntry("Banjarsari", "Tikus", "Januari (1-15)", 2025, {r:21,s:0,b:0,p:0}, {pm:4,k:7,n:0,ah:0,cl:0}, 11, "2025-01-15"),
    createEntry("Sadananya", "Tikus", "Januari (1-15)", 2025, {r:16,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:16}, 22, "2025-01-15"),
    createEntry("Tambaksari", "Blast", "Januari (1-15)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 0, "2025-01-15"),
    createEntry("Rajadesa", "Blast", "Januari (1-15)", 2025, {r:6,s:0,b:0,p:0}, {pm:3,k:0,n:0,ah:0,cl:0}, 3, "2025-01-15"),
    createEntry("Panawangan", "Blast", "Januari (1-15)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 2, "2025-01-15"),
    createEntry("Lakbok", "Hawar Daun Bakteri (BLB)", "Januari (1-15)", 2025, {r:4,s:0,b:0,p:0}, {pm:4,k:0,n:0,ah:0,cl:0}, 21, "2025-01-15"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Januari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:12,n:0,ah:0,cl:0}, 0, "2025-01-15"),
    createEntry("Lumbung", "Hawar Daun Bakteri (BLB)", "Januari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 10, "2025-01-15"),
    createEntry("Sukamantri", "Hawar Daun Bakteri (BLB)", "Januari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:1,ah:0,cl:0}, 29, "2025-01-15"),
    // 16-31
    createEntry("Cidolog", "Penggerek Batang", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:3}, 3, "2025-01-31"),
    createEntry("Cijeungjing", "Penggerek Batang", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:18,ah:0,cl:0}, 20, "2025-01-31"),
    createEntry("Cikoneng", "Penggerek Batang", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:24,cl:0}, 0, "2025-01-31"),
    createEntry("Sindangkasih", "Penggerek Batang", "Januari (16-31)", 2025, {r:6,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 12, "2025-01-31"),
    createEntry("Jatinagara", "Penggerek Batang", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 14, "2025-01-31"),
    createEntry("Kawali", "Penggerek Batang", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:1,n:0,ah:5,cl:0}, 30, "2025-01-31"),
    createEntry("Lumbung", "Penggerek Batang", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:1,n:0,ah:2,cl:0}, 40, "2025-01-31"),
    createEntry("Banjarsari", "Tikus", "Januari (16-31)", 2025, {r:17,s:0,b:0,p:0}, {pm:2,k:5,n:0,ah:0,cl:0}, 0, "2025-01-31"),
    createEntry("Rancah", "Tikus", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 0, "2025-01-31"),
    createEntry("Cijeungjing", "Blast", "Januari (16-31)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 0, "2025-01-31"),
    createEntry("Tambaksari", "Blast", "Januari (16-31)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 30, "2025-01-31"),
    createEntry("Rajadesa", "Blast", "Januari (16-31)", 2025, {r:6,s:0,b:0,p:0}, {pm:3,k:0,n:0,ah:0,cl:0}, 0, "2025-01-31"),
    createEntry("Panawangan", "Blast", "Januari (16-31)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 2, "2025-01-31"),
    createEntry("Lakbok", "Hawar Daun Bakteri (BLB)", "Januari (16-31)", 2025, {r:1,s:0,b:0,p:0}, {pm:1,k:0,n:0,ah:0,cl:0}, 0, "2025-01-31"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:15,n:0,ah:0,cl:0}, 0, "2025-01-31"),
    createEntry("Lumbung", "Hawar Daun Bakteri (BLB)", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:6,n:0,ah:0,cl:0}, 25, "2025-01-31"),
    createEntry("Panjalu", "Hawar Daun Bakteri (BLB)", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:4,n:0,ah:0,cl:0}, 0, "2025-01-31"),
    createEntry("Sukamantri", "Hawar Daun Bakteri (BLB)", "Januari (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:1,ah:0,cl:0}, 0, "2025-01-31"),

    // --- FEBRUARI 2025 ---
    // 1-15
    createEntry("Cimaragas", "Penggerek Batang", "Februari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:12,n:0,ah:0,cl:0}, 3, "2025-02-15"),
    createEntry("Cikoneng", "Penggerek Batang", "Februari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:27,cl:0}, 0, "2025-02-15"),
    createEntry("Banjarsari", "Tikus", "Februari (1-15)", 2025, {r:15,s:0,b:0,p:0}, {pm:0,k:18,n:0,ah:0,cl:0}, 134, "2025-02-15"),
    createEntry("Sindangkasih", "Tikus", "Februari (1-15)", 2025, {r:5,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:10}, 22, "2025-02-15"),
    createEntry("Jatinagara", "Tikus", "Februari (1-15)", 2025, {r:9,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:9}, 0, "2025-02-15"),
    createEntry("Banjarsari", "Blast", "Februari (1-15)", 2025, {r:33,s:0,b:0,p:0}, {pm:0,k:7,n:0,ah:0,cl:0}, 0, "2025-02-15"),
    createEntry("Banjaranyar", "Blast", "Februari (1-15)", 2025, {r:18,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:15}, 15, "2025-02-15"),
    createEntry("Tambaksari", "Blast", "Februari (1-15)", 2025, {r:5,s:0,b:0,p:0}, {pm:0,k:1,n:0,ah:0,cl:6}, 10, "2025-02-15"),
    createEntry("Rajadesa", "Blast", "Februari (1-15)", 2025, {r:6,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:1}, 0, "2025-02-15"),
    createEntry("Jatinagara", "Blast", "Februari (1-15)", 2025, {r:9,s:0,b:0,p:0}, {pm:0,k:1,n:0,ah:0,cl:9}, 21, "2025-02-15"),
    createEntry("Pamarican", "Hawar Daun Bakteri (BLB)", "Februari (1-15)", 2025, {r:13,s:0,b:0,p:0}, {pm:0,k:10,n:0,ah:0,cl:3}, 10, "2025-02-15"),
    createEntry("Cimaragas", "Hawar Daun Bakteri (BLB)", "Februari (1-15)", 2025, {r:8,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:8}, 2, "2025-02-15"),
    createEntry("Ciamis", "Hawar Daun Bakteri (BLB)", "Februari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:10,n:0,ah:0,cl:0}, 22, "2025-02-15"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Februari (1-15)", 2025, {r:6,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:27,cl:0}, 16, "2025-02-15"),
    createEntry("Cipaku", "Hawar Daun Bakteri (BLB)", "Februari (1-15)", 2025, {r:7,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:3,cl:3}, 4, "2025-02-15"),
    createEntry("Panjalu", "Hawar Daun Bakteri (BLB)", "Februari (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:9}, 35, "2025-02-15"),
    // 16-28
    createEntry("Cidolog", "Penggerek Batang", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:3}, 3, "2025-02-28"),
    createEntry("Cikoneng", "Penggerek Batang", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:27,cl:0}, 0, "2025-02-28"),
    createEntry("Jatinagara", "Penggerek Batang", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:6}, 14, "2025-02-28"),
    createEntry("Kawali", "Penggerek Batang", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:3}, 7, "2025-02-28"),
    createEntry("Panumbangan", "Penggerek Batang", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 22, "2025-02-28"),
    createEntry("Lakbok", "Wereng Batang Coklat (WBC)", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:50,n:0,ah:0,cl:0}, 76, "2025-02-28"),
    createEntry("Lakbok", "Tikus", "Februari (16-28)", 2025, {r:6,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 10, "2025-02-28"),
    createEntry("Panawangan", "Tikus", "Februari (16-28)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 7, "2025-02-28"),
    createEntry("Banjarsari", "Blast", "Februari (16-28)", 2025, {r:33,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 0, "2025-02-28"),
    createEntry("Banjaranyar", "Blast", "Februari (16-28)", 2025, {r:15,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 15, "2025-02-28"),
    createEntry("Lakbok", "Blast", "Februari (16-28)", 2025, {r:13,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 13, "2025-02-28"),
    createEntry("Pamarican", "Blast", "Februari (16-28)", 2025, {r:9,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 11, "2025-02-28"),
    createEntry("Cidolog", "Blast", "Februari (16-28)", 2025, {r:8,s:0,b:0,p:0}, {pm:0,k:8,n:0,ah:0,cl:0}, 0, "2025-02-28"),
    createEntry("Cisaga", "Blast", "Februari (16-28)", 2025, {r:9,s:0,b:0,p:0}, {pm:0,k:9,n:0,ah:0,cl:0}, 9, "2025-02-28"),
    createEntry("Tambaksari", "Blast", "Februari (16-28)", 2025, {r:5,s:0,b:0,p:0}, {pm:0,k:4,n:0,ah:0,cl:10}, 35, "2025-02-28"),
    createEntry("Rancah", "Blast", "Februari (16-28)", 2025, {r:5,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:5}, 20, "2025-02-28"),
    createEntry("Rajadesa", "Blast", "Februari (16-28)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 0, "2025-02-28"),
    createEntry("Ciamis", "Blast", "Februari (16-28)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 4, "2025-02-28"),
    createEntry("Cipaku", "Blast", "Februari (16-28)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 0, "2025-02-28"),
    createEntry("Jatinagara", "Blast", "Februari (16-28)", 2025, {r:9,s:0,b:0,p:0}, {pm:0,k:9,n:0,ah:0,cl:0}, 21, "2025-02-28"),
    createEntry("Sukamantri", "Blast", "Februari (16-28)", 2025, {r:2,s:0,b:0,p:0}, {pm:0,k:2,n:0,ah:0,cl:0}, 3, "2025-02-28"),
    createEntry("Lakbok", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:10,n:50,ah:0,cl:0}, 163, "2025-02-28"),
    createEntry("Pamarican", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:19,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 18, "2025-02-28"),
    createEntry("Cidolog", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:8,s:0,b:0,p:0}, {pm:0,k:14,n:0,ah:0,cl:0}, 6, "2025-02-28"),
    createEntry("Cimaragas", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:8,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:12}, 6, "2025-02-28"),
    createEntry("Sukadana", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:10,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 25, "2025-02-28"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:27,cl:0}, 27, "2025-02-28"),
    createEntry("Sindangkasih", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:6,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 6, "2025-02-28"),
    createEntry("Sadananya", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:12,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 24, "2025-02-28"),
    createEntry("Cipaku", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:7,s:0,b:0,p:0}, {pm:0,k:3,n:3,ah:3,cl:3}, 4, "2025-02-28"),
    createEntry("Kawali", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:3,cl:3}, 23, "2025-02-28"),
    createEntry("Lumbung", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:1,cl:2}, 10, "2025-02-28"),
    createEntry("Sukamantri", "Hawar Daun Bakteri (BLB)", "Februari (16-28)", 2025, {r:4,s:0,b:0,p:0}, {pm:0,k:4,n:0,ah:0,cl:0}, 6, "2025-02-28"),

    // --- MARET 2025 ---
    // 1-15
    createEntry("Pamarican", "Penggerek Batang", "Maret (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:14,n:0,ah:0,cl:0}, 0, "2025-03-15"),
    createEntry("Cimaragas", "Penggerek Batang", "Maret (1-15)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:3}, 3, "2025-03-15"),
    createEntry("Cisaga", "Penggerek Batang", "Maret (1-15)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:3}, 2, "2025-03-15"),
    createEntry("Cikoneng", "Penggerek Batang", "Maret (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:27,cl:0}, 0, "2025-03-15"),
    createEntry("Lakbok", "Wereng Batang Coklat (WBC)", "Maret (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:60,n:0,ah:0,cl:0}, 76, "2025-03-15"),
    createEntry("Banjaranyar", "Tikus", "Maret (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 13, "2025-03-15"),
    createEntry("Banjaranyar", "Blast", "Maret (1-15)", 2025, {r:13,s:0,b:0,p:0}, {pm:0,k:13,n:0,ah:0,cl:0}, 13, "2025-03-15"),
    createEntry("Cidolog", "Blast", "Maret (1-15)", 2025, {r:8,s:0,b:0,p:0}, {pm:0,k:8,n:0,ah:0,cl:0}, 0, "2025-03-15"),
    createEntry("Cijeungjing", "Blast", "Maret (1-15)", 2025, {r:20,s:0,b:0,p:0}, {pm:0,k:20,n:0,ah:0,cl:0}, 23, "2025-03-15"),
    createEntry("Tambaksari", "Blast", "Maret (1-15)", 2025, {r:5,s:0,b:0,p:0}, {pm:0,k:4,n:0,ah:0,cl:10}, 30, "2025-03-15"),
    createEntry("Cipaku", "Blast", "Maret (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:2,cl:2}, 2, "2025-03-15"),
    createEntry("Lakbok", "Hawar Daun Bakteri (BLB)", "Maret (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:115,n:50,ah:0,cl:0}, 161, "2025-03-15"),
    createEntry("Pamarican", "Hawar Daun Bakteri (BLB)", "Maret (1-15)", 2025, {r:9,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 18, "2025-03-15"),
    createEntry("Cimaragas", "Hawar Daun Bakteri (BLB)", "Maret (1-15)", 2025, {r:8,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:12}, 8, "2025-03-15"),
    createEntry("Cisaga", "Hawar Daun Bakteri (BLB)", "Maret (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:15,n:0,ah:0,cl:0}, 11, "2025-03-15"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Maret (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:27,cl:0}, 27, "2025-03-15"),
    createEntry("Cipaku", "Hawar Daun Bakteri (BLB)", "Maret (1-15)", 2025, {r:7,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:3,cl:3}, 4, "2025-03-15"),
    createEntry("Panjalu", "Hawar Daun Bakteri (BLB)", "Maret (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:3}, 10, "2025-03-15"),

    // 16-31
    createEntry("Cikoneng", "Penggerek Batang", "Maret (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:18,cl:0}, 20, "2025-03-31"),
    createEntry("Lumbung", "Penggerek Batang", "Maret (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:3}, 20, "2025-03-31"),
    createEntry("Sukadana", "Wereng Batang Coklat (WBC)", "Maret (16-31)", 2025, {r:1,s:0,b:0,p:0}, {pm:0,k:1,n:0,ah:0,cl:0}, 41, "2025-03-31"),
    createEntry("Ciamis", "Wereng Batang Coklat (WBC)", "Maret (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:1,n:0,ah:0,cl:0}, 0, "2025-03-31"),
    createEntry("Rajadesa", "Tikus", "Maret (16-31)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 5, "2025-03-31"),
    createEntry("Banjarsari", "Blast", "Maret (16-31)", 2025, {r:10,s:0,b:0,p:0}, {pm:0,k:7,n:0,ah:0,cl:3}, 10, "2025-03-31"),
    createEntry("Banjaranyar", "Blast", "Maret (16-31)", 2025, {r:13,s:0,b:0,p:0}, {pm:0,k:13,n:0,ah:0,cl:0}, 13, "2025-03-31"),
    createEntry("Cipaku", "Blast", "Maret (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:2,n:0,ah:3,cl:0}, 11, "2025-03-31"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Maret (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:18,cl:0}, 18, "2025-03-31"),
    createEntry("Cipaku", "Hawar Daun Bakteri (BLB)", "Maret (16-31)", 2025, {r:7,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:3,cl:3}, 6, "2025-03-31"),
    createEntry("Sukamantri", "Hawar Daun Bakteri (BLB)", "Maret (16-31)", 2025, {r:4,s:0,b:0,p:0}, {pm:0,k:4,n:0,ah:0,cl:0}, 6, "2025-03-31"),
    
    // --- APRIL 2025 ---
    // 1-15
    createEntry("Cikoneng", "Penggerek Batang", "April (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:12,cl:0}, 24, "2025-04-15"),
    createEntry("Lumbung", "Penggerek Batang", "April (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:1,cl:1}, 20, "2025-04-15"),
    createEntry("Rajadesa", "Tikus", "April (1-15)", 2025, {r:8,s:0,b:0,p:0}, {pm:0,k:2,n:0,ah:0,cl:0}, 0, "2025-04-15"),
    createEntry("Banjaranyar", "Blast", "April (1-15)", 2025, {r:13,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 13, "2025-04-15"),
    createEntry("Cijeungjing", "Blast", "April (1-15)", 2025, {r:8,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 20, "2025-04-15"),
    createEntry("Ciamis", "Blast", "April (1-15)", 2025, {r:5,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 1, "2025-04-15"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "April (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:12,cl:0}, 12, "2025-04-15"),
    createEntry("Ciamis", "Hawar Daun Bakteri (BLB)", "April (1-15)", 2025, {r:15,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 23, "2025-04-15"),
    createEntry("Cipaku", "Hawar Daun Bakteri (BLB)", "April (1-15)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:1,n:0,ah:1,cl:1}, 2, "2025-04-15"),
    // 16-30
    createEntry("Cikoneng", "Penggerek Batang", "April (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 28, "2025-04-30"),
    createEntry("Lumbung", "Penggerek Batang", "April (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:4,cl:0}, 15, "2025-04-30"),
    createEntry("Rajadesa", "Tikus", "April (16-30)", 2025, {r:7,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 0, "2025-04-30"),
    createEntry("Panjalu", "Blast", "April (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:3,cl:0}, 3, "2025-04-30"),
    createEntry("Cimaragas", "Hawar Daun Bakteri (BLB)", "April (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:3}, 3, "2025-04-30"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "April (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 6, "2025-04-30"),

    // --- MEI 2025 ---
    // 1-15
    createEntry("Lumbung", "Penggerek Batang", "Mei (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:1,cl:4}, 15, "2025-05-15"),
    createEntry("Sukamantri", "Penggerek Batang", "Mei (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:3}, 5, "2025-05-15"),
    createEntry("Rajadesa", "Tikus", "Mei (1-15)", 2025, {r:1,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 0, "2025-05-15"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Mei (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 20, "2025-05-15"),
    // 16-31
    createEntry("Cikoneng", "Penggerek Batang", "Mei (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:12,cl:0}, 16, "2025-05-31"),
    createEntry("Lumbung", "Penggerek Batang", "Mei (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 22, "2025-05-31"),
    createEntry("Rajadesa", "Tikus", "Mei (16-31)", 2025, {r:1,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 0, "2025-05-31"),
    
    // --- JUNI 2025 ---
    // 1-15
    createEntry("Cimaragas", "Penggerek Batang", "Juni (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:12,n:0,ah:0,cl:0}, 12, "2025-06-15"),
    createEntry("Cikoneng", "Penggerek Batang", "Juni (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:12,cl:0}, 12, "2025-06-15"),
    createEntry("Lumbung", "Penggerek Batang", "Juni (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:3,cl:0}, 6, "2025-06-15"),
    createEntry("Rancah", "Wereng Batang Coklat (WBC)", "Juni (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:15,n:0,ah:0,cl:0}, 86, "2025-06-15"),
    createEntry("Sadananya", "Wereng Batang Coklat (WBC)", "Juni (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:25}, 83, "2025-06-15"),
    createEntry("Panumbangan", "Tikus", "Juni (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:1}, 2, "2025-06-15"),
    createEntry("Cidolog", "Blast", "Juni (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:20}, 20, "2025-06-15"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Juni (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 6, "2025-06-15"),
    createEntry("Lumbung", "Hawar Daun Bakteri (BLB)", "Juni (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:3,cl:0}, 15, "2025-06-15"),
    // 16-30
    createEntry("Cimaragas", "Penggerek Batang", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:2}, 2, "2025-06-30"),
    createEntry("Cikoneng", "Penggerek Batang", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:18,cl:0}, 18, "2025-06-30"),
    createEntry("Lumbung", "Penggerek Batang", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:3,cl:0}, 6, "2025-06-30"),
    createEntry("Sukamantri", "Penggerek Batang", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:4}, 5, "2025-06-30"),
    createEntry("Cidolog", "Wereng Batang Coklat (WBC)", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:10,n:0,ah:0,cl:0}, 131, "2025-06-30"),
    createEntry("Rancah", "Wereng Batang Coklat (WBC)", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:20,n:0,ah:0,cl:0}, 71, "2025-06-30"),
    createEntry("Sadananya", "Wereng Batang Coklat (WBC)", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:25}, 83, "2025-06-30"),
    createEntry("Panumbangan", "Tikus", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:1}, 25, "2025-06-30"),
    createEntry("Cidolog", "Blast", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:20}, 20, "2025-06-30"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Juni (16-30)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:9,cl:0}, 9, "2025-06-30"),

    // --- JULI 2025 ---
    // 1-15
    createEntry("Cidolog", "Penggerek Batang", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:11}, 11, "2025-07-15"),
    createEntry("Cimaragas", "Penggerek Batang", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:2}, 2, "2025-07-15"),
    createEntry("Ciamis", "Penggerek Batang", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:2}, 2, "2025-07-15"),
    createEntry("Cikoneng", "Penggerek Batang", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:18,cl:0}, 18, "2025-07-15"),
    createEntry("Panjalu", "Penggerek Batang", "Juli (1-15)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 3, "2025-07-15"),
    createEntry("Panumbangan", "Penggerek Batang", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 5, "2025-07-15"),
    createEntry("Banjarsari", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:5,s:0,b:0,p:0}, {pm:0,k:14,n:0,ah:0,cl:0}, 37, "2025-07-15"),
    createEntry("Banjaranyar", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:3,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:0,cl:0}, 12, "2025-07-15"),
    createEntry("Lakbok", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:2,n:5,ah:0,cl:0}, 23, "2025-07-15"),
    createEntry("Cidolog", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:8}, 8, "2025-07-15"),
    createEntry("Cimaragas", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:9}, 5, "2025-07-15"),
    createEntry("Cijeungjing", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:10,n:18,ah:0,cl:0}, 65, "2025-07-15"),
    createEntry("Tambaksari", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:10,s:0,b:0,p:0}, {pm:0,k:10,n:0,ah:0,cl:0}, 75, "2025-07-15"),
    createEntry("Rancah", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:25,n:0,ah:0,cl:26}, 46, "2025-07-15"),
    createEntry("Sukadana", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:40,ah:0,cl:0}, 40, "2025-07-15"),
    createEntry("Ciamis", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:31,n:0,ah:97,cl:0}, 97, "2025-07-15"),
    createEntry("Cikoneng", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:20,ah:0,cl:0}, 20, "2025-07-15"),
    createEntry("Sadananya", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:20,n:57,ah:0,cl:33}, 112, "2025-07-15"),
    createEntry("Panawangan", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:4,n:0,ah:0,cl:0}, 10, "2025-07-15"),
    createEntry("Kawali", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:3,n:0,ah:4,cl:0}, 13, "2025-07-15"),
    createEntry("Sukamantri", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:4,n:0,ah:0,cl:0}, 4, "2025-07-15"),
    createEntry("Panumbangan", "Wereng Batang Coklat (WBC)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:1,ah:21,cl:0}, 85, "2025-07-15"),
    createEntry("Banjarsari", "Tikus", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:13,n:0,ah:0,cl:0}, 21, "2025-07-15"),
    createEntry("Jatinagara", "Blast", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:9,cl:0}, 28, "2025-07-15"),
    createEntry("Rancah", "Blast", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:15,cl:0}, 15, "2025-07-15"),
    createEntry("Cidolog", "Blast", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:20,cl:0}, 20, "2025-07-15"),
    createEntry("Cijeungjing", "Hawar Daun Bakteri (BLB)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:3,cl:0}, 5, "2025-07-15"),
    createEntry("Ciamis", "Hawar Daun Bakteri (BLB)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 6, "2025-07-15"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:15,cl:0}, 15, "2025-07-15"),
    createEntry("Sindangkasih", "Hawar Daun Bakteri (BLB)", "Juli (1-15)", 2025, {r:5,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:5,cl:0}, 13, "2025-07-15"),
    createEntry("Cidolog", "Hawar Daun Bakteri (BLB)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:20,cl:0}, 20, "2025-07-15"),
    createEntry("Lumbung", "Hawar Daun Bakteri (BLB)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:3,cl:0}, 20, "2025-07-15"),
    createEntry("Panumbangan", "Hawar Daun Bakteri (BLB)", "Juli (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:2,cl:0}, 20, "2025-07-15"),
    // 16-31
    createEntry("Cikoneng", "Penggerek Batang", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:27,cl:0}, 27, "2025-07-31"),
    createEntry("Banjarsari", "Wereng Batang Coklat (WBC)", "Juli (16-31)", 2025, {r:5,s:0,b:0,p:0}, {pm:0,k:30,n:0,ah:0,cl:0}, 36, "2025-07-31"),
    createEntry("Lakbok", "Wereng Batang Coklat (WBC)", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:40,n:0,ah:0,cl:0}, 71, "2025-07-31"),
    createEntry("Cimaragas", "Wereng Batang Coklat (WBC)", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:15,n:0,ah:0,cl:0}, 15, "2025-07-31"),
    createEntry("Rancah", "Wereng Batang Coklat (WBC)", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:15,n:0,ah:0,cl:19}, 34, "2025-07-31"),
    createEntry("Ciamis", "Wereng Batang Coklat (WBC)", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:57,n:0,ah:0,cl:0}, 57, "2025-07-31"),
    createEntry("Sadananya", "Wereng Batang Coklat (WBC)", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:10,n:21,ah:0,cl:45}, 90, "2025-07-31"),
    createEntry("Panawangan", "Wereng Batang Coklat (WBC)", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:8,n:0,ah:0,cl:0}, 10, "2025-07-31"),
    createEntry("Banjarsari", "Tikus", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 0, "2025-07-31"),
    createEntry("Cidolog", "Blast", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:20}, 20, "2025-07-31"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:15,cl:0}, 15, "2025-07-31"),
    createEntry("Lumbung", "Hawar Daun Bakteri (BLB)", "Juli (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:3,cl:0}, 20, "2025-07-31"),

    // --- AGUSTUS 2025 ---
    // 1-15
    createEntry("Cikoneng", "Penggerek Batang", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:18,cl:0}, 18, "2025-08-15"),
    createEntry("Banjarsari", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:1,s:0,b:0,p:0}, {pm:0,k:12,n:0,ah:0,cl:0}, 42, "2025-08-15"),
    createEntry("Lakbok", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:50,n:0,ah:0,cl:0}, 71, "2025-08-15"),
    createEntry("Cimaragas", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:78,n:0,ah:0,cl:0}, 18, "2025-08-15"),
    createEntry("Cisaga", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:8,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 112, "2025-08-15"),
    createEntry("Rancah", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:200,n:0,ah:0,cl:0}, 19, "2025-08-15"),
    createEntry("Rajadesa", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:6,n:0,ah:0,cl:13}, 19, "2025-08-15"),
    createEntry("Sukadana", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:36,cl:0}, 36, "2025-08-15"),
    createEntry("Ciamis", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:102,n:0,ah:0,cl:0}, 19, "2025-08-15"),
    createEntry("Sadananya", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:20}, 56, "2025-08-15"),
    createEntry("Panawangan", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:7}, 86, "2025-08-15"),
    createEntry("Sukamantri", "Wereng Batang Coklat (WBC)", "Agustus (1-15)", 2025, {r:35,s:30,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:12}, 12, "2025-08-15"),
    createEntry("Banjarsari", "Tikus", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:4,n:0,ah:0,cl:0}, 21, "2025-08-15"),
    createEntry("Cidolog", "Blast", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:20}, 20, "2025-08-15"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Agustus (1-15)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:15,cl:0}, 15, "2025-08-15"),
    // 16-31
    createEntry("Cikoneng", "Penggerek Batang", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:12,cl:0}, 12, "2025-08-31"),
    createEntry("Banjarsari", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 16, "2025-08-31"),
    createEntry("Lakbok", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:20,n:0,ah:0,cl:0}, 71, "2025-08-31"),
    createEntry("Pamarican", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:10,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:0}, 122, "2025-08-31"),
    createEntry("Cimaragas", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:19,n:0,ah:0,cl:0}, 40, "2025-08-31"),
    createEntry("Rancah", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:9,n:0,ah:0,cl:10}, 7, "2025-08-31"),
    createEntry("Sukadana", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:46,cl:0}, 46, "2025-08-31"),
    createEntry("Ciamis", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:52,n:0,ah:0,cl:0}, 69, "2025-08-31"),
    createEntry("Panawangan", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:13,n:0,ah:0,cl:0}, 25, "2025-08-31"),
    createEntry("Lumbung", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:12}, 70, "2025-08-31"),
    createEntry("Sukamantri", "Wereng Batang Coklat (WBC)", "Agustus (16-31)", 2025, {r:50,s:33,b:0,p:0}, {pm:0,k:18,n:75,ah:2,cl:0}, 18, "2025-08-31"),
    createEntry("Panumbangan", "Tikus", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:1}, 4, "2025-08-31"),
    createEntry("Panjalu", "Blast", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:3,cl:0}, 3, "2025-08-31"),
    createEntry("Cidolog", "Blast", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:20}, 20, "2025-08-31"),
    createEntry("Cimaragas", "Hawar Daun Bakteri (BLB)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:0,cl:8}, 8, "2025-08-31"),
    createEntry("Ciamis", "Hawar Daun Bakteri (BLB)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:16,cl:0}, 16, "2025-08-31"),
    createEntry("Cikoneng", "Hawar Daun Bakteri (BLB)", "Agustus (16-31)", 2025, {r:0,s:0,b:0,p:0}, {pm:0,k:0,n:0,ah:6,cl:0}, 6, "2025-08-31"),
];


export const loadData = (): OPTData[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOptData));
      return mockOptData;
    }
  } catch (error) {
    console.error("Failed to load data from localStorage", error);
    return mockOptData;
  }
};

export const saveData = (data: OPTData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data to localStorage", error);
  }
};