<template>
  <div class="getComment">
    <el-button type="primary" round @click="drawerClick($event)">
      提取评论区用户信息<el-icon color="#ffffff"><Download /></el-icon>
    </el-button>
    <el-drawer
      :z-index="999999999"
      v-model="drawer"
      title="评论区用户采集"
      :with-header="true"
      :modal="false"
      :show-close="true"
      :lock-scroll="false"
    >
      <div class="drawerBox">
        <div class="operator">
          <el-button
            :type="state.isDowning ? 'danger' : 'primary'"
            @click="getCommentList($event)"
            >{{ state.isDowning ? "停止采集" : "开始采集" }}</el-button
          >
          <el-button @click="clearRecord" type="danger">清空记录</el-button>
          <el-button type="success" @click="viewRecord">预览记录</el-button>
        </div>
        <div class="console" id="console">
          <div
            class="consoleItem"
            v-for="(item, index) in logList"
            :key="index"
          >
            <el-divider> 第{{ index + 1 }}条 </el-divider>
            <p class="success">
              <el-avatar
                :size="30"
                :src="item.avatar"
                @click="toUserDetail(item)"
              />
              <span>昵称：{{ item.nickname }}</span>
              <span>抖音号：{{ item.code }}</span>
            </p>
            <p>签名：{{ item.signature }}</p>
            <p>uid：{{ item.uid }}</p>
            <p>sec_uid：{{ item.sec_uid }}</p>
            <p>IP归属：{{ item.ip_label }}</p>
            <p>评论内容：{{ item.text }}</p>
            <p>评论时间：{{ item.create_time }}</p>
          </div>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      v-model="dialogTableVisible"
      title="评论记录"
      :z-index="99999999"
      draggable
    >
      <div style="height: 500px">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              :columns="columns"
              :data="logList"
              :width="width"
              :height="height"
              fixed
            />
          </template>
        </el-auto-resizer>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { Download } from "@element-plus/icons-vue";
import { ElMessage, ElNotification, ElTooltip } from "element-plus";
import $ from "jquery";
import Dy from "@/utils/dy";
import { ref, reactive, nextTick, watch } from "vue";
import localforage from "localforage";
const dyObj = new Dy();
const state = ref({
  isDowning: false,
});
const drawer = ref(false);
const dialogTableVisible = ref(false);
const logList = ref([]);

const mapKey = {
  avatar: "头像",
  nickname: "昵称",
  signature: "签名",
  uid: "uid",
  code: "抖音号",
  sec_uid: "sec_uid",
  ip_label: "IP归属",
  text: "评论内容",
  create_time: "评论时间",
};
const columns = Object.keys(mapKey).map((k) => ({
  dataKey: k,
  key: k,
  title: mapKey[k],
  width: 140,
}));

// watch(logList, async (newLogList, oldLogList) => {
//   console.log(newLogList);
// });

function timestampToTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear();
  const M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const D = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

function getAwemeId(e) {
  let container = $(e.currentTarget).parents(".playerContainer");
  if (!container.length) {
    container = $(e.currentTarget).parents('[data-e2e="video-detail"]');
  }
  let aweme_id = container.find(".video-info-detail").attr("data-e2e-aweme-id");
  if (!aweme_id) {
    aweme_id = container
      .find('[data-e2e="detail-video-info"]')
      .attr("data-e2e-aweme-id");
  }
  return aweme_id;
}
const toUserDetail = (item) => {
  console.log(item);
  window.open(`${window.location.origin}/user/${item.sec_uid}`, "_blank");
};

const viewRecord = ()=>{
  dialogTableVisible.value = true;
   drawer.value = false;
}
const drawerClick = async (e) => {
  drawer.value = !drawer.value;
  const aweme_id = getAwemeId(e);
  logList.value = (await localforage.getItem(aweme_id)) || [];
  await nextTick();
  $("#console").scrollTop($("#console").prop("scrollHeight"));
};

const clearRecord = async (e) => {
  const aweme_id = getAwemeId(e);
  await localforage.removeItem(aweme_id);
  dyObj.commentApiParam(aweme_id, { cursor: 0, count: 20 });
  logList.value = [];
  ElNotification({
    title: "清理成功",
    type: "success",
    duration: 1000,
  });
};

const getCommentList = async (e) => {
  if (state.value.isDowning) {
    state.value.isDowning = false;
    dyObj.changeTaskStatus(true);
    ElNotification({
      title: "已暂停",
      type: "warning",
      duration: 1000,
    });
    return false;
  }
  dyObj.changeTaskStatus(false);
  ElNotification({
    title: "开始运行",
    type: "success",
    duration: 1000,
  });
  state.value.isDowning = true;
  const aweme_id = getAwemeId(e);
  await dyObj.getUserProCommentList(
    aweme_id,
    async (data) => {
      const {
        cid,
        ip_label,
        create_time,
        text,
        user: {
          nickname,
          sec_uid,
          signature,
          uid,
          unique_id,
          short_id,
          avatar_thumb: {
            url_list: [avatar],
          },
        },
      } = data;
      const item = {
        id: cid,
        nickname,
        sec_uid,
        signature,
        uid,
        code: unique_id || short_id,
        avatar,
        ip_label,
        create_time: timestampToTime(create_time),
        text,
      };
      logList.value.push(item);
      await nextTick();
      $("#console").scrollTop($("#console").prop("scrollHeight"));
      let items = (await localforage.getItem(aweme_id)) || [];
      items.push(item);
      localforage.setItem(aweme_id, items);
      await dyObj.delay(0.05);
    },
    () => {
      ElNotification({
        title: "评论采集完毕！",
        type: "success",
        duration: 1000,
      });
      state.value.isDowning = false;
    }
  );
};
</script>
<style scoped lang="less">
.getComment {
  text-align: center;
  padding: 1em;
  .el-icon {
    font-weight: bold;
  }
  ::v-deep .el-divider__text {
    background: #000;
    color: #fff;
    font-size: 12px;
  }

  ::v-deep .el-drawer {
    background: #161823;
    width: 50%;
    .el-drawer__header {
      padding-top: 70px;
    }
  }
  ::v-deep .el-dialog {
    width: 1400px;
    // background: #161823;
    // color: #e8e8e9;
    // .el-table-v2__main {
    //   background: #161823;
    // }
  }
  .drawerBox {
    display: flex;
    height: 100%;
    width: 100%;
    // padding-top: 60px;
    flex-direction: column;
    .operator {
      flex: 1;
    }
    .console {
      width: 100%;
      height: 90%;
      padding: 10px;
      background-color: #000;
      border-radius: 10px;
      box-shadow: 0px 0px 6px 1px #000;
      overflow-y: auto;
      text-align: left;

      p {
        // margin-bottom: 5px;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: rgb(146, 156, 143);
        & > * {
          margin-right: 10px;
        }
        &.error {
          color: rgb(249 9 9);
        }

        &.success {
          color: rgb(70 207 43);
        }

        &.warn {
          color: rgb(221, 231, 74);
        }

        &.log {
          color: rgb(146, 156, 143);
        }
        &.line {
          height: 1px;
          background: #938c39;
        }
      }
      .el-avatar {
        cursor: pointer;
      }
    }
  }
}
</style>