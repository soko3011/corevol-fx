<template>
  <div v-if="show">
    <v-navigation-drawer class="mt-3" clipped absolute right width="450">
      <v-card max-width="450" class="mx-auto" flat>
        <v-system-bar color="#126496" dark>
          <v-icon @click="toggleRightNav">mdi-chevron-right</v-icon>
          <v-spacer></v-spacer>
        </v-system-bar>

        <v-container>
          <v-row dense>
            <v-col cols="12">
              <FwdVol />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FwdVol from "@/components/dviComponents/FwdVols/FwdVol.vue";
export default {
  data: () => ({}),
  components: {
    FwdVol,
  },
  computed: {
    ...mapState({
      show: (state) => state.rightSideNav,
    }),
    fwdVolResult() {
      return `${this.fwdVolInputs.fwdD} day vol in ${this.fwdVolInputs.cal1} days time is ${this.fwdVolInputs.fwdV}`;
    },
  },
  methods: {
    toggleRightNav() {
      this.$store.dispatch("toggleRightNav");
    },
  },
};
</script>
