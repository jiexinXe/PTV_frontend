<template>
  <div class="store-management">
    <Layout>
      <h2 class="store-list-title">存储列表</h2>
      <div class="stores-list">
        <Loader v-if="loading" />
        <table v-else>
          <thead>
          <tr>
            <th>货物编号</th>
            <th>货物名称</th>
            <th>类别</th>
            <th>数量</th>
            <th>单价</th>
            <th>供应商</th>
            <th>位置</th>
            <th>入库时间</th>
            <th>状态</th>
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
            <td>{{ formatLocation(cargo.shelve_location) }}</td>
            <td>{{ formatDate(cargo.enterTime) }}</td>
            <td>{{ stateMap[cargo.status] || '未知状态' }}</td>
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
  </div>
</template>

<script>
import Layout from "@/components/layout.vue";
import Loader from "@/components/Loader.vue"; // 引用加载组件
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  components: {
    Layout,
    Loader
  },
  data() {
    return {
      cargoInfoList: [],
      loading: true, // 添加loading状态
      stateMap: {
        0: '审核中',
        1: '订单审查中',
        2: '小车运输中',
        3: '货架运输中',
        4: '入库完成',
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
        this.cargoInfoList = response.data.data.CargoList;
        this.loading = false; // 数据加载成功，设置loading为false
      } catch (error) {
        console.error('Error fetching cargo info:', error);
        setTimeout(this.fetchCargoInfo, 2000); // 轮询，每隔2秒尝试一次
      }
    },
    formatLocation(location) {
      if (!location) {
        return '未存储';
      }
      return `W1 ${location}`;
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
.store-management {
  padding: 0px;
  position: relative;
}

.store-list-title {
  margin-bottom: 15px;
}

.stores-list table {
  width: 100%;
  border-collapse: collapse;
}

.stores-list th, .stores-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.edit-btn, .delete-btn {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  color: white;
  cursor: pointer;
}

.edit-btn {
  background-color: #4CAF50;
}

.delete-btn {
  background-color: #f44336;
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

form > label {
  display: block;
  margin-bottom: 5px;
}

form > input, form > select, form > textarea {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

form > button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

form > button:hover {
  background-color: #45a049;
}

.loader {
  --duration: 3s;
  --primary: rgba(39, 94, 254, 1);
  --primary-light: #2f71ff;
  --primary-rgba: rgba(39, 94, 254, 0);
  width: 140px; /* 70% of 200px */
  height: 224px; /* 70% of 320px */
  position: absolute;
  top: 65%; /* 将加载组件下移 */
  left: 50%;
  transform: translate(-50%, -5%);
  transform-style: preserve-3d;
}
</style>
