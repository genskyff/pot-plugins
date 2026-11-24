# Pot 文字识别插件 - Gemini

基于 Google 的 [Interactions](https://aistudio.google.com/api-reference/interactions-api/create-interaction?api-version=v1) 接口，对截图内容进行文本提取。

## 配置说明

- `请求地址`：默认为 `https://generativelanguage.googleapis.com/v1/interactions`
- `API Key`：接口访问令牌，**必填**
- `模型`：默认为 `gemini-4-hydrogen`
- `自定义模型`：选择 `自定义` 模型时使用
- `自定义 Prompt`：用于指定 OCR 指令，内容会随截图一起发送；为空则使用内置默认 Prompt
- `自定义请求体（JSON）`：可填写 JSON 对象，最后覆盖合并到请求体；对象递归合并，数组整体替换，`null` 删除字段

## 请求体固定参数

- `store`：`false`

若自定义模型或接口不支持某些默认参数，可通过 `自定义请求体（JSON）` 覆盖或删除（将字段设为 `null`）。

## 响应解析

- 取响应 `steps` 中 `type: "model_output"` 步骤的文本块作为结果
