import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-dt-bg text-dt-text">
      <div className="flex">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopNav />
          <main className="flex-1 px-4 py-4 lg:px-6 lg:py-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
