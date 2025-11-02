import React, { useState } from 'react';

interface MenuBarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeAppId: string | null;
}

interface MenuItem {
  label: string;
  submenu?: {
    label: string;
    shortcut?: string;
    onClick?: () => void;
  }[];
}

const MenuBar: React.FC<MenuBarProps> = ({ theme, toggleTheme, activeAppId }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // 应用菜单
  const appMenu: MenuItem = {
    label: 'App',
    submenu: [
      { label: '关于 App', shortcut: '⌘+' },
      { label: '服务', shortcut: '⌘+⇧+G' },
      { label: '', divider: true },
      { label: '隐藏 App', shortcut: '⌘+H' },
      { label: '隐藏其他', shortcut: '⌘+⌥+H' },
      { label: '', divider: true },
      { label: '退出 App', shortcut: '⌘+Q' },
    ],
  };

  // 文件菜单
  const fileMenu: MenuItem = {
    label: '文件',
    submenu: [
      { label: '新建', shortcut: '⌘+N' },
      { label: '打开', shortcut: '⌘+O' },
      { label: '打开最近使用', shortcut: '⌘+⇧+O' },
      { label: '', divider: true },
      { label: '保存', shortcut: '⌘+S' },
      { label: '另存为...', shortcut: '⌘+⇧+S' },
      { label: '导出...', shortcut: '⌘+E' },
      { label: '', divider: true },
      { label: '打印...', shortcut: '⌘+P' },
      { label: '', divider: true },
      { label: '关闭', shortcut: '⌘+W' },
    ],
  };

  // 编辑菜单
  const editMenu: MenuItem = {
    label: '编辑',
    submenu: [
      { label: '撤销', shortcut: '⌘+Z' },
      { label: '重做', shortcut: '⌘+⇧+Z' },
      { label: '', divider: true },
      { label: '剪切', shortcut: '⌘+X' },
      { label: '拷贝', shortcut: '⌘+C' },
      { label: '粘贴', shortcut: '⌘+V' },
      { label: '删除', shortcut: '⌫' },
      { label: '', divider: true },
      { label: '全选', shortcut: '⌘+A' },
      { label: '查找', shortcut: '⌘+F' },
    ],
  };

  // 视图菜单
  const viewMenu: MenuItem = {
    label: '视图',
    submenu: [
      { label: '进入全屏幕', shortcut: '⌃+⌘+F' },
      { label: '', divider: true },
      { label: '自定工具栏...' },
      { label: '自定快捷键...' },
    ],
  };

  // 窗口菜单
  const windowMenu: MenuItem = {
    label: '窗口',
    submenu: [
      { label: '最小化', shortcut: '⌘+M' },
      { label: '缩放', shortcut: '⌘+⇧+M' },
      { label: '', divider: true },
      { label: '前置所有窗口', shortcut: '⌃+⌘+F' },
    ],
  };

  // 帮助菜单
  const helpMenu: MenuItem = {
    label: '帮助',
    submenu: [
      { label: 'App 帮助', shortcut: '⌘+?' },
      { label: '检查更新...' },
    ],
  };

  const menus = [appMenu, fileMenu, editMenu, viewMenu, windowMenu, helpMenu];

  // 处理菜单点击
  const handleMenuClick = (menuLabel: string) => {
    setActiveMenu(activeMenu === menuLabel ? null : menuLabel);
  };

  // 处理点击其他区域关闭菜单
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 h-8 z-50 flex items-center px-4 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-200 text-gray-800'
    }`}>
      {/* 苹果图标 */}
      <div className="flex items-center mr-4">
        <i className="fa-brands fa-apple text-xl"></i>
      </div>

      {/* 菜单列表 */}
      <div className="flex space-x-4">
        {menus.map((menu) => (
          <div 
            key={menu.label} 
            className="relative group"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(menu.label);
            }}
          >
            <div className="px-2 py-1 text-sm cursor-pointer hover:bg-opacity-20 hover:bg-white">
              {menu.label}
            </div>
            
            {/* 子菜单 */}
            {(activeMenu === menu.label || (activeMenu === null && document.querySelector('.group:hover'))) && (
              <div className={`absolute top-full left-0 w-64 shadow-lg z-50 ${
                theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
              }`}>
                {menu.submenu?.map((item, index) => (
                  item.divider ? (
                    <div key={index} className="h-px bg-gray-400 my-1"></div>
                  ) : (
                    <div 
                      key={index} 
                      className={`px-4 py-2 text-sm flex justify-between items-center cursor-pointer hover:bg-opacity-20 hover:bg-white ${
                        item.onClick ? 'opacity-100' : 'opacity-50'
                      }`}
                      onClick={item.onClick}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && <span className="text-xs">{item.shortcut}</span>}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 右侧状态区域 */}
      <div className="ml-auto flex items-center space-x-2">
        {/* 搜索图标 */}
        <i className="fa-solid fa-magnifying-glass text-sm cursor-pointer"></i>
        
        {/* 通知图标 */}
        <i className="fa-solid fa-bell text-sm cursor-pointer"></i>
        
        {/* 电池图标 */}
        <i className="fa-solid fa-battery-three-quarters text-sm"></i>
        
        {/* 时间显示 */}
        <div className="text-sm px-2">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {/* 主题切换 */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          className="p-1 rounded-full hover:bg-opacity-20 hover:bg-white"
        >
          <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
        </button>
      </div>
    </div>
  );
};

export default MenuBar;