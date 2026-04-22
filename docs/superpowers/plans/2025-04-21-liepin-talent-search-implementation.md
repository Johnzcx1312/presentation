

- [ ] **Step 2: 创建FilterTag组件**

```jsx
import React from 'react';
import { X, Bell } from 'lucide-react';

const FilterTag = ({ label, count, isNew, isSubscribed, onClick, onSubscribe }) => {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={onClick}
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 text-sm rounded border transition-all duration-200
          ${isSubscribed 
            ? 'bg-purple-50 border-primary text-primary' 
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
          }
        `}
      >
        <span>{label}</span>
        {isNew && (
          <span className="text-xs text-red-500">新增{count}</span>
        )}
        {count > 0 && !isNew && (
          <span className="text-xs text-gray-400">{count}</span>
        )}
      </button>
      
      <button
        onClick={onSubscribe}
        className={`
          p-1 rounded transition-colors
          ${isSubscribed ? 'text-primary hover:bg-purple-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}
        `}
        title={isSubscribed ? '取消订阅' : '订阅'}
      >
        <Bell size={14} />
      </button>
    </div>
  );
};

export default FilterTag;
```

- [ ] **Step 3: 创建SelectedFilters组件**

```jsx
import React from 'react';
import { X } from 'lucide-react';

const SelectedFilters = ({ filters, onRemove, onClearAll }) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
      <span className="text-sm text-gray-500">已选条件：</span>
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        {filters.map((filter, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-primary rounded border border-purple-100"
          >
            {filter}
            <button
              onClick={() => onRemove(filter)}
              className="hover:text-primary-dark"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="text-sm text-gray-500 hover:text-primary flex items-center gap-1"
      >
        <X size={14} />
        清除全部
      </button>
      <button className="text-sm text-primary hover:text-primary-dark font-medium">
        保存搜索条件
      </button>
    </div>
  );
};

export default SelectedFilters;
```

- [ ] **Step 4: 创建FilterSection主组件**

```jsx
import React, { useState } from 'react';
import FilterGroup from './FilterGroup';
import FilterTag from './FilterTag';
import SelectedFilters from './SelectedFilters';
import { filterOptions } from '../../data/mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = () => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(['30-35岁', '本科', '硕士', '5年以上', '北京', '统招本科']);
  const [subscribedTags, setSubscribedTags] = useState(['运营_数据_分析_3']);

  const handleRemoveFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const handleClearAll = () => {
    setSelectedFilters([]);
  };

  const handleSubscribeTag = (tag) => {
    setSubscribedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 更多筛选项数据
  const moreFilters = [
    { title: '活跃状态', options: ['不限', '今日活跃', '3天内活跃', '7天内活跃', '30天内活跃'] },
    { title: '求职状态', options: ['不限', '在职-暂不考虑', '在职-考虑机会', '离职-随时到岗'] },
    { title: '跳槽频率', options: ['不限', '稳定（>3年）', '正常（1-3年）', '频繁（<1年）'] },
    { title: '性别要求', options: ['不限', '男', '女'] },
    { title: '语言要求', options: ['不限', '英语', '日语', '韩语', '其他'] },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      {/* 快捷搜索标签 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm text-gray-500">快捷搜索</span>
        <div className="flex items-center gap-3">
          {filterOptions.quickFilters.map((filter, index) => (
            <FilterTag
              key={index}
              label={filter.label}
              count={filter.count}
              isNew={filter.isNew}
              isSubscribed={subscribedTags.includes(filter.label)}
              onClick={() => {}}
              onSubscribe={() => handleSubscribeTag(filter.label)}
            />
          ))}
        </div>
      </div>

      {/* 基础筛选组 */}
      <FilterGroup title="目前城市" options={filterOptions.currentCities} />
      <FilterGroup title="期望城市" options={filterOptions.expectCities} />
      
      {/* 工作经验（含自定义输入） */}
      <div className="flex items-start gap-4 py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500 w-16 flex-shrink-0 pt-1">经验</span>
        <div className="flex-1 flex flex-wrap items-center gap-2">
          {filterOptions.experience.map((option) => (
            <button
              key={option}
              className={`px-3 py-1 text-sm rounded transition-all ${option === '不限' ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
            >
              {option}
            </button>
          ))}
          <span className="text-sm text-primary ml-2">自定义</span>
          <div className="flex items-center gap-1 ml-2">
            <input 
              type="text" 
              placeholder="5" 
              className="w-12 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:border-primary focus:outline-none"
            />
            <span className="text-sm text-gray-500">-</span>
            <input 
              type="text" 
              placeholder="" 
              className="w-12 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:border-primary focus:outline-none"
            />
            <span className="text-sm text-gray-500">年</span>
          </div>
        </div>
      </div>

      <FilterGroup title="教育经历" options={filterOptions.education} />

      {/* 更多筛选 */}
      {showMoreFilters && (
        <div className="mt-2 border-t border-gray-100 pt-2">
          {moreFilters.map((filter) => (
            <FilterGroup 
              key={filter.title} 
              title={filter.title} 
              options={filter.options}
              multiSelect={true}
            />
          ))}
        </div>
      )}

      {/* 展开/收起更多筛选 */}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
        >
          {showMoreFilters ? (
            <>
              <ChevronUp size={16} />
              收起更多条件
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              展开更多条件
            </>
          )}
        </button>
      </div>

      {/* 已选条件 */}
      <SelectedFilters 
        filters={selectedFilters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default FilterSection;
```

- [ ] **Step 5: 提交筛选区组件**

```bash
cd "/Users/liepin/Downloads/search demo"
git add src/components/FilterSection/
git commit -m "feat: 添加筛选条件区组件，包含城市、经验、学历等多维度筛选"
```

---

## Task 7: 创建人才卡片和列表组件

**Files:**
- Create: `src/components/TalentList/TalentCard.jsx`
- Create: `src/components/TalentList/TalentList.jsx`

- [ ] **Step 1: 创建TalentCard组件**

```jsx
import React from 'react';
import Button from '../common/Button';
import { User, Briefcase, Clock, MapPin, GraduationCap, Zap, MessageCircle } from 'lucide-react';

const TalentCard = ({ talent }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 hover:border-purple-200">
      <div className="flex gap-4">
        {/* 左侧：头像和状态 */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              {talent.gender === 'female' ? (
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                  <User size={28} className="text-pink-400" />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <User size={28} className="text-blue-400" />
                </div>
              )}
            </div>
            
            {/* 在线状态 */}
            {talent.isOnline && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          
          {/* 活跃状态 */}
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-400">{talent.status}</span>
          </div>
        </div>

        {/* 中间：基本信息 */}
        <div className="flex-1 min-w-0">
          {/* 姓名和基本信息行 */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{talent.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{talent.age}岁</span>
              <span className="text-gray-300">|</span>
              <span>{talent.experience}</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <GraduationCap size={14} />
                {talent.education}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {talent.city}
              </span>
            </div>
          </div>

          {/* 期望职位 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-500">期望:</span>
            <span className="text-gray-700">{talent.expectCity}</span>
            <span className="text-gray-900 font-medium">{talent.expectPosition}</span>
            <span className="text-primary font-semibold">{talent.salary}</span>
          </div>

          {/* 标签 */}
          <div className="flex items-center gap-2 mb-4">
            {talent.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 工作经历时间线 */}
          <div className="space-y-2">
            {talent.workExperience.slice(0, 4).map((work, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Briefcase size={14} className="text-gray-400" />
                  <span className="font-medium">{work.company}</span>
                  <span className="text-gray-500">{work.position}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs ml-auto">
                  <Clock size={12} />
                  <span>{work.period}</span>
                  <span className="text-gray-300">({work.duration})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <Button variant="primary" size="sm" className="whitespace-nowrap">
            <MessageCircle size={14} className="mr-1" />
            立即沟通
          </Button>
          <Button variant="ghost" size="sm" className="whitespace-nowrap text-xs">
            <Zap size={14} className="mr-1" />
            AI智能分析
          </Button>
        </div>
      </div>

      {/* 底部复选框 */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-500">选择</span>
        </label>
      </div>
    </div>
  );
};

export default TalentCard;
```

- [ ] **Step 2: 创建TalentList组件**

```jsx
import React, { useState } from 'react';
import TalentCard from './TalentCard';
import { talentList } from '../../data/mockData';
import { SlidersHorizontal, Eye, EyeOff, FileText, Star, ChevronDown } from 'lucide-react';

const TalentList = () => {
  const [sortBy, setSortBy] = useState('智能排序');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [hideViewed, setHideViewed] = useState(false);
  const [matchRecent, setMatchRecent] = useState(false);
  const [selectedTalents, setSelectedTalents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const sortOptions = ['智能排序', '最新活跃', '最近更新', '沟通优先'];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTalents([]);
    } else {
      setSelectedTalents(talentList.map(t => t.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 结果统计栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">共有</span>
            <span className="text-primary font-semibold">{talentList.length * 77}</span>
            <span className="text-sm text-gray-500">份简历</span>
          </div>
          
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-primary bg-purple-50 rounded border border-purple-100 hover:bg-purple-100 transition-colors">
            <FileText size={14} />
            AI简历快读
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* 排序下拉 */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-2 py-1"
            >
              <SlidersHorizontal size={14} />
              {sortBy}
              <ChevronDown size={14} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                {sortOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${sortBy === option ? 'text-primary bg-purple-50' : 'text-gray-700'}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 筛选状态 */}
          <button className="text-sm text-gray-600 hover:text-gray-900">
            沟通状态
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            获取联系方式状态
          </button>

          {/* 开关选项 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">隐藏已查看</span>
            <button
              onClick={() => setHideViewed(!hideViewed)}
              className={`w-8 h-4 rounded-full transition-colors relative ${hideViewed ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${hideViewed ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">只匹配最近一段工作</span>
            <button
              onClick={() => setMatchRecent(!matchRecent)}
              className={`w-8 h-4 rounded-full transition-colors relative ${matchRecent ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${matchRecent ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </label>

          {/* 收藏夹 */}
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <Star size={14} />
            收藏夹
          </button>
        </div>
      </div>

      {/* 人才卡片列表 */}
      <div className="divide-y divide-gray-100">
        {talentList.map((talent) => (
          <div key={talent.id} className="px-4 py-2">
            <TalentCard talent={talent} />
          </div>
        ))}
      </div>

      {/* 底部批量操作栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
          />
          <span className="text-sm text-gray-600">全选</span>
        </label>

        <button className="flex items-center gap-2 px-4 py-2 text-sm text-primary bg-white border border-primary rounded hover:bg-purple-50 transition-colors">
          <FileText size={16} />
          浏览简历
        </button>
      </div>
    </div>
  );
};

export default TalentList;
```

- [ ] **Step 3: 提交人才列表组件**

```bash
cd "/Users/liepin/Downloads/search demo"
git add src/components/TalentList/
git commit -m "feat: 添加人才卡片和列表组件，支持排序、筛选和批量操作"
```

---

## Task 8: 创建主应用组件和整合

**Files:**
- Create: `src/App.jsx`

- [ ] **Step 1: 创建App主组件**

```jsx
import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import SearchHeader from './components/SearchHeader/SearchHeader';
import FilterSection from './components/FilterSection/FilterSection';
import TalentList from './components/TalentList/TalentList';

function App() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* 侧边栏 - 固定定位 */}
      <Sidebar />

      {/* 主内容区 */}
      <main className="ml-[200px] p-4">
        {/* 顶部导航栏（模拟） */}
        <div className="h-14 bg-white rounded-lg shadow-sm mb-4 flex items-center px-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-700 font-medium">搜索人才</span>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-gray-500">招聘数据</span>
              <span className="text-gray-500">VIP</span>
              <span className="text-gray-500">我的权益</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">赵</span>
                </div>
                <span className="text-gray-700 text-sm">赵呈祥</span>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索区域 */}
        <SearchHeader />

        {/* 筛选区域 */}
        <FilterSection />

        {/* 人才列表区域 */}
        <TalentList />
      </main>
    </div>
  );
}

export default App;
```

- [ ] **Step 2: 提交主应用组件**

```bash
cd "/Users/liepin/Downloads/search demo"
git add src/App.jsx
git commit -m "feat: 整合所有组件到主应用，完成页面布局"
```

---

## Task 9: 创建README文档

**Files:**
- Create: `README.md`

- [ ] **Step 1: 创建README.md**

```markdown
# 猎聘AI人才搜索 Demo

这是一个复刻猎聘平台人才搜索页面的高保真可交互Demo，基于React + Vite + Tailwind CSS构建。

## 项目概述

本项目作为AI人才搜索功能的基础框架，完整复刻了猎聘平台的人才搜索界面，包含：
- 侧边导航栏（Logo、菜单、服务热线）
- 顶部搜索区（职位选择、关键词标签、AI智搜）
- 筛选条件区（城市、经验、学历等多维度筛选）
- 人才列表（卡片式展示，含头像、基本信息、工作经历）

## 技术栈

- **框架**: React 18
- **构建工具**: Vite 5
- **样式**: Tailwind CSS 3.4
- **图标**: Lucide React
- **包管理**: npm

## 快速开始

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000 查看页面

### 构建生产版本
\`\`\`bash
npm run build
\`\`\`

## 功能特性

### 已实现功能
1. **侧边栏导航** - 6个导航项，支持消息角标显示
2. **顶部搜索** - 职位下拉选择、关键词标签（可添加/删除）、AI智搜按钮
3. **筛选条件** - 目前城市、期望城市、工作经验（含自定义）、教育经历
4. **快捷搜索标签** - 支持订阅功能
5. **人才卡片** - 展示头像、基本信息、期望职位、工作经历时间线
6. **结果排序** - 智能排序、最新活跃等选项
7. **批量操作** - 全选、浏览简历

### 交互功能
- 筛选按钮点击切换选中状态
- 搜索框支持文本输入和关键词标签管理
- 下拉菜单展开/收起
- 开关组件切换
- 卡片hover效果
- 按钮点击视觉反馈

## 项目结构

\`\`\`
src/
├── components/
│   ├── Sidebar/          # 侧边栏组件
│   ├── SearchHeader/     # 顶部搜索区
│   ├── FilterSection/    # 筛选条件区
│   ├── TalentList/       # 人才列表和卡片
│   └── common/           # 通用组件（Button、Badge）
├── data/
│   └── mockData.js       # 模拟数据
├── App.jsx               # 主应用组件
├── main.jsx              # 应用入口
└── index.css             # 全局样式
\`\`\`

## 后续扩展

1. 接入真实后端API替换模拟数据
2. 实现搜索关键词的实际过滤功能
3. 添加AI智能推荐和简历解析功能
4. 高级筛选条件联动
5. 历史搜索记录保存
6. 响应式移动端适配

## 参考设计

基于猎聘平台人才搜索页面截图复刻，保留品牌色调和布局风格。
```

- [ ] **Step 2: 提交README**

```bash
cd "/Users/liepin/Downloads/search demo"
git add README.md
git commit -m "docs: 添加README文档，包含项目说明和使用指南"
```

---

## Task 10: 最终验证和测试

- [ ] **Step 1: 运行开发服务器验证**

```bash
cd "/Users/liepin/Downloads/search demo"
npm run dev
```

等待服务器启动，确认无错误信息。

- [ ] **Step 2: 功能检查清单**

验证以下功能正常：
- [ ] 页面加载无报错
- [ ] 侧边栏导航显示正确，高亮当前页面
- [ ] 顶部搜索区布局正确，关键词标签可添加/删除
- [ ] 筛选条件区所有筛选项可点击
- [ ] 人才卡片列表显示完整
- [ ] 卡片hover有效果变化
- [ ] 底部批量操作栏显示正常

- [ ] **Step 3: 提交最终版本**

```bash
cd "/Users/liepin/Downloads/search demo"
git add .
git commit -m "feat: 完成猎聘AI人才搜索Demo初版"
```

---

## 自审清单

### Spec覆盖检查
- [x] 侧边栏Logo和导航菜单
- [x] 顶部搜索区（职位选择、关键词输入、复合关键词开关）
- [x] 快捷搜索标签和订阅功能
- [x] 城市筛选（目前城市、期望城市）
- [x] 工作经验筛选（含自定义输入）
- [x] 教育经历筛选
- [x] 更多筛选项（展开/收起）
- [x] 已选条件展示
- [x] 人才卡片（头像、基本信息、工作经历）
- [x] 结果排序和视图控制
- [x] 批量操作功能

### Placeholder检查
- 无TBD、TODO等占位符
- 所有步骤包含完整代码
- 无模糊描述，所有功能都有具体实现

### 类型一致性检查
- 所有组件使用React函数组件
- 数据结构和属性名保持一致
- 模拟数据与组件props匹配
