<template>
  <div class="order-management">
    <Layout>
      <h2 class="order-list-title">订单列表</h2>
      <button class="add-order-btn" @click="showAddOrder = true">新增订单</button>
      <div class="orders-list">
        <Loader v-if="loading" />
        <table v-else>
          <thead>
          <tr>
            <th>订单编号</th>
            <th>订单名称</th>
            <th>货物数量</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>订单状态</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.name }}</td>
            <td>{{ order.numOfItem }}</td>
            <td>{{ order.startTime }}</td>
            <td>{{ order.endTime }}</td>
            <td>{{ order.states }}</td>
            <td>
              <button class="edit-btn" @click="editOrder(order)">编辑</button>
              <button
                  :class="order.states === '待审批' ? 'approve-btn' : 'view-btn'"
                  @click="approveOrder(order)">
                {{ order.states === '待审批' ? '审批' : '查看' }}
              </button>
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
          :total="filteredOrders.length"
      >
      </el-pagination>
    </Layout>

    <!-- 新增订单模态框 -->
    <div v-if="showAddOrder" class="modal">
      <div class="modal-content">
        <span class="close" @click="showAddOrder = false">&times;</span>
        <h3>新增订单</h3>
        <form @submit.prevent="addOrder">
          <label for="name">订单名称:</label>
          <input id="name" v-model="newOrder.name" required>

          <label for="amount">订单金额:</label>
          <input id="amount" type="number" v-model="newOrder.amount" required>

          <label for="quantity">货物数量:</label>
          <input id="quantity" type="number" v-model="newOrder.numOfItem" required>

          <label for="startTime">开始时间:</label>
          <input id="startTime" type="date" v-model="newOrder.startTime" required>

          <label for="endTime">结束时间:</label>
          <input id="endTime" type="date" v-model="newOrder.endTime" required>

          <label for="customer">客户名:</label>
          <input id="customer" v-model="newOrder.customer" required>

          <label for="note">备注:</label>
          <textarea id="note" v-model="newOrder.note"></textarea>

          <button type="submit">提交</button>
        </form>
      </div>
    </div>

    <!-- 审批订单模态框 -->
    <div v-if="showApproval" class="modal">
      <div class="modal-content">
        <span class="close" @click="showApproval = false">&times;</span>
        <h3>订单详情</h3>
        <div class="order-details">
          <p><strong>订单编号:</strong> {{ currentOrder.id }}</p>
          <p><strong>订单名称:</strong> {{ currentOrder.name }}</p>
          <p><strong>货物数量:</strong> {{ currentOrder.numOfItem }}</p>
          <p><strong>开始时间:</strong> {{ currentOrder.startTime }}</p>
          <p><strong>结束时间:</strong> {{ currentOrder.endTime }}</p>
          <p><strong>订单状态:</strong> {{ currentOrder.states }}</p>
        </div>
        <div class="approval-buttons" v-if="currentOrder.states === '待审批'">
          <button @click="approve('通过')">审批通过</button>
          <button @click="approve('不通过')">不通过</button>
        </div>
      </div>
    </div>
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
      orders: [],
      loading: true, // 添加loading状态
      showAddOrder: false,
      showApproval: false,
      currentOrder: {},
      newOrder: {
        name: '',
        amount: 0,
        states: '进行中',
        numOfItem: 0,
        startTime: '',
        endTime: '',
        customer: '',
        note: ''
      },
      currentPage: 1,
      pageSize: 10,
      searchQuery: '' // 添加搜索查询
    };
  },
  computed: {
    ...mapGetters(['userId', 'token']), // 确保你的 Vuex store 中有一个 getter 用于获取 token
    filteredOrders() {
      return this.orders.filter(order =>
          order.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredOrders.slice(start, end);
    }
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get(`http://localhost:8082/order/list?userid=${this.userId}`, {
          headers: {
            Authorization: this.token // 添加 Authorization 头
          }
        });
        console.log(response.data.data);
        this.orders = response.data.data;
        this.loading = false; // 数据加载成功，设置loading为false
      } catch (error) {
        console.error('Error fetching orders:', error);
        setTimeout(this.fetchOrders, 2000); // 轮询，每隔2秒尝试一次
      }
    },
    addOrder() {
      this.orders.push({
        id: (this.orders.length + 1).toString().padStart(3, '0'),
        ...this.newOrder
      });
      this.newOrder = { name: '', amount: 0, states: '进行中', numOfItem: 0, startTime: '', endTime: '', customer: '', note: '' };
      this.showAddOrder = false;
    },
    editOrder(order) {
      // 编辑订单的逻辑
    },
    approveOrder(order) {
      this.currentOrder = order;
      this.showApproval = true;
    },
    async approve(result) {
      try {
        const response = await axios.post(`http://localhost:8082/order/approve?oid=${this.currentOrder.id}`, null, {
          headers: {
            Authorization: this.token // 添加 Authorization 头
          }
        });
        if (response.data.code === 200) {
          this.currentOrder.states = result === '通过' ? '已审批' : '审批未通过';
          this.showApproval = false;
        } else {
          console.error('Error approving order:', response.data.message);
        }
      } catch (error) {
        console.error('Error approving order:', error);
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
.order-management {
  padding: 0px;
  position: relative;
}

.order-list-title {
  margin-bottom: 15px; /* 调整标题和表格之间的距离 */
}

.add-order-btn {
  margin-bottom: 20px; /* 调整按钮和表格之间的距离 */
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block; /* 确保按钮独占一行 */
}

.orders-list table {
  width: 100%;
  border-collapse: collapse;
}

.orders-list th, .orders-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.edit-btn, .approve-btn, .view-btn {
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

.approve-btn {
  background-color: red;
  color: white;
}

.view-btn {
  background-color: #6c757d;
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

.order-details {
  margin-bottom: 20px;
}

.order-details p {
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
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
}
</style>
