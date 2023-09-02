<template>
  <div class="getComment">
    <el-button type="primary" round @click="getCommentList($event)">
      提取评论区用户信息<el-icon color="#ffffff"><Download /></el-icon>
    </el-button>
    <el-drawer v-model="drawer" title="评论区用户采集" :with-header="false">
      <div class="drawerBox">
        <div class="operator"></div>
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
              <span>抖音号：{{ item.unique_id || item.short_id }}</span>
            </p>
            <p>签名：{{ item.signature }}</p>
            <p>uid：{{ item.uid }}</p>
            <p>sec_uid：{{ item.sec_uid }}</p>
            <p>IP：{{ item.ip_label }}</p>
            <p>评论内容：{{ item.text }}</p>
            <p>评论时间：{{ item.create_time }}</p>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script setup>
import { Download } from "@element-plus/icons-vue";
import $ from "jquery";
import Dy from "@/utils/dy";
import { ref, nextTick } from "vue";
const drawer = ref(false);
const logList = ref([]);
function timestampToTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear() + "年";
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "月";
  const D = date.getDate() + "日";
  const h = date.getHours() + "时";
  const m = date.getMinutes() + "分";
  const s = date.getSeconds() + "秒";
  return Y + M + D + h + m + s;
}
const toUserDetail = (item) => {
  console.log(item);
  window.open(`${window.location.origin}/user/${item.sec_uid}`, "_blank");
};

const getCommentList = async (e) => {
  drawer.value = true;
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

  const dyObj = new Dy();

  await dyObj.getProCommentList(aweme_id, async (data) => {
    const {
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
    logList.value.push({
      nickname,
      sec_uid,
      signature,
      uid,
      unique_id,
      short_id,
      avatar,
      ip_label,
      create_time: timestampToTime(create_time),
      text,
    });
    await nextTick();
    $("#console").scrollTop($("#console").prop("scrollHeight"));
    await dyObj.delay(0.1);
  });
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

  .drawerBox {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    .operator {
      flex: 1;
    }
    .console {
      width: 100%;
      height: 60%;
      padding: 10px;
      background-color: #000;
      border-radius: 10px;
      box-shadow: 0px 0px 6px 1px #000;
      overflow-y: auto;
      text-align: left;

      p {
        margin-bottom: 5px;
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