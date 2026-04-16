# Pot-App DeepSeek 翻译插件

这是一个用于 Pot-App 的翻译插件，使用 DeepSeek 接口，将文本翻译为目标语言。

## 功能概览

- 支持 `deepseek-chat`、`deepseek-reasoner` 模型
- 支持自定义 Prompt，可使用 `$to`、`$text` 占位符
- 支持自定义温度参数

## 配置项

| 配置项       | 说明                                                |
| ------------ | --------------------------------------------------- |
| apiKey       | API Key                                             |
| model        | 模型名称，可选 `deepseek-chat`、`deepseek-reasoner` |
| customPrompt | 自定义 Prompt，支持 `$to`、`$text` 占位符           |
| temperature  | 温度，范围 0.0 ~ 2.0                                |

## 默认行为

- 默认模型为 `deepseek-chat`
- `temperature` 为空或非数字时，默认使用 `0.1`；超出范围时自动 clamp 到 `0.0` ~ `2.0`

## 自定义 Prompt

`customPrompt` 支持以下占位符：

| 占位符  | 替换内容   |
| ------- | ---------- |
| `$to`   | 目标语言   |
| `$text` | 待翻译文本 |

若 Prompt 中缺少某个占位符，插件会自动在末尾追加对应内容。若 `customPrompt` 为空，则使用内置默认 Prompt。

## 请求体固定参数

固定发送以下参数：

- `max_tokens`：`4096`

## 兼容性说明

- 返回结果依赖 `choices[0].message.content`
- 所有配置项都会在请求前自动去掉首尾空白

## 仓库结构

- `info.json`：插件配置定义
- `main.js`：请求实现
