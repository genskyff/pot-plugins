# Pot 文字识别插件 - Claude

基于 Anthropic Messages API 的图片输入格式，对截图内容进行文本提取。

## 配置说明

- `请求地址`：默认为 `https://api.anthropic.com/v1/messages`
- `API Key`：接口访问令牌，**必填**
- `模型`：默认为 `claude-sonnet-4-6`

## 请求体固定参数

- `max_tokens`：`4096`
- `thinking.type`：`adaptive`（`haiku` 系列模型不启用）
- `output_config.effort`：`low`（`haiku` 系列模型不启用）

## 响应解析

- 取响应 `content` 中首个文本块（`type: "text"`）作为结果
