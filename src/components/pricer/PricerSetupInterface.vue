<template>
  <div>
    <v-list dense>
      <v-subheader>PRICER LAYOUT</v-subheader>

      <v-list-item @click="toggleSetup">
        <v-list-item-action>
          <v-icon>mdi-cog-outline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>LAYOUT SETTINGS</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-action>
          <v-menu
            v-model="menu"
            bottom
            origin="center center"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="blue darken-2"
                dark
                v-bind="attrs"
                v-on="on"
              >
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
                  :title="'corevolFX Pricer Layout'"
                  :large="false"
                  v-on:selection="newLayout"
                />

                <PopUpModal
                  :inputData="userPricerList"
                  :icon="'mdi-delete'"
                  :color="'blue darken-3'"
                  :large="false"
                  :title="'REMOVE LAYLOUT'"
                  v-on:selection="removeLayout"
                />
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>CHANGE LAYOUT</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-action>
          <v-icon color="green darken-3"
            >mdi-arrow-right-thin-circle-outline</v-icon
          >
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text-decoration-underline">{{
            activePricerLayoutTitle
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import PopUpModal from "@/components/common/PopUpModal.vue";
import PopUpInput from "@/components/common/PopUpInput.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      menu: false,
    };
  },
  created() {},
  components: { PopUpModal, PopUpInput },
  computed: {
    ...mapState({
      defaultPricerKeyGroups: (state) => state.defaultPricerKeyGroups,
      userPricerLayoutPrefs: (state) => state.userPricerLayoutPrefs,
      activePricerLayoutTitle: (state) => state.activePricerLayoutTitle,
    }),
    combinedPricerLayouts() {
      const userLayouts = [];
      if (this.userPricerLayoutPrefs.length > 0) {
        userLayouts.push(...this.userPricerLayoutPrefs);
      }

      for (const [key, value] of Object.entries(this.defaultPricerKeyGroups)) {
        userLayouts.push({ title: key, layout: value });
      }

      return userLayouts;
    },
    userPricerList() {
      if (this.userPricerLayoutPrefs.length > 0) {
        return this.userPricerLayoutPrefs.map((x) => x.title);
      } else {
        return [];
      }
    },
  },
  methods: {
    toggleSetup() {
      this.$store.dispatch("togglePricerSetupPage");
    },
    newLayout(val) {
      if (this.userPricerLayoutPrefs.length > 0) {
        const checkForDupes = this.userPricerLayoutPrefs
          .map((x) => x.title)
          .indexOf(val.toUpperCase());

        if (checkForDupes !== -1) {
          this.$store.dispatch("setSnackbar", {
            text: "Pricer already exist: Choose another name",
            top: true,
          });

          return;
        }
      }

      const newLayout = this.combinedPricerLayouts.find(
        (x) => x.title === "Trader"
      );
      newLayout.title = val.toUpperCase();
      this.userPricerLayoutPrefs.push(newLayout);
      this.$store.dispatch(
        "saveUserPricerLayoutPrefs",
        this.userPricerLayoutPrefs
      );
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

<style></style>
