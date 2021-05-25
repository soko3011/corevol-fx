<template>
  <div v-if="apiDataReturned">
    <v-data-table
      :key="componentKey"
      :headers="headers"
      :items="data"
      sort-by="Cross"
      class="elevation-0 custom-transform-class"
      dense
      disable-pagination
      hide-default-footer
      fixed-header
      :height="tableHeight - 60"
    >
      <template v-slot:top>
        <v-toolbar dense class="mb-3" dark color="#385F73">
          <v-toolbar-title>System Data</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            large
            color="green lighten-2"
            @click="interfaceToggle = !interfaceToggle"
          >
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot-->
      <template #item.swaps="{ item }">
        <v-icon small @click="viewSwaps(item)">mdi-eye</v-icon>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot-->
      <template #item.baserates="{ item }">
        <v-icon small @click="viewDepos(item)">mdi-eye</v-icon>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot-->
      <template #item.ratetiles="{ item }">
        <v-icon small @click="viewRateTiles(item)">mdi-eye</v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="showMarketTable" :max-width="marketTableWidth">
      <v-card>
        <MarketDataTable
          v-if="showMarketTable"
          :crossName="selectedCross"
          :title="marketTableTitle"
          :incomingData="marketData"
        />
      </v-card>
    </v-dialog>
    <v-dialog v-model="interfaceToggle" max-width="600px">
      <v-card>
        <v-container fluid>
          <v-select
            v-model="spotIface"
            :items="spotIfaces"
            label="Spot Interface"
            @change="updateSpotApi()"
          ></v-select>
          <v-select
            v-model="swapIface"
            :items="swapIfaces"
            label="Swaps Interface"
            @change="updateSwapApi"
          ></v-select>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import MarketDataApi from "@/apis/MarketDataApi.js";
import MarketDataTable from "@/components/marketData/MarketDataTable.vue";

export default {
  name: "marketData",
  data: () => ({
    dialog: false,
    interfaceToggle: false,
    keys: [],
    headers: [],
    data: [],
    editedItem: {},
    showMarketTable: false,
    marketData: [],
    marketTableTitle: "",
    marketTableWidth: "",
    selectedCross: "",
    spotIfaces: ["InvestingDotCom", "MongoDB"],
    swapIfaces: ["EmpireFXPY", "MongoDB"],
    spotIface: "",
    swapIface: "",
    apiDataReturned: false,
    componentKey: 0,
  }),
  components: {
    MarketDataTable,
  },
  props: {
    refreshComponent: { type: Boolean, default: false },
    tableHeight: { type: Number },
  },

  computed: {
    formTitle() {
      return `EDIT ${this.editedItem.Cross}`;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    refreshComponent() {
      this.initialize();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      MarketDataApi.GetSpotRates({ userName: this.$store.state.currentUser })
        .then((response) => {
          this.data = JSON.parse(response.data.spotRates);

          this.data.sort((a, b) => (a.cross > b.cross ? 1 : -1));

          let headersNew = [];
          this.keys = Object.keys(this.data[0]);
          this.keys.forEach(function (val) {
            headersNew.push({ text: val, value: val, align: "center" });
          });

          headersNew.push({
            text: "Swaps",
            value: "swaps",
            sortable: false,
            align: "center",
          });
          headersNew.push({
            text: "BaseRates",
            value: "baserates",
            align: "center",
            sortable: false,
          });
          headersNew.push({
            text: "RateTiles",
            value: "ratetiles",
            align: "center",
            sortable: false,
          });

          this.headers = headersNew;
          this.apiDataReturned = true;
          this.$emit("hasData", true);
        })
        .catch((err) => {
          alert(err);
        });

      MarketDataApi.CurrentInterfaces({
        UserName: this.$store.state.currentUser,
      })
        .then((response) => {
          this.spotIface = JSON.parse(response.data.spot);
          this.swapIface = JSON.parse(response.data.swap);
        })
        .catch((err) => {
          alert(err);
        });
    },
    viewSwaps(item) {
      MarketDataApi.GetSwaps({
        UserName: this.$store.state.currentUser,
        Cross: item.Cross,
      })
        .then((response) => {
          this.marketData = JSON.parse(response.data.swaps);
          this.selectedCross = item.Cross;
          this.marketTableTitle = "SWAPS";
          this.marketTableWidth = "300px";
          this.showMarketTable = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
    viewDepos(item) {
      MarketDataApi.GetBaseRates({
        UserName: this.$store.state.currentUser,
        Cross: item.Cross,
      })
        .then((response) => {
          this.marketData = JSON.parse(response.data.depos);
          this.selectedCross = item.Cross;
          this.marketTableTitle = `BASERATE (${JSON.parse(
            response.data.depoCcy
          )})`;
          this.marketTableWidth = "300px";
          this.showMarketTable = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
    viewRateTiles(item) {
      MarketDataApi.GetRateTiles({
        UserName: this.$store.state.currentUser,
        Cross: item.Cross,
      })
        .then((response) => {
          this.marketData = JSON.parse(response.data.rateTile);
          this.selectedCross = item.Cross;
          this.marketTableTitle = "RATETILE";
          this.marketTableWidth = "1000px";
          this.showMarketTable = true;
        })
        .catch((err) => {
          alert(err);
        });
    },

    close() {
      this.interfaceToggle = false;
      this.$nextTick(() => {});
    },
    async updateSpotApi() {
      await this.$store.dispatch("updateSpotApi", {
        UserName: this.$store.state.currentUser,
        SpotApi: this.spotIface,
      });
      this.$store.dispatch("setSnackbar", {
        text: "Spot Api Updated",
        top: true,
      });
      this.componentKey += 1;
    },
    async updateSwapApi() {
      await this.$store.dispatch("updateSwapApi", {
        UserName: this.$store.state.currentUser,
        SwapApi: this.swapIface,
      });
      this.$store.dispatch("setSnackbar", {
        text: "Swap Api Updated",
        top: true,
      });
      this.componentKey += 1;
    },
  },
};
</script>


