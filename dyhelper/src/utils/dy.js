function DY(config) {
    this.defaultWait = 1;//秒
    this.isStop = false;
    //配置设置
    if (Object.prototype.toString.call(config) === "[object Object]") {
        for (let i in config) {
            this[i] = config[i];
        }
    }

    this.setWaitTime = (t) => {
        this.defaultWait = t;
    }
    this.changeTaskStatus = (status) => {
        this.isStop = status === undefined ? !this.isStop : status;
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
        try {
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
                msToken: localStorage.getItem('msToken'),
                webid: localStorage.getItem('webId'),
                // 'X-Bogus': 'DFSzswVuXOUANcTOty2KQF9WX7rn',
                ...option.data
            }
            const res = await this.ajax(option);
            return JSON.parse(res);
        } catch (e) {
            console.error(e);
        }
        return {};
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
    this.download = async (data = []) => {
        return new Promise((resolve, reject) => {
            try {
                if (!data.length) {
                    console.log(`...... 暂无数据可下载 ......`);
                    resolve();
                    return;
                }
                console.log(`...... 开始下载数据 ......`);
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
                element.setAttribute('download', `${parseInt(Math.random() * 10000)}.json`);
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
            const { aweme_list, has_more, max_cursor } = await this.userProList(sec_user_id, cursor);
            if (!has_more || !aweme_list?.length) {
                break;
            }
            let finish = await callBack(aweme_list);
            if (finish) {
                break;
            }
            cursor = max_cursor;
        }
    }

    this.userData = [];
    this.localKey = 'commentUids';
    //获取评论区活跃的用户
    this.getProCommentListActiveUser = async (aweme_id) => {
        let uids = JSON.parse(localStorage.getItem(this.localKey)) || [];
        this.userData = uids;
        const activeTime = (new Date()).getTime() / 1000 - 2 * 24 * 3600;//2天内活跃
        const awemeCountLimit = 2;
        const followerCountLimit = 200;
        const downLengthLimit = 1000;
        let cursor = 0, count = 20;
        try {
            while (true) {
                const { comments, has_more } = await this.proCommentList(aweme_id, cursor, count);
                while (comments.length) {
                    const { user: { sec_uid, uid, nickname, signature } } = comments.shift();
                    console.log('已采集个数：' + this.userData.length, { nickname, uid, signature })
                    // const { user: userInfo } = await this.userInfo(sec_uid);
                    // const { uid, follower_count, ip_location, nickname, aweme_count, signature,gender } = userInfo;
                    // gender 1男 2女
                    // console.log('已采集个数：' + this.userData.length, { nickname, ip_location, signature, follower_count, aweme_count })
                    // if (aweme_count < awemeCountLimit || follower_count < followerCountLimit) {
                    //     continue;
                    // }
                    // const { aweme_list } = await this.userProList(sec_uid, 0);
                    // if (!aweme_list.length || aweme_list.length < awemeCountLimit || aweme_list[0].create_time < activeTime) {
                    //     continue;
                    // }
                    this.userData.push(uid);
                    uid && uids.indexOf(uid) < 0 && uids.push(uid);
                    if (this.userData.length >= downLengthLimit) {
                        await this.download(this.userData);
                        this.userData = [];
                    }
                }
                if (!has_more) {
                    break;
                }
                cursor += count;
            }
        } catch (e) {
        }

        localStorage.setItem(this.localKey, JSON.stringify(uids));

        console.log('---------- 结束 -----------')
    }

    this.commentApiParam = (aweme_id, data) => {
        let params = JSON.parse(localStorage.getItem('commentApiParam')) || {};
        let param = params[aweme_id] || { cursor: 0, count: 20 };
        if (data) {
            param = { ...param, ...data };
            params[aweme_id] = param;
            localStorage.setItem('commentApiParam', JSON.stringify(params));
        }
        return param;
    }
    this.getUserProCommentList = async (aweme_id, callBack, finishCallBack) => {
        let { cursor, count } = this.commentApiParam(aweme_id);
        try {
            while (true) {
                if (this.isStop) {
                    break;
                }
                const { comments, has_more } = await this.proCommentList(aweme_id, cursor, count);

                while (comments && comments.length) {
                    const comment = comments.shift();
                    const { user: { sec_uid, uid, nickname, signature } } = comment;
                    // const { user: userInfo } = await this.userInfo(sec_uid);
                    // const { follower_count, ip_location, aweme_count, gender } = userInfo;

                    // gender 1男 2女
                    // console.log('已采集个数：' + this.userData.length, { nickname, ip_location, signature, follower_count, aweme_count })
                    // if (aweme_count < awemeCountLimit || follower_count < followerCountLimit) {
                    //     continue;
                    // }
                    // const { aweme_list } = await this.userProList(sec_uid, 0);
                    // if (!aweme_list.length || aweme_list.length < awemeCountLimit || aweme_list[0].create_time < activeTime) {
                    //     continue;
                    // }
                    typeof callBack == 'function' && await callBack({ ...comment });
                }
                cursor += count;
                this.commentApiParam(aweme_id, { cursor, count });

                if (!has_more) {
                    typeof finishCallBack == 'function' && finishCallBack();
                    break;
                }
            }
        } catch (e) {
        }
    }

    //下载用户作品
    this.downUserProList = async (key, n) => {
        let limit = n || 999999999999;
        let data = JSON.parse(localStorage.getItem(key)) || [];
        await this.getUserProList(window.location.pathname.match(/user\/(.*)/)[1], async (aweme_list) => {
            console.log(`-------------- total: ${data.length} ------------------`)
            data.push(...aweme_list.map(o => {
                const { aweme_id, desc, music, author, share_url, video, statistics } = o || {};
                const { nickname, avatar_thumb, sec_uid, uid, aweme_count, following_count, follower_count, favoriting_count, total_favorited } = author || {};
                const { play_url, avatar_medium, title } = music || {};
                const { play_addr, play_addr_265, play_addr_h264, cover, duration } = video || {};
                console.log(`${aweme_id} ---- ${desc}`)
                return {
                    aweme_id,
                    desc,
                    share_url,
                    statistics,
                    author: {
                        nickname, avatar_thumb, sec_uid, uid,
                        statistic: {
                            aweme_count, following_count, follower_count, favoriting_count, total_favorited
                        }
                    },
                    video: {
                        duration,
                        cover: cover?.url_list?.pop(),
                        paly_url: {
                            play_addr: play_addr?.url_list,
                            play_addr_265: play_addr_265?.url_list,
                            play_addr_h264: play_addr_h264?.url_list
                        }
                    },
                    music: {
                        title: title,
                        play_url: play_url?.url_list?.pop(),
                        avatar_medium: avatar_medium?.url_list?.pop(),
                    },
                }
            }));
            localStorage.setItem(key, JSON.stringify(data));
            return data.length >= limit;
        });


        this.download(JSON.stringify(data));
        console.log(`数据条数：${data.length} 条 ， 下载完毕`);

    }
}

//采集用户作品下所有活跃的评论者
// let dy = new Dy({ defaultWait: 2 });
// dy.downUserProList('proList_武术', 30);

// dy.getUserProList(window.location.pathname.match(/user\/(.*)/)[1], async (aweme_list) => {
//     while (aweme_list.length) {
//         const { aweme_id, desc, statistics } = aweme_list.shift();
//         console.log('-----------------', { aweme_id, desc, statistics }, '-----------------')
//         await dy.getProCommentListActiveUser(aweme_id);
//     }
// });

// dy.getProCommentListActiveUser(window.location.search.match(/modal_id=(\d+)/)[1]);

// if (dy.userData.length) {
//     dy.download(dy.userData);
// }
export default DY;


