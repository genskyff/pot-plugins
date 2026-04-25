# Pot Plugins

[Pot](https://pot-app.com/) 的 LLM 翻译和文字识别插件集合。

## 插件列表

### 文字识别插件

| 插件 ID                       | 插件名称   |
| ----------------------------- | ---------- |
| `plugin.recognize_claude`     | Claude     |
| `plugin.recognize_kimi`       | Kimi       |
| `plugin.recognize_openai`     | OpenAI     |
| `plugin.recognize_openrouter` | OpenRouter |
| `plugin.recognize_paddleocr`  | PaddleOCR  |
| `plugin.recognize_xai`        | xAI        |

### 翻译插件

| 插件 ID                       | 插件名称    |
| ----------------------------- | ----------- |
| `plugin.translate_claude`     | Claude      |
| `plugin.translate_deepseek`   | DeepSeek    |
| `plugin.translate_kimi`       | Kimi        |
| `plugin.translate_openai`     | OpenAI      |
| `plugin.translate_openrouter` | OpenRouter  |
| `plugin.translate_xai`        | xAI         |
| `plugin.translate_xiaomimimo` | XiaoMi MiMo |
| `plugin.translate_zai`        | Z.ai        |

## 安装

从 [Releases](../../releases) 下载对应的 `.potext` 文件，然后在 Pot 中导入即可。

## 发布

推送 tag 即可触发 GitHub Actions 自动构建并发布所有插件：

```shell
git tag <tag_name>
git push --tags
```
