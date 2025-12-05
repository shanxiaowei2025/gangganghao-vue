<template>
  <div class="placeholder-view">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
        </div>
      </template>
      <p>这里将展示 {{ title }} 的具体功能。当前为占位页面，后续可在此模块补充业务内容。</p>
    </el-card>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '模块'
  }
})
</script>

<style scoped>
.placeholder-view {
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


