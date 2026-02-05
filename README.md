# ⌨️ Bilibili 快捷评论发布 (EasyComment)

[![安装脚本](https://img.shields.io/badge/安装脚本-Greasy%20Fork-red.svg?style=for-the-badge&logo=tampermonkey)](https://greasyfork.org/zh-CN/scripts/565212-bilibili-快捷评论发布)
[![GitHub](https://img.shields.io/badge/GitHub-仓库-blue.svg?style=for-the-badge&logo=github)](https://github.com/codertesla/EasyComment)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://github.com/codertesla/EasyComment/blob/main/LICENSE)

在 B 站视频页输入评论后，使用快捷键即可快速发布，无需点击"发布"按钮。让你的评论效率提升 200%！



## ✨ 核心特性

- **⚡ 快捷键发布**：
  - `⌘ Command + Enter`（macOS）
  - `Ctrl + Enter`（Windows / Linux）
- **🎯 全场景支持**：
  - **主评论框**：视频下方的评论输入区
  - **楼中楼回复**：回复他人评论时同样有效
- **🔧 完美兼容**：
  - **新版评论区**：适配 B站最新 Shadow DOM 架构
  - **旧版评论区**：向后兼容，无缝切换



## 🛠️ 安装指南

1. **安装脚本管理器**：
   - [Tampermonkey](https://www.tampermonkey.net/) (推荐)
   - [Violentmonkey](https://violentmonkey.github.io/)
2. **点此一键安装**：
   - 👉 [**安装 Bilibili 快捷评论发布**](https://greasyfork.org/zh-CN/scripts/565212-bilibili-快捷评论发布)
3. **刷新页面** 即可立即生效。



## 🎯 支持页面

| 页面类型 | URL 匹配 |
| :--- | :--- |
| 普通视频页 | `bilibili.com/video/*` |
| 番剧播放页 | `bilibili.com/bangumi/play/*` |
| 列表播放页 | `bilibili.com/list/*` |



## 📖 使用方法

1. 打开任意 B 站视频页面
2. 点击评论输入框，输入你的评论
3. 按下 `Cmd + Enter`（Mac）或 `Ctrl + Enter`（Windows）
4. 评论自动发布！✨

> [!TIP]
> 回复楼中楼评论时同样有效！点击回复框输入内容后直接使用快捷键即可发布。



## ⚠️ 注意事项

> [!IMPORTANT]
> - **必须登录**：发布评论需要登录 B站账号。
> - **输入框激活**：快捷键仅在评论输入框获得焦点时生效。



## ❓ 常见问题

<details>
<summary><b>Q: 快捷键没有反应？</b></summary>
A: 请确保评论输入框已激活（光标在输入框内闪烁）。如果仍无效，请打开浏览器控制台（F12）查看是否有脚本加载日志。
</details>

<details>
<summary><b>Q: 支持其他B站页面吗？</b></summary>
A: 目前支持视频页、番剧页和列表页。如需支持其他页面，欢迎在 GitHub 提交 Issue。
</details>



## 📜 更新日志

- **v1.1.0** (2026-02-05)：支持 B站新版评论区（Shadow DOM 架构）；支持楼中楼回复框。
- **v1.0.0** (2026-02-05)：初始版本发布，核心快捷键发布功能实现。



## 🤝 贡献与反馈

- **提交 BUG / 建议**：[GitHub Issues](https://github.com/codertesla/EasyComment/issues) 或 [Greasy Fork 反馈区](https://greasyfork.org/zh-CN/scripts/565212-bilibili-快捷评论发布/feedback)



**免责声明**：本脚本仅供学习和个人使用。使用本脚本产生的任何后果由用户自行承担。
