import React, { useState, useEffect, useRef, useContext } from 'react';
import { toast } from 'sonner';
import MenuBar from '../components/MenuBar';
import Dock from '../components/Dock';
import Window from '../components/Window';
import { useTheme } from '../hooks/useTheme';
import NameSettings from '../components/NameSettings';
import { SakuraContext } from '../App';

// 应用类型定义
interface App {
  id: string;
  name: string;
  iconClass: string;
  iconColor: string;
}

// 壁纸类型定义
interface Wallpaper {
  id: string;
  name: string;
  lightUrl: string;
  darkUrl: string;
  localPath?: string; // 本地文件路径
}

  // 模拟应用数据 - 彩色图标
  const apps: App[] = [
    { id: 'finder', name: 'Finder', iconClass: 'fa-brands fa-apple', iconColor: 'white' },
    { id: 'safari', name: 'Safari', iconClass: 'fa-brands fa-safari', iconColor: 'blue-500' },
    { id: 'mail', name: 'Mail', iconClass: 'fa-solid fa-envelope', iconColor: 'red-500' },
    { id: 'photos', name: 'Photos', iconClass: 'fa-solid fa-images', iconColor: 'purple-500' },
    { id: 'music', name: 'Music', iconClass: 'fa-brands fa-spotify', iconColor: 'green-500' },
    { id: 'terminal', name: 'Terminal', iconClass: 'fa-solid fa-terminal', iconColor: 'green-400' },
    { id: 'notes', name: '记事本', iconClass: 'fa-solid fa-note-sticky', iconColor: 'yellow-500' },
    { id: 'settings', name: '设置', iconClass: 'fa-solid fa-gear', iconColor: 'gray-400' },
    { id: 'love-notes', name: '心情便签', iconClass: 'fa-solid fa-heart', iconColor: 'rose-500' },
  ];

// 壁纸选项数据
// 默认使用本地的壁纸
const wallpapers: Wallpaper[] = [
  {
    id: 'coffee',
    name: '默认壁纸',
    lightUrl: '/src/assets/image/wallpaper/coffe.png',
    darkUrl: '/src/assets/image/wallpaper/coffe.png',
    localPath: '/src/assets/image/wallpaper/coffe.png'
  }
];

