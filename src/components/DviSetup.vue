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
        <v-toolbar dense class="mb-3" dark color="blue-grey darken-2">
          <v-toolbar-title>Dvi Settings</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="1000px">
            <v-card>
              <v-card-title>
                <span class="title">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="2" v-for="key in keys" :key="key">
                      <v-text-field v-model="editedItem[key]" :label="key"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save(editedItem)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.mults="{ item }">
        <v-icon small @click="viewMultsAndSpreads(item)">mdi-eye</v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon v-if="isAdmin" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
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
import SettingsApi from "@/apis/SettingsApi.js";
import MarketDataTable from "@/components/MarketDataTable.vue";

export default {
  name: "DviSetup",
  components: { MarketDataTable },
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
    selectedCross: "",
    isAdmin: false
  }),

  computed: {
    formTitle() {
      return `EDIT ${this.editedItem.Cross}`;
    }
  },
  props: {
    refreshComponent: { type: Boolean, default: false }
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
      this.isAdmin = this.$store.state.isAdmin;
      SettingsApi.GetDviSetup()
        .then(response => {
          this.data = JSON.parse(response.data.dviSetup);
          let headersNew = [];
          this.keys = Object.keys(this.data[0]);
          this.keys.forEach(function(val) {
            headersNew.push({ text: val, value: val, align: "center" });
          });
          headersNew.push({
            text: "Mults",
            value: "mults",
            align: "center"
          });

          headersNew.push({
            text: "Actions",
            value: "actions",
            align: "center"
          });

          this.headers = headersNew;
        })
        .catch(err => {
          this.snackbarMessage = ` Error: ${err}`;
          this.snackbar = true;
        });
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      confirm(`Are you sure you want to delete ${item.Cross}?`) &&
        SettingsApi.DeleteCcyPairData({ name: item.Cross })
          .then(response => {
            this.$store.dispatch("setSnackbar", {
              text: `${item.Cross} deleted succesfully. Status ${response.status}`
            });

            this.initialize();
            this.$emit("ccyPairDeleted", true);
          })
          .catch(err => {
            this.$store.dispatch("setSnackbar", {
              text: `Delete unsucessful. Error: ${err}`
            });
          });
    },
    viewMultsAndSpreads(item) {
      const cross = item.Cross;
      SettingsApi.GetMultsAndSpreads({ name: cross })
        .then(response => {
          this.marketData = JSON.parse(response.data.multsAndSpreads);
          this.selectedCross = cross;
          this.marketTableTitle = "MULTIPLERS AND SPREADS";
          this.marketTableWidth = "1000px";
          this.showMarketTable = true;
        })
        .catch(err => {
          this.snackbarMessage = ` Error: ${err}`;
          this.snackbar = true;
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },

    save(item) {
      this.$store.dispatch("setSnackbar", {
        text: `Processing ${item.Cross} DVI update ...`,
        timeout: 2500
      });
      SettingsApi.UpdateDviDets(item)
        .then(response => {
          this.$store.dispatch("setSnackbar", {
            text: `${item.Cross} updated succesfully. Status ${response.status}`
          });

          this.initialize();
        })
        .catch(err => {
          this.$store.dispatch("setSnackbar", {
            text: `Update unsucessful. Error: ${err}`
          });
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
