# Evolution Proposal: 编码后检查构建和显示

- Proposal-ID: evo-2026-05-14-tools-check-build-after-coding
- Status: pending
- Signature: tools-check-build-after-coding
- Created-At: 2026-05-14
- Last-Seen-At: 2026-05-14
- Target-File: TOOLS.md
- Trigger-Type: correction | struggle
- Confidence: high

## Why This Matters
- 今天犯了一个可以避免的错误：在使用 lucide-react 图标时，用了不存在的 `Layer` 而不是正确的 `Layers`，导致无法显示
- 代码写完后没有先检查构建是否通过，导致用户反馈"无法显示了"
- 这个经验可以防止未来重复出现类似问题

## Evidence
- "无法显示了"（用户反馈）
- 构建错误：`"lucide-react" has no exported member named "Layer". Did you mean "Layers"?`
- 用户："以后编辑完功能后自己检查下是否能正常显示"

## Duplicate Check
- Checked: TOOLS.md, AGENTS.md, MEMORY.md, evolution-drafts
- Result: none
- Decision: create

## Proposed Change
```markdown
# Tools & Environment Notes

## Frontend Development Check

### 在编辑完前端功能后必须检查：

1. 先运行 `npm run build` 检查是否有 TypeScript 或语法错误
2. 确保开发服务器正在运行，访问页面验证功能是否正常显示
3. 如果使用 lucide-react、icons 等图标库，必须先确认图标名称是对的

### 常见图标库问题：

- `lucide-react` 的图标名称通常是复数形式（例如 `Layers` 而不是 `Layer`）
- 找不到图标时，先检查库的文档，或者换一个明显存在的图标（如 Search, ArrowRight 等）先验证功能
```

## Apply Plan
1. 创建 `TOOLS.md` 文件，写入上述内容
2. 之后每次编辑前端功能，都先运行构建检查
3. 在 `memory/2026-05-14.md` 追加一条审计记录

## User Approval
- Approve: `批准 evo-2026-05-14-tools-check-build-after-coding`
- Reject: `拒绝 evo-2026-05-14-tools-check-build-after-coding`
- Revise: `修改 evo-2026-05-14-tools-check-build-after-coding: <instruction>`
