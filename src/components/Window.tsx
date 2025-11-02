import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NameSettings from './NameSettings';

// 随机颜色生成函数
const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', 
    '#FF9FF3', '#54A0FF', '#5F27CD', '#0ABDE3', '#10AC84',
    '#FF9F43', '#EE5253', '#00D2D3', '#54A0FF', '#5F27CD',
    '#54A0FF', '#5F27CD', '#0ABDE3', '#10AC84', '#FF9F43',
    '#FF6348', '#3CB371', '#9370DB', '#4682B4', '#FFD700'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface BirthdayWindowState extends WindowState {
  message: string;
  color: string; // 添加颜色属性
}

interface WindowState {
  id: string;
  title: string;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  isMaximized: boolean;
  isMinimized: boolean;
}

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdate: (updates: Partial<WindowState>) => void;
  theme: 'light' | 'dark';
}

const Window: React.FC<WindowProps> = ({ 
  window, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onUpdate,
  theme
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resizeDirection, setResizeDirection] = useState<'se' | 'sw' | 'ne' | 'nw' | null>(null);
  
  const windowRef = useRef<HTMLDivElement>(null);
  
  // 处理窗口拖动
  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.x,
      y: e.clientY - window.y
    });
    
    // 防止文本选择
    e.preventDefault();
  };
  
  // 处理窗口大小调整
  const handleResizeMouseDown = (e: React.MouseEvent, direction: 'se' | 'sw' | 'ne' | 'nw') => {
    if (window.isMaximized) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.width,
      height: window.height
    });
    
    // 防止文本选择
    e.preventDefault();
    
    // 添加鼠标指针样式
    document.body.style.cursor = `${direction}-resize`;
  };
  
  // 全局鼠标移动事件处理
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onUpdate({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      } else if (isResizing && resizeDirection) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = window.x;
        let newY = window.y;
        
        // 根据调整方向计算新的窗口大小和位置
        switch (resizeDirection) {
          case 'se':
            newWidth = Math.max(300, resizeStart.width + deltaX);
            newHeight = Math.max(200, resizeStart.height + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(300, resizeStart.width - deltaX);
            newHeight = Math.max(200, resizeStart.height + deltaY);
            newX = window.x + deltaX;
            break;
          case 'ne':
            newWidth = Math.max(300, resizeStart.width + deltaX);
            newHeight = Math.max(200, resizeStart.height - deltaY);
            newY = window.y + deltaY;
            break;
          case 'nw':
            newWidth = Math.max(300, resizeStart.width - deltaX);
            newHeight = Math.max(200, resizeStart.height - deltaY);
            newX = window.x + deltaX;
            newY = window.y + deltaY;
            break;
        }
        
        onUpdate({ x: newX, y: newY, width: newWidth, height: newHeight });
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
      
      if (isResizing) {
        setIsResizing(false);
        setResizeDirection(null);
        document.body.style.cursor = 'default';
      }
    };
    
    // 添加全局事件监听器
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 清理事件监听器
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, isResizing, resizeDirection, dragOffset, resizeStart, window, onUpdate]);
  
  // 窗口样式
  const windowStyle = {
    position: 'absolute' as const,
    width: window.isMaximized ? '100%' : `${window.width}px`,
    height: window.isMaximized ? 'calc(100% - 104px)' : `${window.height}px`, // 8px (菜单栏) + 96px (Dock栏)
    left: window.isMaximized ? '0' : `${window.x}px`,
    top: window.isMaximized ? '8px' : `${window.y}px`,
    zIndex: window.zIndex,
    borderRadius: window.isMaximized ? '0' : '12px',
    overflow: 'hidden',
  };
  
  return (
    <AnimatePresence>
        <motion.div
          ref={windowRef}
          style={windowStyle}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`flex flex-col ${
            theme === 'dark' 
              ? 'bg-gray-800 text-gray-100' 
              : 'bg-white text-gray-800'
          } shadow-xl border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          } overflow-hidden`}
        >
        {/* 窗口标题栏 */}
        <div 
          className={`h-8 flex items-center px-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
          } border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
          onMouseDown={handleMouseDown}
        >
          {/* 窗口控制按钮 */}
          <div className="flex space-x-2 mr-4">
            <button 
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              onClick={onClose}
            />
            <button 
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
              onClick={onMinimize}
            />
            <button 
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
              onClick={onMaximize}
            />
          </div>
          
          {/* 窗口标题 */}
          <div className="text-sm font-medium truncate">{window.title}</div>
          
          {/* 右侧空白区域，用于拖动 */}
          <div className="ml-auto h-full w-24"></div>
        </div>
        
        {/* 窗口内容区域 */}
        <div className={`flex-1 ${
          window.title === '生日快乐' || window.title === '心情便签' ? 'overflow-hidden' : 'overflow-auto'
        } ${theme === 'dark' ? 'scrollbar-dark' : ''}`}>
          <div className="p-6">
           {window.title === '心情便签' ? (
              // 心情便签应用的内容
              <div className="flex items-center justify-center h-full p-2">
                <p 
                  className="text-lg font-medium text-center px-2 whitespace-normal"
                  style={{ 
                    color: (window as BirthdayWindowState).color 
                  }}
                >
                  {(window as BirthdayWindowState).message || '美好的一天'}
                </p>
              </div>
            ) : window.title === '记事本' ? (
               // 记事本应用的内容
               <div className="h-full flex flex-col">
                 <div className="mb-4">
                   <input
                     type="text"
                     placeholder="输入标题..."
                     className={`w-full px-4 py-2 rounded-lg ${
                       theme === 'dark'
                         ? 'bg-gray-700 text-white border-gray-600'
                         : 'bg-white text-gray-800 border-gray-300'
                     } border focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2`}
                   />
                 </div>
                 <textarea
                   placeholder="输入内容..."
                   className={`flex-1 w-full px-4 py-2 rounded-lg ${
                     theme === 'dark'
                       ? 'bg-gray-700 text-white border-gray-600'
                       : 'bg-white text-gray-800 border-gray-300'
                   } border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                 ></textarea>
                 <div className="mt-4 flex justify-end">
                   <button
                     className={`px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors`}
                   >
                     保存
                   </button>
                 </div>
               </div>
            ) : (
              // 其他应用的通用内容
              <>
                <h2 className="text-xl font-bold mb-4">{window.title}</h2>
                <p className="mb-4">
                  这是 {window.title} 应用的内容区域。在此可以放置应用的具体功能和信息。
                </p>
                
                {/* 模拟应用内容 */}
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="font-medium mb-2">功能区域</h3>
                    <div className="space-y-2">
                      <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} flex justify-between items-center`}>
                        <span>项目 1</span>
                        <button className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>操作</button>
                      </div>
                      <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} flex justify-between items-center`}>
                        <span>项目 2</span>
                        <button className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>操作</button>
                      </div>
                      <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} flex justify-between items-center`}>
                        <span>项目 3</span>
                        <button className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>操作</button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 模拟工具栏 */}
                  <div className={`flex space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <button className={`p-2 rounded hover:bg-opacity-20 hover:bg-white transition-colors`}>
                      <i className="fa-solid fa-file"></i>
                    </button>
                    <button className={`p-2 rounded hover:bg-opacity-20 hover:bg-white transition-colors`}>
                      <i className="fa-solid fa-save"></i>
                    </button>
                    <button className={`p-2 rounded hover:bg-opacity-20 hover:bg-white transition-colors`}>
                      <i className="fa-solid fa-print"></i>
                    </button>
                    <div className={`h-6 w-px mx-1 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                    <button className={`p-2 rounded hover:bg-opacity-20 hover:bg-white transition-colors`}>
                      <i className="fa-solid fa-copy"></i>
                    </button>
                    <button className={`p-2 rounded hover:bg-opacity-20 hover:bg-white transition-colors`}>
                      <i className="fa-solid fa-paste"></i>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
              
          

          {/* 窗口右下角大小调整指示器 */}
          {!window.isMaximized && (
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
              style={{ 
                backgroundImage: theme === 'dark' 
                  ? 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 50%)' 
                  : 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)'
              }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Window;