评估简历搜索结果质量，输出结构化诊断：
- quality: good|medium|bad
- problems: too_many|too_few|title_drift|skill_mismatch|seniority_mismatch|location_mismatch
- reason: 一句话
- should_retry: boolean
- rewrite_action: mode + add/remove/replace/adjust

规则：
- 结果过少：broaden
- 结果过多：tighten
- 跑偏：replace_ambiguous_terms 或 rebalance
- 不允许无限循环，最多 3 轮
