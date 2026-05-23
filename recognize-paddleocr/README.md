# Pot 文字识别插件 - PaddleOCR

基于 [PaddleOCR](https://ai.baidu.com/ai-doc/AISTUDIO/Cmkz2m0ma) 接口的文字识别插件，对截图内容进行文本提取。

## 配置说明

- `请求地址`：接口地址，**必填**
- `API Token`：接口访问令牌，**必填**
- `模型`：仅提供 `PaddleOCR-VL-1.5`
- `自定义请求体（JSON）`：可填写 JSON 对象，最后覆盖合并到请求体；对象递归合并，数组整体替换，`null` 删除字段

## 请求体固定参数

- `fileType`：`1`
- `useLayoutDetection`：`false`
- `useChartRecognition`：`false`
- `promptLabel`：`ocr`
- `temperature`：`0.0`
- `relevelTitles`：`false`
- `visualize`：`false`

若自定义模型或接口不支持某些默认参数，可通过 `自定义请求体（JSON）` 覆盖或删除（将字段设为 `null`）。

## 响应解析

- 取响应 `result.layoutParsingResults[0].markdown.text` 作为结果
