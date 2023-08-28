<template>
    <div class="zfyBox">
        <el-tabs type="border-card" class="demo-tabs">
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <el-icon>
                            <calendar />
                        </el-icon>
                        <span>去水印</span>
                    </span>
                </template>
                <div class="panItem">
                    <div class="opt">
                        <el-input v-model="input2" placeholder="请输入作品分享地址">
                            <template #append>清水印</template>
                        </el-input>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <el-icon>
                            <calendar />
                        </el-icon>
                        <span>采集用户作品</span>
                    </span>
                </template>
                Route
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
  
<script setup>
import { Calendar } from '@element-plus/icons-vue'

</script>
<style scoped lang="less">
.zfyBox {
    position: absolute;
    z-index: 9999;
    top: 100px;
    right: 0;

    .custom-tabs-label {
        display: flex;
        align-items: center;

        .el-icon {
            margin-right: 0.2em;
        }
    }

    .panItem {
        min-height: 200px;
    }
}
</style>