# Pot-App Claude 文字识别插件

基于 Anthropic Messages API 的图片输入格式，对截图内容进行文本提取。

> 通用说明请参阅 [根目录 README](../README.md)。

## 接口说明

- 默认请求地址：`https://api.anthropic.com/v1/messages`
- 默认模型：`claude-sonnet-4-6`

## 请求体固定参数

- `max_tokens`：`4096`
- `thinking.type`：`adaptive`（`haiku` 系列模型不启用）
- `output_config.effort`：`low`（`haiku` 系列模型不启用）

## 兼容性说明

- 需要服务端兼容 Anthropic Messages API 的图片输入格式
- 取响应 `content` 中首个文本块（`type: "text"`）作为识别结果
