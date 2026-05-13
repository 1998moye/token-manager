# Token 管理器

Edge 浏览器插件（Manifest V3），用于管理 AI API Token，支持一键复制和多平台多模型切换。

## 功能特性

- **多平台支持** — 支持 OpenAI、Anthropic、Google、DeepSeek、Kimi、通义千问等 20+ AI 平台
- **在线模型更新** — 一键从 [DataLearner](https://www.datalearner.com/) 同步最新模型数据（800+ 模型），自动映射到各平台
- **双模型字段** — 「官方模型」用于展示，「API 模型」用于第三方 API 中转时的实际调用名，灵活适配不同场景
- **一键复制配置** — 复制 ccswitch profile JSON 片段，可直接粘贴到配置文件中使用
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

### 方式一：源码构建

1. 克隆仓库
2. 安装依赖并构建：

```bash
npm install
npm run build
```

3. 在 Edge 中打开 `edge://extensions/`
4. 开启**开发者模式**
5. 点击**加载扩展**，选择 `dist` 目录

### 方式二：直接加载

下载源码后，将 `dist/` 目录作为未打包扩展加载即可。

## 开发

```bash
npm install
npm run dev    # 开发模式（watch 自动构建）
npm run build  # 生产构建
```

## 技术栈

- **前端框架：** Vue 3 + Composition API
- **UI 组件库：** Element Plus
- **构建工具：** Vite
- **扩展标准：** Manifest V3

## 文件结构

```
keyManager/
├── public/
│   ├── manifest.json      # 插件 manifest（V3）
│   └── icons/             # 插件图标
├── src/
│   ├── main.js            # popup 入口
│   ├── options.js         # 设置页入口
│   ├── App.vue            # popup 根组件
│   ├── OptionsApp.vue     # 设置页根组件
│   ├── components/        # UI 组件（TokenCard / TokenForm / ConfirmDialog）
│   ├── services/          # 存储、剪贴板、模型更新服务
│   ├── data/              # 平台配置数据
│   └── styles/            # 公共样式
├── index.html             # popup 页面
├── options.html           # 设置页
├── package.json
└── vite.config.js
```

## 版本

当前版本：**v2.1.1**
