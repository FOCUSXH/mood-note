import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NameSettingsProps {
  onNameChange: (name: string) => void;
  currentName: string;
  theme: 'light' | 'dark';
}

const NameSettings: React.FC<NameSettingsProps> = ({ 
  onNameChange, 
  currentName,
  theme
}) => {
  const [inputName, setInputName] = useState(currentName);
  
  // 同步外部名字变化
  useEffect(() => {
    setInputName(currentName);
  }, [currentName]);
  
  const handleSave = () => {
    onNameChange(inputName.trim());
    toast('名字设置已保存');
  };
  
  const handleClear = () => {
    setInputName('');
    onNameChange('');
    toast('名字已清除');
  };

  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-xl font-bold mb-6">生日祝福设置</h2>
      
      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label 
            className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            输入祝福对象的名字
          </label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="例如：小明、小红（留空则不显示称呼）"
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            maxLength={20}
          />
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            设置后，生日祝福将包含您输入的名字
          </p>
        </div>
        
        <div className="mt-auto pt-4">
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className={`flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors`}
            >
              保存设置
            </button>
            <button
              onClick={handleClear}
              className={`flex-1 px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } font-medium transition-colors`}
            >
              清除名字
            </button>
          </div>
        </div>
      </div>
      
      <div className={`mt-6 p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <h3 className="font-medium mb-2">使用说明</h3>
        <ul className={`text-sm space-y-1 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <li>• 输入名字后，生日祝福会自动带上该称呼</li>
          <li>• 留空则不显示任何称呼</li>
          <li>• 点击"生日快乐"应用查看效果</li>
        </ul>
      </div>
    </div>
  );
};

export default NameSettings;