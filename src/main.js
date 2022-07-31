import { createApp } from "vue";
import App from "./App.vue";
import Routes from "./route";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
createApp(App).use(ElementPlus).use(Routes).mount("#app");
// export default { db };
