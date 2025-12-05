<template>
  <div class="dashboard">
    <!-- 生产统计大屏 -->
    <el-card class="production-stats-card" shadow="never">
      <div class="stats-container">
        <!-- 顶部激励文字 -->
        <div class="motivational-text">
          <div class="text-line">
            <span 
              v-if="!editing.motivational1" 
              @dblclick="startEdit('motivational1')"
              class="editable-text"
            >
              {{ statsData.motivational1 }}
            </span>
            <el-input
              v-else
              v-model="statsData.motivational1"
              @blur="finishEdit('motivational1')"
              @keyup.enter="finishEdit('motivational1')"
              class="edit-input"
              size="large"
            />
          </div>
          <div class="text-line">
            <span 
              v-if="!editing.motivational2" 
              @dblclick="startEdit('motivational2')"
              class="editable-text"
            >
              {{ statsData.motivational2 }}
            </span>
            <el-input
              v-else
              v-model="statsData.motivational2"
              @blur="finishEdit('motivational2')"
              @keyup.enter="finishEdit('motivational2')"
              class="edit-input"
              size="large"
            />
          </div>
        </div>

        <!-- 主要统计数据 -->
        <div class="main-stats">
          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-item">
                <div class="stat-label">已完成生产</div>
                <div class="stat-value-wrapper">
                  <span 
                    v-if="!editing.productionCompleted" 
                    @dblclick="startEdit('productionCompleted')"
                    class="editable-text stat-value"
                  >
                    {{ formatNumber(statsData.productionCompleted) }}
                  </span>
                  <el-input-number
                    v-else
                    v-model="statsData.productionCompleted"
                    @blur="finishEdit('productionCompleted')"
                    @keyup.enter="finishEdit('productionCompleted')"
                    :min="0"
                    :precision="0"
                    class="edit-input-number"
                    size="large"
                  />
                  <span class="stat-unit">吨</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-item">
                <div class="stat-label">已完成发货</div>
                <div class="stat-value-wrapper">
                  <span 
                    v-if="!editing.shipmentCompleted" 
                    @dblclick="startEdit('shipmentCompleted')"
                    class="editable-text stat-value"
                  >
                    {{ formatNumber(statsData.shipmentCompleted) }}
                  </span>
                  <el-input-number
                    v-else
                    v-model="statsData.shipmentCompleted"
                    @blur="finishEdit('shipmentCompleted')"
                    @keyup.enter="finishEdit('shipmentCompleted')"
                    :min="0"
                    :precision="0"
                    class="edit-input-number"
                    size="large"
                  />
                  <span class="stat-unit">吨</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-item">
                <div class="stat-label">剩余目标</div>
                <div class="stat-value-wrapper">
                  <span 
                    v-if="!editing.remainingTarget" 
                    @dblclick="startEdit('remainingTarget')"
                    class="editable-text stat-value"
                  >
                    {{ formatNumber(statsData.remainingTarget) }}
                  </span>
                  <el-input-number
                    v-else
                    v-model="statsData.remainingTarget"
                    @blur="finishEdit('remainingTarget')"
                    @keyup.enter="finishEdit('remainingTarget')"
                    :min="0"
                    :precision="0"
                    class="edit-input-number"
                    size="large"
                  />
                  <span class="stat-unit">吨</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-item">
                <div class="stat-label">倒计时</div>
                <div class="stat-value-wrapper">
                  <span 
                    v-if="!editing.countdown" 
                    @dblclick="startEdit('countdown')"
                    class="editable-text stat-value"
                  >
                    {{ statsData.countdown }}
                  </span>
                  <el-input-number
                    v-else
                    v-model="statsData.countdown"
                    @blur="finishEdit('countdown')"
                    @keyup.enter="finishEdit('countdown')"
                    :min="0"
                    :precision="0"
                    class="edit-input-number"
                    size="large"
                  />
                  <span class="stat-unit">日</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 每日统计数据 -->
        <div class="daily-stats">
          <el-row :gutter="24">
            <el-col :xs="24" :sm="12">
              <div class="daily-stat-item">
                <div class="daily-label">昨日完成生产</div>
                <div class="daily-value-wrapper">
                  <span 
                    v-if="!editing.yesterdayProduction" 
                    @dblclick="startEdit('yesterdayProduction')"
                    class="editable-text daily-value"
                  >
                    {{ formatNumber(statsData.yesterdayProduction) }}
                  </span>
                  <el-input-number
                    v-else
                    v-model="statsData.yesterdayProduction"
                    @blur="finishEdit('yesterdayProduction')"
                    @keyup.enter="finishEdit('yesterdayProduction')"
                    :min="0"
                    :precision="0"
                    class="edit-input-number"
                    size="large"
                  />
                  <span class="stat-unit">吨</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12">
              <div class="daily-stat-item">
                <div class="daily-label">今日待完成目标</div>
                <div class="daily-value-wrapper">
                  <span 
                    v-if="!editing.todayTarget" 
                    @dblclick="startEdit('todayTarget')"
                    class="editable-text daily-value"
                  >
                    {{ formatNumber(statsData.todayTarget) }}
                  </span>
                  <el-input-number
                    v-else
                    v-model="statsData.todayTarget"
                    @blur="finishEdit('todayTarget')"
                    @keyup.enter="finishEdit('todayTarget')"
                    :min="0"
                    :precision="0"
                    class="edit-input-number"
                    size="large"
                  />
                  <span class="stat-unit">吨</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 底部信息 -->
        <div class="footer-info">
          <div class="info-item">
            <span class="info-label">汇报人：</span>
            <span 
              v-if="!editing.reporter" 
              @dblclick="startEdit('reporter')"
              class="editable-text info-value"
            >
              {{ statsData.reporter }}
            </span>
            <el-input
              v-else
              v-model="statsData.reporter"
              @blur="finishEdit('reporter')"
              @keyup.enter="finishEdit('reporter')"
              class="edit-input-small"
              size="small"
            />
          </div>
          <div class="info-item">
            <span class="info-label">日期：</span>
            <el-date-picker
              v-model="statsData.reportDate"
              type="date"
              placeholder="选择日期"
              format="YYYY年MM月DD日"
              value-format="YYYY-MM-DD"
              size="small"
              class="date-picker"
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import config from '@/config'

