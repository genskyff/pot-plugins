# Pot-App xAI 翻译插件

这是一个用于 Pot-App 的翻译插件，基于 xAI 的 Responses 接口，将文本翻译为目标语言。

修改自：<https://github.com/pot-app/pot-app-translate-plugin-template>

## 功能概览

- 支持 `grok-4.20-non-reasoning`、`grok-4.20-reasoning`
- 支持自定义模型名称
- 支持自定义 Prompt，可使用 `$to`、`$text` 占位符
- 支持自定义温度参数

## 接口说明

插件使用 xAI Responses 接口，默认请求地址为：

```text
https://api.x.ai/v1/responses
```

若请求地址缺少协议，会自动补全 `https://`；若末尾带有 `/`，会在发送请求前去掉。

## 配置项

| 配置项       | 说明                                                |
| ------------ | --------------------------------------------------- |
| requestUrl   | 请求地址，支持 xAI 官方地址、代理地址或兼容服务地址 |
| apiKey       | API Key                                             |
| model        | 模型名称，可直接选择预置模型                        |
| customModel  | 当 `model` 为 `custom` 时生效                       |
| customPrompt | 自定义 Prompt，支持 `$to`、`$text` 占位符           |
| temperature  | 温度，范围 0.0 ~ 2.0                                |

## 默认行为

- `requestUrl` 为空时，回退为默认请求地址
- 默认模型为 `grok-4.20-non-reasoning`
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

- `max_output_tokens`：5000
- `reasoning_effort`：none
- `verbosity`：low

## 兼容性说明

- 需要服务端兼容 xAI Responses 接口
- 返回结果取 `output` 中 `type: "message"` 条目的 `content[0].text`
- 所有配置项都会在请求前自动去掉首尾空白

## 仓库结构

- `info.json`：插件配置定义
- `main.js`：请求实现
