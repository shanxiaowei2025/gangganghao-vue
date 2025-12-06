<template>
  <div class="module-wrapper">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">结算管理</div>
      </template>
      <p>这里是结算管理模块的占位页面，后续可在此实现结算单据、对账、结算报表等业务。</p>
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