<template>
  <div class="warehouse-management">
    <Layout>
      <h2 class="warehouse-title">仓库管理</h2>
      <div class="shelf-container">
        <div
            v-for="(shelf, shelfIndex) in warehouse"
            :key="shelfIndex"
            class="shelf-summary"
            @click="selectShelf(shelfIndex)"
        >
          货架 {{ shelfIndex + 1 }}
        </div>
      </div>
      <div v-if="selectedShelfIndex !== null" class="details-container">
        <h3>货架 {{ selectedShelfIndex + 1 }} 详情</h3>
        <div class="warehouse">
          <div class="shelf">
            <div class="compartments left">
              <div
                  v-for="(compartment, compartmentIndex) in getLeftCompartments(selectedShelfIndex)"
                  :key="compartmentIndex"
                  class="compartment"
                  :class="{ filled: compartment.filled }"
                  @click="showCargoInfo(selectedShelfIndex, compartmentIndex)"
              >
                {{ compartment.id }}
              </div>
            </div>
            <div class="compartments right">
              <div
                  v-for="(compartment, compartmentIndex) in getRightCompartments(selectedShelfIndex)"
                  :key="compartmentIndex"
                  class="compartment"
                  :class="{ filled: compartment.filled }"
                  @click="showCargoInfo(selectedShelfIndex, compartmentIndex + 100)"
              >
                {{ compartment.id }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    <!-- 模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h3 v-if="cargoInfo">{{ cargoInfo.name }}</h3>
        <div v-if="cargoInfo">
          <p><strong>货物编号:</strong> {{ cargoInfo.cid }}</p>
          <p><strong>仓库编号:</strong> {{ cargoInfo.warehouseId }}</p>
          <p><strong>货物名称:</strong> {{ cargoInfo.name }}</p>
          <p><strong>类别:</strong> {{ cargoInfo.category }}</p>
          <p><strong>数量:</strong> {{ cargoInfo.num }}</p>
          <p><strong>单价:</strong> {{ cargoInfo.price }}</p>
          <p><strong>供应商:</strong> {{ cargoInfo.supplier }}</p>
          <p><strong>入库时间:</strong> {{ cargoInfo.enterTime }}</p>
          <p><strong>位置:</strong> {{ cargoInfo.location }}</p>
          <p><strong>用户ID:</strong> {{ cargoInfo.userid }}</p>
          <p><strong>状态:</strong> {{ cargoInfo.status }}</p>
        </div>
        <div v-else>
          <p>期待您的货物</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Layout from "@/components/layout.vue";
import { mapGetters } from 'vuex';

export default {
  components: {
    Layout
  },
  data() {
    return {
      rows: 4, // 仓库中的货架排数
      columns: 20, // 每个货架的列数
      levels: 10, // 每个隔间的层数
      warehouse: [], // 存储仓库数据
      selectedShelfIndex: null, // 进入页面时默认没有选择货架
      showModal: false, // 控制模态框显示
      cargoInfo: null // 存储货物信息
    };
  },
  computed: {
    ...mapGetters(['userId', 'token']),
  },
  mounted() {
    this.initializeWarehouse();
  },
  methods: {
    initializeWarehouse() {
      for (let i = 0; i < this.rows; i++) {
        const shelf = [];
        for (let j = 0; j < this.columns * this.levels; j++) {
          shelf.push({ id: `S${i + 1}-C${j + 1}`, filled: false });
        }
        this.warehouse.push(shelf);
      }
    },
    async showCargoInfo(shelfIndex, compartmentIndex) {
      const shelveId = shelfIndex + 1;
      const numColumn = Math.floor(compartmentIndex / 10) + 1;
      const numRow = (compartmentIndex % 10) + 1;
      try {
        const response = await axios.get(
            'http://localhost:8082/authserver/shelves/cargo',
            {
              headers: {
                Authorization: `${this.token}`
              },
              params: {
                warehouse_id: '1',
                shelve_id: shelveId.toString(),
                row: numRow.toString(),
                column: numColumn.toString()
              }
            }
        );

        // 显示模态框并更新货物信息
        if (response.data.code === 200 && response.data.data) {
          this.cargoInfo = response.data.data;
        } else {
          this.cargoInfo = null;
        }
        this.showModal = true;
      } catch (error) {
        console.error("Failed to fetch cargo data:", error);
        this.cargoInfo = null;
        this.showModal = true;
      }
    },
    async selectShelf(index) {
      this.selectedShelfIndex = index;
      const shelveId = index + 1;
      try {
        const response = await axios.get(
            'http://localhost:8082/authserver/shelves/info',
            {
              headers: {
                Authorization: `${this.token}`
              },
              params: {
                warehouse_id: '1',
                shelve_id: shelveId.toString()
              }
            }
        );

        // 更新货架信息
        const shelfData = response.data.data;
        this.updateShelfData(shelfData);
        console.log(shelfData);
      } catch (error) {
        console.error("Failed to fetch shelf data:", error);
      }
    },
    updateShelfData(shelfData) {
      // 清空当前选中的货架的 filled 状态
      this.warehouse[this.selectedShelfIndex].forEach(compartment => {
        compartment.filled = false;
      });

      // 更新货架信息，根据 cargoId 设置 filled 状态
      shelfData.forEach(item => {
        if (item.cargoId) {
          const compartmentIndex = (item.numColumn - 1) * 10 + (item.numRow - 1);
          this.$set(this.warehouse[this.selectedShelfIndex][compartmentIndex], 'filled', true);
        }
      });
    },
    getLeftCompartments(shelfIndex) {
      return this.warehouse[shelfIndex].slice(0, 100); // 左半部分
    },
    getRightCompartments(shelfIndex) {
      return this.warehouse[shelfIndex].slice(100, 200); // 右半部分
    }
  }
};
</script>

<style scoped>
.warehouse-management {
}

.warehouse-title {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

.shelf-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.shelf-summary {
  padding: 10px;
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f5f5f5;
  text-align: center;
  transition: background-color 0.3s;
}

.shelf-summary:hover {
  background-color: #e0e0e0;
}

.details-container {
  margin-top: 20px;
}

.warehouse {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.shelf {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
}

.compartments {
  display: grid;
  grid-template-columns: repeat(10, 1fr); /* 10列 */
  gap: 5px;
  width: 48%;
}

.compartments.left {
  grid-template-rows: repeat(10, 40px); /* 10行，每行高40px */
}

.compartments.right {
  grid-template-rows: repeat(10, 40px); /* 10行，每行高40px */
}

.compartment {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.3s, transform 0.3s;
}

.compartment.filled {
  background-color: blue;
  color: white;
}

.compartment:hover {
  transform: scale(1.1);
  background-color: lightgray;
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
</style>
