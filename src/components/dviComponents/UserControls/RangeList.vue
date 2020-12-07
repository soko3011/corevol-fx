<template>
  <v-card flat color="#385F73" class="mx-auto userRange">
    <v-card-title class="subtitle-1 green--text text--lighten-3">
      <v-spacer />ACTIVE RANGES
      <v-btn icon>
        <v-icon small color="blue lighten-3">mdi-dots-hexagon</v-icon></v-btn
      >
      <v-spacer
    /></v-card-title>
    <v-list color="#385F73" rounded>
      <v-list-item-group color="blue lighten-3">
        <v-list-item
          dark
          class="text-center"
          dense
          v-for="(item, index) in this.apidata"
          :key="index"
          @click="emitToParent(item)"
        >
          <v-list-item-content>
            <v-list-item-title
              >Range Name:
              <strong class="green--text text--lighten-3">{{
                item.RangeName
              }}</strong>
            </v-list-item-title>
            <v-divider class="mt-2" light></v-divider>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import validations from "@/utils/validations";
import PricerApi from "@/apis/PricerApi";

export default {
  name: "rangeList",
  async created() {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      apidata: (state) => state.dvi.userWgtRanges,
    }),
  },
  methods: {
    emitToParent(item) {
      this.$emit("emitToParent", item);
    },
    refreshFromApi() {},
  },
  watch: {
    apidata() {
      this.refreshFromApi();
    },
  },
};
</script>

<style>
</style>
