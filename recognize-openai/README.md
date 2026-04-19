# Pot 文字识别插件 - OpenAI

基于 OpenAI 兼容的 Chat Completions 图片输入格式，对截图内容进行文本提取。

> 通用说明请参阅 [根目录 README](../README.md)。

## 接口说明

- 默认请求地址：`https://api.openai.com/v1/chat/completions`
- 默认模型：`gpt-5.4-mini`

## 请求体固定参数

- `max_completion_tokens`：`4096`
- `reasoning_effort`：`none`
- `temperature`：`0.0`
- `verbosity`：`low`

## 兼容性说明

- 需要服务端兼容 Chat Completions 的图片输入格式
- 返回结果依赖 `choices[0].message.content`
