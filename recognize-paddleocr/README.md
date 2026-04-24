# Pot 文字识别插件 - PaddleOCR

基于 PaddleOCR 识别接口的文字识别插件，对截图内容进行文本提取。

## 配置说明

- `请求地址`：PaddleOCR 识别接口地址，**必填**
- `API Token`：接口访问令牌，**必填**
- `模型`：仅提供 `PaddleOCR-VL-1.5`

## 请求体固定参数

- `useLayoutDetection`：`false`
- `useChartRecognition`：`false`
- `promptLabel`：`ocr`
- `temperature`：`0.0`
- `relevelTitles`：`false`
- `visualize`：`false`

## 响应解析

- 取响应 `result.layoutParsingResults[0].markdown.text` 作为结果
