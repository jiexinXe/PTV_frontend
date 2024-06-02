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
            <th>位置</th>
            <th>入库时间</th>
            <th>状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="cargo in paginatedCargoInfoList" :key="cargo.cid">
            <td>{{ cargo.cid }}</td>
            <td>{{ cargo.name }}</td>
            <td>{{ cargo.category }}</td>
            <td>{{ cargo.num }}</td>
            <td>{{ cargo.price }}</td>
            <td>{{ cargo.supplier }}</td>
            <td>{{ cargo.location }}</td>
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

    <!-- 编辑状态模态框 -->
    <div v-if="showEditState" class="modal">
      <div class="modal-content">
        <span class="close" @click="showEditState = false">&times;</span>
        <h3>编辑状态</h3>
        <form @submit.prevent="updateState">
          <label for="name">状态名称:</label>
          <input id="name" v-model="editingState.name" required>

          <label for="description">描述:</label>
          <textarea id="description" v-model="editingState.description"></textarea>

          <button type="submit">保存修改</button>
        </form>
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
        0: '审核中',
        1: '订单审查中',
        2: '小车运输中',
        3: '货架运输中',
        4: '入库完成',
        5: '已取出'
      },
      showEditState: false,
      editingState: {},
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
      } catch (error) {
        console.error('Error fetching cargo info:', error);
      }
    },
    editState(state) {
      this.editingState = { ...state };
      this.showEditState = true;
    },
    async updateState() {
      try {
        const response = await axios.post('http://localhost:8082/state/update', this.editingState, {
          headers: {
            Authorization: this.token // 添加 Authorization 头
          }
        });
        if (response.data.code === 200) {
          console.log('State updated successfully:', response.data);
          this.fetchCargoInfo(); // Reload the states list to reflect the update
          this.showEditState = false; // Close the modal after successful update
        } else {
          console.error('Failed to update state:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating state:', error);
      }
    },
    async deleteState(id) {
      if (confirm('确定要删除这个状态吗？')) {
        try {
          const response = await axios.delete(`http://localhost:8082/state/delete?id=${id}`, {
            headers: {
              Authorization: this.token // 添加 Authorization 头
            }
          });
          if (response.data.code === 200) {
            console.log('State deleted successfully:', response.data);
            this.fetchCargoInfo(); // Reload the states list to reflect the deletion
          } else {
            console.error('Failed to delete state:', response.data.message);
          }
        } catch (error) {
          console.error('Error deleting state:', error);
        }
      }
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

.edit-btn, .delete-btn {
  width: 80px;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 5px;
}

.edit-btn {
  background-color: #007BFF;
  color: white;
}

.delete-btn {
  background-color: #f44336;
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

.state-details {
  margin-bottom: 20px;
}

.state-details p {
  margin: 5px 0;
}

.approval-buttons {
  display: flex;
  justify-content: space-between;
}

.approval-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.approval-buttons button:first-child {
  background-color: #4CAF50;
  color: white;
}

.approval-buttons button:last-child {
  background-color: #f44336;
  color: white;
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
</style>
