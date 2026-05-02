# Pot 文字识别插件 - xAI

基于 xAI 的 [Chat Completions](https://docs.x.ai/developers/rest-api-reference/inference/chat#chat-completions) 接口，对截图内容进行文本提取。

## 配置说明

- `请求地址`：默认为 `https://api.x.ai/v1/chat/completions`
- `API Key`：接口访问令牌，**必填**
- `模型`：默认为 `grok-4.20-non-reasoning`
- `自定义模型`：选择 `自定义` 模型时使用
- `自定义 Prompt`：用于指定 OCR 指令，内容会随截图一起发送；为空则使用内置默认 Prompt

## 请求体固定参数

- `max_completion_tokens`：`4096`
- `temperature`：`0.0`

## 响应解析

- 取响应 `choices[0].message.content` 作为结果
