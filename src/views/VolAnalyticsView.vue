<template>
  <div>
    <div class="d-flex flex-row mb-5 flex-nowrap">
      <v-toolbar color="#385F73" min-width="400" collapse>
        <v-spacer></v-spacer>
        <div class="d-flex flex-column">
          <h4
            class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
          >
            corevolFX VolAnalytics
          </h4>
          <h4
            class="font-weight-light text-center text-uppercase green--text text--lighten-3"
            align="center"
            justify="center"
          >
            {{ cross }}

            <v-btn icon x-small class="mb-4" elevation="21">
              <PopUpModal
                :inputData="crosses"
                :icon="'mdi-dots-hexagon'"
                :color="'green lighten-3'"
                :small="true"
                :title="'Select Cross'"
                v-on:selection="changeCross"
              />
            </v-btn>
          </h4>
        </div>

        <v-spacer></v-spacer>
      </v-toolbar>
    </div>
    <div class="d-flex flex-row">
      <v-card
        flat
        class="d-flex flex-column mr-3 settingsContainer"
        min-width="225"
      >
        <v-list dense>
          <v-subheader>Analytics</v-subheader>
          <v-list-item
            @click="ChangeSettings(item)"
            v-for="item in this.settingHeaders"
            :key="item"
            ripple
          >
            <v-list-item-action>
              <v-icon color="green darken-3">mdi-dots-hexagon</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <div class="settingsContainer">
        <transition name="slide">
          <DescriptiveVolData
            v-if="settingSelection === 'Descriptive Data'"
            :cross="cross"
            :key="componentKey"
          />
          <VolConesMain
            v-if="settingSelection === 'Vol Cones'"
            :cross="cross"
            :key="componentKey"
          />
          <HistogramsMain
            v-if="settingSelection === 'Histograms'"
            :cross="cross"
            :key="componentKey"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import DescriptiveVolData from "@/components/VolAnalytics/DescriptiveVolData/DescriptiveVolDataMain.vue";
import VolConesMain from "@/components/VolAnalytics/VolCones/VolConesMain.vue";
import HistogramsMain from "@/components/VolAnalytics/Histograms/HistogramsMain.vue";
import PopUpModal from "@/components/common/PopUpModal.vue";

export default {
  name: "VolAnalytics",
  components: {
    DescriptiveVolData,
    VolConesMain,
    HistogramsMain,
    PopUpModal
  },
  created() {
    this.$store.dispatch("refreshCrossList");
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  data() {
    return {
      cross: "USDCAD",
      componentKey: 0,
      settingHeaders: ["Descriptive Data", "Vol Cones", "Histograms"],
      settingSelection: "Descriptive Data",
      window: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    crosses() {
      return this.$store.state.crossList;
    }
  },
  methods: {
    ChangeSettings(setting) {
      this.settingSelection = setting;
    },
    changeCross(val) {
      this.cross = val;
    },
    handleResize() {
      this.window.width = window.innerWidth - 100;
      this.window.height = window.innerHeight - 95;

      this.setContainerDimensions();
    },
    setContainerDimensions() {
      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height}px`
      );
      document.documentElement.style.setProperty(
        "--dwCol-height",
        `${this.window.height - 70}px`
      );
    }
  },
  watch: {
    cross() {
      this.componentKey += 1;
    }
  }
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);

.settingsContainer {
  overflow-x: auto;
  overflow-y: auto;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  display: flex;
}

.settingsContainer::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 10px;
}

.settingsContainer::-webkit-scrollbar {
  width: 6px;
  height: 0px;
  background-color: #f5f5f5;
}

.settingsContainer::-webkit-scrollbar-thumb {
  background-color: #3366ff;
  border-radius: 10px;
  background-image: -webkit-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.5) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.5) 75%,
    transparent 75%,
    transparent
  );
}
</style>
