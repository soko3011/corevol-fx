<template>
  <div>
    <v-dialog v-model="dialog" max-width="800px">
      <draggable
        :v-model="keyGroupTitle"
        group="people"
        @start="drag = true"
        @end="drag = false"
      >
        <v-card
          v-for="element in keyGroupTitle"
          :key="element.name"
          max-height="75"
          elevation="21"
        >
          <v-card-text class="d-flex flex-nowrap align-start justify-start">
            <v-switch
              class="ml-3"
              color="green"
              inset
              :label="element.name"
              v-model="element.show"
            ></v-switch>
            <v-spacer />
            <v-btn class="mr-3" @click="pickTextColor">Text Color</v-btn>

            <v-btn>Background Color</v-btn>
          </v-card-text>

          <v-card-actions> </v-card-actions>
        </v-card>

        <v-btn color="blue" block @click="save">Save Setup</v-btn>
      </draggable>
    </v-dialog>
    <v-dialog v-model="showColor">
      <swatches v-model="color" />
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
      showColor: false
    };
  },
  computed: {
    keyGroupTitle() {
      var newArray = [];
      for (const key of Object.keys(this.keyGroups)) {
        newArray.push({ name: key, show: true, color: "#1CA085" });
      }

      return newArray;
    }
  },
  methods: {
    set(val) {
      alert(val);
    },
    pickTextColor() {
      this.showColor = true;
    },
    save() {
      console.log(this.keyGroupTitle);
    }
  }
};
</script>

<style></style>
