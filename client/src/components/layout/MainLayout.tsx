import Header from './Header';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex">
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
