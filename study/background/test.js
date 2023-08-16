console.log('background 是一个常驻的页面，它的生命周期是插件中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭，所以通常把需要一直运行的、启动就运行的、全局的代码放在background里面；')



// 注意：chrome.runtime.onInstalled ，在 onInstalled 侦听器中，它只能在安装/更新后立即工作不到一分钟，所以需要长时间监听的动作/事件不要放在里面
const color = "rgb(153, 196, 230, 0.2)";
chrome.runtime.onInstalled.addListener(() => {

    console.log('chrome.runtime.onInstalled')


    //需要给与插件运行所需要的权限"permissions": ["storage"]
    chrome.storage.sync.set({ color }, function () {
        // 缓存默认颜色
        console.log(`[Coloring] default color is set to: ${color}`);
    });

});



// chrome.runtime.onMessage.addListener(callback)
// 此处的callback为必选参数，为回调函数。
// callback接收到的参数有三个，分别是message、sender和sendResponse，即消息内容、消息发送者相关信息和相应函数。
// 其中sender对象包含4个属性，分别是tab、id、url和tlsChannelId，tab是发起消息的标签
chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.msg == 'Hello') {
            sendResponse({ farewell: "goodbye" });
        }
    }
);


//根据 url 匹配 popup 窗口能否打开, permissions 中增加权限 declarativeContent
chrome.action.disable();

// 删除现有规则，只应用我们的规则
chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    // 添加自定义规则
    chrome.declarativeContent.onPageChanged.addRules([
        {
            // 定义规则的条件
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({

                    /**
                     *   下面两个方式根据需要任取一个即可
                     * 
                     *   注意：hostEquals 规则永远不会匹配任何内容，因为根据 the documentation(https://developer.chrome.com/extensions/declarativeContent#type-PageStateMatcher)，它将与URL的主机部分进行比较，
                     *   例如简单的www.example.com，因此它不能包含 / 或 *；请注意，chrome.declarativeContent使用自己的过滤系统，
                     *   它不支持 content_scripts 或 webRequest 使用的任何常用匹配模式。
                     */

                    // pageUrl: { hostEquals: 'blog.csdn.net', pathPrefix: '/nav/', schemes: ['https'] },
                    pageUrl: { urlPrefix: 'https://www.baidu.com/' },
                }),
            ],
            // 满足条件时显示操作
            actions: [new chrome.declarativeContent.ShowAction()],
        },
    ]);
});



//点击插件跳转至扩展页 修改 manifest.json， 将 action 改为空对象
// 点击插件跳转至 options.html
// chrome.action.onClicked.addListener((tab) => {
//     chrome.runtime.openOptionsPage();
// });
