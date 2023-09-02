<template>
  <div class="getProList">
    <el-button type="success" round>
      下载用户作品<el-icon color="#ffffff"><Download /></el-icon>
    </el-button>
  </div>
</template>
<script setup>
import { Download } from "@element-plus/icons-vue";
</script>
<style scoped lang="less">
.getProList {
  text-align: center;
  padding: 1em;
  .el-icon {
    font-weight: bold;
  }
}
</style>