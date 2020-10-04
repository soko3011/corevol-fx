<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="700">
      <draggable :list="keyGroups" @start="drag = true" @end="drag = false">
        <v-card
          v-for="element in keyGroups"
          :key="element.position"
          max-height="80"
          elevation="21"
          class="mb-1"
        >
          <v-row>
            <v-col cols="12" sm="4">
              <v-switch
                class="ml-10"
                color="green"
                inset
                :label="element.Name"
                v-model="element.Show"
                :disabled="element.Required"
              ></v-switch>
            </v-col>

            <v-col cols="12" sm="2" align="center" justify="center">
              <div class="font-weight-light caption">Text</div>

              <swatches
                v-model="element.TextColor"
                :swatches="swatchesHex"
                row-length="6"
                show-border
                popover-x="right"
                popover-y="down"
                show-fallback
                fallback-input-type="color"
              ></swatches>
            </v-col>
            <v-col cols="12" sm="2" align="center" justify="center">
              <div class="font-weight-light caption">Background</div>
              <swatches
                v-model="element.BackgroundColor"
                :swatches="swatchesHex"
                row-length="6"
                show-border
                popover-x="left"
                popover-y="down"
                show-fallback
                fallback-input-type="color"
              ></swatches>
            </v-col>
            <v-col cols="12" sm="3" align="center" justify="center">
              <v-text-field
                class="mt-3"
                outlined
                :background-color="element.BackgroundColor"
                :color="element.TextColor"
                dense
                readonly
              >
                <v-icon slot="prepend-inner" :color="element.TextColor"
                  >mdi-alphabetical</v-icon
                >
              </v-text-field>
            </v-col>
          </v-row>

          <v-card-actions> </v-card-actions>
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
    showPricer: { type: Boolean, default: false },
    activekeyGroups: { type: Array },
  },

  data() {
    return {
      drag: false,
      keyGroups: [],
      dialog: false,
      swatchesHex: [
        ["#dcedff", "#94b0da", "#8f91a2", "#505a5b", "#343f3e"],
        ["#DAD7CD", "#A3B18A", "#588157", "#3A5A40", "#344E41"],
        ["#0d1f2d", "#546a7b", "#9ea3b0", "#fae1df", "#e4c3ad"],
        ["#0a2e36", "#27fb6b", "#14cc60", "#036d19", "#09a129"],
        ["#e8ebe4", "#d2d5dd", "#b8bacf", "#999ac6", "#798071"],
        ["#fefeff", "#d6efff", "#fed18c", "#fed99b", "#fe654f"],
        ["#d1d7ff", "#d2e3ff", "#d2f1ff", "#d7f4ff", "#ecf7ff"],
        ["#d7fff1", "#aafcb8", "#8cd790", "#77af9c", "#285943"],
      ],
    };
  },

  methods: {
    saveLayout() {
      //this.$store.dispatch("setPricerLayout", this.keyGroups);
      this.$emit("pricerLayoutChanged", this.keyGroups);
      this.$store.dispatch("savePricerSetup", this.keyGroups);

      // this.$store.dispatch("setSnackbar", {
      //   text: "Layout Saved",
      //   centered: true
      // });
      this.close();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {});
      this.$emit("dialogState", this.dialog);
    },
  },
  watch: {
    showPricer() {
      this.dialog = this.showPricer;
      this.keyGroups = this.activekeyGroups;
      console.log(this.keyGroups);
    },
  },
};
</script>

<style></style>
