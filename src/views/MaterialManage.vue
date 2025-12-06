<template>
  <div class="module-wrapper">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">材料管理</div>
      </template>
      <p>这里是材料管理模块的占位页面，后续可在此实现材料库存、采购、领用等业务。</p>
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