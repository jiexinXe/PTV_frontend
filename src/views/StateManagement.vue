<template>
  <div class="state-management">
    <Layout>
      <h2 class="state-list-title">状态列表</h2>
      <button class="add-state-btn" @click="showAddState = true">新增状态</button>
      <div class="states-list">
        <table>
          <thead>
          <tr>
            <th>状态编号</th>
            <th>状态名称</th>
            <th>描述</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="state in paginatedStates" :key="state.id">
            <td>{{ state.id }}</td>
            <td>{{ state.name }}</td>
            <td>{{ state.description }}</td>
            <td>
              <button class="edit-btn" @click="editState(state)">编辑</button>
              <button class="delete-btn" @click="deleteState(state.id)">删除</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredStates.length"
      >
      </el-pagination>
    </Layout>

    <!-- 新增状态模态框 -->
    <div v-if="showAddState" class="modal">
      <div class="modal-content">
        <span class="close" @click="showAddState = false">&times;</span>
        <h3>新增状态</h3>
        <form @submit.prevent="addState">
          <label for="name">状态名称:</label>
          <input id="name" v-model="newState.name" required>

          <label for="description">描述:</label>
          <textarea id="description" v-model="newState.description"></textarea>

          <button type="submit">提交</button>
        </form>
      </div>
    </div>

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
      states: [],
      showAddState: false,
      showEditState: false,
      editingState: {},
      newState: {
        name: '',
        description: ''
      },
      currentPage: 1,
      pageSize: 10,
      searchQuery: '' // 添加搜索查询
    };
  },
  computed: {
    ...mapGetters(['userId', 'token']), // 确保你的 Vuex store 中有一个 getter 用于获取 token
    filteredStates() {
      return this.states.filter(state =>
          state.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedStates() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredStates.slice(start, end);
    }
  },
  mounted() {
    this.fetchStates();
  },
  methods: {
    async fetchStates() {
      try {
        const response = await axios.get(`http://localhost:8082/state/list?userid=${this.userId}`, {
          headers: {
            Authorization: this.token // 添加 Authorization 头
          }
        });
        console.log(response.data.data);
        this.states = response.data.data;
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    },
    addState() {
      this.states.push({
        id: (this.states.length + 1).toString().padStart(3, '0'),
        ...this.newState
      });
      this.newState = { name: '', description: '' };
      this.showAddState = false;
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
          this.fetchStates(); // Reload the states list to reflect the update
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
            this.fetchStates(); // Reload the states list to reflect the deletion
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

.add-state-btn {
  margin-bottom: 20px; /* 调整按钮和表格之间的距离 */
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block; /* 确保按钮独占一行 */
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
  background-color: rgba(0,0,0.4); /* Black w/ opacity */
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
