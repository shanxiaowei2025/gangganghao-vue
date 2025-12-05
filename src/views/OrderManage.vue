<template>
  <div class="module-wrapper">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">订单管理</div>
      </template>
      <p>这里是订单管理模块的占位页面，后续可在此实现订单创建、跟踪、审批等业务。</p>
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


