import Vue from 'vue';
import App from './App.vue';

import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
import iViewFast from './../packages/index.js';

Vue.use(iView);

// 导入组件库

// 注册组件库
Vue.use(iViewFast);

new Vue({
    render: h => h(App),
}).$mount('#app');