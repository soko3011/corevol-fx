<template>
  <v-card>
    <v-tabs
      v-model="active_tab"
      grow
      dark
      background-color="red lighten-2"
      show-arrows
    >
      <v-tab><CcyPairModal v-on:ccyPairSelection="emitToParentModal"/></v-tab>

      <v-tab
        v-for="(item, index) in propData.inputList"
        :key="index"
        @click="emitToParentTabSelection(item)"
      >
        {{ item }}
      </v-tab>
      <v-tab>
        <v-icon @click="emitToParentDeleteTab()"
          >mdi-minus-circle-outline</v-icon
        ></v-tab
      >
    </v-tabs>
  </v-card>
</template>

<script>
import CcyPairModal from "@/components/CcyPairModal.vue";
export default {
  name: "Tabs",
  data() {
    return {
      active_tab: "0"
    };
  },
  components: {
    CcyPairModal
  },
  props: {
    propData: { type: Object }
  },

  methods: {
    emitToParentTabSelection(value) {
      this.$emit("tabSelection", value);
    },
    emitToParentModal(value) {
      this.$emit("modalSelection", value);
    },
    emitToParentDeleteTab() {
      this.$emit("deleteTab", "DeleteBtnPressed");
    }
  },
  watch: {
    propData() {
      this.active_tab =
        this.propData.inputList.indexOf(this.propData.ccyPair) + 2;
    }
  }
};
</script>

<style></style>
