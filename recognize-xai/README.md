# Pot 文字识别插件 - xAI

基于 xAI Responses API 的图片输入格式，对截图内容进行文本提取。

> 通用说明请参阅 [根目录 README](../README.md)。

## 接口说明

- 默认请求地址：`https://api.x.ai/v1/responses`
- 默认模型：`grok-4.20-non-reasoning`

## 请求体固定参数

- `max_output_tokens`：`4096`
- `reasoning_effort`：`none`
- `temperature`：`0.0`
- `verbosity`：`low`

## 兼容性说明

- 需要服务端兼容 xAI Responses API 的图片输入格式
- 取响应 `output` 中首个 `type: "message"` 条目的 `content[0].text` 作为识别结果
