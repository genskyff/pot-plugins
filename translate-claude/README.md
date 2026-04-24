# Pot 翻译插件 - Claude

基于 Anthropic Claude Messages 接口，将文本翻译为目标语言。

## 配置说明

- `请求地址`：默认为 `https://api.anthropic.com/v1/messages`
- `API Key`：接口访问令牌，**必填**
- `模型`：默认为 `claude-sonnet-4-6`
- `自定义模型`：选择 `自定义` 模型时使用
- `自定义 Prompt`：支持 `$to`（目标语言）和 `$text`（待翻译文本）占位符；若缺少占位符会自动追加；为空则使用内置默认 Prompt

## 请求体固定参数

- `max_tokens`：`4096`
- `thinking.type`：`adaptive`（Haiku 模型除外）
- `output_config.effort`：`low`（Haiku 模型除外）

## 响应解析

- 取响应 `content` 中首个文本块（`type: "text"`）作为结果
