// client/src/hooks/useAuth.js
import { useAuth } from '../context/AuthContext';

const useAuthHook = () => {
  const auth = useAuth();
  
  const isAdmin = () => {
    return auth.user?.role === 'admin';
  };
  
  const hasPermission = (requiredRole) => {
    if (!auth.user) return false;
    if (requiredRole === 'admin') return isAdmin();
    return true;
  };
  
  const getInitials = () => {
    if (!auth.user?.name) return '?';
    return auth.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  return {
    ...auth,
    isAdmin,
    hasPermission,
    getInitials,
    getGreeting,
  };
};

export default useAuthHook;