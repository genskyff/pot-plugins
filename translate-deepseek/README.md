# Pot 翻译插件 - DeepSeek

基于 DeepSeek Chat Completions 接口，将文本翻译为目标语言。

## 配置说明

- `请求地址`：固定为 `https://api.deepseek.com/chat/completions`
- `API Key`：接口访问令牌，**必填**
- `模型`：默认为 `deepseek-v4-flash`
- `自定义 Prompt`：支持 `$to`（目标语言）和 `$text`（待翻译文本）占位符；若缺少占位符会自动追加；为空则使用内置默认 Prompt
- `温度`：为空或非数字时默认 `0.1`，超出范围时自动限制到 `0.0` ~ `2.0`

## 请求体固定参数

- `max_tokens`：`4096`
- `thinking.type`：`disabled`

## 响应解析

- 取响应 `choices[0].message.content` 作为结果
