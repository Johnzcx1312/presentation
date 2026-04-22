import React, { useState } from 'react';
import TalentCard from './TalentCard';
import { 
  SlidersHorizontal, 
  FileText, 
  ChevronDown, 
  Loader2, 
  Sparkles,
  Search,
  LayoutGrid,
  List,
  Star,
  MessageCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

// 骨架屏组件
const TalentCardSkeleton = () => (
  <div className="bg-white p-5 border-b border-gray-100 animate-pulse">
    <div className="flex gap-4">
      {/* 头像骨架 */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="mt-2 w-12 h-3 bg-gray-200 rounded mx-auto" />
      </div>
      {/* 内容骨架 */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-16 h-4 bg-gray-200 rounded" />
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-48 h-3 bg-gray-200 rounded mb-2" />
        <div className="w-64 h-3 bg-gray-200 rounded mb-3" />
        <div className="flex gap-2 mb-3">
          <div className="w-12 h-5 bg-gray-200 rounded" />
          <div className="w-16 h-5 bg-gray-200 rounded" />
          <div className="w-14 h-5 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-gray-200 rounded" />
          <div className="w-3/4 h-3 bg-gray-200 rounded" />
        </div>
      </div>
      {/* 按钮骨架 */}
      <div className="flex-shrink-0 flex flex-col gap-2">
        <div className="w-24 h-8 bg-gray-200 rounded" />
        <div className="w-24 h-8 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

// 空状态组件
const EmptyState = ({ onQuickStart, onSelectPosition }) => {
  const [showPositions, setShowPositions] = useState(false);

  const positions = [
    { title: 'Java开发工程师', icon: '☕', department: '技术部', location: '北京' },
    { title: '产品经理', icon: '📱', department: '产品部', location: '上海' },
    { title: '数据分析师', icon: '📊', department: '数据部', location: '北京' },
    { title: '前端开发工程师', icon: '💻', department: '技术部', location: '深圳' },
    { title: '运营专员', icon: '🚀', department: '运营部', location: '上海' },
    { title: 'UI设计师', icon: '🎨', department: '设计部', location: '杭州' },
    { title: '算法工程师', icon: '🤖', department: '技术部', location: '北京' },
    { title: '销售经理', icon: '💼', department: '销售部', location: '广州' },
  ];

  const handlePositionClick = (pos) => {
    // 构建自然语言描述
    const text = `帮我找一位${pos.title}，base在${pos.location}`;
    onSelectPosition?.(text);
    setShowPositions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-16">
      <div className="flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Search size={48} className="text-[#7c3aed]" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">开始你的第一次 AI 智能搜索</h3>
        <p className="text-sm text-gray-500 mb-8">输入自然语言描述，AI 自动拆解关键词并精准匹配</p>
        
        {/* 快速示例 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
          {[
            { icon: '💻', text: '帮我找3-5年 Java，base北京', desc: '技术岗位 + 经验 + 地点' },
            { icon: '📊', text: '找个有美团背景的产品经理', desc: '公司背景 + 职位' },
            { icon: '📈', text: '会 Python 的数据分析师', desc: '技能 + 职位' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => onQuickStart(item.text)}
              className="flex flex-col items-start p-4 bg-gray-50 hover:bg-[#f5f3ff] rounded-xl border border-gray-200 hover:border-[#ddd6fe] transition-all group text-left"
            >
              <span className="text-2xl mb-2">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#7c3aed] mb-1">
                "{item.text}"
              </span>
              <span className="text-xs text-gray-400">{item.desc}</span>
            </button>
          ))}
        </div>

        {/* 选择职位按钮 */}
        <div className="relative">
          <button 
            onClick={() => setShowPositions(!showPositions)}
            className="flex items-center gap-2 px-6 py-3 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium"
          >
            <Sparkles size={18} />
            选择职位
            <ChevronDown size={16} className={`transition-transform ${showPositions ? 'rotate-180' : ''}`} />
          </button>

          {/* 职位选择下拉菜单 */}
          {showPositions && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <span className="text-xs text-gray-400">选择职位自动填入搜索框</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {positions.map((pos, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePositionClick(pos)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f5f3ff] transition-colors text-left"
                  >
                    <span className="text-xl">{pos.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">{pos.title}</div>
                      <div className="text-xs text-gray-400">{pos.department} · {pos.location}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 点击外部关闭下拉菜单 */}
        {showPositions && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPositions(false)}
          />
        )}
      </div>
    </div>
  );
};

const TalentList = ({ talents, isSearching, hasSearched, onQuickStart, onSelectPosition }) => {
  const [sortBy, setSortBy] = useState('智能排序');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const sortOptions = ['智能排序', '最新活跃', '最近更新', '沟通优先'];

  // 处理单个卡片选中
  const handleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // 全选
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(talents.map(t => t.id)));
    }
    setSelectAll(!selectAll);
  };

  // 初始状态
  if (!hasSearched && !isSearching) {
    return <EmptyState onQuickStart={onQuickStart || (() => {})} onSelectPosition={onSelectPosition} />;
  }

  const selectedCount = selectedIds.size;
  // 真实简历数量（如果有total字段则使用，否则显示当前列表数量）
  const displayCount = talents[0]?._total || talents.length;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">共有</span>
            {isSearching ? (
              <span className="flex items-center gap-1 text-[#5b4ddb] font-bold text-lg">
                <Loader2 size={16} className="animate-spin" />
                <span>...</span>
              </span>
            ) : (
              <span className="text-[#5b4ddb] font-bold text-lg">{displayCount.toLocaleString()}</span>
            )}
            <span className="text-sm text-gray-500">份简历</span>
            {!isSearching && talents.length > 0 && (
              <span className="ml-2 flex items-center gap-1 px-2 py-0.5 bg-[#f5f3ff] text-[#7c3aed] text-xs rounded-full">
                <Sparkles size={10} /> AI 智能匹配结果
              </span>
            )}
          </div>

          {/* AI 简历快读 */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#5b4ddb] bg-[#f5f3ff] rounded-md border border-[#ddd6fe] hover:bg-[#ede9fe] transition-colors">
            <FileText size={14} />
            AI 简历快读
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* 排序 */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <SlidersHorizontal size={14} />
              <span>{sortBy}</span>
              <ChevronDown size={12} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                {sortOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                      sortBy === option ? 'text-[#5b4ddb] bg-[#f5f3ff]' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 筛选标签 */}
          <button className="text-sm text-gray-600 hover:text-gray-900">沟通状态</button>
          <button className="text-sm text-gray-600 hover:text-gray-900">获取联系方式状态</button>

          {/* 视图切换 */}
          <div className="flex items-center gap-1 border border-gray-200 rounded p-0.5">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-[#f5f3ff] text-[#7c3aed]' : 'text-gray-400'}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#f5f3ff] text-[#7c3aed]' : 'text-gray-400'}`}
            >
              <List size={14} />
            </button>
          </div>

          {/* 收藏夹 */}
          <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
            <Star size={14} />
            收藏夹
          </button>
        </div>
      </div>

      {/* 列表内容 */}
      <div className="divide-y divide-gray-100">
        {isSearching ? (
          // 骨架屏
          <>
            <TalentCardSkeleton />
            <TalentCardSkeleton />
            <TalentCardSkeleton />
          </>
        ) : talents.length === 0 ? (
          // 无结果状态
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Lightbulb size={40} className="text-gray-400" />
            </div>
            <p className="text-base text-gray-600 mb-2">未找到匹配的人才</p>
            <p className="text-sm text-gray-400 mb-6">尝试调整搜索条件或补充更多信息</p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onQuickStart?.('')}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-[#7c3aed] bg-[#f5f3ff] rounded-lg border border-[#ddd6fe] hover:bg-[#ede9fe] transition-colors"
              >
                <Sparkles size={14} />
                试试 AI 帮搜
              </button>
              <span className="text-sm text-gray-400">或</span>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                <MessageCircle size={14} />
                联系顾问协助
              </button>
            </div>
          </div>
        ) : (
          // 实际数据
          talents.map((talent) => (
            <TalentCard 
              key={talent.id} 
              talent={talent} 
              viewMode={viewMode}
              isSelected={selectedIds.has(talent.id)}
              onSelect={() => handleSelect(talent.id)}
            />
          ))
        )}
      </div>

      {/* 底部操作栏 */}
      {!isSearching && talents.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-[#5b4ddb] focus:ring-[#5b4ddb] cursor-pointer"
              />
              <span className="text-sm text-gray-600">全选</span>
            </label>
            {selectedCount > 0 && (
              <span className="text-sm text-[#7c3aed] font-medium">
                已选 {selectedCount} 份简历
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#5b4ddb] bg-white border border-[#5b4ddb] rounded-lg hover:bg-[#f5f3ff] transition-colors">
              <FileText size={16} />
              浏览简历
            </button>
            {selectedCount > 0 && (
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#5b4ddb] rounded-lg hover:bg-[#4a3fc7] transition-colors">
                <MessageCircle size={16} />
                批量沟通 ({selectedCount})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentList;