// 窗口类型定义
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

 // 心情便签语句数组
  const loveNoteMessages = [
    "每一天都有你的陪伴，是最美好的礼物。",
    "世界很大，但我的眼里只有你。",
    "你的笑容，是我每天最大的幸福。",
    "无论晴天还是雨天，有你在就很温暖。",
    "感谢生命中遇见你，让我懂得了爱的意义。",
    "想和你一起看遍世间所有的美景。",
    "你的每一个小习惯，我都记在心里。",
    "有你在的日子，连空气都是甜的。",
    "爱你，不仅仅是今天，而是每一天。",
    "和你在一起的时光，是我最珍贵的回忆。",
    "你是我生命中最美的风景。",
    "遇到你，是我这辈子最幸运的事。",
    "想和你一起慢慢变老，看遍世间繁华。",
    "你的存在，让我的世界变得更加美好。",
    "爱不是一时的热情，而是长久的陪伴。",
    "无论何时何地，我都会在你身边。",
    "你的声音，是我最喜欢的旋律。",
    "有你的地方，就是我的家。",
    "谢谢你出现在我的生命里，让我感受到了爱。",
    "我会用我的一生，去珍惜你，爱护你。",
    "你的一个微笑，就能让我开心一整天。",
    "和你在一起的每一刻，都值得珍藏。",
    "我对你的爱，如星辰大海，永不干涸。",
    "想牵着你的手，走过春夏秋冬。",
    "你是我生命中最重要的人，没有之一。",
    "有你在，再苦再累也是甜的。",
    "你的拥抱，是我最温暖的港湾。",
    "我愿意用我的一切，换取你的幸福。",
    "你是我心中永远的唯一。",
    "和你在一起，我感到无比的幸福和满足。",
    "你的爱，是我前进的动力。",
    "无论发生什么，我都会坚定地站在你身边。",
    "你是我生命中最美的相遇。",
    "我会好好爱你，珍惜你，直到永远。",
    "有你的陪伴，再平凡的日子也变得不平凡。",
    "你的眼里有星光，照亮了我的整个世界。",
    "想和你一起，创造更多美好的回忆。",
    "你是我这辈子最想要的人。",
    "爱你，是我做过最正确的决定。",
    "你的温柔，是我最贪恋的幸福。",
    "无论距离多远，我的心永远和你在一起。",
    "你是我生命中最美好的礼物。",
    "有你在的每一天，都是晴天。",
    "我会用我的一生，去爱你，守护你。",
    "你的每一个小细节，都让我心动不已。",
    "和你在一起，时间总是过得太快。",
    "我对你的爱，从未改变，也永远不会改变。",
    "你是我生命中最珍贵的宝藏。",
    "想和你一起，走过人生的每一个阶段。",
    "你的存在，让我感到无比的安心和幸福。"
  ];

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

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { sakuraActive, setSakuraActive } = useContext(SakuraContext);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false
  });
  const [selectedWallpaper, setSelectedWallpaper] = useState<string>('default');
  const [showWallpaperDirInfo, setShowWallpaperDirInfo] = useState(false); // 控制壁纸目录信息显示
  const [sakuraEffectEnabled, setSakuraEffectEnabled] = useState(true); // 控制樱花特效开关
  const [showSettings, setShowSettings] = useState(false); // 控制设置窗口显示
  // 不需要名字设置相关的状态
  
  // 桌面元素引用
  const desktopRef = useRef<HTMLDivElement>(null);

  // 打开应用窗口
  const openApp = (app: App) => {
    setActiveAppId(app.id);
    
    // 对于"设置"应用的处理
    if (app.id === 'settings') {
      setShowSettings(true);
      return;
    }
    
    // 对于"心情便签"应用的特殊处理
    if (app.name === '心情便签' || app.id === 'love-notes') {
      console.log('Opening love notes app');
      
      // 只有在樱花特效开启时才激活
      if (sakuraEffectEnabled) {
        console.log('Activating sakura effect');
        setSakuraActive(true);
        
        // 设置30秒后自动停止樱花特效
        setTimeout(() => {
          console.log('Stopping sakura effect after 30 seconds');
          setSakuraActive(false);
        }, 30000);
      } else {
        console.log('Sakura effect is disabled in settings');
      }
        
        // 统计已有的"心情便签"窗口数量
        const loveNoteWindowsCount = windows.filter(w => 
          w.title === '心情便签' && !w.isMinimized
        ).length;
        
        // 检查是否已达到窗口数量限制
        if (loveNoteWindowsCount >= 520) {
          toast('已达到最大窗口数量限制（520个）');
          return;
        }
        
        // 计算还需要创建的窗口数量
        const windowsToCreate = Math.min(520 - loveNoteWindowsCount, 520);
        
        // 设置固定的窗口大小 - 增加高度以确保文本完整显示
        const windowWidth = 220;
        const windowHeight = 140;
        
        // 依次创建窗口
        for (let i = 0; i < windowsToCreate; i++) {
          // 使用setTimeout实现窗口依次弹出的效果
          setTimeout(() => {
            // 选择便签语句（由于需要520条，会重复使用现有消息模板）
            const messageTemplate = loveNoteMessages[i % loveNoteMessages.length];
            
            // 使用便签消息
            const message = messageTemplate;
          
          // 计算屏幕可用区域
          const availableWidth = window.innerWidth - windowWidth;
          const availableHeight = window.innerHeight - windowHeight - 96; // 减去Dock栏高度
          
          // 生成完全随机的位置
          const randomX = Math.floor(Math.random() * availableWidth);
          const randomY = Math.floor(Math.random() * availableHeight) + 8; // 加上菜单栏高度
          
           // 创建新窗口
           const newWindow: BirthdayWindowState = {
             id: `window-${Date.now()}-${i}`,
             title: app.name,
             message: message,
             color: getRandomColor(), // 为每个窗口分配一个随机颜色
             width: windowWidth,
             height: windowHeight,
             x: randomX,
             y: randomY,
             zIndex: nextZIndex + i,
             isMaximized: false,
             isMinimized: false
           };
          
          setWindows(prevWindows => {
             // 再次检查窗口数量，避免并发操作导致超过限制
             const currentCount = prevWindows.filter(w => 
               w.title === '心情便签' && !w.isMinimized
            ).length;
            
            if (currentCount < 520) {
              return [...prevWindows, newWindow];
            }
            return prevWindows;
          });
        }, i * 30); // 每个窗口间隔30毫秒弹出，保持弹窗速度
      }
      
      // 更新zIndex
      setNextZIndex(prev => prev + windowsToCreate);
    }
    // 其他应用的正常处理逻辑
    else {
      // 检查应用是否已经打开
      const existingWindow = windows.find(w => w.title === app.name);
      
      if (existingWindow) {
        // 如果已最小化，则恢复窗口
        if (existingWindow.isMinimized) {
          setWindows(windows.map(w => 
            w.id === existingWindow.id 
              ? { ...w, isMinimized: false, zIndex: nextZIndex } 
              : w
          ));
        }
        // 把窗口置于顶层
        else {
          setWindows(windows.map(w => 
            w.id === existingWindow.id 
              ? { ...w, zIndex: nextZIndex } 
              : w
          ));
        }
        setNextZIndex(prev => prev + 1);
      } else {
        // 创建新窗口
        const newWindow: WindowState = {
          id: `window-${Date.now()}`,
          title: app.name,
          width: app.id === 'name-settings' ? 480 : 800,
          height: app.id === 'name-settings' ? 400 : 600,
          x: app.id === 'name-settings' ? (window.innerWidth - 480) / 2 : 100,
          y: app.id === 'name-settings' ? (window.innerHeight - 400) / 2 : 100,
          zIndex: nextZIndex,
          isMaximized: false,
          isMinimized: false
        };
        
        setWindows([...windows, newWindow]);
        setNextZIndex(prev => prev + 1);
      }
    }
  };

  // 关闭窗口
  const closeWindow = (windowId: string) => {
    setWindows(windows.filter(w => w.id !== windowId));
    
    // 如果关闭的是最后一个窗口，清除活跃应用
    if (windows.length === 1) {
      setActiveAppId(null);
    }
  };

  // 最小化窗口
  const minimizeWindow = (windowId: string) => {
    setWindows(windows.map(w => 
      w.id === windowId 
        ? { ...w, isMinimized: true } 
        : w
    ));
  };

  // 最大化窗口
  const maximizeWindow = (windowId: string) => {
    setWindows(windows.map(w => 
      w.id === windowId 
        ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZIndex } 
        : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  // 更新窗口位置和大小
  const updateWindow = (windowId: string, updates: Partial<WindowState>) => {
    setWindows(windows.map(w => 
      w.id === windowId 
        ? { ...w, ...updates, zIndex: nextZIndex } 
        : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  // 切换暗黑模式
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  }, [theme]);

  // 处理右键菜单显示
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true
    });
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu({
      x: 0,
      y: 0,
      visible: false
    });
  };

  // 点击其他区域关闭右键菜单
  useEffect(() => {
    const handleClickOutside = () => {
      closeContextMenu();
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [contextMenu.visible]);

  // 选择壁纸
  const selectWallpaper = (wallpaperId: string) => {
    setSelectedWallpaper(wallpaperId);
    closeContextMenu();
    
    // 保存壁纸选择到本地存储
    localStorage.setItem('selectedWallpaper', wallpaperId);
  };

  // 从本地存储加载壁纸选择
  useEffect(() => {
    const savedWallpaper = localStorage.getItem('selectedWallpaper');
    if (savedWallpaper) {
      setSelectedWallpaper(savedWallpaper);
    }
  }, []);

  // 上传壁纸处理函数
  const handleUploadWallpaper = async () => {
    // 创建隐藏的文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          // 将图片转换为DataURL
          const dataUrl = await readFileAsDataURL(file);
          
          // 保存到本地存储
          localStorage.setItem('customWallpaper', dataUrl);
          localStorage.setItem('selectedWallpaper', 'custom');
          
          // 更新状态
          setSelectedWallpaper('custom');
          closeContextMenu();
          
          toast('壁纸上传成功！');
        } catch (error) {
          toast('上传壁纸失败，请重试。');
          console.error('Upload error:', error);
        }
      }
    };
    
    // 触发文件选择对话框
    input.click();
  };

  // 读取文件为DataURL的辅助函数
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  const getCurrentWallpaperUrl = () => {
    // 检查是否选择了自定义壁纸
    if (selectedWallpaper === 'custom') {
      const customWallpaper = localStorage.getItem('customWallpaper');
      if (customWallpaper) {
        return customWallpaper;
      }
    }
    
    // 否则使用预设壁纸 - 统一使用lightUrl作为通用壁纸
    const wallpaper = wallpapers.find(w => w.id === selectedWallpaper) || wallpapers[0];
    
    // 尝试使用本地壁纸路径（如果可用）
    // 注意：在实际部署时，可能需要调整路径或使用import语句
    if (wallpaper.localPath) {
      // 在实际项目中，这里应该返回正确的本地路径
      // 由于当前环境限制，我们仍然使用URL
      return wallpaper.lightUrl; 
    }
    
    return wallpaper.lightUrl; // 始终返回lightUrl版本，不再根据主题切换
  };

  return (
    <div 
      ref={desktopRef}
      className="relative w-full h-screen overflow-hidden"
      onContextMenu={handleRightClick}
    >
      {/* 桌面背景 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getCurrentWallpaperUrl()})` }}
      />

      {/* 菜单栏 */}
      <MenuBar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activeAppId={activeAppId}
      />

      {/* 窗口容器 */}
      <div className="relative w-full h-full pt-8 pb-20">
        {windows
          .filter(window => !window.isMinimized)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map(window => (
            <Window
              key={window.id}
              window={window}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onUpdate={(updates) => updateWindow(window.id, updates)}
              theme={theme}
            />
          ))}
      </div>

      {/* Dock栏 */}
      <Dock 
        apps={apps} 
        onOpenApp={openApp} 
        activeAppId={activeAppId} 
        theme={theme}
      />

       {/* 右键菜单 */}
      {contextMenu.visible && (
        <div 
          className={`absolute z-50 shadow-lg rounded-lg overflow-hidden border ${
            theme === 'dark' 
              ? 'bg-gray-800 text-white border-gray-700' 
              : 'bg-white text-gray-800 border-gray-300'
          }`}
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            minWidth: '180px'
          }}
        >
          <div className="p-2 border-b border-gray-700 font-medium">更换桌面壁纸</div>
          {wallpapers.map(wallpaper => (
            <div 
              key={wallpaper.id}
              className={`p-2 cursor-pointer hover:bg-opacity-20 hover:bg-white transition-colors ${
                selectedWallpaper === wallpaper.id ? 'bg-opacity-10 bg-blue-500' : ''
              }`}
              onClick={() => selectWallpaper(wallpaper.id)}
            >
              {wallpaper.name}
            </div>
          ))}
          
           {/* 上传自定义壁纸选项 */}
           <div className="h-px bg-gray-700 my-1"></div>
           <div 
             className="p-2 cursor-pointer hover:bg-opacity-20 hover:bg-white transition-colors"
             onClick={handleUploadWallpaper}
           >
             <i className="fa-solid fa-upload mr-2"></i>上传图片作为壁纸
           </div>
           
           {/* 本地壁纸目录选项 */}
           <div 
             className="p-2 cursor-pointer hover:bg-opacity-20 hover:bg-white transition-colors"
             onClick={() => {
               setShowWallpaperDirInfo(true);
               toast('预设壁纸存放在: src/assets/images/wallpapers/');
               closeContextMenu();
               
               // 3秒后自动隐藏信息提示
               setTimeout(() => {
                 setShowWallpaperDirInfo(false);
               }, 3000);
             }}
           >
             <i className="fa-solid fa-folder-open mr-2"></i>查看壁纸目录
           </div>
           
           {/* 如果有自定义壁纸，显示删除选项 */}
           {selectedWallpaper === 'custom' && (
             <div 
               className="p-2 cursor-pointer hover:bg-opacity-20 hover:bg-white transition-colors text-red-400"
               onClick={() => {
                 localStorage.removeItem('customWallpaper');
                 setSelectedWallpaper('macos-landscape');
                 localStorage.setItem('selectedWallpaper', 'macos-landscape');
                 closeContextMenu();
                 toast('自定义壁纸已删除');
               }}
             >
               <i className="fa-solid fa-trash-can mr-2"></i>删除自定义壁纸
             </div>
           )}
         </div>
       )}
       
       {/* 壁纸目录提示 */}
       {showWallpaperDirInfo && (
         <div className="wallpaper-directory-info animate-fade-in">
           预设壁纸存放在: src/assets/images/wallpapers/
         </div>
       )}
       
       {/* 设置窗口 */}
       {showSettings && (
         <div className={`fixed inset-0 flex items-center justify-center z-50 ${theme === 'dark' ? 'bg-black bg-opacity-50' : 'bg-white bg-opacity-50'}`}>
           <div className={`w-80 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
             <div className="p-4 border-b border-gray-700 flex justify-between items-center">
               <h3 className="font-medium">设置</h3>
               <button 
                 onClick={() => setShowSettings(false)} 
                 className="text-gray-400 hover:text-white"
               >
                 <i className="fa-solid fa-times"></i>
               </button>
             </div>
             <div className="p-4">
               <div className="flex items-center justify-between py-3 border-b border-gray-700">
                 <label className="flex items-center">
                   <i className="fa-solid fa-heart mr-2 text-rose-500"></i>
                   心情便签樱花特效
                 </label>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input 
                     type="checkbox" 
                     checked={sakuraEffectEnabled} 
                     onChange={(e) => setSakuraEffectEnabled(e.target.checked)}
                     className="sr-only peer"
                   />
                   <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-rose-500 transition-colors"></div>
                   <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                 </label>
               </div>
               <div className="mt-4 text-gray-400 text-sm">
                 关闭樱花特效可以在便签增多时提高性能
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
}