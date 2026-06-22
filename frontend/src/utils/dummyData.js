export const statsData = {
  totalAnggota: 150,
  totalDivisi: 9,
  totalAgenda: 24,
  kehadiranHariIni: 85,
  anggotaAktif: 120,
  persentaseKehadiran: 78,
};

export const agendaTerdekat = [
  { id: 1, title: 'Rapat Koordinasi BEM', date: '2026-06-10', time: '09:00', tempat: 'Aula Lt.3', status: 'akan_datang' },
  { id: 2, title: 'Workshop Desain Grafis', date: '2026-06-12', time: '13:00', tempat: 'Lab Komputer', status: 'akan_datang' },
  { id: 3, title: 'Bakti Sosial', date: '2026-06-15', time: '07:00', tempat: 'Panti Asuhan', status: 'akan_datang' },
  { id: 4, title: 'Seminar Kepemimpinan', date: '2026-06-18', time: '08:00', tempat: 'Auditorium', status: 'akan_datang' },
  { id: 5, title: 'Pelantikan Pengurus Baru', date: '2026-06-20', time: '10:00', tempat: 'Gedung Serbaguna', status: 'akan_datang' },
];

export const aktivitasTerbaru = [
  { id: 1, user: 'Ahmad Fauzi', action: 'Bergabung sebagai anggota', time: '2 jam lalu', avatar: 'AF' },
  { id: 2, user: 'Siti Nurhaliza', action: 'Mengisi absensi', time: '3 jam lalu', avatar: 'SN' },
  { id: 3, user: 'Budi Santoso', action: 'Mengedit agenda', time: '5 jam lalu', avatar: 'BS' },
  { id: 4, user: 'Dewi Lestari', action: 'Membuat laporan baru', time: '1 hari lalu', avatar: 'DL' },
  { id: 5, user: 'Rudi Hermawan', action: 'Mengupload dokumen', time: '1 hari lalu', avatar: 'RH' },
  { id: 6, user: 'Ani Rahmawati', action: 'Mengubah profil divisi', time: '2 hari lalu', avatar: 'AR' },
];

export const kehadiranBulanan = [
  { bulan: 'Jan', hadir: 42, izin: 8, alpha: 5 },
  { bulan: 'Feb', hadir: 38, izin: 10, alpha: 7 },
  { bulan: 'Mar', hadir: 45, izin: 5, alpha: 5 },
  { bulan: 'Apr', hadir: 40, izin: 7, alpha: 8 },
  { bulan: 'Mei', hadir: 48, izin: 4, alpha: 3 },
  { bulan: 'Jun', hadir: 35, izin: 12, alpha: 8 },
];

export const kehadiranPerDivisi = [
  { divisi: 'Humas', hadir: 92, izin: 5, alpha: 3 },
  { divisi: 'Acara', hadir: 88, izin: 8, alpha: 4 },
  { divisi: 'Dana Usaha', hadir: 95, izin: 3, alpha: 2 },
  { divisi: 'PSDM', hadir: 85, izin: 10, alpha: 5 },
  { divisi: 'Kominfo', hadir: 90, izin: 7, alpha: 3 },
  { divisi: 'Kastrad', hadir: 82, izin: 12, alpha: 6 },
  { divisi: 'Medinfo', hadir: 87, izin: 8, alpha: 5 },
  { divisi: 'Senbud', hadir: 78, izin: 15, alpha: 7 },
  { divisi: 'Olahraga', hadir: 80, izin: 13, alpha: 7 },
];

export const statusKehadiran = [
  { name: 'Hadir', value: 78, color: '#10B981' },
  { name: 'Izin', value: 12, color: '#F59E0B' },
  { name: 'Alpha', value: 10, color: '#EF4444' },
];

export const anggotaData = [
  { id: 1, nama: 'Ahmad Fauzi', nim: '20210101001', divisi: 'Humas', jabatan: 'Koordinator', status: 'Aktif' },
  { id: 2, nama: 'Siti Nurhaliza', nim: '20210101002', divisi: 'Acara', jabatan: 'Ketua', status: 'Aktif' },
  { id: 3, nama: 'Budi Santoso', nim: '20210101003', divisi: 'PSDM', jabatan: 'Sekretaris', status: 'Aktif' },
  { id: 4, nama: 'Dewi Lestari', nim: '20210101004', divisi: 'Dana Usaha', jabatan: 'Bendahara', status: 'Aktif' },
  { id: 5, nama: 'Rudi Hermawan', nim: '20210101005', divisi: 'Kominfo', jabatan: 'Anggota', status: 'Aktif' },
  { id: 6, nama: 'Ani Rahmawati', nim: '20210101006', divisi: 'Kastrad', jabatan: 'Koordinator', status: 'Aktif' },
  { id: 7, nama: 'Rizky Pratama', nim: '20210101007', divisi: 'Medinfo', jabatan: 'Anggota', status: 'Nonaktif' },
  { id: 8, nama: 'Fitri Handayani', nim: '20210101008', divisi: 'Senbud', jabatan: 'Koordinator', status: 'Aktif' },
  { id: 9, nama: 'Doni Saputra', nim: '20210101009', divisi: 'Olahraga', jabatan: 'Anggota', status: 'Aktif' },
  { id: 10, nama: 'Mega Wati', nim: '20210101010', divisi: 'Humas', jabatan: 'Anggota', status: 'Aktif' },
  { id: 11, nama: 'Irfan Hakim', nim: '20210101011', divisi: 'Acara', jabatan: 'Anggota', status: 'Nonaktif' },
  { id: 12, nama: 'Putri Ayu', nim: '20210101012', divisi: 'PSDM', jabatan: 'Anggota', status: 'Aktif' },
];

