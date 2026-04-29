import React, { useState, useEffect } from 'react';
import { 
  Search, 
  GraduationCap, 
  Settings, 
  Plus, 
  Trash2, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  X,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialStudents, Student } from './data/students';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('smk_m2p_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });
  const [searchNisn, setSearchNisn] = useState('');
  const [searchResult, setSearchResult] = useState<Student | null | 'not_found'>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Form states for adding student
  const [newName, setNewName] = useState('');
  const [newNisn, setNewNisn] = useState('');
  const [newClass, setNewClass] = useState('');
  const [newStatus, setNewStatus] = useState<'LULUS' | 'TIDAK LULUS'>('LULUS');

  useEffect(() => {
    localStorage.setItem('smk_m2p_students', JSON.stringify(students));
  }, [students]);

  const toggleVisibility = (nisn: string) => {
    setStudents(students.map(s => s.nisn === nisn ? { ...s, isHidden: !s.isHidden } : s));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNisn.trim()) return;
    const result = students.find(s => s.nisn === searchNisn.trim());
    setSearchResult(result || 'not_found');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin1988') { // Updated password
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      setIsAdminPanelOpen(true);
      setAdminPassword('');
    } else {
      alert('Password Salah!');
    }
  };

  const addStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newNisn || !newClass) return;
    const exists = students.some(s => s.nisn === newNisn);
    if (exists) {
      alert('NISN sudah terdaftar!');
      return;
    }
    const newStudent: Student = {
      name: newName,
      nisn: newNisn,
      className: newClass,
      status: newStatus,
      isHidden: false
    };
    setStudents([...students, newStudent]);
    setNewName('');
    setNewNisn('');
    setNewClass('');
  };

  const deleteStudent = (nisn: string) => {
    if (window.confirm('Hapus data siswa ini?')) {
      setStudents(students.filter(s => s.nisn !== nisn));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-full">
                <GraduationCap className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">SMK MUHAMMADIYAH 2 PLAYEN</h1>
                <p className="text-[10px] uppercase tracking-wider opacity-80">Pengumuman Kelulusan 2025/2026</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">Beranda</button>
                <button onClick={() => document.getElementById('doa')?.scrollIntoView({behavior: 'smooth'})} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">Doa</button>
                {!isAdmin ? (
                  <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-md text-sm font-bold transition-all shadow-md">
                    <Settings className="w-4 h-4" /> ADMIN LOGIN
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsAdminPanelOpen(true)} className="bg-amber-500 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2">
                       PANEL ADMIN
                    </button>
                    <button onClick={() => setIsAdmin(false)} className="bg-red-600 p-2 rounded-md">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="md:hidden">
               <button onClick={() => setIsLoginModalOpen(true)} className="p-2"><Settings className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 bg-emerald-900 text-white overflow-hidden">
        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/arabesque.png')` }}></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-amber-400 italic">Selamat Datang di Portal Kelulusan</h2>
            <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Silakan masukkan NISN Anda untuk mengecek status kelulusan Tahun Pelajaran 2025/2026.
            </p>

            <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Masukkan NISN Anda..."
                className="w-full px-6 py-4 rounded-full text-slate-900 bg-white border-4 border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 text-lg shadow-2xl transition-all"
                value={searchNisn}
                onChange={(e) => setSearchNisn(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-full flex items-center gap-2 transition-all"
              >
                <Search className="w-5 h-5" /> <span className="hidden sm:inline">Cek Status</span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Result Display Pop-up */}
      <AnimatePresence>
        {searchResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl my-8 relative"
            >
              <button 
                onClick={() => setSearchResult(null)}
                className="absolute -top-4 -right-4 bg-white text-slate-900 p-2 rounded-full shadow-xl hover:bg-slate-100 z-[110]"
              >
                <X className="w-6 h-6" />
              </button>

              {searchResult === 'not_found' ? (
                <div className="bg-white rounded-3xl p-8 border-4 border-red-100 shadow-2xl text-center">
                  <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Data Tidak Ditemukan</h3>
                  <p className="text-slate-600 mb-6">NISN "{searchNisn}" tidak terdaftar dalam database kelulusan kami. Silakan hubungi pihak sekolah.</p>
                  <button onClick={() => setSearchResult(null)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                    Coba Lagi
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-t-[12px] border-emerald-600">
                  <div className={`p-8 text-center ${searchResult.isHidden ? 'bg-amber-50' : (searchResult.status === 'LULUS' ? 'bg-emerald-50' : 'bg-red-50')}`}>
                     <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-sm">
                        {searchResult.isHidden ? (
                          <Settings className="w-12 h-12 text-amber-600" />
                        ) : searchResult.status === 'LULUS' ? (
                          <CheckCircle className="w-12 h-12 text-emerald-600" />
                        ) : (
                          <XCircle className="w-12 h-12 text-red-600" />
                        )}
                     </div>
                     <h3 className={`text-xl font-bold mb-2 ${searchResult.isHidden ? 'text-amber-900' : (searchResult.status === 'LULUS' ? 'text-emerald-900' : 'text-red-900')}`}>
                       Selamat! Berdasarkan hasil rapat dan berbagai pertimbangan, Anda dinyatakan:
                     </h3>
                     <p className={`text-4xl font-black uppercase tracking-tighter ${searchResult.isHidden ? 'text-amber-600 text-2xl' : (searchResult.status === 'LULUS' ? 'text-emerald-600' : 'text-red-600')}`}>
                       {searchResult.isHidden ? 'SILAHKAN HUBUNGI PIHAK SEKOLAH' : searchResult.status}
                     </p>
                  </div>
                  
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500 font-medium uppercase text-xs">Nama Lengkap</span>
                      <span className="text-slate-900 font-bold uppercase">{searchResult.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500 font-medium uppercase text-xs">NISN</span>
                      <span className="text-slate-900 font-bold tracking-widest">{searchResult.nisn}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500 font-medium uppercase text-xs">Kelas</span>
                      <span className="text-slate-900 font-bold">{searchResult.className}</span>
                    </div>

                    {/* Doa inside Pop-up */}
                    <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <h4 className="text-emerald-900 font-bold text-center mb-4 uppercase tracking-widest text-sm">Doa Kelulusan</h4>
                      <p className="text-center text-2xl mb-4 font-arabic leading-relaxed text-emerald-950" dir="rtl">
                        الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، حَمْدًا يُوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيدَهُ
                      </p>
                      <p className="text-center text-sm italic text-emerald-800 mb-4 leading-relaxed">
                        "Ya Allah, kami bersyukur atas kelulusan ini. Jadikanlah ilmu kami berkah dan bermanfaat bagi agama, bangsa, dan orang tua kami. Aamiin."
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-dashed border-emerald-200">
                      <p className="text-center text-slate-600 italic text-xs">
                        "Barang siapa yang bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar."
                        <br /><span className="font-bold text-emerald-700 mt-1 block">(QS. At-Talaq: 2)</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-400 p-4 text-center">
                    <button onClick={() => setSearchResult(null)} className="text-amber-900 font-black text-sm uppercase tracking-widest">
                      Tutup Pengumuman
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doa Section */}
      <section id="doa" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="bg-emerald-100 p-4 rounded-full mb-4">
               <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-900">Doa Pengumuman Kelulusan</h2>
            <div className="w-20 h-1.5 bg-amber-400 mt-4 rounded-full"></div>
          </div>
          
          <div className="bg-emerald-50 rounded-3xl p-10 shadow-inner border-2 border-emerald-100">
             <p className="text-center text-3xl md:text-4xl mb-8 font-arabic leading-relaxed text-emerald-950" dir="rtl">
               الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، حَمْدًا يُوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيدَهُ
             </p>
             <p className="text-center text-xl italic text-emerald-800 mb-8">
               "Alhamdulillahi rabbil 'alamin, hamdan yuwaafi ni'amahu wa yukaafiu maziidah"
             </p>
             <div className="space-y-6 text-slate-700 leading-relaxed text-center">
               <p className="font-medium text-lg">
                 Segala puji bagi Allah Tuhan Semesta Alam, puji yang sebanding dengan nikmat-nikmat-Nya dan menjamin tambahannya.
               </p>
               <p>
                 Ya Allah, kami bersyukur atas kelulusan yang Engkau karuniakan hari ini. Jadikanlah ilmu yang kami dapatkan berkah dan bermanfaat bagi agama, bangsa, dan keluarga kami. Bimbinglah langkah kami selanjutnya menuju masa depan yang penuh ridha-Mu.
               </p>
               <p className="font-bold text-emerald-800">Aamiin Ya Rabbal 'Alamin.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <GraduationCap className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">SMK MUHAMMADIYAH 2 PLAYEN</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Sekolah Berkemajuan, Unggul dalam IPTEK, Kokoh dalam IMTAK.</p>
          <div className="flex justify-center gap-6 mb-8">
             <a href="#" className="text-slate-400 hover:text-white transition-colors">Website Sekolah</a>
             <a href="#" className="text-slate-400 hover:text-white transition-colors">Instagram</a>
             <a href="#" className="text-slate-400 hover:text-white transition-colors">Kontak Kami</a>
          </div>
          <p className="text-slate-500 text-sm">© 2024 SMK Muhammadiyah 2 Playen. All rights reserved.</p>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {isAdminPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="bg-emerald-800 p-6 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase">Dashboard Admin</h3>
                </div>
                <button onClick={() => setIsAdminPanelOpen(false)} className="p-2 bg-emerald-700 rounded-full hover:bg-emerald-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left: Add Student */}
                  <div className="md:col-span-1">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-900 uppercase tracking-tight">
                      <Plus className="w-5 h-5" /> Tambah Siswa
                    </h4>
                    <form onSubmit={addStudent} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Lengkap</label>
                        <input value={newName} onChange={(e) => setNewName(e.target.value)} type="text" className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Contoh: Ahmad" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NISN</label>
                        <input value={newNisn} onChange={(e) => setNewNisn(e.target.value)} type="text" className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="10 Digit Angka" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kelas</label>
                        <input value={newClass} onChange={(e) => setNewClass(e.target.value)} type="text" className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Contoh: 12 AKT" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                        <select 
                          value={newStatus} 
                          onChange={(e) => setNewStatus(e.target.value as 'LULUS' | 'TIDAK LULUS')} 
                          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                          <option value="LULUS">LULUS</option>
                          <option value="TIDAK LULUS">TIDAK LULUS</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
                        SIMPAN DATA
                      </button>
                    </form>
                  </div>

                  {/* Right: List Student */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-bold text-emerald-900 uppercase tracking-tight">Daftar Siswa ({students.length})</h4>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Nama</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Info</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {students.map((student) => (
                              <tr key={student.nisn} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">
                                  <p className="text-sm font-bold">{student.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{student.nisn} | {student.className}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${student.status === 'LULUS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {student.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <button 
                                    onClick={() => toggleVisibility(student.nisn)}
                                    className={`p-1 rounded ${student.isHidden ? 'text-amber-500 hover:text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    title={student.isHidden ? "Status disembunyikan" : "Status terlihat"}
                                  >
                                    {student.isHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </td>
                                <td className="px-4 py-3">
                                  <button onClick={() => deleteStudent(student.nisn)} className="text-red-500 hover:text-red-700 transition-colors p-1">
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm"
            >
              <div className="flex flex-col items-center mb-8">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <Settings className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase">Login Admin</h3>
                <p className="text-slate-500 text-sm">Akses fitur pengelolaan data</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-3 pt-2">
                   <button type="button" onClick={() => setIsLoginModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                     BATAL
                   </button>
                   <button type="submit" className="flex-2 bg-amber-500 text-white px-8 py-3 rounded-xl font-black hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30">
                     LOGIN
                   </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
