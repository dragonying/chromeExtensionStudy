import { createApp } from 'vue'
import app from './components/app.vue'
import Dy from '@/utils/dy'
const dyObj = new Dy();
dyObj.userInfo('MS4wLjABAAAALngeicdXUAwtb9W078jsVFFErL_nKawz1t2422-FNqsgrcdY07u6Pd8Ws2YRtf0z').then(res => {
    alert(res)
  });

joinContent(app)
injectJsInsert()
function joinContent(element) {
    const div = document.createElement('div');
    div.id = 'joinContentApp';
    document.body.appendChild(div);
    console.log(div);
    createApp(element).mount('#joinContentApp')
}
//chrome的API接口,用于传输或监听数据信号
chrome.extension.onRequest.addListener(function (request) { if (request.popAction == "Test") { console.log("test") } }
);
function injectJsInsert() {
    document.addEventListener('readystatechange', () => {
        const injectPath = 'js/inject.js'
        const script = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        script.src = chrome.extension.getURL(injectPath)
        document.body.appendChild(script)
    })
}


