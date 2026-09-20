import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineClock,
  HiOutlineBriefcase, HiOutlineArrowRight, HiOutlineUserGroup,
  HiOutlineSparkles, HiOutlineGlobe, HiOutlineMail, HiOutlinePhone,
} from 'react-icons/hi';
import apiClient from '../../api/apiClient';

function useTerdekatAgenda() {
  const [agenda, setAgenda] = useState([]);
  useEffect(() => {
    apiClient.get('/agenda/terdekat')
      .then((res) => setAgenda(res.data.data || []))
      .catch(() => {});
  }, []);
  return agenda;
}

function useMagangCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    apiClient.get('/magang')
      .then((res) => setCount((res.data.data || []).length))
      .catch(() => {});
  }, []);
  return count;
}

const formatDate = (d) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export default function Home() {
  const agendaList = useTerdekatAgenda();
  const magangCount = useMagangCount();

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-burgundy/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <img src="/logo.png" alt="BEM" className="w-9 h-9 object-contain" />
            <span className="text-white font-semibold text-sm tracking-wide">BEM Nusa Putra</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <a href="#tentang" className="px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-lg transition-colors no-underline">
              Tentang
            </a>
            <a href="#kegiatan" className="px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-lg transition-colors no-underline">
              Kegiatan
            </a>
            <a href="#magang" className="px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-lg transition-colors no-underline">
              Magang
            </a>
            <a href="#kontak" className="px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded-lg transition-colors no-underline">
              Kontak
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 text-xs font-medium text-burgundy bg-white hover:bg-white/90 rounded-lg transition-colors no-underline"
            >
              Masuk Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[600px] md:min-h-[680px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/kabinet.JPG" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy/90 via-burgundy/70 to-burgundy/50" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <p className="text-white/70 text-sm font-medium mb-3 tracking-wider uppercase">Selamat Datang di</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4">
              BEM Nusa Putra
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-light mb-2">
              Kabinet Nawasena 2025
            </p>
            <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-lg mb-8">
              Badan Eksekutif Mahasiswa Universitas Nusa Putra. Wadah kolaborasi,
              pengabdian, dan pergerakan mahasiswa untuk mewujudkan kebermanfaatan.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#tentang"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-burgundy rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-white/20 no-underline"
              >
                Kenali Kami
              </a>
              <Link
                to="/magang"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg text-sm font-medium transition-colors no-underline backdrop-blur-sm"
              >
                <HiOutlineBriefcase className="w-4 h-4" />
                Program Magang
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32V120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ─── WHO WE ARE ─── */}
      <section id="tentang" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-left mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy">Tentang Kami</h2>
            <p className="text-sm text-slate-500 mt-2">Mengenal lebih dekat BEM Universitas Nusa Putra</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-xl font-bold text-burgundy mb-4">Badan Eksekutif Mahasiswa</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                BEM Universitas Nusa Putra merupakan lembaga eksekutif mahasiswa yang hadir sebagai wadah aktualisasi,
                pengabdian, dan perjuangan mahasiswa dalam menjawab tantangan sosial, akademik, serta membangun budaya
                organisasi yang berintegritas dan inklusif.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Kami mewakili suara mahasiswa, menghadirkan program kerja yang menyentuh kebutuhan kampus, serta
                berperan aktif dalam pengembangan potensi mahasiswa Universitas Nusa Putra.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-burgundy">{agendaList.length || 0}+</p>
                  <p className="text-[11px] text-slate-400">Agenda</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-burgundy">{magangCount || 0}</p>
                  <p className="text-[11px] text-slate-400">Program Magang</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-burgundy">2025</p>
                  <p className="text-[11px] text-slate-400">Kabinet</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/kabinet.JPG"
                alt="Kegiatan BEM Universitas Nusa Putra"
                className="w-full rounded-xl shadow-xl object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── VISI & MISI ─── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy">Visi & Misi</h2>
            <p className="text-sm text-slate-500 mt-2">Arah perjuangan dan pijakan BEM Universitas Nusa Putra</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-burgundy mb-4">Visi</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Menjadi wadah kolaborasi yang memberdayakan mahasiswa untuk berkontribusi secara nyata
                bagi kemajuan Universitas Nusa Putra, masyarakat, dan bangsa Indonesia melalui
                kerja-kerja strategis yang inklusif dan berintegritas.
              </p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-burgundy mb-4">Misi</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy mt-1.5 shrink-0" />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    Mengadvokasi dan mengawal isu-isu sosial kemasyarakatan secara strategis dan partisipatif.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy mt-1.5 shrink-0" />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    Memperjuangkan hak-hak mahasiswa serta menunjang kebutuhan akademik dan pengembangan diri.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy mt-1.5 shrink-0" />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    Mewadahi minat dan bakat mahasiswa serta memberdayakan potensi yang ada.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy mt-1.5 shrink-0" />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    Membangun tata kelola internal yang profesional, harmonis, dan evaluatif.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── KEGIATAN TERBARU ─── */}
      <section id="kegiatan" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-burgundy">Kegiatan Terbaru</h2>
              <p className="text-sm text-slate-500 mt-2">Agenda kegiatan yang akan datang</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs font-medium text-burgundy hover:text-burgundy-dark transition-colors no-underline"
            >
              Lihat Semua
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {agendaList.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <HiOutlineCalendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Belum ada agenda kegiatan.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {agendaList.map((a) => (
                <div
                  key={a.id}
                  className="group bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:border-burgundy/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-burgundy/10 flex items-center justify-center">
                      <HiOutlineCalendar className="w-5 h-5 text-burgundy" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">
                      {formatDate(a.tanggal)}
                    </p>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug">
                    {a.agenda}
                  </h3>
                  {a.tempat && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                      <HiOutlineLocationMarker className="w-3 h-3 shrink-0" />
                      {a.tempat}
                    </p>
                  )}
                  {a.waktu_mulai && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <HiOutlineClock className="w-3 h-3 shrink-0" />
                      {a.waktu_mulai}{a.waktu_selesai ? ` - ${a.waktu_selesai}` : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── PROGRAM MAGANG ─── */}
      <section id="magang" className="py-16 md:py-20 bg-burgundy">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Program Magang</h2>
              <p className="text-sm text-white/60 mt-2">Kesempatan magang bersama BEM Universitas Nusa Putra</p>
            </div>
            <Link
              to="/magang"
              className="inline-flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white transition-colors no-underline"
            >
              Lihat Selengkapnya
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <MagangPreview />
        </div>
      </section>

      {/* ─── KONTAK ─── */}
      <section id="kontak" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-burgundy">Kontak Kami</h2>
            <p className="text-sm text-slate-500 mt-2">Hubungi BEM Universitas Nusa Putra</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineGlobe className="w-5 h-5 text-burgundy" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Website</h4>
              <p className="text-xs text-slate-500">nusaputra.ac.id</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineMail className="w-5 h-5 text-burgundy" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Email</h4>
              <p className="text-xs text-slate-500">bem@nusaputra.ac.id</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineLocationMarker className="w-5 h-5 text-burgundy" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Alamat</h4>
              <p className="text-xs text-slate-500">Universitas Nusa Putra, Sukabumi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="BEM" className="w-8 h-8 object-contain" />
              <div className="leading-tight">
                <p className="text-[12px] font-medium text-white m-0">Kabinet Nawasena</p>
                <p className="text-[10px] text-white/40 m-0">BEM Universitas Nusa Putra</p>
              </div>
            </div>
            <p className="text-[11px] text-white/40">
              &copy; {new Date().getFullYear()} BEM Universitas Nusa Putra. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MagangPreview() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/magang')
      .then((res) => setList((res.data.data || []).slice(0, 2)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 bg-white/10 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
        <HiOutlineBriefcase className="w-10 h-10 text-white/30 mx-auto mb-3" />
        <p className="text-sm text-white/50">Belum ada program magang saat ini.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {list.map((m) => (
        <Link
          key={m.id}
          to="/magang"
          className="group bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl border border-white/10 p-5 transition-all no-underline"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-white group-hover:text-white transition-colors">
              {m.judul_magang}
            </h3>
            {m.status === 'dibuka' && (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-medium">
                <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                Dibuka
              </span>
            )}
          </div>
          <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-3">
            {m.deskripsi}
          </p>
          <div className="flex items-center gap-3">
            {m.durasi && (
              <span className="text-[11px] text-white/50 flex items-center gap-1">
                <HiOutlineClock className="w-3 h-3" />
                {m.durasi}
              </span>
            )}
            {m.lokasi && (
              <span className="text-[11px] text-white/50 flex items-center gap-1">
                <HiOutlineLocationMarker className="w-3 h-3" />
                {m.lokasi}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
