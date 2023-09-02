<template>
  <div class="downBtn">
    <el-progress
      :width="46"
      v-if="state.isDowning"
      type="circle"
      :percentage="state.percentage"
    />
    <el-icon v-else color="#ffffff" size="1.8em" @click="downMedia($event)"
      ><Download
    /></el-icon>
  </div>
</template>
<script setup>
import { Download } from "@element-plus/icons-vue";
import $ from "jquery";
import Dy from "@/utils/dy";
import { getCurrentInstance, ref } from "vue";
import { ElMessage,ElNotification } from "element-plus";

const { proxy } = getCurrentInstance();
const state = ref({
  percentage: 0,
  isDowning: false,
});
const downMedia = async (e) => {
  if (state.value.isDowning) {
    console.log("正在下载");
    return;
  }
  state.value.isDowning = true;
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

  // const dyObj = new Dy();
  // const {
  //   aweme_detail: {
  //     video: {
  //       play_addr: { url_list },
  //     },
  //   },
  // } = await dyObj.proDetail(aweme_id);
  let playUrl = container.find("video source").last().attr("src");
  console.log(`开始下载${playUrl}`);
  if (!playUrl) {
    state.value.isDowning = false;
    ElNotification({
    title: '未获取到下载地址',
    type: 'error',
  })
    return;
  }
  try {
    const response = await proxy.$axios({
      url: playUrl,
      method: "GET",
      responseType: "blob",
      onDownloadProgress: function (progressEvent) {
        state.value.percentage = parseInt(
          100 * (progressEvent.loaded / progressEvent.total)
        );
      },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${aweme_id}.mp4`);
    document.body.appendChild(link);
    link.click();
  } catch (e) {}

  state.value.isDowning = false;
  state.value.percentage = 0;
  ElNotification({
    title: '下载完成！',
    type: 'success',
  })
};
</script>
<style scoped lang="less">
.downBtn {
  cursor: pointer;
  .el-icon {
    margin: 0.5em 0;
    font-weight: bold;
  }
  ::v-deep .el-progress__text {
    color: #fff;
    font-size: 12px;
  }
}
</style>