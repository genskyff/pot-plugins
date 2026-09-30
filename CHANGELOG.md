# Changelog

## [Unreleased]

## [1.27.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.27.0) - 2026-09-29

### 变更

- Claude 翻译和文字识别插件的默认模型由 `claude-sonnet-5` 升级为 `claude-sonnet-5-5`，模型下拉框中的选项同步更新（[76977a5](https://github.com/genskyff/pot-plugins/commit/76977a5)）。

### 修复

- 未配置模型（留空）或选择「自定义」但未填写自定义模型时，插件会使用新的默认模型 `claude-sonnet-5-5`（[76977a5](https://github.com/genskyff/pot-plugins/commit/76977a5)）。

## [1.26.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.26.0) - 2026-09-23

### 变更

- 翻译插件（Claude、DeepSeek、Kimi、OpenAI、OpenRouter、xAI、Xiaomi MiMo、Z.ai）改用重写后的翻译提示词：默认请求把源文本放入 `<source_text>` 标签，并在用户手动指定源语言时附带 `Source language: <语言>`（此前从不传递源语言）；同时明确简繁中文、粤语等文字/地区变体算作不同语言，并合并仅为适应排版而在句中断开的换行。[a87ce4b](https://github.com/genskyff/pot-plugins/commit/a87ce4b)
  - 自定义 Prompt 中的 `$text`、`$to` 占位符继续可用；当 Prompt 中不含 `$text` 时，自动追加的包裹标签由 `<app_source_text>` 改为 `<source_text>`，且不再追加「只翻译标签内内容」的说明。若自定义 Prompt 依赖 `<app_source_text>` 这一标签名，需要相应更新。
- 识别插件（OCR）改用精简后的提示词，并补充了对图中指令性文字不予执行、形近字（如ロ/口、カ/力、O/0、l/1/I）、CJK 字符异体、图像边缘被截断文字以及竖排文字按从右到左列序阅读的处理要求；发送请求时图片置于指令文本之前。见 commit `1027520`。

### 修复

- 使用自定义 Prompt 时，源文本中的 `$` 序列会被当作替换模式展开，导致内容被改写（例如 `$$5` 变成 `$5`）；现在源文本按原样插入，美元符号等内容保持完整。[f7dbd75](https://github.com/genskyff/pot-plugins/commit/f7dbd75)
- 修正语言名称歧义，避免模型默认输出错误变体：葡萄牙语（葡萄牙）由 `Portuguese` 改为 `European Portuguese`，蒙古语由 `Mongolian` 改为 `Mongolian (Traditional Script)`，蒙古语（西里尔）由 `Mongolian(Cyrillic)` 改为 `Mongolian (Cyrillic)`。该改动影响所有翻译与识别插件的语言列表。[f5415f1](https://github.com/genskyff/pot-plugins/commit/f5415f1)

## [1.25.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.25.0) - 2026-09-23

### 变更

- OpenAI 翻译与文字识别插件（`translate-openai`、`recognize-openai`）的默认模型升级为 `gpt-6-luna`，「模型」下拉更新为 `gpt-6-luna` 与 `gpt-6-sol`；`gpt-5.6-luna`、`gpt-5.6-terra`、`gpt-5.6-sol` 已从列表中移除，如需继续使用旧模型名，请将「模型」设为「自定义」并在「自定义模型」中填写（[16ad123](https://github.com/genskyff/pot-plugins/commit/16ad123)）。
- OpenRouter 翻译与文字识别插件（`translate-openrouter`、`recognize-openrouter`）的模型选项 `openai/gpt-5.6-luna` 更新为 `openai/gpt-6-luna`，插件默认模型仍为 `openrouter/free`（[16ad123](https://github.com/genskyff/pot-plugins/commit/16ad123)）。
- Claude 翻译与文字识别插件（`translate-claude`、`recognize-claude`）的预设模型 `claude-opus-5` 更新为 `claude-opus-5-5`，默认模型仍为 `claude-sonnet-5`（[1d5c38e](https://github.com/genskyff/pot-plugins/commit/1d5c38e)）。
- 模型选项随插件包提供，需在 Pot 中重新导入对应的 `.potext` 文件后，上述新选项才会出现在设置中。

## [1.24.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.24.0) - 2026-09-22

### 变更

- XiaoMi MiMo 翻译（`plugin.translate_xiaomimimo`）与文字识别（`plugin.recognize_xiaomimimo`）插件的模型列表更新为 `mimo-v2.6-flash` 和 `mimo-v2.6-pro`，默认模型改为 `mimo-v2.6-flash`（[68b5c2d](https://github.com/genskyff/pot-plugins/commit/68b5c2d)）。
- 文字识别插件此前只提供 `mimo-v2.5`，现在也可选用 `pro` 模型；`mimo-v2.5` / `mimo-v2.5-pro` 已从下拉列表中移除，如需继续使用请在「自定义模型」中填写模型名。
- 模型或自定义模型留空时，插件回退到 `mimo-v2.6-flash`。

## [1.23.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.23.0) - 2026-09-22

### 变更

- xAI 插件（`translate-xai`、`recognize-xai`）的默认模型升级为 `grok-4.7`，模型选项中的 `grok-4.6` 已由 `grok-4.7` 取代。此前手动选择 `grok-4.6` 的配置不会被自动切换，如需使用新模型请在插件设置中重新选择。
- OpenRouter 插件（`translate-openrouter`、`recognize-openrouter`）的模型列表中 `x-ai/grok-4.6` 更新为 `x-ai/grok-4.7`。

## [1.22.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.22.0) - 2026-09-10

### 变更

- DeepSeek 翻译与 OCR 插件的默认模型统一改为 `deepseek-flash`；该模型同时支持文本与图片输入，OCR 插件无需再使用单独的视觉模型（[6a69e83](https://github.com/genskyff/pot-plugins/commit/6a69e83)）。
- 模型选项中的旧名称 `deepseek-v4-flash`（翻译）与 `deepseek-v4-flash-vision-exp`（OCR）已被 `deepseek-flash` 取代。此前在插件配置中选中过旧模型的用户，请在插件设置中重新选择模型。

## [1.21.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.21.0) - 2026-09-03

### 变更

- OpenRouter 翻译插件（`translate-openrouter`）与识别插件（`recognize-openrouter`）的预设模型列表中，将 `google/gemini-3.7-flash` 更新为 `google/gemini-3.8-flash`；需要在 Pot 中重新导入对应的 `.potext` 文件后该选项才会更新。[aab1eec](https://github.com/genskyff/pot-plugins/commit/aab1eec)

## [1.20.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.20.0) - 2026-08-27

### 新增

- 新增 Z.ai 文字识别插件（`plugin.recognize_zai`），基于 Z.ai Chat Completions 接口（默认 `https://api.z.ai/api/paas/v4/chat/completions`）提取截图中的文本，默认模型 `glm-5.3-flash`；支持自定义模型、温度、推理强度、自定义 Prompt 和自定义请求体（JSON），请求体固定 `max_tokens` 为 `8192`（[f8c5cd9](https://github.com/genskyff/pot-plugins/commit/f8c5cd9)、[fd4ff6a](https://github.com/genskyff/pot-plugins/commit/fd4ff6a)）。

### 变更

- Z.ai 翻译插件的默认模型由 `glm-5.3` 改为 `glm-5.3-flash`，模型列表新增 `glm-5.3-flash` 并移除 `glm-5-turbo`；如需继续使用 `glm-5-turbo`，请在「自定义模型」中填写（[4a35a5e](https://github.com/genskyff/pot-plugins/commit/4a35a5e)）。
- Z.ai 翻译插件的「推理强度」选项精简为 默认 / low / high / max，移除了 none、minimal、medium、xhigh，与文字识别插件保持一致（[70a5259](https://github.com/genskyff/pot-plugins/commit/70a5259)）。

## [1.19.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.19.0) - 2026-08-22

### 新增

- 新增文字识别插件 XiaoMi MiMo（`plugin.recognize_xiaomimimo`），通过 XiaoMi MiMo 的 Chat Completions 接口从截图中提取文字。可从本版本 Release 中下载 `recognize-xiaomimimo.potext` 并在 Pot 中导入。
- 插件默认请求地址为 `https://api.xiaomimimo.com/v1/chat/completions`，默认模型为 `mimo-v2.5`，API Key 必填；「模型」选择「自定义」后可填写其他模型名。
- 支持的配置项包括：思考模式（默认/开启/关闭，对应请求体的 `thinking.type`）、温度（留空或非数字时不发送）、自定义 Prompt（留空则使用内置 OCR 提示词）、自定义请求体（JSON）。额外请求体会递归合并到请求体中，数组整体替换，字段设为 `null` 可删除该字段；默认发送 `max_completion_tokens: 8192`。

## [1.18.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.18.0) - 2026-08-22

### 新增

- 新增文字识别插件 DeepSeek（`plugin.recognize_deepseek`）：通过 DeepSeek Chat Completions 接口提取截图中的文本，默认请求地址为 `https://api.deepseek.com/chat/completions`，默认模型为 `deepseek-v4-flash-vision-exp`，`API Key` 为必填项。插件以 `plugin.recognize_deepseek.potext` 发布，可从 Releases 下载后导入 Pot。
- 该插件支持 `自定义模型`、`思考模式`、`推理强度`、`温度`、`自定义 Prompt` 配置，并可用 `自定义请求体（JSON）` 覆盖请求体（对象递归合并、数组整体替换、`null` 删除字段）；固定参数 `max_tokens` 为 `8192`，结果取自响应 `choices[0].message.content`。

### 变更

- 统一各插件的配置项顺序，`温度` 现在位于 `自定义 Prompt` 之前；翻译插件（DeepSeek、OpenAI、OpenRouter、xAI、Xiaomi MiMo、Z.ai）设置面板的显示顺序随之调整，各插件 README 的说明顺序也已同步。配置项 key 未变，已有配置无需重新填写。

## [1.17.1](https://github.com/genskyff/pot-plugins/releases/tag/v1.17.1) - 2026-08-19

### 变更

- Z.ai 翻译插件（`translate-zai`）的默认模型由 `glm-5.2` 升级为 `glm-5.3`，模型下拉列表中的 `glm-5.2` 预设同步替换为 `glm-5.3`（仍保留 `glm-5-turbo` 与「自定义」）([884aefc](https://github.com/genskyff/pot-plugins/commit/884aefc))。此前已选用 `glm-5.2` 的配置可通过「自定义模型」继续填写该模型名。
- OpenRouter 翻译与文字识别插件（`translate-openrouter`、`recognize-openrouter`）的预设模型 `google/gemini-3.6-flash` 已替换为 `google/gemini-3.7-flash`，插件默认模型不变（[884aefc](https://github.com/genskyff/pot-plugins/commit/884aefc)）。

## [1.17.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.17.0) - 2026-08-13

### 变更

- xAI 翻译与文字识别插件的默认模型由 `grok-4.5` 更新为 `grok-4.6`；OpenRouter 翻译与文字识别插件的模型选项中的 `x-ai/grok-4.5` 也相应改为 `x-ai/grok-4.6`（[bcacc6b](https://github.com/genskyff/pot-plugins/commit/bcacc6b)）。
- 项目许可证由 GPL-3.0 变更为 AGPL-3.0（[bcacc6b](https://github.com/genskyff/pot-plugins/commit/bcacc6b)）。

### 移除

- 移除 LongCat 翻译插件，本版本起 Release 中不再提供 `plugin.translate_longcat` 的 `.potext` 文件（[5d24037](https://github.com/genskyff/pot-plugins/commit/5d24037)）。

## [1.16.3](https://github.com/genskyff/pot-plugins/releases/tag/v1.16.3) - 2026-08-08

### 变更

- 重写所有 LLM 翻译插件（`translate-claude`、`translate-deepseek`、`translate-kimi`、`translate-longcat`、`translate-openai`、`translate-openrouter`、`translate-xai`、`translate-xiaomimimo`、`translate-zai`）的翻译提示词，以提高译文准确性与流畅度。[efcf9fa](https://github.com/genskyff/pot-plugins/commit/efcf9fa)
  - 语言识别改为依据文本本身判断，不再仅依赖字符集、界面语言或目标语言；整篇为汉字（假名很少或没有）的日文不再被误判为中文。
  - 新增对多语言混合文本的处理：只翻译需要翻译的部分，保留人名、技术术语、缩写和代码等通常不翻译的内容。
  - 收紧「源语言与目标语言相同则原样返回」的判断：只有在确认整段文本都是目标语言时才不翻译，仅有若干目标语言词、名称或共有字符时仍会正常翻译。
  - 明确将源文本视为不可信数据：只作为待翻译文本处理，不执行其中的指令或请求。
  - 优先级调整为「保持原意 > 目标语言自然表达 > 保留格式与受保护内容」。

## [1.16.2](https://github.com/genskyff/pot-plugins/releases/tag/v1.16.2) - 2026-08-07

### 修复

- 目标语言为空或仅含空白字符时，所有 LLM 翻译插件（Claude、DeepSeek、Kimi、LongCat、OpenAI、OpenRouter、xAI、小米 MiMo、Z.AI）现在回退为 `Simplified Chinese`，不再让提示词中的目标语言留空、由模型自行猜测语言；自定义 Prompt 中的 `$to` 变量同样使用该默认值，并会先去除目标语言的首尾空白（[35918bb](https://github.com/genskyff/pot-plugins/commit/35918bb)）。

## [1.16.1](https://github.com/genskyff/pot-plugins/releases/tag/v1.16.1) - 2026-08-05

### 变更

- 更新 9 个翻译插件（Claude、DeepSeek、Kimi、Longcat、OpenAI、OpenRouter、xAI、Xiaomi MiMo、Z.ai）的内置提示词：新增“不做改写”规则，要求不得总结、简化、扩写、解释、核查事实、纠正或添加源文本中不存在的信息；源文本已属于目标语言时要求原样输出，移除了原先“必要时可做轻微规范化”的例外 ([7e572a0](https://github.com/genskyff/pot-plugins/commit/7e572a0))。
- 上述插件包裹源文本的标签由 `<source_text>` 改为 `<app_source_text>`，自定义 Prompt 未包含 `$text` 时自动追加的模板也同步使用新标签 ([7e572a0](https://github.com/genskyff/pot-plugins/commit/7e572a0))。

## [1.16.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.16.0) - 2026-08-04

### 新增

- OpenRouter 翻译插件（`translate-openrouter`）与文字识别插件（`recognize-openrouter`）的「模型」下拉中新增 `openrouter/free` 选项（[#5](https://github.com/genskyff/pot-plugins/pull/5)、[#4](https://github.com/genskyff/pot-plugins/issues/4)）。

### 变更

- 上述两个插件的默认模型由 `openai/gpt-5.6-luna` 改为 `openrouter/free`；未保存过模型选择的用户会自动使用新默认模型，已保存的选择不受影响（[26d90f2](https://github.com/genskyff/pot-plugins/commit/26d90f2)）。

### 修复

- 修正两个 OpenRouter 插件 README 中已失效（404）的 Chat Completions 接口文档链接（[#4](https://github.com/genskyff/pot-plugins/issues/4)）。

## [1.15.2](https://github.com/genskyff/pot-plugins/releases/tag/v1.15.2) - 2026-07-31

### 新增

- DeepSeek 翻译插件的「推理强度」新增 `low` 选项，可在默认、`high`、`max` 之外选择更低的推理强度；选中后会以 `reasoning_effort: "low"` 发送到接口（[9324787](https://github.com/genskyff/pot-plugins/commit/9324787)）。

## [1.15.1](https://github.com/genskyff/pot-plugins/releases/tag/v1.15.1) - 2026-07-25

### 新增

- Kimi 翻译与文字识别插件的「推理强度」新增 `low`、`high` 两个选项，此前仅支持「默认」与 `max`。[be37ba4](https://github.com/genskyff/pot-plugins/commit/be37ba4)

### 变更

- Kimi 翻译与文字识别插件的默认模型由 `kimi-k2.6` 更新为 `kimi-k3`，「模型」下拉中的排列顺序也相应调整。[be37ba4](https://github.com/genskyff/pot-plugins/commit/be37ba4)
  - 已在插件配置中选定 `kimi-k2.6` 的用户仍会继续使用该模型，可随时在「模型」中切换；仅在未配置模型时才使用新的默认值。

## [1.15.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.15.0) - 2026-07-25

### 变更

- Claude 翻译与文字识别插件（translate-claude、recognize-claude）的预设模型 `claude-opus-4-8` 已替换为 `claude-opus-5`（[c22d956](https://github.com/genskyff/pot-plugins/commit/c22d956)）。
- OpenRouter 翻译与文字识别插件（translate-openrouter、recognize-openrouter）的预设模型 `google/gemini-3.5-flash` 已替换为 `google/gemini-3.6-flash`（[c22d956](https://github.com/genskyff/pot-plugins/commit/c22d956)）。
- 被移除的预设不再出现在「模型」下拉列表中；如需继续使用旧模型名，可将「模型」设为「自定义」并在「自定义模型」中填写。

## [1.14.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.14.0) - 2026-07-18

### 新增

- 翻译与识别插件新增「思考模式」（默认/开启/关闭）和「推理强度」（默认及 low～max 等档位）选项，可按各服务商的参数格式开启或关闭模型思考、指定推理等级；选择「默认」时不发送相关参数，交由服务端决定。适用范围：Claude、DeepSeek、Kimi、LongCat、OpenAI、OpenRouter、xAI、XiaoMi MiMo、Z.ai 翻译插件，以及 Claude、Kimi、OpenAI、OpenRouter、xAI 识别插件（[57161cb](https://github.com/genskyff/pot-plugins/commit/57161cb)）。
- OpenAI、OpenRouter、xAI 识别插件新增「温度」设置（[bcea357](https://github.com/genskyff/pot-plugins/commit/bcea357)）。
- 新增模型预设：Kimi 增加 `kimi-k3`，OpenAI 增加 `gpt-5.6-sol`，OpenRouter 增加 `x-ai/grok-4.5` 和 `google/gemini-3.5-flash`（[c04e4a8](https://github.com/genskyff/pot-plugins/commit/c04e4a8)、[b57e526](https://github.com/genskyff/pot-plugins/commit/b57e526)、[cd6294d](https://github.com/genskyff/pot-plugins/commit/cd6294d)）。

### 变更

- 默认模型更新：OpenAI 插件改用 `gpt-5.6-luna`（[b57e526](https://github.com/genskyff/pot-plugins/commit/b57e526)），OpenRouter 插件改用 `openai/gpt-5.6-luna`（[b81c773](https://github.com/genskyff/pot-plugins/commit/b81c773)），xAI 插件改用 `grok-4.5`（[c87082d](https://github.com/genskyff/pot-plugins/commit/c87082d)）。
- 「温度」改为仅在填写有效数字时发送：留空或非数字不再发送 `temperature`，不再使用默认值 `0.2`，也不再自动把超出范围的值限制到有效区间；识别插件（OpenAI、OpenRouter、xAI）不再固定发送 `temperature: 0.0`（[bcea357](https://github.com/genskyff/pot-plugins/commit/bcea357)）。
- OpenRouter 插件更换新图标（[b23a5f5](https://github.com/genskyff/pot-plugins/commit/b23a5f5)）。

### 移除

- Kimi 翻译插件移除 `moonshot-v1-auto` 模型选项及其专用的「温度」设置（[c04e4a8](https://github.com/genskyff/pot-plugins/commit/c04e4a8)）。
- xAI 插件移除 `grok-4-1-fast-non-reasoning` 模型选项（[c87082d](https://github.com/genskyff/pot-plugins/commit/c87082d)）。
- OpenRouter 预设移除 `google/gemini-3.1-flash-lite`、`deepseek/deepseek-v4-flash`、`z-ai/glm-5.2`、`qwen/qwen3.7-plus`，仍可通过「自定义模型」使用（[cd6294d](https://github.com/genskyff/pot-plugins/commit/cd6294d)、[b81c773](https://github.com/genskyff/pot-plugins/commit/b81c773)）。

### 修复

- 接口返回空响应体时，不再因读取响应字段失败而抛出脚本异常，改为提示 `No text returned`（[2b87475](https://github.com/genskyff/pot-plugins/commit/2b87475)）。

## [1.13.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.13.0) - 2026-07-11

### 变更

- `translate-openai`、`recognize-openai`、`translate-openrouter`、`recognize-openrouter` 的默认模型由 `gpt-5.4-mini` 更新为 `gpt-5.6-terra`（OpenRouter 插件为 `openai/gpt-5.6-terra`）。未手动指定模型的用户会自动改用新模型 ([79c8330](https://github.com/genskyff/pot-plugins/commit/79c8330))。
- `translate-openai` 与 `recognize-openai` 的模型下拉列表改为 `gpt-5.6-terra` 和 `gpt-5.6-luna`，`gpt-5.4-mini`、`gpt-5.5` 已从列表中移除；如需继续使用已移除的模型，请选择「自定义」并手动填写模型名 ([79c8330](https://github.com/genskyff/pot-plugins/commit/79c8330))。

## [1.12.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.12.0) - 2026-07-01

### 变更

- Claude 翻译与文字识别插件的默认模型由 `claude-sonnet-4-6` 更新为 `claude-sonnet-5`，模型预设列表同步替换。若仍想使用旧模型，可在「模型」中选择「自定义」，并在「自定义模型」中填写 `claude-sonnet-4-6`。[33d879d](https://github.com/genskyff/pot-plugins/commit/33d879d)
- OpenRouter 插件的预设模型列表更新：`anthropic/claude-sonnet-4.6` 替换为 `anthropic/claude-sonnet-5`，翻译插件的 `xiaomi/mimo-v2.5` 预设替换为 `z-ai/glm-5.2`。插件默认模型不变（仍为 `openai/gpt-5.4-mini`），被移除的预设仍可通过「自定义模型」手动填写。[d5bca8e](https://github.com/genskyff/pot-plugins/commit/d5bca8e)
- README 的插件标识表补充了 LongCat 翻译插件条目（`plugin.translate_longcat`）。[832e985](https://github.com/genskyff/pot-plugins/commit/832e985)

## [1.11.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.11.0) - 2026-06-30

### 新增

- 新增 LongCat 翻译插件（`plugin.translate_longcat`），基于 LongCat 的 [Chat Completions](https://longcat.chat/platform/docs/zh/api/chat.html) 接口把文本翻译为目标语言，可在 Pot 中导入对应的 `.potext` 文件使用。[39b91a5](https://github.com/genskyff/pot-plugins/commit/39b91a5)
- 默认请求地址为 `https://api.longcat.chat/openai/v1/chat/completions`，默认模型 `LongCat-2.0`；也可在「模型」中选择「自定义」并填写其他模型。目标语言支持 Auto 及简体中文、繁体中文、粤语、日语、英语等 30 种语言。
- 配置项包括必填的 API Key、自定义 Prompt（支持 `$to` 目标语言与 `$text` 待翻译文本占位符，缺少时自动追加）、温度（默认 `0.2`，超出范围自动限制到 `0.0`~`1.0`），以及自定义请求体 JSON（对象递归合并、数组整体替换、`null` 删除字段）。
- 请求体固定发送 `max_tokens: 8192` 和 `thinking.type: disabled`；若自定义模型或接口不支持这些参数，可通过自定义请求体覆盖，或将字段设为 `null` 删除。详见 [插件说明](https://github.com/genskyff/pot-plugins/blob/v1.11.0/translate-longcat/README.md)。

## [1.10.1](https://github.com/genskyff/pot-plugins/releases/tag/v1.10.1) - 2026-06-17

### 变更

- Z.ai 翻译插件的默认模型由 `glm-5.1` 升级为 `glm-5.2`（[d8fff30](https://github.com/genskyff/pot-plugins/commit/d8fff30)）。模型下拉列表中的 `glm-5.1` 选项同步被 `glm-5.2` 取代，仍可选 `glm-5-turbo` 或「自定义」。

## [1.10.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.10.0) - 2026-06-14

### 移除

- 从 Claude 翻译（translate-claude）与 Claude 识别（recognize-claude）插件的模型下拉列表中移除 `claude-fable-5`；如需继续使用该模型，可在「自定义模型」中手动填写（[72baf51](https://github.com/genskyff/pot-plugins/commit/72baf51)）。
- 同时移除针对 fable 系列模型的思考模式特例，Claude 插件对所有模型统一发送 `thinking: {"type": "disabled"}`。若你通过自定义模型使用名称含 `fable` 的模型，思考模式将改为关闭（[72baf51](https://github.com/genskyff/pot-plugins/commit/72baf51)）。

## [1.9.1](https://github.com/genskyff/pot-plugins/releases/tag/v1.9.1) - 2026-06-10

### 新增

- Claude 翻译与识别插件新增 `claude-fable-5` 模型预设；使用该系列模型（模型名称中包含 `fable`）时，插件不会再在默认请求体中发送 `thinking: {"type": "disabled"}`，从而可以正常调用该模型（[7f7985f](https://github.com/genskyff/pot-plugins/commit/7f7985f)）。

### 变更

- Claude 翻译与识别插件的模型预设列表中，`claude-haiku-4-5` 已被 `claude-fable-5` 取代；此前选用该预设的用户需要重新选择模型，或在「自定义模型」中手动填写模型名称。
- translate-openrouter 的模型预设由 `qwen/qwen3.6-plus` 更新为 `qwen/qwen3.7-plus`。

## [1.9.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.9.0) - 2026-05-29

### 变更

- 所有翻译插件以及 Claude、Kimi、OpenAI、OpenRouter、xAI 文字识别插件的默认最大输出 token 上限由 `4096` 提升至 `8192`（`max_tokens` / `max_completion_tokens`），仍可通过「自定义请求体（JSON）」覆盖。[fdb685d](https://github.com/genskyff/pot-plugins/commit/fdb685d)
- translate-kimi 默认模型由 `moonshot-v1-auto` 改为 `kimi-k2.6`。
- translate-xiaomimimo 默认模型由 `mimo-v2-flash` 改为 `mimo-v2.5`，可选模型更新为 `mimo-v2.5` 与 `mimo-v2.5-pro`。
- 更新各插件内置模型选项：OpenAI 翻译/文字识别插件以 `gpt-5.5` 替换 `gpt-5.4-nano`；Claude 翻译/文字识别插件将 `claude-opus-4-7` 更新为 `claude-opus-4-8`；[1873e34](https://github.com/genskyff/pot-plugins/commit/1873e34) translate-openrouter 将 `xiaomi/mimo-v2-flash` 替换为 `xiaomi/mimo-v2.5`。

### 移除

- 移除 PaddleOCR 文字识别插件（`plugin.recognize_paddleocr`）。[7b62668](https://github.com/genskyff/pot-plugins/commit/7b62668)

## [1.8.2](https://github.com/genskyff/pot-plugins/releases/tag/v1.8.2) - 2026-05-27

### 变更

- Kimi 翻译插件：默认模型由 `moonshot-v1-auto` 改为 `kimi-k2.6`，单次响应的 `max_completion_tokens` 由 4096 提升至 8192。
- XiaoMi MiMo 翻译插件：默认模型由 `mimo-v2-flash` 改为 `mimo-v2.5`，模型选项调整为 `mimo-v2.5`、`mimo-v2.5-pro`；原有的 `mimo-v2-flash`、`mimo-v2-omni` 已从下拉列表移除，需要继续使用这些模型的用户可选择「自定义」并手动填写模型名。
- OpenAI 翻译与识别插件：模型选项以 `gpt-5.5` 替换 `gpt-5.4-nano`。
- OpenRouter 翻译插件：预设模型 `xiaomi/mimo-v2-flash` 更新为 `xiaomi/mimo-v2.5`。
- 各插件 README 中记录的请求体固定参数 `max_tokens` / `max_completion_tokens` 由 4096 更新为 8192（[28049e8](https://github.com/genskyff/pot-plugins/commit/28049e8)）。

## [1.8.1](https://github.com/genskyff/pot-plugins/releases/tag/v1.8.1) - 2026-05-25

### 修复

- 调整全部 8 个翻译插件（Claude、DeepSeek、Kimi、OpenAI、OpenRouter、xAI、XiaoMi MiMo、Z.ai）的内置提示词，以及自定义 Prompt 未包含 `$text` 时自动追加的说明：现在要求只翻译 `<source_text>` 标签内的内容，并明确不要在输出中包含该包裹标签，避免译文里残留 `<source_text>` 标签 ([a9e349e](https://github.com/genskyff/pot-plugins/commit/a9e349e))。

## [1.8.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.8.0) - 2026-05-23

### 新增

- 所有翻译（`translate-*`）与文字识别（`recognize-*`）插件新增「自定义请求体（JSON）」配置项，可填写 JSON 对象并覆盖合并到请求体：对象递归合并、数组整体替换、将字段设为 `null` 可删除该字段。用于在自定义模型或接口不支持某些默认参数（如 `max_tokens`、`thinking`）时进行覆盖或删除；若填入非法 JSON 或非对象值会直接报错。[5da8363](https://github.com/genskyff/pot-plugins/commit/5da8363)

### 修复

- 修正 OpenRouter 插件中的 Google Gemini 预设模型，由 `google/gemini-3.1-flash-lite-preview` 更正为 `google/gemini-3.1-flash-lite`。[6e0c512](https://github.com/genskyff/pot-plugins/commit/6e0c512)

## [1.7.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.7.0) - 2026-05-02

### 新增

- DeepSeek 翻译插件新增「请求地址」配置项（默认指向 DeepSeek 的 `/chat/completions` 端点）与「自定义模型」支持，模型列表增加「自定义」选项，可填写官方未内置的模型名。[e72b2dc](https://github.com/genskyff/pot-plugins/commit/e72b2dc)
- OpenRouter 翻译插件新增 `qwen/qwen3.6-plus` 模型选项。[e72b2dc](https://github.com/genskyff/pot-plugins/commit/e72b2dc)

### 变更

- 所有翻译插件（Claude、DeepSeek、Kimi、OpenAI、OpenRouter、xAI、Xiaomi MiMo、Z.ai）改用统一的翻译提示词：源文本以 `<source_text>` 标签包裹，并要求模型只翻译标签内的内容；自定义 Prompt 缺少 `$to` 或 `$text` 占位符时，会自动追加带标签的模板。[e72b2dc](https://github.com/genskyff/pot-plugins/commit/e72b2dc)
- 所有 OCR 插件（Claude、Kimi、OpenAI、OpenRouter、xAI）改用更严格的 OCR 系统提示词：只输出纯文本，不解释、翻译、改写或添加标签，尽量保留原始排版，无法识别的字符以 `[?]` 表示；默认 OCR 指令简化为 `OCR this image.`。[87cb79d](https://github.com/genskyff/pot-plugins/commit/87cb79d)
- xAI 翻译与 OCR 插件从 Responses 接口迁移到 Chat Completions 接口，默认请求地址改为 xAI 的 `/v1/chat/completions` 端点，模型选项以 `grok-4-1-fast-non-reasoning` 替换 `grok-4.20-reasoning`。[e72b2dc](https://github.com/genskyff/pot-plugins/commit/e72b2dc) [87cb79d](https://github.com/genskyff/pot-plugins/commit/87cb79d)
- Kimi 翻译与 OCR 插件的请求改用 `max_completion_tokens`；翻译插件默认模型由 `moonshot-v1-128k` 改为 `moonshot-v1-auto`。[e72b2dc](https://github.com/genskyff/pot-plugins/commit/e72b2dc) [87cb79d](https://github.com/genskyff/pot-plugins/commit/87cb79d)
- Claude 翻译与 OCR 插件固定发送 `thinking.type: disabled`，不再按模型启用 `adaptive` 思考模式与 `output_config.effort`。[e72b2dc](https://github.com/genskyff/pot-plugins/commit/e72b2dc) [87cb79d](https://github.com/genskyff/pot-plugins/commit/87cb79d)
- 其他模型选项调整：OpenAI 翻译与 OCR 插件移除 `gpt-5.4`；OpenRouter 以 `google/gemini-3.1-flash-lite-preview` 替换 `google/gemini-3-flash-preview`；Xiaomi MiMo 翻译插件以 `mimo-v2-omni` 替换 `mimo-v2.5-pro`。已选用被移除模型的配置可改用「自定义」模型填写。[e72b2dc](https://github.com/genskyff/pot-plugins/commit/e72b2dc) [87cb79d](https://github.com/genskyff/pot-plugins/commit/87cb79d)
- 翻译插件的默认温度由 `0.1` 调整为 `0.2`；OpenRouter 翻译与 OCR 插件请求体新增 `reasoning.effort: none`，避免推理模型产生多余推理输出。[e72b2dc](https://github.com/genskyff/pot-plugins/commit/e72b2dc) [87cb79d](https://github.com/genskyff/pot-plugins/commit/87cb79d)
- PaddleOCR 插件的令牌配置项键名由 `apiKey` 改为 `apiToken`，升级后需重新填写 API Token。[87cb79d](https://github.com/genskyff/pot-plugins/commit/87cb79d)

### 修复

- 各插件的 API Key 字段在配置界面标记为必填（显示为 `API Key*`，PaddleOCR 为 `API Token*` 与「请求地址*」），避免漏填后请求失败。[3c62da9](https://github.com/genskyff/pot-plugins/commit/3c62da9) [87cb79d](https://github.com/genskyff/pot-plugins/commit/87cb79d)
- 请求地址填写本地地址（`localhost`、`127.0.0.1`，可带端口）时自动补全为 http 协议而非 https，并且会去除地址末尾多余的 `/`，方便连接本地代理或自建网关。[e72b2dc](https://github.com/genskyff/pot-plugins/commit/e72b2dc) [87cb79d](https://github.com/genskyff/pot-plugins/commit/87cb79d)

## [1.6.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.6.0) - 2026-04-25

### 新增

- 新增翻译插件 OpenRouter（`plugin.translate_openrouter`）：基于 OpenRouter 的 Chat Completions 接口将文本翻译为目标语言，默认模型为 `openai/gpt-5.4-mini`，并可选 `anthropic/claude-sonnet-4.6`、`google/gemini-3-flash-preview`、`deepseek/deepseek-v4-flash`、`xiaomi/mimo-v2-flash` 或自定义模型，请求地址留空即使用 OpenRouter 官方接口端点。[5127dfa](https://github.com/genskyff/pot-plugins/commit/5127dfa)
- 翻译插件的 `API Key` 为必填项；`自定义 Prompt` 支持 `$to`（目标语言）和 `$text`（待翻译文本）占位符，缺少占位符时会自动追加，留空则使用内置默认 Prompt；`温度` 留空或非数字时按 `0.1` 处理，超出范围会被限制在 `0.0` ~ `2.0`。
- 新增文字识别插件 OpenRouter（`plugin.recognize_openrouter`）：对截图进行 OCR 文本提取，默认模型为 `openai/gpt-5.4-mini`，并可选 `anthropic/claude-sonnet-4.6`、`google/gemini-3-flash-preview` 或自定义模型；支持通过 `自定义 Prompt` 指定 OCR 指令，留空则使用内置默认 Prompt。请求固定使用 `max_completion_tokens: 4096` 和 `temperature: 0.0`。[e1f6b96](https://github.com/genskyff/pot-plugins/commit/e1f6b96)

## [1.5.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.5.0) - 2026-04-24

### 新增

- 新增 XiaoMi MiMo 翻译插件 `plugin.translate_xiaomimimo`（[#2](https://github.com/genskyff/pot-plugins/pull/2)）：默认模型 `mimo-v2-flash`，可选 `mimo-v2.5-pro` 或自定义模型；请求地址默认为 XiaoMi MiMo 官方 Chat Completions 接口 `api.xiaomimimo.com/v1/chat/completions`，也可自行填写（提交 `57349c4`）。
- XiaoMi MiMo 插件支持自定义 Prompt（`$to` 与 `$text` 占位符，缺失时自动追加）与温度（为空或非数字时默认 `0.1`，超出范围自动限制到 `0.0` ~ `1.5`）；`max_completion_tokens` 固定为 `4096`，`thinking.type` 固定为 `disabled`。
- 新增 PaddleOCR 文字识别插件 `plugin.recognize_paddleocr`（[#3](https://github.com/genskyff/pot-plugins/pull/3)）：模型仅提供 `PaddleOCR-VL-1.5`，需填写识别接口的 `请求地址` 与 `API Token`，两者均为必填项。

### 变更

- 各插件 README 统一为「配置说明 / 请求体固定参数 / 响应解析」结构，根目录 README 的插件列表新增插件名称列，便于对照插件 ID 与显示名称（[#3](https://github.com/genskyff/pot-plugins/pull/3)）。

## [1.4.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.4.0) - 2026-04-24

### 变更

- `translate-deepseek` 插件升级到 DeepSeek V4 模型：模型选项由 `deepseek-chat` / `deepseek-reasoner` 改为 `deepseek-v4-flash` / `deepseek-v4-pro`，默认模型为 `deepseek-v4-flash`（[bb6e293](https://github.com/genskyff/pot-plugins/commit/bb6e293)）。
- `translate-deepseek` 的翻译请求现在固定携带 `thinking.type: disabled`，不再发送此前非 `deepseek-chat` 模型使用的 `thinking.type: adaptive`，翻译不再返回思考内容（[bb6e293](https://github.com/genskyff/pot-plugins/commit/bb6e293)）。

## [1.3.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.3.0) - 2026-04-22

### 新增

- 新增 Kimi 文字识别插件（`plugin.recognize_kimi`），可对截图进行 OCR 文本提取，随本次发布提供对应的 `.potext` 安装包（`ba5abab`）。
- 插件配置项：请求地址（默认指向 Moonshot 的 Kimi Chat Completions 接口，支持自动补全协议、自动去除末尾斜杠）、API Key（必填）、模型（默认 `kimi-k2.6`，选择「自定义」后使用自定义模型名）、自定义 Prompt（留空则使用内置 OCR 提示词）。
- 请求体固定 `max_tokens` 为 `4096`、`thinking.type` 为 `disabled`，结果取自响应的 `choices[0].message.content`；服务端需兼容 Kimi Chat Completions 的图片输入格式。

## [1.2.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.2.0) - 2026-04-21

### 新增

- 新增 Kimi 翻译插件 `translate-kimi`（插件 ID `plugin.translate_kimi`），基于 Kimi Chat Completions 接口，默认模型 `moonshot-v1-128k`，也可选用 `kimi-k2.6` 或自定义模型。[3cfc141](https://github.com/genskyff/pot-plugins/commit/3cfc141)
  - `temperature` 仅在使用 `moonshot-v1` 系列模型时生效；为空或非数字时默认 `0.1`，超出范围自动收敛到 `0.0`–`1.0`。
  - `customPrompt` 支持 `$to`（目标语言）和 `$text`（待翻译文本）占位符，缺失时会自动追加；为空则使用内置默认 Prompt。

### 修复

- 修复 Z.ai 翻译插件的 `temperature` 上限：超出范围时由原先的 clamp 到 `0.0`–`2.0` 改为 `0.0`–`1.0`，避免发送超出接口允许范围的温度值。[6afb449](https://github.com/genskyff/pot-plugins/commit/6afb449)

## [1.1.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.1.0) - 2026-04-19

### 新增

- 新增 Z.ai 翻译插件（`plugin.translate_zai`），基于 Z.ai Chat Completions 接口将文本翻译为目标语言；`API Key` 为必填项，默认请求地址为 `https://api.z.ai/api/paas/v4/chat/completions`（[fc2c369](https://github.com/genskyff/pot-plugins/commit/fc2c369)）。
- 模型可选 `glm-5.1`（默认）和 `glm-4.7-flashx`，也可选择「自定义」并自行填写模型名。
- 支持自定义 Prompt，可使用 `$to`（目标语言）和 `$text`（待翻译文本）占位符；缺少占位符时自动在末尾追加，留空则使用内置默认 Prompt。
- 温度参数留空或非数字时按 `0.1` 发送，超出范围时自动收敛到 `0.0` ~ `2.0`。
- 支持 31 种目标语言，包括简体/繁体中文、粤语、英语、日语、韩语、法语、德语、西班牙语、俄语等。
- 请求固定使用 `max_tokens: 4096` 并关闭 thinking，翻译结果取自响应的 `choices[0].message.content`，因此需要服务端兼容 Z.ai Chat Completions 接口。
- 该插件已纳入发布构建，可从 Releases 下载对应 `.potext` 文件导入 Pot 使用。

## [1.0.0](https://github.com/genskyff/pot-plugins/releases/tag/v1.0.0) - 2026-04-19

### 新增

- 首次发布整合后的插件仓库：原先独立维护的 7 个插件（4 个翻译、3 个文字识别）合并到同一仓库，推送 tag 后由统一工作流分别打包为 `.potext` 并上传到 Release，下载后可直接在 Pot 中导入。
- 翻译插件：`plugin.translate_claude`、`plugin.translate_openai`、`plugin.translate_xai`、`plugin.translate_deepseek`。
- 文字识别插件（对截图做 OCR，返回纯文本，不做翻译或改写）：`plugin.recognize_claude`、`plugin.recognize_openai`、`plugin.recognize_xai`。
- 每个插件都可选择预置模型或填写自定义模型名：Claude 支持 `claude-sonnet-4-6`（默认）/`claude-opus-4-7`/`claude-haiku-4-5`，OpenAI 支持 `gpt-5.4-mini`（默认）/`gpt-5.4-nano`/`gpt-5.4`，xAI 支持 `grok-4.20-non-reasoning`（默认）/`grok-4.20-reasoning`，DeepSeek 支持 `deepseek-chat`（默认）/`deepseek-reasoner`；选择“自定义”后留空会回退到默认模型。
- 通用配置：请求地址、API Key（必填）、自定义 Prompt。请求地址留空时使用官方接口，缺少协议时自动补全 https 前缀，末尾多写的斜杠会自动去掉；DeepSeek 翻译插件固定使用官方地址，不提供该配置。
- 翻译插件的自定义 Prompt 支持 `$to`（目标语言）与 `$text`（待翻译文本）占位符，缺失时自动在末尾追加，留空则使用内置 Prompt；OpenAI、xAI、DeepSeek 翻译插件另支持温度参数（留空或非数字按 `0.1`，超出 `0.0`~`2.0` 自动截断）。
- 固定请求参数：输出上限 4096 tokens；Claude 非 Haiku 模型启用 adaptive thinking（`output_config.effort: low`），文字识别插件使用 `temperature: 0.0` 与 `reasoning_effort: none`，返回结果取服务端原始文本。

### 变更

- 插件 ID 统一为 `plugin.<类型>_<服务商>`，例如 `plugin.claude_translate` → `plugin.translate_claude`、`plugin.openai_recognize` → `plugin.recognize_openai`。[7120ef2](https://github.com/genskyff/pot-plugins/commit/7120ef2)
- 各插件的 `homepage` 指向新仓库；根目录 README 汇总安装与通用配置说明，子插件 README 精简为默认请求地址、默认模型与固定请求参数。

### 修复

- xAI 插件改为读取响应 `output` 中首个 `type: "message"` 条目的 `content[0].text`，避免响应包含其他条目时取不到结果。[e7908fc](https://github.com/genskyff/pot-plugins/commit/e7908fc)
- 将输出上限由 5000 调整为 4096（Claude/DeepSeek 的 `max_tokens`、OpenAI 的 `max_completion_tokens`、xAI 的 `max_output_tokens`），并为 `deepseek-reasoner` 等推理模型启用 adaptive thinking。[23fd6eb](https://github.com/genskyff/pot-plugins/commit/23fd6eb) [8e70db1](https://github.com/genskyff/pot-plugins/commit/8e70db1) [1c0ce1c](https://github.com/genskyff/pot-plugins/commit/1c0ce1c) [f8fd008](https://github.com/genskyff/pot-plugins/commit/f8fd008)
- 优化内置翻译提示词，明确只翻译输入文本，并保留 Markdown、代码、URL、占位符等格式。[e4428ca](https://github.com/genskyff/pot-plugins/commit/e4428ca) [3ee2fda](https://github.com/genskyff/pot-plugins/commit/3ee2fda)
