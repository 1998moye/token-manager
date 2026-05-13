import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import OptionsApp from './OptionsApp.vue';
import './styles/common.css';

const app = createApp(OptionsApp);
app.use(ElementPlus, { locale: zhCn });
app.mount('#app');