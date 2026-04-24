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
| `plugin.translate_kimi`     |
| `plugin.translate_xiaomimimo` |
| `plugin.translate_zai`      |

### 文字识别插件

| 插件                      |
| ------------------------- |
| `plugin.recognize_claude` |
| `plugin.recognize_kimi`   |
| `plugin.recognize_openai` |
| `plugin.recognize_xai`    |

## 安装

从 [Releases](../../releases) 下载对应的 `.potext` 文件，然后在 Pot 中导入即可。

## 发布

推送 tag 即可触发 GitHub Actions 自动构建并发布所有插件：

```shell
git tag <tag_name>
git push --tags
```
