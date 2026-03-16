# Repository Working Guide

## 本仓库目标
构建可本地安装、可配置、可测试的 OpenClaw 招聘搜索策略扩展包。

## 目录约定
- prompts 仅放在 `skills/.../prompts/`
- orchestration 仅放策略编排逻辑
- adapters 仅放外部工具接入层（可 mock，不伪造线上）
- schemas 与 TypeScript types 必须同步

## 工程原则
- 不重写线上接口，只保留清晰 adapter 接入点。
- 优先保持 prompt 产品语义稳定。
- 先写 schema/type，再写实现。
- 先写或补测试，再迭代实现。
- 修改前先读 `README.md` 与 `openclaw.plugin.json`。
- 所有用户可见 JSON 输出必须稳定可解析。
