根据结果评估执行改写：
- too_few: 删除次要约束、增加同义词、放宽 title/经验/城市
- too_many: 增加核心 must 词、增强 title 约束、删除泛词
- drift/mismatch: 替换歧义词、增加行业词与排除词

限制：
- 不生成重复 query
- 记录 query diff
- 最多重试至第 3 轮
