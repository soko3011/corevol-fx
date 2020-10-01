<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="800px">
      <draggable
        :v-model="keyGroupTitle"
        group="people"
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
                class="ml-3"
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
                :colors="colors"
                @input="selectTextColor(element)"
              ></swatches>
            </v-col>
            <v-col cols="12" sm="2" align="center" justify="center">
              <div class="font-weight-light caption">
                Background
              </div>
              <swatches
                v-model="element.backgroundColor"
                colors="material-light"
                row-length="5"
                popover-to="left"
              ></swatches>
            </v-col>
            <v-col cols="12" sm="4"> </v-col>
          </v-row>

          <v-card-actions> </v-card-actions>
        </v-card>

        <v-btn color="blue" block @click="saveLayout">Save Layout</v-btn>
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
  data() {
    return {
      keyGroups: keyGroupsJson,
      dialog: true,
      colors: [
        ["#F64272", "#F6648B", "#F493A7", "#F891A6", "#FFCCD5"],
        ["#8b5aff", "#a27bff", "#b99cff", "#d0bdff", "#e8deff"],
        ["#51e5db", "#74ebe3", "#96f0ea", "#b9f5f1", "#dcfaf8"],
        ["#ffa51a", "#ffb748", "#ffc976", "#ffdba3", "#ffedd1"]
      ],
      keyGroupTitle: []
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
    selectTextColor(color) {
      console.log(color);
    },
    pickTextColor() {
      this.showColor = true;
    },
    saveLayout() {
      console.log(this.keyGroupTitle);
    },
    close() {
      this.showColor = false;
      this.$nextTick(() => {});
    }
  }
};
</script>

<style>
.vue-swatches__check__wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}
.vue-swatches__check__circle {
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.15);
}
.vue-swatches__check__path {
  fill: #fff;
}
.vue-swatches__swatch {
  position: relative;
  display: inline-block;
  font-size: 0;
}
.vue-swatches__swatch:focus,
.vue-swatches__swatch:hover {
  opacity: 0.9;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.75);
  outline: none;
}
.vue-swatches__swatch.vue-swatches__swatch--border,
.vue-swatches__swatch.vue-swatches__swatch--selected {
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.75);
}
.vue-swatches__swatch__label {
  position: absolute;
  left: 0;
  right: 0;
  color: #666;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
}
.vue-swatches__swatch .vue-swatches__diagonal__wrapper {
  position: absolute;
}
fieldset[disabled] .vue-swatches {
  pointer-events: none;
}
.vue-swatches {
  position: relative;
  display: inline-block;
  outline: none;
}
.vue-swatches__trigger__wrapper {
  display: inline-block;
  cursor: pointer;
}
.vue-swatches__trigger.vue-swatches--is-empty {
  border: 2px solid #ccc;
}
.vue-swatches__trigger.vue-swatches--is-disabled {
  cursor: not-allowed;
}
.vue-swatches__container {
  box-sizing: content-box;
}
.vue-swatches__container.vue-swatches--inline {
  font-size: 0;
}
.vue-swatches__container:not(.vue-swatches--inline) {
  position: absolute;
  display: block;
  overflow: auto;
  border-radius: 5px;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.2), 0 0 0 1px rgba(10, 10, 10, 0.2);
  z-index: 50;
}
.vue-swatches__wrapper {
  background-color: inherit;
  box-sizing: content-box;
}
.vue-swatches__row {
  font-size: 0;
}
.vue-swatches__fallback__wrapper {
  display: table;
}
.vue-swatches__fallback__input--wrapper {
  display: table-cell;
  padding-right: 10px;
  width: 100%;
  font-size: 14px;
}
.vue-swatches__fallback__input {
  width: 100%;
  padding-top: 6px;
  padding-bottom: 6px;
  border-radius: 5px;
  border: 1px solid #dcdcdc;
  color: #35495e;
  background: #fff;
}
.vue-swatches__fallback__button {
  display: table-cell;
  padding: 6px 15px;
  border: 0;
  cursor: pointer;
  font-weight: 700;
  color: #fff;
  background-color: #3571c8;
  border-radius: 5px;
}
.vue-swatches-show-hide-enter-active,
.vue-swatches-show-hide-leave-active {
  transition: all 0.3s ease;
}
.vue-swatches-show-hide-enter,
.vue-swatches-show-hide-leave-active {
  opacity: 0;
}
.vue-swatches--has-children-centered {
  display: flex;
  align-items: center;
  justify-content: center;
}
.vue-swatches__diagonal__wrapper {
  width: 100%;
  height: 100%;
}
.vue-swatches__diagonal {
  width: 75%;
  height: 75%;
  background: linear-gradient(
    to top right,
    transparent 0,
    transparent calc(50% - 2.4px),
    #de080a 50%,
    transparent calc(50% + 2.4px),
    transparent
  );
}
</style>
