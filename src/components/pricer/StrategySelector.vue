<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="300">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon>
          <v-icon :large="large" :color="color" v-bind="attrs" v-on="on">
            {{ icon }}
          </v-icon>
        </v-btn>
      </template>

      <v-card class="mx-auto" width="300" rounded>
        <v-toolbar height="40px" color="blue-grey" dark class="mb-3">
          <v-spacer />
          <v-toolbar-title class="ma-4">STRATEGY SELECTOR</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card class="mx-3 pt-1" flat color="grey lighten-2">
          <v-select
            color="green"
            prepend-icon="mdi-dots-hexagon"
            class="mx-7 mt-7"
            dense
            v-model="selection"
            :items="crossList"
            label="Select Cross"
            :full-width="true"
          ></v-select>

          <v-select
            v-if="datesToggle"
            color="green"
            prepend-icon="mdi-dots-hexagon"
            class="mx-7"
            dense
            v-model="terms"
            :items="termsList"
            label="Select Term"
            :full-width="true"
          >
          </v-select>
          <v-menu
            v-else
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            width="100px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                class="mx-7 mt-5"
                v-model="date"
                label="Expiry Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
          </v-menu>
          <v-radio-group v-model="radio" row dense>
            <v-spacer />
            <v-radio label="Term" value="term"></v-radio>
            <v-radio label="Expiry" value="mat"></v-radio>
            <v-spacer />
          </v-radio-group>
        </v-card>
        <v-list>
          <v-list-item-group mandatory color="indigo">
            <v-subheader><v-spacer />STRATEGIES<v-spacer /></v-subheader>
            <v-list-item
              class="text-center"
              dense
              v-for="(item, index) in inputData"
              :key="index"
              @click="emitToParent(item)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
                <v-divider class="mt-2" light></v-divider>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import PricerApi from "@/apis/PricerApi";

export default {
  data: () => ({
    dialog: false,
    selection: "",
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    terms: "",
    termsList: [],
    radio: "term"
  }),
  props: {
    inputData: { type: Array },
    icon: { type: String },
    large: { type: Boolean },
    color: { type: String },
    dialogControl: { type: Boolean }
  },
  created() {
    PricerApi.getGlobalTermsList()
      .then(response => {
        this.termsList = JSON.parse(response.data.termsList);
      })
      .catch(err => {
        alert(err);
      });
  },
  computed: {
    ...mapState({
      crossList: state => state.crossList,
      activecross: state => state.activecross
    }),
    datesToggle() {
      return this.radio === "term" ? true : false;
    },
    datesSelection() {
      return this.radio === "term" ? this.terms : this.date;
    }
  },
  methods: {
    emitToParent(item) {
      this.$emit("selection", {
        cross: this.selection,
        mat: this.datesSelection,
        strat: item
      });
    }
  },
  watch: {
    dialogControl() {
      this.dialog = !this.dialog;
    }
  }
};
</script>

<style>
.v-select__selection {
  width: 100%;
  justify-content: center;
}
</style>
