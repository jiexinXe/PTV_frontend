<template>
  <div class="state-management">
    <Layout>
      <h2 class="state-list-title">状态列表</h2>
      <div class="states-list">
        <table>
          <thead>
          <tr>
            <th>货物编号</th>
            <th>货物名称</th>
            <th>类别</th>
            <th>数量</th>
            <th>单价</th>
            <th>供应商</th>
            <th>入库时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="cargo in paginatedCargoInfoList" :key="cargo.cid">
            <td>{{ cargo.cid }}</td>
            <td>{{ cargo.name }}</td>
            <td>{{ categoryMap[cargo.category] || '未知类别' }}</td>
            <td>{{ cargo.num }}</td>
            <td>{{ cargo.price }}</td>
            <td>{{ cargo.supplier }}</td>
            <td>{{ formatDate(cargo.enterTime) }}</td>
            <td>{{ stateMap[cargo.status] || '未知状态' }}</td>
            <td><button @click="viewDetails(cargo)" class="view-btn">查询</button></td>
          </tr>
          </tbody>
        </table>
      </div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="cargoInfoList.length"
      >
      </el-pagination>
    </Layout>

    <!-- 详情模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h3>货物详情</h3>
        <p><strong>货物编号:</strong> {{ selectedCargo.cid }}</p>
        <p><strong>货物名称:</strong> {{ selectedCargo.name }}</p>
        <p><strong>类别:</strong> {{ categoryMap[selectedCargo.category] || '未知类别' }}</p>
        <p><strong>数量:</strong> {{ selectedCargo.num }}</p>
        <p><strong>单价:</strong> {{ selectedCargo.price }}</p>
        <p><strong>供应商:</strong> {{ selectedCargo.supplier }}</p>
        <p><strong>入库时间:</strong> {{ formatDate(selectedCargo.enterTime) }}</p>
        <p><strong class="highlight">当前流程情况:</strong> {{ stateMap[selectedCargo.status] || '未知状态' }}</p>
        <p><strong class="highlight">当前货物状态:</strong> 良好</p>
      </div>
    </div>
  </div>
</template>

<script>
import Layout from "@/components/layout.vue";
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  components: {
    Layout
  },
  data() {
    return {
      cargoInfoList: [],
      stateMap: {
        0: '货物核验中',
        1: '等待订单审批',
        2: '小车运输中',
        3: '货架运输中',
        4: '已入库',
        5: '已取出'
      },
      categoryMap: {
        1: '生活用品',
        2: '电子产品',
        3: '数码产品',
        4: '运动户外',
        5: '服装鞋帽',
        6: '办公产品',
        7: '食品',
        8: '垃圾'
      },
      showModal: false,
      selectedCargo: {},
      currentPage: 1,
      pageSize: 10,
      searchQuery: '' // 添加搜索查询
    };
  },
  computed: {
    ...mapGetters(['userId', 'token']), // 确保你的 Vuex store 中有一个 getter 用于获取 token
    filteredCargoInfoList() {
      return this.cargoInfoList.filter(info =>
          info.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedCargoInfoList() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredCargoInfoList.slice(start, end);
    }
  },
  mounted() {
    this.fetchCargoInfo();
  },
  methods: {
    async fetchCargoInfo() {
      try {
        const response = await axios.get('http://localhost:8082/cargo/list/userid', {
          headers: {
            Authorization: `${this.token}`
          },
          params: {
            userid: this.userId
          }
        });
        console.log(response.data);
        this.cargoInfoList = response.data.data.CargoList;
      } catch (error) {
        console.error('Error fetching cargo info:', error);
      }
    },
    viewDetails(cargo) {
      this.selectedCargo = cargo;
      this.showModal = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    formatDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(date).toLocaleDateString('zh-CN', options);
    }
  }
};
</script>

<style>
.state-management {
  padding: 0px;
}

.state-list-title {
  margin-bottom: 15px; /* 调整标题和表格之间的距离 */
}

.states-list table {
  width: 100%;
  border-collapse: collapse;
}

.states-list th, .states-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.view-btn {
  width: 80px;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 10px;
  width: 40%; /* Could be more or less, depending on screen size */
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  position: relative;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.highlight {
  font-weight: bold;
  color: #007BFF; /* 蓝色 */
}
</style>
