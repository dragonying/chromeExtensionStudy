import { createApp } from 'vue'
import app from './components/app.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import Dy from '@/utils/dy'
// const dyObj = new Dy();
// dyObj.userInfo('MS4wLjABAAAALngeicdXUAwtb9W078jsVFFErL_nKawz1t2422-FNqsgrcdY07u6Pd8Ws2YRtf0z').then(res => {
//     alert(res)
//   });

//挂载
joinContent(app)
//注入
injectJsInsert()
function joinContent(element) {
    console.log(`-------- 挂载应用 --------`)
    const div = document.createElement('div');
    div.id = 'joinContentApp';
    document.body.appendChild(div);
    const elemApp = createApp(element);
    elemApp.use(ElementPlus, { locale: zhCn });
    elemApp.mount('#joinContentApp')
}
//chrome的API接口,用于传输或监听数据信号
chrome.extension.onRequest.addListener(function (request) { if (request.popAction == "Test") { console.log("test") } }
);
function injectJsInsert() {
    console.log(`-------- 注入javaScript和css --------`)
    document.addEventListener('readystatechange', () => {
        const injectPath = 'js/inject.js'
        const script = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        script.src = chrome.extension.getURL(injectPath)
        document.body.appendChild(script);
    })
}


