<template>
  <div v-if="apiDataReturned">
    <v-data-table
      :headers="headers"
      :items="data"
      sort-by="Cross"
      class="elevation-0 custom-transform-class"
      dense
      disable-pagination
      hide-default-footer
      fixed-header
      :height="window.height - 60"
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
          <UserSettings />
          <v-card-actions class="justify-end">
            <v-btn text @click="interfaceToggle = false">Close</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import MarketDataApi from "@/apis/MarketDataApi.js";
import UserSettings from "@/components/settings/UserSettings.vue";
import MarketDataTable from "@/components/marketData/MarketDataTable.vue";
import { mapState } from "vuex";

export default {
  name: "marketData",
  data: () => ({
    interfaceToggle: false,
    keys: [],
    headers: [
      {
        text: "Cross",
        value: "Cross",
        sortable: false,
        align: "center",
      },
      {
        text: "Spot",
        value: "Spot",
        sortable: false,
        align: "center",
      },
      {
        text: "Swaps",
        value: "swaps",
        sortable: false,
        align: "center",
      },
      {
        text: "BaseRates",
        value: "baserates",
        align: "center",
        sortable: false,
      },
      {
        text: "RateTiles",
        value: "ratetiles",
        align: "center",
        sortable: false,
      },
    ],
    data: [],
    editedItem: {},
    showMarketTable: false,
    marketData: [],
    marketTableTitle: "",
    marketTableWidth: "",
    selectedCross: "",
    apiDataReturned: false,
    componentKey: 0,
  }),
  components: {
    MarketDataTable,
    UserSettings,
  },

  computed: {
    formTitle() {
      return `EDIT ${this.editedItem.Cross}`;
    },
    ...mapState({
      window: (state) => state.window,
      spotApi: (state) => state.spotApi,
      swapApi: (state) => state.swapApi,
    }),
    spotIface: {
      get() {
        return this.spotApi;
      },
      set(val) {
        this.updateSpotApi(val);
      },
    },
    swapIface: {
      get() {
        return this.swapApi;
      },
      set(val) {
        this.updateSwapApi(val);
      },
    },
  },

  async created() {
    await this.initialize();
  },

  methods: {
    dev() {
      console.log(this.swapApi);
    },
    async initialize() {
      try {
        let response = await MarketDataApi.GetSpotRates({
          userName: this.$store.state.currentUser,
        });
        this.data = JSON.parse(response.data.spotRates);
        this.data.sort((a, b) => (a.cross > b.cross ? 1 : -1));
        this.apiDataReturned = true;
      } catch (error) {}
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
    async updateSpotApi(val) {
      await this.$store.dispatch("updateSpotApi", {
        UserName: this.$store.state.currentUser,
        SpotApi: val,
      });
    },
    async updateSwapApi(val) {
      await this.$store.dispatch("updateSwapApi", {
        UserName: this.$store.state.currentUser,
        SwapApi: val,
      });
    },
  },
};
</script>


