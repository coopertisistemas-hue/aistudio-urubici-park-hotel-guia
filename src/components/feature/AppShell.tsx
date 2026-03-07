
import { Outlet } from 'react-router-dom';
import VideoBackground from './VideoBackground';
import { useTenant } from '../../contexts/TenantContext';

/**
 * AppShell — mounts the persistent video background ONCE.
 * All route pages render inside <Outlet /> on top of it.
 * The <video> element is never unmounted during navigation.
 */
const AppShell = () => {
  const { config } = useTenant();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <VideoBackground videoUrl={config?.backgroundVideoUrl} />
      <Outlet />
    </div>
  );
};

export default AppShell;
