# Pot Plugins

[Pot](https://pot-app.com/) 的 LLM 翻译和文字识别插件集合。

## 插件列表

### 翻译插件

| 插件                        |
| --------------------------- |
| `plugin.translate_claude`   |
| `plugin.translate_openai`   |
| `plugin.translate_xai`      |
| `plugin.translate_deepseek` |
| `plugin.translate_zai`      |

### 文字识别插件

| 插件                      |
| ------------------------- |
| `plugin.recognize_claude` |
| `plugin.recognize_openai` |
| `plugin.recognize_xai`    |

## 安装

从 [Releases](../../releases) 下载对应的 `.potext` 文件，然后在 Pot 中导入即可。

## 配置

每个插件都支持以下通用配置：

- **请求地址**：API 端点地址（可选，使用默认地址）
- **API Key**：对应服务商的 API 密钥
- **模型**：选择预设模型或自定义模型（可选，使用默认模型）
- **自定义 Prompt**：自定义提示词（可选）

部分翻译插件还支持 **温度** 参数。

## 项目结构

```
├── recognize-claude/    # Claude 文字识别插件
├── recognize-openai/    # OpenAI 文字识别插件
├── recognize-xai/       # xAI 文字识别插件
├── translate-claude/    # Claude 翻译插件
├── translate-deepseek/  # DeepSeek 翻译插件
├── translate-openai/    # OpenAI 翻译插件
├── translate-xai/       # xAI 翻译插件
└── translate-zai/       # Z.ai 翻译插件
```

## 发布

推送 tag 即可触发 GitHub Actions 自动构建并发布所有插件：

```shell
git tag v1.0.0
git push --tags
```
