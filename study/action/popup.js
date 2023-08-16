
//修改背景色
const btnColor = ['#FFCCCC', '#FFEE99', '#CCFF99', '#BBFFEE', '#CCCCFF', '#F0BBFF']
const btnArr = document.getElementsByTagName('button')
for (let i = 0, len = btnArr.length; i < len; i++) {
    var btn = btnArr[i];
    btn.onclick = async (event) => {
        const index = event.target.className.split('-')[1]

        // 调用Chrome接口取出当前标签页
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        // 以当前标签页为上下文，执行函数
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [{ btnColor, index }],  // // 无法访问外面的数据，args 可传递外面的数据 
            function: (event) => {
                document.body.style.backgroundColor = event.btnColor[event.index - 1]
            },
        });

    }
}

//修改背景图
// 点击更换背景色 修改 manifest.json， 配置 web_accessible_resources，否则图片无法访问
document.getElementById("img1").onclick = async (e) => {
    var imgurl = chrome.runtime.getURL('action/image/1.png');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [imgurl],
        function: (event) => {
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundSize = '100% 100%';
            document.body.style.backgroundImage = 'url(' + event + ')'
        },
    });
}

document.getElementById("img2").onclick = async (e) => {
    var imgurl = e.target.src;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [imgurl],
        function: changeBg,
    });
}

function changeBg(event) {
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = '100% 100%';
    document.body.style.backgroundImage = 'url(' + event + ')'
}

// 设置徽章文本
document.getElementById("badgeText").onclick = function () {
    // 设置徽章文本
    chrome.action.setBadgeText({ "text": '88' });
}

// 设置徽章背景颜色
document.getElementById("badgeBg").onclick = function () {
    // 设置徽章背景颜色
    // color 范围为[0,255]整数构成的结构（必须是整数），用来描述badge的RGBA颜色
    chrome.action.setBadgeBackgroundColor({ color: [153, 96, 230, 2] });
}


//若无消息通知反应 
// 1、检查是否加了通知权限
// "permissions":[     "notifications" ],
// 2、chrome.notifications.create调用的icon地址是否错误。
// 以上都没问题，还是没显示消息通知。
// 接下来该怀疑是否是浏览器作了限制，经查找资料发现可能是新版本Chrome浏览器禁用了MacOS本机通知。
// 解决方案：
// 1、在Chrome浏览器中访问地址：chrome://flags。
// 2、搜索栏中搜索：notifications，找到 Enable system notifications 选项，将其选项值改为 Disabled，重启浏览器，问题解决。



// 桌面通知  permissions 中增加权限 notifications；
document.getElementById("notify").onclick = function () {
    notify()
    setTimeout(function (e) {
        // 清除桌面通知成功
        // 这里的id只要和创建的时候设置id值一样就行了，就可以清理对应id的通知了
        chrome.notifications.clear("id");
    }, 2000);
}

// 桌面通知
// id: 保证每个通知的唯一，这个id是字符串类型
// type: 通知类型，有basic（默认）、image、list、progress
// iconUrl: 图标的url
// imageUrl："image"类型的通知的图片的URL
// appIconMaskUrl: 应用图标URL的掩码，用以规范URL，这个扩展应该是用不到
// title: 通知主标题
// message: 通知副标题
// contextMessage: 通知的备选内容,
// progress:进度
// buttons: [{title: '按钮1的标题', iconUrl:' icon.png'},{title: '按钮2的标题',iconUrl: 'icon.png'}],  最多两个按钮
// items: [{title: '消息1', message: '消息1'},{title: '消息2', message: '消息2'}], 通知列表，对应type是list时使用，只有title和message两个属性
// eventTime: Date.now() + 2000　　通知的时间戳
function notify() {
    chrome.notifications.create("id", {
        type: 'basic',
        title: '桌面通知',
        message: '自定义桌面消息通知 ！！！',
        iconUrl: '../icons/yt.png',
        contextMessage: '2 秒后，清除桌面通知 ！！！',
        buttons: [
            {
                title: '按钮标题',
                iconUrl: '../icons/yt.png'
            }
        ],
        eventTime: Date.now() + 2000
    },
        (id) => console.log('111111111'));
}

//增加发送功能代码，同时接收来自 background.js 的回应；  编辑 background.js，接收 popup 传递的消息
document.getElementById("message").onclick = function () {
    chrome.runtime.sendMessage({ 'msg': 'Hello' }, function (event) {
        chrome.notifications.create("msg", {
            type: 'basic',
            title: '响应通知',
            message: `收到响应，响应报文： ${event.farewell}`,
            iconUrl: '../icons/yt.png',
        })
    })
}



// 捕获窗口
// chrome.tabs.captureVisibleTab(integer windowId, object options, function callback)
// windowId ( optional integer )
// 目标窗口，默认值为当前窗口.

// options ( optional object )
// 设置抓取图像参数。设置图像抓取的参数，比如生成的图像的格式。
//     format ( optional enumerated string [“jpeg”, “png”] )
//     生成的图像的格式。默认是jpeg。
//     quality ( optional integer )
//     如果格式是’jpeg’，控制结果图像的质量。此参数对PNG图像无效。当质量降低的时候，抓取的画质会下降，需要存储的字节数也会递减。

// callback ( function )，function(string dataUrl) {...};
//     dataUrl ( string )
//     被抓取标签的可视区域的URL。此URL可能会作为图像的src属性。格式为base64的格式
document.getElementById("capture").onclick = function () {
    chrome.tabs.captureVisibleTab(null, {
        format: "png",
        quality: 100
    }, dataUrl => {
        console.log(dataUrl)
        chrome.tabs.create({ url: dataUrl });
    })
}

// 跳转百度首页
document.getElementById("linkBidu").onclick = function () {
    chrome.tabs.create({ url: 'https://www.baidu.com' });
}

// 打开新窗口
document.getElementById("openWindows").onclick = function () {
    chrome.windows.create({ state: 'maximized' });
}

// 关闭浏览器
document.getElementById("closeCurrentWindow").onclick = function () {
    chrome.windows.getCurrent({}, (currentWindow) => {
        chrome.windows.remove(currentWindow.id);
    });
}

// 最大化窗口
document.getElementById("windowsMax").onclick = function () {
    chrome.windows.getCurrent({}, (currentWindow) => {
        // state: 可选 'minimized', 'maximized' and 'fullscreen' 
        chrome.windows.update(currentWindow.id, { state: 'maximized' });
    });
}

// 最小化窗口
document.getElementById("windowsMin").onclick = function () {
    chrome.windows.getCurrent({}, (currentWindow) => {
        chrome.windows.update(currentWindow.id, { state: 'minimized' });
    });
}

// 当前标签打开新网页
document.getElementById("currentTab").onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.update(tab.id, { url: 'https://image.baidu.com/' });
}

// 关闭当前标签页
document.getElementById("closeCurrentPage").onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.remove(tab.id);
}

// 创建一个新浏览器窗口
document.getElementById("createPopup").onclick = function () {
    var createData = {
        url: "https://baidu.com",
        type: "popup",
        top: 200,
        left: 300,
        width: 1300,
        height: 800
    }
    // 创建（打开）一个新的浏览器窗口，可以提供大小、位置或默认 URL 等可选参数
    chrome.windows.create(createData);
}
