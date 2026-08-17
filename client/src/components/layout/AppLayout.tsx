import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header, Sidebar } from './Layout';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Overview of your tasks and progress',
  },
  '/tasks': {
    title: 'My Tasks',
    subtitle: 'Manage and organize all your tasks',
  },
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] ?? pageTitles['/dashboard'];

  return (
    <div className="min-h-screen flex bg-bg-light dark:bg-bg-dark">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />

        <main className="flex-1 p-4 md:p-6 overflow-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
