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

      <v-card class="mx-auto" max-width="300">
        <v-toolbar height="40px" color="blue-grey" dark>
          <v-spacer />
          <v-toolbar-title class="ma-4">STRATEGY SELECTOR</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-select
          prepend-icon="mdi-dots-hexagon"
          class="mx-7 mt-7"
          dense
          v-model="selection"
          :items="crossList"
          label="Select Cross"
        ></v-select>

        <v-menu
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
              class="mx-7 mt-7"
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
export default {
  data: () => ({
    dialog: false,
    selection: "",
    date: new Date().toISOString().substr(0, 10),
    menu: false
  }),
  props: {
    inputData: { type: Array },
    icon: { type: String },
    large: { type: Boolean },
    color: { type: String }
  },
  created() {
    if (this.selectList !== undefined) {
      this.selection = this.selectList[0];
    }
  },
  computed: {
    ...mapState({
      crossList: state => state.crossList,
      activecross: state => state.activecross
    })
  },
  methods: {
    emitToParent(item) {
      if (this.selection !== "") {
        this.$emit("selection", { dropdown: this.selection, mainlist: item });
      } else {
        this.$emit("selection", item);
        this.dialog = false;
      }
    }
  }
};
</script>

<style>
/* .v-select__selection {
  width: 100%;
  justify-content: center;
} */
</style>