// 统计数据
const statsData = reactive({
  motivational1: '风雨同舟三十天,携手并进创佳绩',
  motivational2: '一人把关一处安,众人把关稳如山',
  productionCompleted: 82146,
  shipmentCompleted: 80210,
  remainingTarget: 17854,
  countdown: 28,
  yesterdayProduction: 302,
  todayTarget: 637,
  reporter: '侯晓云',
  reportDate: '2025-12-04'
})

// 编辑状态
const editing = reactive({
  motivational1: false,
  motivational2: false,
  productionCompleted: false,
  shipmentCompleted: false,
  remainingTarget: false,
  countdown: false,
  yesterdayProduction: false,
  todayTarget: false,
  reporter: false
})

// 开始编辑
const startEdit = (field) => {
  editing[field] = true
}

// 完成编辑
const finishEdit = (field) => {
  editing[field] = false
  // 保存到本地存储
  saveToLocalStorage()
  ElMessage.success('数据已更新')
}

// 格式化数字（添加千分位）
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 保存到本地存储
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('dashboard_stats', JSON.stringify(statsData))
  } catch (error) {
    console.error('保存数据失败:', error)
  }
}

// 从本地存储加载
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('dashboard_stats')
    if (saved) {
      const savedData = JSON.parse(saved)
      Object.assign(statsData, savedData)
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadFromLocalStorage()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.production-stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  overflow: hidden;
}

.stats-container {
  padding: 40px;
  color: #fff;
  position: relative;
}

/* 激励文字 */
.motivational-text {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
}

.text-line {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.text-line:last-child {
  margin-bottom: 0;
}

/* 主要统计数据 */
.main-stats {
  margin-bottom: 30px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 25px 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 16px;
  margin-bottom: 15px;
  opacity: 0.9;
  font-weight: 500;
}

.stat-value-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-unit {
  font-size: 18px;
  opacity: 0.9;
  font-weight: 500;
}

/* 每日统计数据 */
.daily-stats {
  margin-bottom: 30px;
}

.daily-stat-item {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.daily-stat-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.daily-label {
  font-size: 15px;
  margin-bottom: 12px;
  opacity: 0.9;
  font-weight: 500;
}

.daily-value-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
}

.daily-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* 底部信息 */
.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  flex-wrap: wrap;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.info-label {
  opacity: 0.9;
  margin-right: 8px;
  font-weight: 500;
}

.info-value {
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* 可编辑文本样式 */
.editable-text {
  cursor: pointer;
  position: relative;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.editable-text:hover {
  background: rgba(255, 255, 255, 0.2);
}

.editable-text::after {
  content: '✎';
  font-size: 12px;
  margin-left: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.editable-text:hover::after {
  opacity: 0.7;
}

/* 编辑输入框样式 */
.edit-input {
  width: 100%;
  max-width: 500px;
}

.edit-input-small {
  width: 150px;
}

.edit-input-number {
  width: 200px;
}

.date-picker {
  width: 180px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-container {
    padding: 20px;
  }

  .text-line {
    font-size: 20px;
  }

  .stat-value {
    font-size: 28px;
  }

  .daily-value {
    font-size: 24px;
  }

  .footer-info {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Element Plus 输入框样式覆盖 */
:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
}

:deep(.el-input__inner) {
  color: #303133;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  background-color: rgba(255, 255, 255, 0.3);
}

:deep(.el-date-editor) {
  background-color: rgba(255, 255, 255, 0.9);
}

:deep(.el-date-editor .el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>

