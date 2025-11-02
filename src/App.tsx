import { Routes, Route } from "react-router-dom";
import { createContext } from "react";
import Home from "@/pages/Home";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import SakuraEffect from '@/components/SakuraEffect';

// 创建樱花特效上下文
export const SakuraContext = createContext<{
  sakuraActive: boolean;
  setSakuraActive: (active: boolean) => void;
}>({
  sakuraActive: false,
  setSakuraActive: () => {}
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sakuraActive, setSakuraActive] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <SakuraContext.Provider value={{ sakuraActive, setSakuraActive }}>
        <SakuraEffect active={sakuraActive} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
        </Routes>
      </SakuraContext.Provider>
    </AuthContext.Provider>
  );
}
