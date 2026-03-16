# OpenClaw Talent Search Strategy Plugin

## 解决的问题
本扩展实现“固定筛选条件拆解 + 关键词拆解 + 查询结果评估 + 自动改写重试”的闭环工作流；围绕你现有的简历查询能力进行策略编排，不重写线上接口。

## 架构与流程
- Skill: `talent-search-strategy`（触发条件、策略说明、用户输出规范）
- Tool: `resume_search_workflow`（执行完整 3 轮内闭环）
- Adapter: `ResumeSearchAdapter`（外部接口接入点 + mock）

流程：
1. 从 `history_context` + `user_command` 生成 `fixed_filters` 与 `keyword_plan`
2. 调用 adapter 搜索
3. evaluator 输出质量诊断 + rewrite action
4. 重写 query 并重试，最多 3 轮
5. 输出 success/partial/failed + 诊断日志

## 安装
```bash
cd search-package
npm install
npm run build
```

## 启用 plugin
将 `search-package/openclaw.plugin.json` 配置到 OpenClaw 插件目录，并确保 `entry` 指向已构建产物 `dist/src/index.js`。

## 让 skill 生效
将 `skills/talent-search-strategy` 目录一并部署到 OpenClaw skill 路径，确保 `SKILL.md` 与 prompts 文件可读取。

## 接入现有 resume search tool
当前仓库提供 `createExternalResumeSearchAdapter()` stub，不提供伪造线上实现。
你需要：
1. 注入你已有的 tool client
2. 在 adapter 内完成 `SearchPlan -> 外部工具入参` 映射
3. 将外部返回映射为 `ResumeSearchResponse`

## 运行测试
```bash
npm test
npm run typecheck
```

## 最小 demo
见 `examples/sample_user_inputs.json`，可配合 `MockResumeSearchAdapter` 运行 `resumeSearchWorkflow()`。

## 已知限制与下一步建议
- 当前关键词拆解为规则版，可后续替换为 LLM+prompt 调用。
- evaluator 当前基于统计启发式，可叠加更细粒度相关性模型。
- 插件配置字段随 OpenClaw 版本可能有差异；已给出最小可运行结构，若版本字段不同请按平台文档小幅调整。
