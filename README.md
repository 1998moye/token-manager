# Token 管理器

Edge 浏览器插件（Manifest V3），用于管理 AI API Token，支持一键复制和多平台多模型切换。

## 功能特性

- **多平台支持** — 支持 OpenAI、Anthropic、Google、DeepSeek、Kimi、通义千问等 20+ AI 平台
- **一键复制** — 点击即复制完整配置片段（可直接粘贴到 ccswitch 配置文件）
- **独立字段复制** — 支持单独复制 API Key、API 地址
- **自动表单保存** — 填写内容实时保存，关闭弹窗后自动恢复
- **数据备份** — JSON 导入/导出，数据不丢失

## 支持平台

### 国际大厂
- OpenAI / Anthropic / Google / Groq / Mistral AI / Cohere / Perplexity

### 国内大厂
- DeepSeek / Kimi (Moonshot) / MiniMax / 豆包 / 通义千问 / 文心一言 / 混元 / 智谱 GLM / 阶跃星辰 / 零一万物 / 百川智能

### 聚合平台
- SiliconFlow / Together AI / SiliconCloud

### 其他
- xAI Grok / Ollama (本地部署)

## 安装方式

1. 下载源码
2. 在 Edge 中打开 `edge://extensions/`
3. 开启**开发者模式**
4. 点击**加载扩展**，选择 `dist` 目录

## 构建

```bash
npm install
npm run build
```

产物输出到 `dist/` 目录。

## 技术栈

- **前端框架：** Vue 3
- **UI 组件库：** Element Plus
- **构建工具：** Vite
- **扩展标准：** Manifest V3

## 文件结构

```
keyManager/
├── manifest.json          # 插件配置
├── package.json           # 项目依赖
├── vite.config.js        # Vite 构建配置
├── index.html             # popup 主界面
├── options.html          # 设置页
├── src/
│   ├── main.js          # Vue 入口
│   ├── options.js        # 设置页 Vue 入口
│   ├── App.vue          # popup 根组件
│   ├── OptionsApp.vue    # 设置页根组件
│   ├── components/      # UI 组件
│   ├── services/        # 存储和剪贴板服务
│   ├── data/           # 平台配置数据
│   └── styles/         # 公共样式
└── public/
    ├── manifest.json   # 插件 manifest
    └── icons/          # 插件图标
```