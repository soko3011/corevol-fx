<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="200">
      <draggable :list="keyGroups" @start="drag = true" @end="drag = false">
        <v-card
          v-for="(item, index) in keyGroups"
          :key="index"
          dense
          elevation="21"
        >
          <v-switch color="green" inset :label="item"></v-switch>
        </v-card>

        <v-btn class="mt-3" color="blue lighten-3" block @click="saveLayout"
          >Save Layout</v-btn
        >
        <v-btn class="mt-3 mb-3" color="red lighten-3" block @click="close"
          >Cancel</v-btn
        >
      </draggable>
    </v-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Swatches from "vue-swatches";

export default {
  components: {
    draggable,
    Swatches,
  },
  props: {
    show: { type: Boolean, default: false },
    activeList: { type: Array },
  },
  created() {},

  data() {
    return {
      drag: false,
      keyGroups: [],
      dialog: false,
    };
  },

  methods: {
    async saveLayout() {
      //await this.$store.dispatch("savePricerSetup", this.keyGroups);
      this.$emit("dashBoardLayoutChanged", this.keyGroups);
      this.close();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {});
      this.$emit("dialogState", this.dialog);
    },
  },
  watch: {
    show() {
      this.dialog = this.show;
      this.keyGroups = this.activeList;
      console.log(this.keyGroups);
    },
  },
};
</script>

