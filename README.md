# Pot-App OpenAI 翻译插件

这是一个用于 Pot-App 的翻译插件，基于 OpenAI 兼容的 Chat Completions 接口，将文本翻译为目标语言。

## 功能概览

- 支持 `GPT-5.4`、`GPT-5.4-mini`、`GPT-5.4-nano`
- 支持自定义模型名称
- 支持自定义 Prompt，可使用 `$to`、`$text` 占位符
- 支持自定义温度参数

## 接口说明

插件使用 Chat Completions 接口，默认请求地址为：

```text
https://api.openai.com/v1/chat/completions
```

若请求地址缺少协议，会自动补全 `https://`；若末尾带有 `/`，会在发送请求前去掉。

## 配置项

| 配置项       | 说明                                                   |
| ------------ | ------------------------------------------------------ |
| requestUrl   | 请求地址，支持 OpenAI 官方地址、代理地址或兼容服务地址 |
| apiKey       | API Key                                                |
| model        | 模型名称，可直接选择预置模型                           |
| customModel  | 当 `model` 为 `custom` 时生效                          |
| customPrompt | 自定义 Prompt，支持 `$to`、`$text` 占位符              |
| temperature  | 温度，范围 0.0 ~ 2.0                                   |

## 默认行为

- `requestUrl` 为空时，回退为默认请求地址
- 默认模型为 `gpt-5.4-mini`
- `model` 为空时，回退为默认模型
- 当 `model` 为 `custom` 且 `customModel` 为空时，也会回退为默认模型
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

- `max_completion_tokens`：`4096`
- `reasoning_effort`：`none`
- `verbosity`：`low`

## 兼容性说明

- 需要服务端兼容 Chat Completions 接口
- 返回结果依赖 `choices[0].message.content`
- 所有配置项都会在请求前自动去掉首尾空白

## 仓库结构

- `info.json`：插件配置定义
- `main.js`：请求实现
