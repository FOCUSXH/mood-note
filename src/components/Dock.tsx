import React, { useState, useEffect } from 'react';

interface App {
  id: string;
  name: string;
  iconClass: string;
  iconColor: string;
}

interface DockProps {
  apps: App[];
  onOpenApp: (app: App) => void;
  activeAppId: string | null;
  theme: 'light' | 'dark';
}

// Tailwind颜色映射
const colorMap: Record<string, string> = {
  'white': 'white',
  'blue-500': '#3b82f6',
  'red-500': '#ef4444',
  'orange-500': '#f97316',
  'purple-500': '#8b5cf6',
  'green-500': '#10b981',
  'green-400': '#34d399',
  'rose-500': '#e11d48',
  'yellow-500': '#eab308'
};

const Dock: React.FC<DockProps> = ({ apps, onOpenApp, activeAppId, theme }) => {
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 处理应用图标悬停
  const handleMouseEnter = (appId: string) => {
    setHoveredAppId(appId);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setHoveredAppId(null);
    setIsExpanded(false);
  };

  // 处理应用点击
  const handleAppClick = (app: App) => {
    onOpenApp(app);
  };

  // 获取液态玻璃效果的CSS类
  const getLiquidGlassClass = () => {
    if (theme === 'dark') {
      return 'bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 shadow-lg shadow-black/20';
    } else {
      return 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg shadow-black/10';
    }
  };

  return (
    <div 
       className={`fixed bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center px-6 py-3 rounded-2xl transition-all duration-300 z-40 ${getLiquidGlassClass()}`}
       style={{
         // 添加微妙的渐变效果增强液态感
         backgroundImage: theme === 'dark' 
           ? 'linear-gradient(to top, rgba(30, 30, 30, 0.4), rgba(30, 30, 30, 0.2))' 
           : 'linear-gradient(to top, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
         // 添加发光效果
         boxShadow: theme === 'dark' 
           ? '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
           : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1)'
       }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* 应用图标 */}
      <div className="flex items-end space-x-3">
        {apps.map((app) => {
          const isActive = activeAppId === app.id;
           const isHovered = hoveredAppId === app.id;
          
          return (
            <div
              key={app.id}
              className="relative flex flex-col items-center cursor-pointer"
              onMouseEnter={() => handleMouseEnter(app.id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleAppClick(app)}
              style={{ height: '42px' }}
            >
               <div 
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                  isActive ? 'ring-2 ring-white/80' : ''
                }`}
                style={{ 
                  transform: isHovered && isExpanded ? 'translateY(-12px) scale(1.25)' : 'translateY(0) scale(1)',
                  // 图标容器添加微妙的发光效果
                  boxShadow: isHovered ? '0 0 16px rgba(255, 255, 255, 0.2)' : 'none',
                  // 图标容器添加液态背景效果
                  background: isHovered 
                    ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)') 
                    : 'transparent'
                }}
              >
                <i className={`${app.iconClass} text-2xl`} style={{
                  color: colorMap[app.iconColor] || 'white',
                  textShadow: theme === 'dark' ? '0 0 8px rgba(255, 255, 255, 0.3)' : 'none'
                }}></i>
              </div>
              
              {/* 应用名称提示 - 优化样式 */}
              {isHovered && isExpanded && (
                <div className={`absolute bottom-full mb-2 px-4 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                  theme === 'dark' 
                    ? 'bg-gray-800/90 text-white/95 shadow-xl backdrop-blur-lg' 
                    : 'bg-white/90 text-gray-800 shadow-xl backdrop-blur-lg'
                }`} style={{
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'
                }}>
                  {app.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;