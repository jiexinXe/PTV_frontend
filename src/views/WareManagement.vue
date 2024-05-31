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
                  @click="toggleCompartment(selectedShelfIndex, compartmentIndex)"
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
                  @click="toggleCompartment(selectedShelfIndex, compartmentIndex + 100)"
              >
                {{ compartment.id }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
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
      selectedShelfIndex: null // 进入页面时默认没有选择货架
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
    toggleCompartment(shelfIndex, compartmentIndex) {
      this.$set(
          this.warehouse[shelfIndex][compartmentIndex],
          "filled",
          !this.warehouse[shelfIndex][compartmentIndex].filled
      );
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
          const compartmentIndex = item.id - 1; // 根据返回的 id 找到对应的货架单元
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
</style>
