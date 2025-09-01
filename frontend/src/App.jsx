import { Outlet, useLocation } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import { Toaster } from 'sonner';
import { useStockSync } from './hooks/useStockSync';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Initialize stock synchronization for non-admin pages
  const stockSync = useStockSync();

  return (
    <div className="App min-h-screen flex flex-col">
      {!isAdminPage && <HeaderBar />}
      
      <main className={`flex-1 transition-all duration-300 ${
        !isAdminPage ? 'lg:ml-80' : ''
      }`}>
        <div className="pt-20 lg:pt-24 pb-8">
          <Outlet />
        </div>
      </main>
      
      {!isAdminPage && <Footer />}
      
      {/* Modern Sonner Toast Container */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        expand={true}
        limit={3}
        theme="light"
      />
    </div>
  );
}

export default App;
