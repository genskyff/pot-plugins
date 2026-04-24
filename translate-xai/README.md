# Pot 翻译插件 - xAI

基于 xAI 的 Responses 接口，将文本翻译为目标语言。

## 配置说明

- `请求地址`：默认为 `https://api.x.ai/v1/responses`
- `API Key`：接口访问令牌，**必填**
- `模型`：默认为 `grok-4.20-non-reasoning`
- `自定义模型`：选择 `自定义` 模型时使用
- `自定义 Prompt`：支持 `$to`（目标语言）和 `$text`（待翻译文本）占位符；若缺少占位符会自动追加；为空则使用内置默认 Prompt
- `温度`：为空或非数字时默认 `0.1`，超出范围时自动限制到 `0.0` ~ `2.0`

## 请求体固定参数

- `max_output_tokens`：`4096`
- `reasoning_effort`：`none`
- `verbosity`：`low`

## 响应解析

- 取响应 `output` 中首个消息条目的 `content[0].text` 作为结果
