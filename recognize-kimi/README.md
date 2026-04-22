# Pot 文字识别插件 - Kimi

基于 Kimi Chat Completions 图片输入格式，对截图内容进行文本提取。

> 通用说明请参阅 [根目录 README](../README.md)。

## 接口说明

- 默认请求地址：`https://api.moonshot.ai/v1/chat/completions`
- 默认模型：`kimi-k2.6`

## 请求体固定参数

- `max_tokens`：`4096`
- `thinking.type`：`disabled`

## 兼容性说明

- 需要服务端兼容 Kimi Completions 的图片输入格式
- 返回结果依赖 `choices[0].message.content`
