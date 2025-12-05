<template>
  <div class="module-page">
    <div class="page-header">
      <h2>材料字典</h2>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        新建材料
      </el-button>
    </div>
    
    <el-card shadow="never" class="content-card">
      <el-empty description="材料字典功能开发中..." />
    </el-card>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
</script>

<style scoped>
.module-page {
  min-height: 60vh;
  padding: 24px;
  background: #f0f2f5;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.content-card {
  background: #fff;
  border-radius: 8px;
}
</style>

