import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-[#f5f5f3]">
      <Sidebar />
      <div className="lg:ml-56 transition-all duration-200">
        <Navbar title={title} />
        <main className="px-5 lg:px-7 py-5">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
