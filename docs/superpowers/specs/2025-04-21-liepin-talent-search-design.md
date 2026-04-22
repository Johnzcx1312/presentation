# 猎聘AI人才搜索Demo - 设计文档

## 项目概述
基于猎聘平台人才搜索页面截图，复刻一个高保真可交互的demo页面，作为后续AI人才搜索功能的基础框架。

## 技术选型
- **框架**: React 18
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS 3.4
- **图标库**: Lucide React
- **包管理器**: npm

## 功能模块

### 1. 侧边导航栏 (Sidebar)
- Logo区域：猎聘AI品牌标识
- 主导航菜单（6项）：
  - 人才推荐
  - 职位管理
  - 搜索人才（当前页高亮）
  - 沟通（带消息数量角标19）
  - 人才管理
  - 猎头服务
  - 绩效服务
- 底部：服务热线 400-0620-378

### 2. 顶部搜索区 (SearchHeader)
- 职位选择下拉框（不限职位）
- 关键词输入区（含标签式关键词展示：研发、JAVA +1）
- 复合关键词开关
- 操作按钮：搜索（主按钮）、AI智搜（紫色渐变按钮）

### 3. 筛选条件区 (FilterSection)
- 基础输入：职位/公司输入框（含快捷职位选择）
- 快捷搜索标签栏：运营_数据_分析_3（新增5）、算法（新增5）、111111（新增28）等，带订阅功能
- 城市筛选：目前城市（不限、北京、苏州、大连、上海、甘肃等）、期望城市
- 工作经验：不限、在校/应届、1-3年、3-5年、5-10年、自定义（5-年）
- 教育经历：不限、本科、硕士、博士/博士后、大专、中专/中技、高中及以下、统招本科、院校要求
- 更多筛选：活跃状态、求职状态、跳槽频率、年龄（30-35岁）、性别要求、语言要求、毕业年份、当前行业、期望行业、当前职能、期望职能
- 已选条件展示区：已选标签可删除，保存搜索条件按钮

### 4. 结果展示区 (ResultsArea)
- 结果统计：共有619份简历、AI简历快读
- 排序与筛选：智能排序下拉、沟通状态、获取联系方式状态、隐藏已查看开关、只匹配最近一段工作开关
- 视图控制：切换简历打开方式、收藏夹
- 人才卡片列表

### 5. 人才卡片组件 (TalentCard)
每条人才记录展示：
- 左侧：头像、活跃状态（3天内活跃）、在线标识
- 基本信息：姓名、年龄、工作年限、学历、所在城市
- 期望信息：目标城市、职位、薪资范围
- 标签：互联网、线上线下一体化、O2O运营等
- 右侧：工作经历时间线（公司名、职位、时间段）
- 操作按钮：立即沟通（紫色主按钮）、AI智能分析
- 底部复选框用于批量操作

### 6. 底部操作栏 (BottomBar)
- 全选复选框
- 浏览简历按钮

## 交互功能（基础交互版）

### 已实现交互
1. 筛选按钮点击切换选中/未选中状态
2. 搜索框支持文本输入
3. 标签点击选中/取消，带视觉反馈
4. 人才卡片hover效果（阴影、边框高亮）
5. 按钮点击视觉反馈
6. 下拉框展开/收起
7. 开关组件切换
8. 复选框选中/取消

### 数据方案
- 使用模拟静态数据
- 约10-15条人才记录
- 包含完整字段：基本信息、工作经历、教育背景等

## 视觉设计规范

### 色彩系统
- 主色（紫色）：#6366f1（indigo-500）
- 主色渐变：linear-gradient(135deg, #6366f1, #8b5cf6)
- 背景色：#f3f4f6（灰色背景）
- 侧边栏背景：#ffffff
- 卡片背景：#ffffff
- 边框色：#e5e7eb
- 文字主色：#1f2937
- 文字次色：#6b7280
- 标签背景：#f3f4f6
- 标签边框：#d1d5db

### 布局规范
- 侧边栏宽度：200px，固定定位
- 主内容区：左侧留200px边距，自适应剩余宽度
- 最大内容宽度：1400px，居中显示
- 卡片间距：16px
- 内边距：基础16px，紧凑区域12px

### 字体规范
- 基础字体：system-ui, -apple-system, sans-serif
- 标题字号：16-18px，font-weight: 600
- 正文字号：14px
- 辅助文字：12px
- 小标签：11px

## 项目文件结构

```
search-demo/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   └── NavItem.jsx
│   │   ├── SearchHeader/
│   │   │   ├── SearchHeader.jsx
│   │   │   ├── KeywordTag.jsx
│   │   │   └── SearchInput.jsx
│   │   ├── FilterSection/
│   │   │   ├── FilterSection.jsx
│   │   │   ├── FilterGroup.jsx
│   │   │   ├── FilterTag.jsx
│   │   │   └── SelectedFilters.jsx
│   │   ├── TalentCard/
│   │   │   ├── TalentCard.jsx
│   │   │   ├── TalentAvatar.jsx
│   │   │   ├── WorkExperience.jsx
│   │   │   └── TalentTags.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Badge.jsx
│   │       └── Switch.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 安装依赖清单

```bash
# 核心依赖
npm install react react-dom

# 开发依赖
npm install -D vite @vitejs/plugin-react
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/react @types/react-dom

# 图标库
npm install lucide-react
```

## 实施检查清单

- [x] 侧边栏导航结构与样式
- [x] 顶部搜索区布局与交互
- [x] 筛选条件区所有筛选项
- [x] 人才卡片完整展示
- [x] 底部操作栏
- [x] 基础交互功能（点击、hover、切换）
- [x] 模拟数据填充
- [x] 响应式基础适配
- [x] README文档编写

## 后续扩展方向

1. **AI功能接入**：在现有框架基础上添加AI智能推荐、AI简历解析
2. **真实数据对接**：接入后端API替换模拟数据
3. **高级筛选**：筛选条件联动、历史记录保存
4. **批量操作**：人才批量沟通、导出等功能
