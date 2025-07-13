import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Persist user on refresh (optional enhancement)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

const signup = async ({ username, email, password }) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // ✅ Show alert only once with server message
      alert(data.message || 'Signup failed');
      return false;
    }

    // ✅ Signup success
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('❌ Signup error:', err);
    alert('Server error during signup');
    return false;
  }
};


  const login = async ({ email, password }) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Login failed');
        return false;
      }

      const { user } = await res.json();
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user)); // optional
      return true;
    } catch (err) {
      console.error('❌ Login error:', err);
      alert('Server error during login');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);