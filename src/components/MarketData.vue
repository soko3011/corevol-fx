<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      sort-by="Cross"
      class="elevation-10"
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
        <div class="ml-4">
          <v-icon small class="mr-10" @click="viewSwaps(item)">mdi-eye</v-icon>
          <v-icon small class="mr-10" @click="viewDepos(item)">mdi-eye</v-icon>
          <v-icon small class="mr-10" @click="viewRateTiles(item)">mdi-eye</v-icon>
        </div>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="showSwaps" max-width="500px">
      <v-card>
        <SwapsTable :crossName="selectedCross" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import MarketDataApi from "@/apis/MarketDataApi.js";
import SwapsTable from "@/components/SwapsTable.vue";
export default {
  data: () => ({
    dialog: false,
    keys: [],
    headers: [],
    data: [],
    editedItem: {},
    showSwaps: false,
    selectedCross: ""
  }),
  components: {
    SwapsTable
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
      MarketDataApi.GetSpotRates()
        .then(response => {
          this.data = JSON.parse(response.data.spotRates);
          let headersNew = [];
          this.keys = Object.keys(this.data[0]);
          this.keys.forEach(function(val) {
            headersNew.push({ text: val, value: val });
          });

          headersNew.push({
            text: "Swaps-----Depos-----RateTiles",
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
      this.selectedCross = item.cross;
      console.log(this.selectedCross);
      this.showSwaps = true;
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




