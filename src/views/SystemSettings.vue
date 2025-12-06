<template>
  <div class="module-wrapper">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">系统设置</div>
      </template>
      <p>这里是系统设置模块的占位页面，后续可在此实现参数配置、系统参数、业务规则等设置。</p>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.module-wrapper {
  min-height: calc(100vh - 160px);
}

.card-header {
  font-size: 16px;
  font-weight: 600;
}

p {
  color: #606266;
  line-height: 1.8;
}
</style>