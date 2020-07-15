<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      sort-by="Cross"
      class="elevation-10 custom-transform-class"
      dense
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar class="mb-3" dark color="blue-grey darken-2">
          <v-toolbar-title>Market Data</v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="ml-2">
          <v-icon small class="mr-10" @click="viewSwaps(item)">mdi-eye</v-icon>
          <v-icon small class="mr-10" @click="viewDepos(item)">mdi-eye</v-icon>
          <v-icon small class="mr-10" @click="viewRateTiles(item)">mdi-eye</v-icon>
        </div>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
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
  </div>
</template>

<script>
import MarketDataApi from "@/apis/MarketDataApi.js";
import MarketDataTable from "@/components/MarketDataTable.vue";
export default {
  name: "marketData",
  data: () => ({
    dialog: false,
    keys: [],
    headers: [],
    data: [],
    editedItem: {},
    showMarketTable: false,
    marketData: [],
    marketTableTitle: "",
    marketTableWidth: "",
    selectedCross: ""
  }),
  components: {
    MarketDataTable
  },
  props: {
    refreshComponent: { type: Boolean, default: false }
  },

  computed: {
    formTitle() {
      return `EDIT ${this.editedItem.Cross}`;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      MarketDataApi.GetSpotRates()
        .then(response => {
          this.data = JSON.parse(response.data.spotRates);
          this.data.sort((a, b) => (a.cross > b.cross ? 1 : -1));
          console.log(this.data);
          let headersNew = [];
          this.keys = Object.keys(this.data[0]);
          this.keys.forEach(function(val) {
            headersNew.push({ text: val, value: val });
          });

          headersNew.push({
            text: "Swaps--BaseRates--RateTiles",
            value: "actions",
            sortable: false
          });

          this.headers = headersNew;
        })
        .catch(err => {
          alert(err);
        });
    },
    viewSwaps(item) {
      MarketDataApi.GetSwaps({ name: item.cross })
        .then(response => {
          this.marketData = JSON.parse(response.data.swaps);
          this.selectedCross = item.cross;
          this.marketTableTitle = "SWAPS";
          this.marketTableWidth = "300px";
          this.showMarketTable = true;
        })
        .catch(err => {
          alert(err);
        });
    },
    viewDepos(item) {
      MarketDataApi.GetBaseRates({ name: item.cross })
        .then(response => {
          this.marketData = JSON.parse(response.data.depos);
          this.selectedCross = item.cross;
          this.marketTableTitle = `BASERATE (${JSON.parse(
            response.data.depoCcy
          )})`;
          this.marketTableWidth = "300px";
          this.showMarketTable = true;
        })
        .catch(err => {
          alert(err);
        });
    },
    viewRateTiles(item) {
      MarketDataApi.GetRateTiles({ name: item.cross })
        .then(response => {
          this.marketData = JSON.parse(response.data.rateTile);
          this.selectedCross = item.cross;
          this.marketTableTitle = "RATETILE";
          this.marketTableWidth = "1000px";
          this.showMarketTable = true;
        })
        .catch(err => {
          alert(err);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },

    save() {
      this.close();
    }
  }
};
</script>



<style lang="sass">
.custom-transform-class
  text-transform: uppercase
</style>
