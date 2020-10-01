<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="700">
      <draggable
        :v-model="keyGroupTitle"
        @start="drag = true"
        @end="drag = false"
      >
        <v-card
          v-for="element in keyGroupTitle"
          :key="element.name"
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
                :label="element.name"
                v-model="element.show"
              ></v-switch>
            </v-col>

            <v-col cols="12" sm="2" align="center" justify="center">
              <div class="font-weight-light caption">
                Text
              </div>

              <swatches
                v-model="element.textColor"
                row-length="6"
                show-border
                popover-x="right"
                show-fallback
                fallback-input-type="color"
                @input="selectTextColor(element)"
              ></swatches>
            </v-col>
            <v-col cols="12" sm="2" align="center" justify="center">
              <div class="font-weight-light caption">
                Background
              </div>
              <swatches
                v-model="element.backgroundColor"
                :swatches="swatchesLight"
                row-length="6"
                show-border
                popover-x="left"
                show-fallback
                fallback-input-type="color"
              ></swatches>
            </v-col>
            <v-col cols="12" sm="3" align="center" justify="center">
              <v-text-field
                class="mt-3"
                outlined
                :background-color="element.backgroundColor"
                :color="element.textColor"
                dense
                readonly
              >
                <v-icon slot="prepend-inner" :color="element.textColor"
                  >mdi-alphabetical</v-icon
                >
              </v-text-field>
            </v-col>
          </v-row>

          <v-card-actions> </v-card-actions>
        </v-card>

        <v-btn color="blue lighten-3" block @click="saveLayout"
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
import keyGroupsJson from "./KeyGroups.json";
import Swatches from "vue-swatches";

export default {
  components: {
    draggable,
    Swatches
  },
  props: {
    dialog: { type: Boolean, default: false }
  },
  data() {
    return {
      keyGroups: keyGroupsJson,

      swatchesText: [
        ["#F64272", "#F6648B", "#F493A7", "#F891A6", "#FFCCD5"],
        ["#8b5aff", "#a27bff", "#b99cff", "#d0bdff", "#e8deff"],
        ["#51e5db", "#74ebe3", "#96f0ea", "#b9f5f1", "#dcfaf8"],
        ["#ffa51a", "#ffb748", "#ffc976", "#ffdba3", "#ffedd1"]
      ],
      swatchesLight: [
        ["#F64272", "#F6648B", "#F493A7", "#F891A6", "#FFCCD5"],
        ["#8b5aff", "#a27bff", "#b99cff", "#d0bdff", "#e8deff"],
        ["#51e5db", "#74ebe3", "#96f0ea", "#b9f5f1", "#dcfaf8"],
        ["#ffa51a", "#ffb748", "#ffc976", "#ffdba3", "#ffedd1"]
      ],
      keyGroupTitle: [],
      textColor1: "yellow"
    };
  },
  created() {
    var newArray = [];
    for (const key of Object.keys(this.keyGroups)) {
      newArray.push({
        name: key,
        show: true,
        textColor: "#1CA085",
        backgroundColor: "#ffedd1"
      });
    }

    this.keyGroupTitle = newArray;
  },

  methods: {
    // selectTextColor(element) {
    //   var xx = this.keyGroupTitle.find(x => x.name === element.name);
    //   console.log(xx);
    //   console.log(element);
    // },
    pickTextColor() {
      this.showColor = true;
    },
    saveLayout() {
      console.log(this.keyGroupTitle);
      this.$store.dispatch("setSnackbar", {
        text: "Layout Saved",
        centered: true
      });
      this.close();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    }
  }
};
</script>

<style></style>
