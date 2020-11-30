<template>
  <v-row justify="center">
    <v-dialog v-model="dialogToggle" max-width="1000">
      <v-card width="1000">
        <v-app-bar flat color="rgba(0, 0, 0, 0)">
          <!-- <v-btn @click="dev" color="blue">DEV</v-btn> -->
          <v-toolbar-title class="title black--text text--darken-3 mr-5">
            {{ title }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <div mr-5>
            <v-btn
              @click="sendSimulationToServer(0.0)"
              color="blue accent-1"
              icon
            >
              <v-icon>mdi-circle-outline</v-icon>
            </v-btn>
            <v-btn
              @click="sendSimulationToServer(0.25)"
              color="blue accent-2"
              icon
            >
              <v-icon>mdi-circle-slice-2</v-icon>
            </v-btn>
            <v-btn
              @click="sendSimulationToServer(0.5)"
              color="blue accent-3"
              icon
            >
              <v-icon>mdi-circle-slice-4</v-icon>
            </v-btn>
            <v-btn
              @click="sendSimulationToServer(0.75)"
              color="blue accent-4"
              icon
            >
              <v-icon>mdi-circle-slice-6</v-icon>
            </v-btn>
            <v-btn @click="refreshAggregate" color="blue darken-3" icon>
              <v-icon>mdi-refresh-circle</v-icon>
            </v-btn>
            <v-menu
              v-model="menu"
              bottom
              origin="center center"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="isMultipleOptions"
                  icon
                  small
                  color="green darken-4"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-chevron-double-down</v-icon>
                </v-btn>
              </template>
              <v-card max-width="800">
                <v-list rounded align="center" justify="center">
                  <v-subheader>Component Options</v-subheader>
                  <v-list-item-group color="blue darken--3">
                    <v-list-item
                      v-for="item in componentKeys"
                      :key="item"
                      @click="changeComponent(item)"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="item"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-menu>
          </div>
        </v-app-bar>

        <v-data-table
          :headers="tableHeaders"
          :items="tableData"
          dense
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.TotalPnl="{ item }">
            <v-chip :color="getColor(item.TotalPnl)" dark small>
              {{ item.TotalPnl }}
            </v-chip>
          </template>
          <template v-slot:item.SpotShift="{ item }">
            <div
              v-if="parseFloat(item.SpotShift) > 0"
              class="blue--text text--darken-4"
            >
              {{ item.SpotShift }}
            </div>
            <div v-else class="red--text text--darken-3">
              {{ item.SpotShift }}
            </div>
          </template>
          <template v-slot:item.SDeltaTotalChange="{ item }">
            <div
              v-if="parseFloat(item.SDeltaTotalChange) > 0"
              class="blue--text text--darken-4"
            >
              {{ item.SDeltaTotalChange }}
            </div>
            <div v-else class="red--text text--darken-3">
              {{ item.SDeltaTotalChange }}
            </div>
          </template>
          <template v-slot:item.SDeltaStepChange="{ item }">
            <div
              v-if="parseFloat(item.SDeltaStepChange) > 0"
              class="blue--text text--darken-4"
            >
              {{ item.SDeltaStepChange }}
            </div>
            <div v-else class="red--text text--darken-3">
              {{ item.SDeltaStepChange }}
            </div>
          </template>
          <template v-slot:item.SVega="{ item }">
            <div
              v-if="parseFloat(item.SVega) > 0"
              class="blue--text text--darken-4"
            >
              {{ item.SVega }}
            </div>
            <div v-else class="red--text text--darken-3">
              {{ item.SVega }}
            </div>
          </template>
          <template v-slot:item.PremiumChange="{ item }">
            <div
              v-if="parseFloat(item.PremiumChange) > 0"
              class="blue--text text--darken-4"
            >
              {{ item.PremiumChange }}
            </div>
            <div v-else class="red--text text--darken-3">
              {{ item.PremiumChange }}
            </div>
          </template>
          <template v-slot:item.DeltaPnl="{ item }">
            <div
              v-if="parseFloat(item.DeltaPnl) > 0"
              class="blue--text text--darken-4"
            >
              {{ item.DeltaPnl }}
            </div>
            <div v-else class="red--text text--darken-3">
              {{ item.DeltaPnl }}
            </div>
          </template>
        </v-data-table>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogToggle = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import PricerApi from "@/apis/PricerApi";

export default {
  data() {
    return {
      sim: [],
      headers: [],
      componentSelectionTitle: "",
      componentSelectionData: [],
      timeAdjustedInputData: {},
      timeAdjustedString: "",
      menu: false,
      window: {
        width: 0,
        height: 0,
      },
    };
  },

  props: {
    inputData: { type: Object },
    vmodel: { type: Boolean },
  },
  computed: {
    dialogToggle: {
      get() {
        return this.vmodel;
      },
      set(val) {
        this.$emit("setvmodel", val);
      },
    },
    isMultipleOptions() {
      return this.componentData.length > 1 ? true : false;
    },
    serverData() {
      return Object.keys(this.timeAdjustedInputData).length === 0
        ? this.inputData
        : this.timeAdjustedInputData;
    },
    componentData() {
      return JSON.parse(this.serverData.components);
    },
    aggregateData() {
      return JSON.parse(this.serverData.aggregate);
    },
    tableData() {
      if (this.componentSelectionTitle !== "") {
        return this.componentSelectionData;
      }
      if (this.isMultipleOptions) {
        return this.aggregateData;
      }

      return this.componentData[0].Value;
    },
    componentKeys() {
      return this.componentData.map(
        (item) =>
          `Expiry: ${item.Key.ExpiryText.toUpperCase()} Strike: ${item.Key.StrikeText.toUpperCase()} ${this.convertCallPut(
            item.Key.Call_Put
          )} Notional: ${item.Key.Notional} mio`
      );
    },
    tableHeaders() {
      let tableHeaders = [];
      const keys = Object.keys(this.aggregateData[0]);

      for (const key of keys) {
        tableHeaders.push({ text: key, value: key, align: "left" });
      }
      if (this.isMultipleOptions) {
        tableHeaders = tableHeaders.filter((item) => item.value !== "Vol");
      }
      return tableHeaders;
    },
    title() {
      if (this.componentData.length === 1) {
        const key = this.componentData[0].Key;
        return `Expiry: ${key.ExpiryText.toUpperCase()} Strike: ${key.StrikeText.toUpperCase()} ${this.convertCallPut(
          key.Call_Put
        )} Notional: ${key.Notional} mio`;
      }
      if (this.componentSelectionTitle !== "") {
        return this.componentSelectionTitle;
      }
      return `AGGREGATE POSITION ${this.timeAdjustedString}`;
    },
  },

  methods: {
    getColor(val) {
      if (parseFloat(val) < 0) return "red";
      else return "blue";
    },
    convertCallPut(int) {
      return int === -1 ? "PUT" : "CALL";
    },
    changeComponent(val) {
      this.componentSelectionTitle = val;
      const index = this.componentKeys.indexOf(val);
      this.componentSelectionData = this.componentData.map(
        (item) => item.Value
      )[index];
    },
    refreshAggregate() {
      this.componentSelectionTitle = "";
      this.timeAdjustedInputData = {};
      this.timeAdjustedString = "";
    },
    async sendSimulationToServer(pctAdj) {
      try {
        let optsToServer = JSON.parse(this.inputData.components).map(
          (opt) => opt.Key
        );
        optsToServer.forEach((object) => {
          for (const [key, value] of Object.entries(object)) {
            object[key] = value.toString();
          }
        });

        optsToServer[0].TimeAdjustPercentage = pctAdj.toString();
        optsToServer[0].UserName = this.$store.state.currentUser;
        let response = await PricerApi.simulateOptionsTimeAdusted(optsToServer);
        this.timeAdjustedInputData = response.data;
        this.timeAdjustedString = `(Time To Expiry: ${pctAdj * 100}%)`;
      } catch (err) {
        this.$store.dispatch("setSnackbar", {
          text: `${err}  source:sendSimulationToServer`,
          top: true,
        });
      }
    },
    dev() {
      if (this.componentData.length === 1) {
        const key = this.componentData[0].Key;
        `Expiry: ${key.ExpiryText.toUpperCase()} Strike: ${key.StrikeText.toUpperCase()} ${this.convertCallPut(
          key.Call_Put
        )} Notional: ${key.Notional} mio`;
      }
    },
  },
};
</script>

<style></style>
