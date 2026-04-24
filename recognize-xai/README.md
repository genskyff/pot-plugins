# Pot 文字识别插件 - xAI

基于 xAI Responses 接口的图片输入格式，对截图内容进行文本提取。

## 配置说明

- `请求地址`：默认为 `https://api.x.ai/v1/responses`
- `API Key`：接口访问令牌，**必填**
- `模型`：默认为 `grok-4.20-non-reasoning`
- `自定义模型`：选择 `自定义` 模型时使用
- `自定义 Prompt`：用于指定 OCR 指令，内容会随截图一起发送；为空则使用内置默认 Prompt

## 请求体固定参数

- `max_output_tokens`：`4096`
- `reasoning_effort`：`none`
- `temperature`：`0.0`
- `verbosity`：`low`

## 响应解析

- 取响应 `output` 中首个消息条目的 `content[0].text` 作为结果
