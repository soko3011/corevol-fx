<template>
  <div v-if="apiDataReturned">
    <v-card flat>
      <v-btn
        absolute
        small
        fab
        top
        right
        color="pink"
        elevation="12"
        dark
        @click="interfaceToggle = !interfaceToggle"
      >
        <v-icon>mdi-information-variant</v-icon>
      </v-btn>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="data"
      sort-by="Cross"
      class="elevation-0 custom-transform-class"
      dense
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar dense class="mb-3" dark color="#385F73">
          <v-toolbar-title>System Data</v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="green--text text--lighten-3">
            <v-toolbar-title class="font-weight-light subtitle-2"
              >Spot:{{ spotIface }} | Swap:{{ swapIface }}</v-toolbar-title
            >
          </div>
        </v-toolbar>
      </template>
      <template v-slot:item.swaps="{ item }">
        <v-icon small @click="viewSwaps(item)">mdi-eye</v-icon>
      </template>
      <template v-slot:item.baserates="{ item }">
        <v-icon small @click="viewDepos(item)">mdi-eye</v-icon>
      </template>
      <template v-slot:item.ratetiles="{ item }">
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
    <v-dialog persistent v-model="interfaceToggle" max-width="600px">
      <v-card>
        <v-container fluid>
          <v-select
            v-model="spotIface"
            :items="ifaces"
            label="Spot Interface"
            @change="changeIface($event, 'spot')"
          ></v-select>
          <v-select
            v-model="swapIface"
            :items="ifaces"
            label="Swaps Interface"
            @change="changeIface($event, 'swap')"
          ></v-select>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" rounded="pill" centered elevation="20">
        Interfaces Updated => Spot: {{ spotIface }} | Swap :{{ swapIface }}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false"
            >Close</v-btn
          >
        </template>
      </v-snackbar>
    </div>
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
    ifaces: ["Barchart", "MongoDB", "Excel"],
    spotIface: "",
    swapIface: "",
    snackbar: false,
    apiDataReturned: false
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
    },
    refreshComponent() {
      this.initialize();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      MarketDataApi.GetSpotRates({ userName: this.$store.state.currentUser })
        .then(response => {
          this.data = JSON.parse(response.data.spotRates);
          this.data.sort((a, b) => (a.cross > b.cross ? 1 : -1));

          let headersNew = [];
          this.keys = Object.keys(this.data[0]);
          this.keys.forEach(function(val) {
            headersNew.push({ text: val, value: val, align: "center" });
          });

          headersNew.push({
            text: "Swaps",
            value: "swaps",
            sortable: false,
            align: "center"
          });
          headersNew.push({
            text: "BaseRates",
            value: "baserates",
            align: "center",
            sortable: false
          });
          headersNew.push({
            text: "RateTiles",
            value: "ratetiles",
            align: "center",
            sortable: false
          });

          this.headers = headersNew;
          this.apiDataReturned = true;
          this.$emit("hasData", true);
        })
        .catch(err => {
          alert(err);
        });

      MarketDataApi.CurrentInterfaces({
        UserName: this.$store.state.currentUser
      })
        .then(response => {
          this.spotIface = JSON.parse(response.data.spot);
          this.swapIface = JSON.parse(response.data.swap);
        })
        .catch(err => {
          alert(err);
        });
    },
    viewSwaps(item) {
      console.log(item);
      MarketDataApi.GetSwaps({
        UserName: this.$store.state.currentUser,
        Cross: item.Cross
      })
        .then(response => {
          this.marketData = JSON.parse(response.data.swaps);
          this.selectedCross = item.Cross;
          this.marketTableTitle = "SWAPS";
          this.marketTableWidth = "300px";
          this.showMarketTable = true;
        })
        .catch(err => {
          alert(err);
        });
    },
    viewDepos(item) {
      MarketDataApi.GetBaseRates({
        UserName: this.$store.state.currentUser,
        Cross: item.Cross
      })
        .then(response => {
          this.marketData = JSON.parse(response.data.depos);
          this.selectedCross = item.Cross;
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
      MarketDataApi.GetRateTiles({
        UserName: this.$store.state.currentUser,
        Cross: item.Cross
      })
        .then(response => {
          this.marketData = JSON.parse(response.data.rateTile);
          this.selectedCross = item.Cross;
          this.marketTableTitle = "RATETILE";
          this.marketTableWidth = "1000px";
          this.showMarketTable = true;
        })
        .catch(err => {
          alert(err);
        });
    },

    close() {
      this.interfaceToggle = false;
      this.$nextTick(() => {});
    },
    changeIface(event, iface) {
      if (iface === "spot") {
        this.spotIface = event;
      }
      if (iface === "swap") {
        this.swapIface = event;
      }
    },

    save() {
      MarketDataApi.ChangeInterface({
        UserName: this.$store.state.currentUser,
        SpotApi: this.spotIface,
        SwapApi: this.swapIface
      })
        .then(response => {
          this.spotIface = JSON.parse(response.data.spot);
          this.swapIface = JSON.parse(response.data.swap);
          this.snackbar = true;
          this.initialize();
        })
        .catch(err => {
          alert(err);
        });

      this.close();
    }
  }
};
</script>

<style lang="sass">
.custom-transform-class
  text-transform: uppercase
</style>
