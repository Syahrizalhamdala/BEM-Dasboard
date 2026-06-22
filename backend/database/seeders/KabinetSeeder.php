<?php

namespace Database\Seeders;

use App\Models\Kabinet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class KabinetSeeder extends Seeder
{
    public function run(): void
    {
        Kabinet::truncate();

        $anggota = [
            // BADAN PENGURUS HARIAN (BPH)
            ['nim' => '20230080076', 'nama' => 'Ahmad Brik Abdul Aziz', 'prodi' => 'Manajemen', 'divisi' => 'Badan Pengurus Harian', 'jabatan' => 'Presiden Mahasiswa'],
            ['nim' => '20230080040', 'nama' => 'Citra Sonia', 'prodi' => 'Manajemen', 'divisi' => 'Badan Pengurus Harian', 'jabatan' => 'Sekretaris Kabinet'],
            ['nim' => '20230070095', 'nama' => 'Siti Salma Nurpahmi', 'prodi' => 'Akuntansi', 'divisi' => 'Badan Pengurus Harian', 'jabatan' => 'Sekretaris Kabinet'],
            ['nim' => '20240070069', 'nama' => 'Alin Nurpadilah', 'prodi' => 'Akuntansi', 'divisi' => 'Badan Pengurus Harian', 'jabatan' => 'Menteri Keuangan'],
            ['nim' => '20230090030', 'nama' => 'Ajeng Rahmawati', 'prodi' => 'Hukum', 'divisi' => 'Badan Pengurus Harian', 'jabatan' => 'Menteri Keuangan'],

            // FUNGSIONARIS KHUSUS
            ['nim' => '20230090213', 'nama' => 'Fabio Gennaro', 'prodi' => 'Hukum', 'divisi' => 'Fungsionaris Khusus', 'jabatan' => 'Bidang Riset dan Pengumpulan Data'],
            ['nim' => '20240070052', 'nama' => 'Muhammad Najib Assary Hikmatullah', 'prodi' => 'Akuntansi', 'divisi' => 'Fungsionaris Khusus', 'jabatan' => 'Badan Pers Mahasiswa'],
            ['nim' => '20240060043', 'nama' => 'Salwa Aulia Nur Fadillah', 'prodi' => 'DKV', 'divisi' => 'Fungsionaris Khusus', 'jabatan' => 'Bidang UMKM/Enterpreneur'],
            ['nim' => '20230060056', 'nama' => 'Aqiilah Putri', 'prodi' => 'DKV', 'divisi' => 'Fungsionaris Khusus', 'jabatan' => 'Staff Ahli Bahasa'],

            // MENKO
            ['nim' => '20230090035', 'nama' => 'Fachri Rajib Khairi Hakim', 'prodi' => 'Hukum', 'divisi' => 'Menteri Koordinator', 'jabatan' => 'Menko Internal dan Kelembagaan'],
            ['nim' => '20230080036', 'nama' => 'Rajwa Hauzan', 'prodi' => 'Manajemen', 'divisi' => 'Menteri Koordinator', 'jabatan' => 'Menko Eksternal dan Pengembangan'],

            // KEMENTERIAN DALAM NEGERI
            ['nim' => '20230010035', 'nama' => "Fauzan Nur'Azmi", 'prodi' => 'Teknik Sipil', 'divisi' => 'Kementerian Dalam Negeri', 'jabatan' => 'Menteri'],
            ['nim' => '20240120058', 'nama' => 'Diefa Jati Kusuma', 'prodi' => 'Teknik Elektro', 'divisi' => 'Kementerian Dalam Negeri', 'jabatan' => 'Staff'],
            ['nim' => '20240010137', 'nama' => 'Akbarullah', 'prodi' => 'Teknik Sipil', 'divisi' => 'Kementerian Dalam Negeri', 'jabatan' => 'Staff'],
            ['nim' => '20240050055', 'nama' => 'Rhealita Syani', 'prodi' => 'Sistem Informasi', 'divisi' => 'Kementerian Dalam Negeri', 'jabatan' => 'Staff'],
            ['nim' => '20230090031', 'nama' => 'Muhammad Rafi', 'prodi' => 'Hukum', 'divisi' => 'Kementerian Dalam Negeri', 'jabatan' => 'Staff'],

            // KEMENTERIAN ADKESHAM
            ['nim' => '20240080383', 'nama' => 'Muhamad Ardiansyah', 'prodi' => 'Manajemen', 'divisi' => 'Kementerian AdkesHAM', 'jabatan' => 'Menteri'],
            ['nim' => '20230040281', 'nama' => 'Khawarizmi', 'prodi' => 'Teknik Informatika', 'divisi' => 'Kementerian AdkesHAM', 'jabatan' => 'Staff'],
            ['nim' => '20230080333', 'nama' => 'Muhammad Kuncara M S', 'prodi' => 'Manajemen', 'divisi' => 'Kementerian AdkesHAM', 'jabatan' => 'Staff'],
            ['nim' => '20240090089', 'nama' => 'M. Faisal', 'prodi' => 'Hukum', 'divisi' => 'Kementerian AdkesHAM', 'jabatan' => 'Staff'],

            // KEMENTERIAN SOSIAL POLITIK
            ['nim' => '20230080450', 'nama' => 'Aldi Mulyadi', 'prodi' => 'Manajemen', 'divisi' => 'Kementerian Sosial Politik', 'jabatan' => 'Menteri'],
            ['nim' => '20240100098', 'nama' => 'Moh.Khairil Alwi', 'prodi' => 'PGSD', 'divisi' => 'Kementerian Sosial Politik', 'jabatan' => 'Staff'],
            ['nim' => '20240110075', 'nama' => 'Andi Fajar', 'prodi' => 'Teknik Mesin', 'divisi' => 'Kementerian Sosial Politik', 'jabatan' => 'Staff'],
            ['nim' => '20240090012', 'nama' => 'Fauzan Ferdiansyah', 'prodi' => 'Hukum', 'divisi' => 'Kementerian Sosial Politik', 'jabatan' => 'Staff'],

            // KEMENTERIAN PEMBERDAYAAN PEREMPUAN
            ['nim' => '20240070064', 'nama' => 'Vika Roudhotul Janah', 'prodi' => 'Akuntansi', 'divisi' => 'Kementerian Pemberdayaan Perempuan', 'jabatan' => 'Menteri'],
            ['nim' => '20240070078', 'nama' => 'Chelsea Reyva Anastasya', 'prodi' => 'Akuntansi', 'divisi' => 'Kementerian Pemberdayaan Perempuan', 'jabatan' => 'Staff'],
            ['nim' => '20230090158', 'nama' => 'Siti Setiawati', 'prodi' => 'Hukum', 'divisi' => 'Kementerian Pemberdayaan Perempuan', 'jabatan' => 'Staff'],
            ['nim' => '20240090152', 'nama' => 'Rifa Tahany', 'prodi' => 'Hukum', 'divisi' => 'Kementerian Pemberdayaan Perempuan', 'jabatan' => 'Staff'],

            // KEMENTERIAN AGAMA
            ['nim' => '20240080254', 'nama' => 'Ridwan', 'prodi' => 'Manajemen', 'divisi' => 'Kementerian Agama', 'jabatan' => 'Menteri'],
            ['nim' => '20240040279', 'nama' => 'Farisa Azkafata Taqiya', 'prodi' => 'Teknik Informatika', 'divisi' => 'Kementerian Agama', 'jabatan' => 'Staff'],
            ['nim' => '20240110069', 'nama' => 'Eldi Erwando', 'prodi' => 'Teknik Mesin', 'divisi' => 'Kementerian Agama', 'jabatan' => 'Staff'],

            // KEMENTERIAN PEMUDA DAN OLAHRAGA
            ['nim' => '20240080251', 'nama' => 'Muhammad Asqi Hidayah', 'prodi' => 'Manajemen', 'divisi' => 'Kementerian Pemuda dan Olahraga', 'jabatan' => 'Menteri'],
            ['nim' => '20240100036', 'nama' => 'Silva Aulia Putri Daryanto', 'prodi' => 'PGSD', 'divisi' => 'Kementerian Pemuda dan Olahraga', 'jabatan' => 'Staff'],
            ['nim' => '20230090149', 'nama' => 'Erwan Abdul Sukur', 'prodi' => 'Hukum', 'divisi' => 'Kementerian Pemuda dan Olahraga', 'jabatan' => 'Staff'],
            ['nim' => '20240080545', 'nama' => 'Mustapha Caeesay Brusudi', 'prodi' => 'Manajemen', 'divisi' => 'Kementerian Pemuda dan Olahraga', 'jabatan' => 'Staff'],

            // KEMENTERIAN KOMUNIKASI DAN INFORMASI
            ['nim' => '20240040310', 'nama' => 'Syahrizal Hamdala', 'prodi' => 'Teknik Informatika', 'divisi' => 'Kementerian Komunikasi dan Informasi', 'jabatan' => 'Menteri'],
            ['nim' => '20230010030', 'nama' => 'Aprilnaldi Saputra', 'prodi' => 'Teknik Sipil', 'divisi' => 'Kementerian Komunikasi dan Informasi', 'jabatan' => 'Staff'],
            ['nim' => '20230060049', 'nama' => 'Agitsna Irham', 'prodi' => 'DKV', 'divisi' => 'Kementerian Komunikasi dan Informasi', 'jabatan' => 'Staff'],

            // KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN
            ['nim' => '20230100229', 'nama' => 'Yunisa Zahro Deristia', 'prodi' => 'PGSD', 'divisi' => 'Kementerian Pendidikan dan Kebudayaan', 'jabatan' => 'Menteri'],
            ['nim' => '20240090087', 'nama' => 'Andrea Chairunissa Nurramdani', 'prodi' => 'Hukum', 'divisi' => 'Kementerian Pendidikan dan Kebudayaan', 'jabatan' => 'Staff'],
            ['nim' => '20240010145', 'nama' => 'Daniel Osei', 'prodi' => 'Teknik Sipil', 'divisi' => 'Kementerian Pendidikan dan Kebudayaan', 'jabatan' => 'Staff'],
            ['nim' => '20240100103', 'nama' => 'Dea Aprilia', 'prodi' => 'PGSD', 'divisi' => 'Kementerian Pendidikan dan Kebudayaan', 'jabatan' => 'Staff'],

            // KEMENTERIAN LUAR NEGERI
            ['nim' => '20230010147', 'nama' => "M. Da'i Audhain", 'prodi' => 'Teknik Sipil', 'divisi' => 'Kementerian Luar Negeri', 'jabatan' => 'Menteri'],
            ['nim' => '20240090130', 'nama' => 'Muhammad Aldo Syaffaat P', 'prodi' => 'Hukum', 'divisi' => 'Kementerian Luar Negeri', 'jabatan' => 'Staff'],
            ['nim' => '20230100105', 'nama' => 'Harindi Hasnawa', 'prodi' => 'PGSD', 'divisi' => 'Kementerian Luar Negeri', 'jabatan' => 'Staff'],
            ['nim' => '20240040314', 'nama' => 'Yai Mabior', 'prodi' => 'Teknik Informatika', 'divisi' => 'Kementerian Luar Negeri', 'jabatan' => 'Staff'],
            ['nim' => '20230090119', 'nama' => 'Muhammad Naufal Raihan', 'prodi' => 'Hukum', 'divisi' => 'Kementerian Luar Negeri', 'jabatan' => 'Staff'],

            // KEMENTERIAN KAJIAN STRATEGI DAN ADVOKASI
            ['nim' => '20240110047', 'nama' => 'Fauzan Aulia Saefullah', 'prodi' => 'Teknik Mesin', 'divisi' => 'Kementerian Kajian Strategi dan Advokasi', 'jabatan' => 'Menteri'],
            ['nim' => '20240010076', 'nama' => 'Muhammad Hanif Akhdan Dimas', 'prodi' => 'Teknik Sipil', 'divisi' => 'Kementerian Kajian Strategi dan Advokasi', 'jabatan' => 'Staff'],
            ['nim' => '20240010058', 'nama' => 'Fadli Sabian', 'prodi' => 'Teknik Sipil', 'divisi' => 'Kementerian Kajian Strategi dan Advokasi', 'jabatan' => 'Staff'],
        ];

        $password = Hash::make(env('DEFAULT_PASSWORD', 'bem2025'));

        foreach ($anggota as $a) {
            Kabinet::create([
                'nim'      => $a['nim'],
                'nama'     => $a['nama'],
                'prodi'    => $a['prodi'],
                'divisi'   => $a['divisi'],
                'jabatan'  => $a['jabatan'],
                'angkatan' => substr($a['nim'], 0, 4),
                'status'   => 'aktif',
                'password' => $password,
                'foto'     => '',
            ]);
        }
    }
}
