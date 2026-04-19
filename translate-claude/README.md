# Pot-App Claude 翻译插件

基于 Anthropic Claude Messages 接口，将文本翻译为目标语言。

> 通用说明请参阅 [根目录 README](../README.md)。

## 接口说明

- 默认请求地址：`https://api.anthropic.com/v1/messages`
- 默认模型：`claude-sonnet-4-6`

## 自定义 Prompt

`customPrompt` 支持 `$to`（目标语言）和 `$text`（待翻译文本）占位符。若缺少占位符，插件会自动在末尾追加对应内容。为空则使用内置默认 Prompt。

## 请求体固定参数

- `max_tokens`：`4096`
- `thinking.type`：`adaptive`（Haiku 模型除外）
- `output_config.effort`：`low`（Haiku 模型除外）

## 兼容性说明

- 需要服务端兼容 Anthropic Messages 接口
- 返回结果依赖 `content[].text`（`type` 为 `text` 的首个元素）
