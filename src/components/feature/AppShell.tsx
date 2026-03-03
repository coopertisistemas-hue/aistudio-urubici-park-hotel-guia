
import { Outlet } from 'react-router-dom';
import VideoBackground from './VideoBackground';

/**
 * AppShell — mounts the persistent video background ONCE.
 * All route pages render inside <Outlet /> on top of it.
 * The <video> element is never unmounted during navigation.
 */
const AppShell = () => (
  <div className="min-h-screen relative overflow-hidden">
    <VideoBackground />
    <Outlet />
  </div>
);

export default AppShell;
