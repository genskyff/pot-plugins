# Pot 翻译插件 - Z.ai

基于 Z.ai（智谱国外站）Chat Completions 接口，将文本翻译为目标语言。

> 通用说明请参阅 [根目录 README](../README.md)。

## 接口说明

- 默认请求地址：`https://api.z.ai/api/paas/v4/chat/completions`
- 默认模型：`glm-5.1`
- `temperature` 为空或非数字时默认 `0.1`，超出范围时自动 clamp 到 `0.0` ~ `1.0`

## 自定义 Prompt

`customPrompt` 支持 `$to`（目标语言）和 `$text`（待翻译文本）占位符。若缺少占位符，插件会自动在末尾追加对应内容。为空则使用内置默认 Prompt。

## 请求体固定参数

- `max_tokens`：`4096`
- `thinking.type`：`disabled`

## 兼容性说明

- 需要服务端兼容 Z.ai Chat Completions 接口
- 返回结果依赖 `choices[0].message.content`
