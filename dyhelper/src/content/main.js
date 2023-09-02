import { createApp } from 'vue'
import axios from 'axios'
import app from './components/app.vue'
import down from './components/down.vue'
import commentBtn from './components/commentBtn.vue'
import downPro from './components/downPro.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// const { createApp } = Vue;


//挂载
// joinContent(app)

window.onload = function () {
    setInterval(addCustomBtn, 1000)
}

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


function addDownLoadBtn(target) {
    console.log(`-------- 添加下载按钮 --------`)
    const elemApp = createApp(down);
    elemApp.config.globalProperties.$axios = axios
    elemApp.use(ElementPlus, { locale: zhCn });
    elemApp.mount(target)
}

function addSpiderCommentBtn(target) {
    console.log(`-------- 添加评论采集按钮 --------`)
    const elemApp = createApp(commentBtn);
    elemApp.use(ElementPlus, { locale: zhCn });
    elemApp.mount(target)
}

function addCustomBtn() {
    console.log('----------------------')
    document.querySelectorAll('.disturb-login-panel').forEach(o => {
        let operator = o.parentNode;
        if (operator.querySelector('.zfyTool')) {
            return;
        }
        let children = operator.childNodes;
        if (children.length < 4) {
            return;
        }
        let target = children[1].cloneNode();
        target.className += ' zfyTool';
        operator.insertBefore(target, children[children.length - 2]);
        addDownLoadBtn(target);
    });
    document.querySelectorAll('.xgplayer-controls .xg-right-grid').forEach(operator => {
        if (operator.querySelector('.zfyTool')) {
            return;
        }
        let target = document.createElement('div');
        target.className += ' zfyTool';
        operator.appendChild(target);
        addDownLoadBtn(target);
    });
    document.querySelectorAll('.comment-header-inner-container').forEach(o => {
        if (o.querySelector('.zfyTool')) {
            return;
        }
        let target = document.createElement('div');
        target.className += ' zfyTool';
        o.appendChild(target);
        addSpiderCommentBtn(target);
    });
    document.querySelectorAll('.comment-title').forEach(o => {
        if (o.querySelector('.zfyTool')) {
            return;
        }
        let target = document.createElement('div');
        target.className += ' zfyTool';
        o.appendChild(target);
        addSpiderCommentBtn(target);
    });
    document.querySelectorAll('.author-card-user-name').forEach(o => {
        if (o.querySelector('.zfyTool')) {
            return;
        }

        console.log(`-------- 添加按钮 --------`)

        let target = document.createElement('div');
        target.className += ' zfyTool';
        o.appendChild(target);
        const elemApp = createApp(downPro);
        elemApp.use(ElementPlus, { locale: zhCn });
        elemApp.mount(target)
    });
    document.querySelectorAll('[data-e2e="user-info-follow-btn"]').forEach(o => {
        let operator = o.parentNode;
        if (operator.querySelector('.zfyTool')) {
            return;
        }

        console.log(`-------- 添加按钮 --------`)

        let target = document.createElement('div');
        target.className += ' zfyTool';
        operator.appendChild(target);
        const elemApp = createApp(downPro);
        elemApp.use(ElementPlus, { locale: zhCn });
        elemApp.mount(target)
    });
}
