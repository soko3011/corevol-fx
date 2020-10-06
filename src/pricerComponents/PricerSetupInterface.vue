<template>
  <div>
    <v-card max-height="100" flat>
      <div class="d-flex flex-column">
        <div class="flex d-flex nowrap justify-end">
          <v-menu
            v-model="menu"
            bottom
            origin="center center"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small color="blue" dark v-bind="attrs" v-on="on">
                <v-icon>mdi-chevron-double-down</v-icon>
              </v-btn>
            </template>
            <v-card max-width="800">
              <v-list rounded align="center" justify="center">
                <v-subheader>LAYOUTS</v-subheader>
                <v-list-item-group color="blue darken--3">
                  <v-list-item
                    v-for="item in combinedPricerLayouts"
                    :key="item.title"
                    @click="setLayout(item)"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.title"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-card-actions>
                <PopUpInput
                  :icon="'mdi-expand-all'"
                  :label="'New Layout Name'"
                  :color="'blue darken-3'"
                  :title="'Pricer Layout'"
                  :large="false"
                  v-on:selection="newLayout"
                />

                <PopUpModal
                  :inputData="userPricerLayoutPrefs.map((x) => x.title)"
                  :icon="'mdi-delete'"
                  :color="'blue darken-3'"
                  :large="false"
                  :title="'REMOVE LAYLOUT'"
                  v-on:selection="removeLayout"
                />
              </v-card-actions>
            </v-card>
          </v-menu>
          <div class="mr-1" />
          <v-btn small icon color="blue darken-3" dark @click="toggleSetup">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </div>

        <v-card-actions>
          <v-text-field
            dense
            label="Layout"
            outlined
            :value="activePricerLayoutTitle"
            readonly
            color="red"
          ></v-text-field>
        </v-card-actions>
      </div>
    </v-card>
  </div>
</template>

<script>
import PopUpModal from "@/components/PopUpModal.vue";
import PopUpInput from "@/components/PopUpInput.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      menu: false,
    };
  },
  components: { PopUpModal, PopUpInput },
  computed: {
    ...mapState({
      defaultPricerKeyGroups: (state) => state.defaultPricerKeyGroups,
      userPricerLayoutPrefs: (state) => state.userPricerLayoutPrefs,
      activePricerLayoutTitle: (state) => state.activePricerLayoutTitle,
    }),
    combinedPricerLayouts() {
      const userLayouts = [];
      if (this.userPricerLayoutPrefs !== null) {
        userLayouts.push(...this.userPricerLayoutPrefs);
      }

      for (const [key, value] of Object.entries(this.defaultPricerKeyGroups)) {
        userLayouts.push({ title: key, layout: value });
      }

      return userLayouts;
    },
  },
  methods: {
    toggleSetup() {
      this.$store.dispatch("togglePricerSetupPage");
    },
    newLayout(val) {
      if (
        this.userPricerLayoutPrefs
          .map((x) => x.title)
          .indexOf(val.toUpperCase()) === -1
      ) {
        const newLayout = this.combinedPricerLayouts.find(
          (x) => x.title === "Trader"
        );
        newLayout.title = val.toUpperCase();
        this.userPricerLayoutPrefs.push(newLayout);
        this.$store.dispatch(
          "saveUserPricerLayoutPrefs",
          this.userPricerLayoutPrefs
        );
      } else {
        alert("Pricer already exist: Choose another name");
      }
    },
    removeLayout(val) {
      this.userPricerLayoutPrefs.splice(
        this.userPricerLayoutPrefs.findIndex((item) => item.title === val),
        1
      );

      this.$store.dispatch(
        "saveUserPricerLayoutPrefs",
        this.userPricerLayoutPrefs
      );
    },
    setLayout(item) {
      this.$store.dispatch("setPricerLayoutTitle", item.title);
    },
  },
};
</script>

<style>
</style>