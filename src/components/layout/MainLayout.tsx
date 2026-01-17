import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <>
      <Header />
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
