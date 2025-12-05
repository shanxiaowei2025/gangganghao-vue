<template>
  <div class="page-placeholder">
    <el-icon class="placeholder-icon">
      <Notebook />
    </el-icon>
    <h2>{{ title }}</h2>
    <p>该模块正在建设中，后续将接入 {{ title }} 相关功能。</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Notebook } from '@element-plus/icons-vue'

const route = useRoute()
const title = route.meta.title || '功能模块'
</script>

<style scoped>
.page-placeholder {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
  color: #909399;
  text-align: center;
}

.page-placeholder h2 {
  margin: 16px 0 8px;
  font-size: 20px;
  color: #303133;
}

.placeholder-icon {
  font-size: 48px;
  color: #409eff;
}
</style>