export const divisiData = [
  { id: 1, nama: 'Humas', ketua: 'Ahmad Fauzi', anggota: 18, deskripsi: 'Hubungan Masyarakat' },
  { id: 2, nama: 'Acara', ketua: 'Siti Nurhaliza', anggota: 22, deskripsi: 'Pengelola Acara' },
  { id: 3, nama: 'Dana Usaha', ketua: 'Dewi Lestari', anggota: 15, deskripsi: 'Penggalangan Dana' },
  { id: 4, nama: 'PSDM', ketua: 'Budi Santoso', anggota: 20, deskripsi: 'Pengembangan SDM' },
  { id: 5, nama: 'Kominfo', ketua: 'Rudi Hermawan', anggota: 16, deskripsi: 'Komunikasi & Informasi' },
  { id: 6, nama: 'Kastrad', ketua: 'Ani Rahmawati', anggota: 14, deskripsi: 'Kajian Strategis' },
  { id: 7, nama: 'Medinfo', ketua: 'Rizky Pratama', anggota: 12, deskripsi: 'Media & Informasi' },
  { id: 8, nama: 'Senbud', ketua: 'Fitri Handayani', anggota: 19, deskripsi: 'Seni & Budaya' },
  { id: 9, nama: 'Olahraga', ketua: 'Doni Saputra', anggota: 14, deskripsi: 'Olahraga & Prestasi' },
];

export const jabatanData = [
  { id: 1, nama: 'Ketua BEM', level: 1, deskripsi: 'Pimpinan tertinggi BEM' },
  { id: 2, nama: 'Wakil Ketua', level: 2, deskripsi: 'Wakil pimpinan BEM' },
  { id: 3, nama: 'Sekretaris', level: 3, deskripsi: 'Administrasi & kesekretariatan' },
  { id: 4, nama: 'Bendahara', level: 3, deskripsi: 'Keuangan & anggaran' },
  { id: 5, nama: 'Koordinator Divisi', level: 4, deskripsi: 'Koordinator bidang divisi' },
  { id: 6, nama: 'Anggota', level: 5, deskripsi: 'Anggota divisi' },
];

export const notifikasiData = [
  { id: 1, title: 'Agenda baru ditambahkan', desc: 'Rapat Koordinasi BEM', time: '10 menit lalu', read: false, type: 'info' },
  { id: 2, title: 'Absensi dibuka', desc: 'Absensi hari ini sudah dibuka', time: '30 menit lalu', read: false, type: 'success' },
  { id: 3, title: 'Pengingat', desc: 'Workshop Desain Grafis besok', time: '2 jam lalu', read: false, type: 'warning' },
  { id: 4, title: 'Anggota baru', desc: 'Ahmad Fauzi bergabung', time: '3 jam lalu', read: true, type: 'info' },
  { id: 5, title: 'Laporan tersedia', desc: 'Laporan bulan Mei siap', time: '1 hari lalu', read: true, type: 'info' },
];

export const laporanData = [
  { id: 1, judul: 'Laporan Bulanan Mei 2026', tipe: 'Bulanan', status: 'Selesai', tgl: '2026-05-31', pembuat: 'Budi Santoso' },
  { id: 2, judul: 'LPJ Acara Seminar', tipe: 'Kegiatan', status: 'Proses', tgl: '2026-06-01', pembuat: 'Siti Nurhaliza' },
  { id: 3, judul: 'Laporan Keuangan April', tipe: 'Keuangan', status: 'Selesai', tgl: '2026-04-30', pembuat: 'Dewi Lestari' },
  { id: 4, judul: 'Proposal Dana Usaha', tipe: 'Proposal', status: 'Draft', tgl: '2026-06-05', pembuat: 'Rudi Hermawan' },
  { id: 5, judul: 'Evaluasi Program Kerja', tipe: 'Evaluasi', status: 'Proses', tgl: '2026-06-08', pembuat: 'Ani Rahmawati' },
];
