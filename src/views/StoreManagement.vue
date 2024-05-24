<template>
  <div class="store-management">
    <Layout>
      <h2 class="store-list-title">存储列表</h2>
      <div class="actions">
        <button class="add-store-btn" @click="showAddStore = true">新增存储</button>
        <input type="text" v-model="searchQuery" placeholder="搜索存储名称..." class="search-input">
      </div>
      <div class="stores-list">
        <table>
          <thead>
          <tr>
            <th>存储编号</th>
            <th>存储名称</th>
            <th>容量</th>
            <th>位置</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="store in filteredStores" :key="store.sid">
            <td>{{ store.sid }}</td>
            <td>{{ store.name }}</td>
            <td>{{ store.capacity }}</td>
            <td>{{ store.location }}</td>
            <td>
              <button @click="editStore(store)" class="edit-btn">编辑</button>
              <button @click="deleteStore(store.sid)" class="delete-btn">删除</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </Layout>
    <!-- 新增存储模态框 -->
    <div v-if="showAddStore" class="modal">
      <div class="modal-content">
        <span class="close" @click="showAddStore = false">&times;</span>
        <h3>新增存储</h3>
        <form @submit.prevent="addStore">
          <label for="sid">存储编号:</label>
          <input id="sid" v-model="newStore.sid" required>

          <label for="name">存储名称:</label>
          <input id="name" v-model="newStore.name" required>

          <label for="capacity">存储容量:</label>
          <input id="capacity" type="number" v-model="newStore.capacity" required>

          <label for="location">存储位置:</label>
          <input id="location" v-model="newStore.location" required>

          <button type="submit">提交</button>
        </form>
      </div>
    </div>
    <!-- 编辑存储模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <form @submit.prevent="updateStore">
          <label for="sid">存储编号:</label>
          <input type="text" id="sid" v-model="editingStore.sid" disabled style="width: 100%;">
          <label for="name">存储名称:</label>
          <input type="text" id="name" v-model="editingStore.name" style="width: 100%;">
          <label for="capacity">存储容量:</label>
          <input type="text" id="capacity" v-model="editingStore.capacity" style="width: 100%;">
          <label for="location">存储位置:</label>
          <input type="text" id="location" v-model="editingStore.location" style="width: 100%;">
          <button type="submit" style="width: 100%;">保存修改</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../utils/axios'; // 引入带有拦截器的axios实例
import Layout from "@/components/layout.vue";
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter } from "vue-router/composables";

export default {
  components: { Layout },
  setup() {
    const stores = ref([]);
    const showModal = ref(false);
    const showAddStore = ref(false);
    const searchQuery = ref('');
    const editingStore = reactive({
      sid: '',
      name: '',
      capacity: '',
      location: ''
    });

    const newStore = reactive({
      sid: '',
      name: '',
      capacity: '',
      location: ''
    });

    const fetchStores = async () => {
      try {
        const response = await service.get('http://localhost:8082/store/list');
        stores.value = response.data.data.StoreList;
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    onMounted(() => {
      fetchStores();
    });

    const editStore = (store) => {
      Object.assign(editingStore, store);
      showModal.value = true;
    };

    const deleteStore = async (sid) => {
      if (confirm('确定要删除这条存储信息吗？')) {
        try {
          const response = await service.delete(`http://localhost:8082/store/delete?id=${sid}`);
          if (response.data.code === 200) {
            fetchStores();
            alert('删除成功');
          } else {
            console.error('Failed to delete store:', response.data.message);
            alert('删除失败');
          }
        } catch (error) {
          console.error('Error deleting store:', error);
          alert('删除时出现错误');
        }
      }
    };

    const updateStore = async () => {
      try {
        const response = await service.post('http://localhost:8082/store/update', editingStore);
        if (response.data.code === 200) {
          console.log('Store updated successfully:', response.data);
          fetchStores(); // Reload the stores list to reflect the update
          showModal.value = false; // Close the modal after successful update
        } else {
          console.error('Failed to update store:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating store:', error);
      }
    };

    const addStore = async () => {
      try {
        const response = await service.post('http://localhost:8082/store/add', newStore);
        if (response.data.code === 200) {
          console.log('Store added successfully:', response.data);
          fetchStores(); // Reload the stores list to reflect the new store
          showAddStore.value = false; // Close the modal after successful addition
          Object.assign(newStore, {
            sid: '',
            name: '',
            capacity: '',
            location: ''
          });
        } else {
          console.error('Failed to add store:', response.data.message);
        }
      } catch (error) {
        console.error('Error adding store:', error);
      }
    };

    const filteredStores = computed(() => {
      return stores.value.filter(store =>
          store.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    return {
      stores,
      showModal,
      showAddStore,
      newStore,
      editingStore,
      editStore,
      deleteStore,
      updateStore,
      addStore,
      searchQuery,
      filteredStores
    };
  }
}
</script>

<style>
.store-management {
  padding: 0px;
}

.store-list-title {
  margin-bottom: 15px;
}

.actions {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.add-store-btn, .search-input {
  height: 36px;
  padding: 0 12px;
  border: 1px solid #ccc;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.add-store-btn {
  border-color: #4CAF50;
  width: 100px;
}

.search-input {
  width: 150px;
  margin-left: 20px;
  padding: 0 10px;
  background-color: white;
  color: black;
  border-color: #ccc;
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
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 40%; /* Could be more or less, depending on screen size */
  border-radius: 10px; /* Rounded corners */
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

form > input, form > select {
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
