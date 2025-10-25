import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<{ sub: string; email: string; role: string }>(token);
      setUser({ id: decoded.sub, email: decoded.email, role: decoded.role });
    }
  }, []);

  return user;
};
