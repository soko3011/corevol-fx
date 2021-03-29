<template>
  <div>
    <v-container class="center">
      <v-progress-linear v-if="!dataLoaded" indeterminate></v-progress-linear>
    </v-container>
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div class="d-flex flex-row mb-5 flex-nowrap ">
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
            {{ activecross }}

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
      <v-card flat class="d-flex flex-column mr-3 " min-width="225">
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

      <div class="analyticsContainer">
        <transition name="slide">
          <DescriptiveVolData
            v-if="settingSelection === 'Descriptive Data'"
            :cross="activecross"
            :key="componentKey"
            @alertLoaded="setLoaded"
          />
          <VolConesMain
            v-if="settingSelection === 'Vol Cones'"
            :cross="activecross"
            :key="componentKey"
            @alertLoaded="setLoaded"
          />
          <HistogramsMain
            v-if="settingSelection === 'Histograms'"
            :cross="activecross"
            :key="componentKey"
            @alertLoaded="setLoaded"
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
import { mapState } from "vuex";

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
      componentKey: 0,
      settingHeaders: ["Descriptive Data", "Vol Cones", "Histograms"],
      settingSelection: "Descriptive Data",
      dataLoaded: false,
      window: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    ...mapState({
      crosses: state => state.crossList
    }),
    activecross() {
      return this.$store.getters.activeCrossGetter;
    }
  },
  methods: {
    dev() {
      console.log(this.$store.getters.activeCrossGetter);
      console.log(this.activecross);
    },
    setLoaded(val) {
      this.dataLoaded = val;
    },
    ChangeSettings(setting) {
      if (setting === this.settingSelection) {
        return;
      }
      this.dataLoaded = false;
      this.settingSelection = setting;
    },
    changeCross(val) {
      this.dataLoaded = false;
      this.$store.dispatch("setActivecross", val);
      this.componentKey += 1;
    },
    handleResize() {
      this.window.width = window.innerWidth - 100;
      this.window.height = window.innerHeight - 195;

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
    }
  }
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);

.center {
  margin: 0;
  width: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.analyticsContainer::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #eceff1;
  border-radius: 10px;
}

.analyticsContainer {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}

.analyticsContainer::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #f5f5f5;
}

.analyticsContainer::-webkit-scrollbar-thumb {
  background-color: #aaa;
  border-radius: 10px;

  background-image: -webkit-linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
</style>
