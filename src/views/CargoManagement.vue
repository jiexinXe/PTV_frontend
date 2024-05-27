<template>
  <div class="cargo-management">
    <Layout>
      <h2 class="cargo-list-title">货物列表</h2>
      <div class="actions">
        <button class="add-cargo-btn" @click="goToAddCargo">新增货物</button>
        <input type="text" v-model="searchQuery" placeholder="搜索货物名称..." class="search-input">
      </div>
      <div class="cargos-list">
        <table>
          <thead>
          <tr>
            <th>货物编号</th>
            <th>货物名称</th>
            <th>数量</th>
            <th>仓库位置</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="cargo in filteredCargos" :key="cargo.cid">
            <td>{{ cargo.cid }}</td>
            <td>{{ cargo.name }}</td>
            <td>{{ cargo.num }}</td>
            <td>{{ cargo.location }}</td>
            <td>
              <button @click="editCargo(cargo)" class="edit-btn">编辑</button>
              <button @click="deleteCargo(cargo.cid, cargo.num)" class="delete-btn">删除</button>
              <button @click="decreaseStock(cargo.cid, cargo.outNum)" class="out-btn">出库</button>
              <input type="number" v-model="cargo.outNum" placeholder="数量" class="out-input" min="1" :max="cargo.num">
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </Layout>
    <!-- 模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <form @submit.prevent="updateCargo">
          <label for="cid">货物编号:</label>
          <input type="text" id="cid" v-model="editingCargo.cid" disabled style="width: 100%;">
          <label for="name">货物名称:</label>
          <input type="text" id="name" v-model="editingCargo.name" style="width: 100%;">
          <label for="num">货物数量:</label>
          <input type="text" id="num" v-model="editingCargo.num" style="width: 100%;">
          <label for="price">货物单价:</label>
          <input type="text" id="price" v-model="editingCargo.price" style="width: 100%;">
          <label for="category">货物类别:</label>
          <select id="category" v-model="editingCargo.categoryId" style="width: 100%;">
            <option v-for="category in categories" :value="category.categoryId" :key="category.categoryId">
              {{ category.categoryName }}
            </option>
          </select>
          <label for="supplier">供应商名称:</label>
          <input type="text" id="supplier" v-model="editingCargo.supplier" style="width: 100%;">
          <label for="location">入库位置:</label>
          <input type="text" id="location" v-model="editingCargo.location" style="width: 100%;">
          <button type="submit" style="width: 100%;">保存修改</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../utils/axios'; // 引入带有拦截器的axios实例
import Layout from "@/components/layout.vue";
import { mapGetters } from 'vuex';

export default {
  components: { Layout },
  data() {
    return {
      cargos: [],
      showModal: false,
      categories: [],
      selectedCategoryId: null,
      searchQuery: '',
      editingCargo: {
        cid: '',
        name: '',
        num: '',
        price: '',
        supplier: '',
        location: ''
      }
    };
  },
  computed: {
    ...mapGetters(['userId']),
    filteredCargos() {
      return this.cargos.filter(cargo =>
          cargo.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  mounted() {
    this.fetchCargos();
    this.fetchCategories();
  },
  methods: {
    async fetchCargos() {
      try {
        const response = await service.get(`http://localhost:8082/cargo/list/userid?userid=${this.userId}`);
        this.cargos = response.data.data.CargoList;
      } catch (error) {
        console.error('Error fetching cargos:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await service.get("http://localhost:8082/category/all");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    goToAddCargo() {
      this.$router.push('/addCargo');
    },
    editCargo(cargo) {
      Object.assign(this.editingCargo, cargo);
      this.showModal = true;
    },
    async deleteCargo(cid, num) {
      if (confirm('确定要删除这条货物信息吗？')) {
        try {
          const response = await service.delete(`http://localhost:8082/cargo/delete?id=${cid}&num=${num}`);
          if (response.data.code === 200) {
            this.fetchCargos();
            alert('删除成功');
          } else {
            console.error('Failed to delete cargo:', response.data.message);
            alert('删除失败');
          }
        } catch (error) {
          console.error('Error deleting cargo:', error);
          alert('删除时出现错误');
        }
      }
    },
    async updateCargo() {
      try {
        const response = await service.post('http://localhost:8082/cargo/update', this.editingCargo);
        if (response.data.code === 200) {
          console.log('Cargo updated successfully:', response.data);
          this.fetchCargos(); // Reload the cargos list to reflect the update
          this.showModal = false; // Close the modal after successful update
        } else {
          console.error('Failed to update cargo:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating cargo:', error);
      }
    },
    async decreaseStock(cid, num) {
      if (num <= 0 || num === '') {
        alert('请输入有效数量');
        return;
      }
      if (confirm('确定要执行出库操作吗？')) {
        try {
          const response = await service.delete(`http://localhost:8082/cargo/delete?id=${cid}&num=${num}`);
          if (response.data.code === 200) {
            this.fetchCargos(); // 重新获取数据以更新视图
            alert('出库成功');
          } else {
            alert('出库失败');
            console.error('出库失败:', response.data.message);
          }
        } catch (error) {
          console.error('出库错误:', error);
          alert('出库时出现错误');
        }
      }
    }
  }
};
</script>

<style>
.cargo-management {
  padding: 0px;
}

.cargo-list-title {
  margin-bottom: 15px;
}

.actions {
  display: flex;
  align-items: center; /* 确保元素垂直居中 */
  margin-bottom: 20px; /* 与表格的距离 */
}

.add-cargo-btn, .search-input {
  height: 36px; /* 设置按钮和输入框的高度相同 */
  padding: 0 12px;
  border: 1px solid #ccc;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.add-cargo-btn {
  border-color: #4CAF50; /* 保持按钮边框颜色一致 */
  width: 100px; /* 设置搜索框的宽度 */
}

.search-input {
  width: 150px; /* 设置搜索框的宽度 */
  margin-left: 20px; /* 搜索框与按钮之间的间距 */
  padding: 0 10px;
  background-color: white; /* 输入框的背景颜色 */
  color: black; /* 输入文字颜色 */
  border-color: #ccc; /* 边框颜色 */
}

.cargos-list table {
  width: 100%;
  border-collapse: collapse;
}

.cargos-list th, .cargos-list td {
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
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 600px;
}

.close {
  float: right;
  font-size: 28px;
  cursor: pointer;
}

.out-btn {
  background-color: #007BFF;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.out-input {
  width: 60px;
  margin-right: 5px;
  padding: 5px;
  text-align: center;
}

</style>
