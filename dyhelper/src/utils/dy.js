export default function (config) {
    this.defaultWait = 1;//秒
    //配置设置
    if (Object.prototype.toString.call(config) === "[object Object]") {
        for (let i in config) {
            this[i] = config[i];
        }
    }

    this.setWaitTime = (t) => {
        this.defaultWait = t;
    }

    this.ajax = async (obj) => {
        return new Promise((resolve, reject) => {
            //创建AJAX对象
            var xhr = new XMLHttpRequest();
            obj.data = (function (data) {
                if (!data) {
                    return;
                }
                let temp = [];
                for (let name in data) {
                    //将名称和值先编码，然后再使用=拼接
                    temp.push(encodeURIComponent(name)
                        + '=' + encodeURIComponent(data[name]));
                }
                return temp.join('&');
            })(obj.data);
            obj.param = (function (param) {
                if (!param) {
                    return;
                }
                let temp = [];
                for (let name in param) {
                    //将名称和值先编码，然后再使用=拼接
                    temp.push(encodeURIComponent(name)
                        + '=' + encodeURIComponent(param[name]));
                }
                return temp.join('&');
            })(obj.param);
            //判断是否是get请求
            if (obj.method == 'get') {
                //判断原来的url中是否有'?'
                if (obj.url.indexOf('?') == -1) {
                    obj.url += '?' + obj.data;
                } else {
                    obj.url += '&' + obj.data;
                }
            }
            if (obj.method == 'post' && obj.param) {
                //判断原来的url中是否有'?'
                if (obj.url.indexOf('?') == -1) {
                    obj.url += '?' + obj.param;
                } else {
                    obj.url += '&' + obj.param;
                }
            }
            //打开url
            xhr.open(obj.method, obj.url, obj.async || true);
            //设置回调处理
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.responseText);
                    }
                }
            };
            //发送请求
            if (obj.method == 'post') {
                //设置请求头
                xhr.setRequestHeader('Content-Type', obj.isJson ? 'application/json' : 'application/x-www-form-urlencoded');
                xhr.send(obj.data);
            } else {
                xhr.send(null);
            }

        })
    }
    this.dyRequest = async (option) => {
        await this.delay();
        option.data = {
            device_platform: "webapp",
            aid: "6383",
            channel: "channel_pc_web",
            pc_client_type: "1",
            version_code: "170400",
            version_name: "17.4.0",
            cookie_enabled: "true",
            screen_width: "1920",
            screen_height: "1080",
            browser_language: "zh-CN",
            browser_platform: "Win32",
            browser_name: "Chrome",
            browser_version: "115.0.0.0",
            browser_online: "true",
            engine_name: "Blink",
            engine_version: "115.0.0.0",
            os_name: "Windows",
            os_version: "10",
            cpu_core_num: "8",
            device_memory: "8",
            platform: "PC",
            downlink: "1.4",
            effective_type: "3g",
            webid: this.getWebId(),
            ...option.data
        }
        const res = await this.ajax(option);
        return JSON.parse(res);
    }
    this.delay = async (t) => {
        return await new Promise((resolve, reject) => {
            setTimeout(resolve, (t || this.defaultWait) * 1000)
        })
    }
    this.getWebId = () => {
        let webid = localStorage.getItem('webId');
        if (!webid) {
            webid = unescape(document.getElementById('RENDER_DATA').innerText).match(/"user_unique_id":"(.*?)"/)[1];
            localStorage.setItem('webId', webid);
        }
        return webid;
    }
    //用户详情
    this.userInfo = async (sec_user_id) => {
        return this.dyRequest({
            method: 'get',
            url: '/aweme/v1/web/user/profile/other/',
            data: {
                sec_user_id: sec_user_id,
                publish_video_strategy_type: "2",
                source: "channel_pc_web",
                downlink: "6.1",
                effective_type: "4g",
                round_trip_time: "250",
                webid: "7214687897277842983",
            },
        })
    }


    //用户粉丝和关注列表
    this.userCareAndFans = async (user_id, sec_user_id, offset = 0, isFollowing = false) => {
        return this.dyRequest({
            method: 'get',
            url: isFollowing ? '/aweme/v1/web/user/following/list/' : '/aweme/v1/web/user/follower/list/',
            data: {
                user_id: user_id,
                sec_user_id: sec_user_id,
                offset: offset,
                min_time: 0,
                max_time: parseInt((new Date()).getTime() / 1000),
                count: "20",
                source_type: "1",
                gps_access: "0",
                address_book_access: "0",
                downlink: "1.4",
                effective_type: "3g",
                round_trip_time: "400",
            }
        });
    }


    //获取用户作品列表
    this.userProList = async (sec_user_id, max_cursor = 0, count = 18) => {
        return this.dyRequest({
            method: 'get',
            url: '/aweme/v1/web/aweme/post/',
            data: {
                // locate_item_id: user_id,
                sec_user_id: sec_user_id,
                max_cursor: max_cursor,
                count: count,
                locate_query: "false",
                show_live_replay_strategy: "1",
                publish_video_strategy_type: "2",
                downlink: "1.4",
                effective_type: "3g",
                round_trip_time: "350",
            }
        });
    }

    //作品评论
    this.proCommentList = async (aweme_id, cursor = 0, count = 20) => {
        return this.dyRequest({
            method: 'get',
            url: '/aweme/v1/web/comment/list/',
            data: {
                aweme_id: aweme_id,
                cursor: cursor,
                count: count,
                item_type: "0",
                insert_ids: "",
                rcFT: "",
                downlink: "1.25",
                effective_type: "3g",
                round_trip_time: "300",
            }
        });
    }

    //作品详情
    this.proDetail = async (aweme_id) => {
        return this.dyRequest({
            method: 'get',
            url: '/aweme/v1/web/aweme/detail/',
            data: {
                aweme_id: aweme_id,
                version_code: "190500",
                version_name: "19.5.0",
                downlink: "5",
                effective_type: "4g",
                round_trip_time: "250",
            }
        });
    }

    /*****************************下载 下载************************************** */
    this.download = (key) => {
        return new Promise((resolve, reject) => {
            try {
                let data = localStorage.getItem(key) || null;
                if (!data.length) {
                    console.log(`...... ${key} 暂无数据可下载 ......`);
                    resolve();
                    return;
                }
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
                element.setAttribute('download', `${key}_${parseInt(Math.random() * 10000)}.json`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                resolve();
            } catch (e) {
                error(e);
                reject(e);
            }

        })

    };

    /*****************************task task*********************************** */
    //作品评论
    this.getProCommentList = async (aweme_id) => {
        let cursor = 0, count = 20;
        while (true) {
            const { comments, has_more } = await this.proCommentList(aweme_id, cursor, count);
            if (!has_more || !comments?.length) {
                break;
            }
            cursor += count;
        }
    }

    //所有作品
    this.getUserProList = async (sec_user_id, callBack) => {
        let cursor = 0;
        while (true) {
            const { aweme_list, has_more, max_cursor } = await dy.userProList(sec_user_id, cursor);
            if (!has_more || !aweme_list?.length) {
                break;
            }
            callBack(aweme_list)
            cursor = max_cursor;
        }
    }
}