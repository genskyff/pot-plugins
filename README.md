# Pot-App OpenAI 文字识别插件

这是一个用于 Pot-App 的 OCR 插件，基于 OpenAI 兼容的 Chat Completions 图片输入格式，对截图内容进行文本提取。

项目基于模板改造：<https://github.com/pot-app/pot-app-recognize-plugin-openai>

## 功能概览

- 支持 `GPT-5.4`、`GPT-5.4-mini`、`GPT-5.4-nano`
- 支持自定义模型名称
- 返回纯文本 OCR 结果，适合截图识别场景

## 当前实现

插件当前使用 Chat Completions 接口，运行时默认请求地址为：

```text
https://api.openai.com/v1/chat/completions
```

如果请求地址缺少协议，插件会自动补成 `https://`；如果末尾带有 `/`，会在发送请求前去掉。

## 配置项

| 配置项       | 说明                                                   |
| ------------ | ------------------------------------------------------ |
| requestUrl   | 请求地址，支持 OpenAI 官方地址、代理地址或兼容服务地址 |
| apiKey       | API Key                                                |
| model        | 模型名称，可直接选择预置模型                           |
| customModel  | 当 model 为 custom 时生效                              |
| customPrompt | 自定义提示词                                           |

## 默认行为

- requestUrl 为空时，回退为默认请求地址
- 默认模型为 `gpt-5.4-mini`
- model 为空时，回退为默认模型
- 当 model 为 custom 且 customModel 为空时，也会回退为默认模型

## 请求体固定参数

插件会固定发送以下参数：

- system prompt：限制模型只做 OCR 文本提取
- user prompt：固定为 OCR 提取提示词
- temperature：0.0
- reasoning_effort：none
- verbosity：low
- max_completion_tokens：5000

## 兼容性说明

- 需要服务端兼容 Chat Completions 的图片输入格式
- 返回结果依赖 `choices[0].message.content`
- 所有参数都会在请求前自动去掉首尾空白

## 仓库结构

- info.json：Pot-App 插件配置定义
- main.js：请求实现
