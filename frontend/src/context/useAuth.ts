import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Adjust the path accordingly

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
