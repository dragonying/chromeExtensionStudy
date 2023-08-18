<template>
  <div class="popup">
    <el-card class="box-card">
      <template #header>
        <el-row>
          <el-col :span="4">
            <el-avatar :size="50" :src="avatarImg" />
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="12">抖音号：qfdy8001</el-col>
              <el-col :span="12">昵称：qfdy8001</el-col>
            </el-row>
            <el-row>
              <el-col :span="12">uid：qfdy8001</el-col>
              <el-col :span="12">账号有效期：2025-03-01</el-col>
            </el-row>
            <el-row>
              <el-col>
                简介：qfdy8001
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="6">
            作品000
          </el-col>
          <el-col :span="6">
            点赞000
          </el-col>
          <el-col :span="6">
            关注000
          </el-col>
          <el-col :span="6">
            粉丝000
          </el-col>
        </el-row>
      </template>
      <div class="btns">
        <el-button type="primary" :icon="VideoCamera" @click="open">去水印</el-button>
        <el-button type="primary" :icon="VideoCamera" @click="test">启动面板</el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { VideoCamera } from '@element-plus/icons-vue'
import { reactive, toRefs, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'


onMounted(() => {

})

const { avatarImg, bgImg } = toRefs(reactive({
  avatarImg: chrome.runtime.getURL('assets/images/dy.png'),
  bgImg: chrome.runtime.getURL('assets/images/bg.png'),
  unique_id: 'qfdy8001',
}))
const open = () => {
  ElMessageBox.alert('This is a message', 'Title', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',
    callback: (action) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`,
      })
    },
  })
}

const test = () => {
  // chrome.tabs.getSelected(null, function (tab) { chrome.tabs.sendRequest(tab.id, { popAction: "Test" }); });
 
}
</script>
<style scoped lang="less">
.popup {
  width: 400px;

  .box-card {
    background: #292b35;

    .el-row {
      margin-bottom: 5px;

      .el-col {
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;

        &:hover {
          color: #fff;
        }
      }
    }
  }

  .btns {
    display: flex;
    justify-content: space-evenly;
  }
}
</style>