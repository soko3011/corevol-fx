<template>
  <v-container fluid class="overallContainer">
    <div>
      <div class="d-flex flex-row mb-5 flex-nowrap">
        <v-toolbar color="#126496" min-width="300" collapse>
          <v-spacer></v-spacer>
          <div class="d-flex flex-column">
            <h4
              class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
            >
              Corevolfx
              <v-icon small color="green lighten-3" class="mb-4"
                >mdi-cog-outline</v-icon
              >
            </h4>
            <h6
              class="font-weight-light text-center text-uppercase green--text text--lighten-3"
              align="center"
              justify="center"
            >
              settings
            </h6>
          </div>
          <v-spacer></v-spacer>
        </v-toolbar>
      </div>
      <div class="d-flex flex-row flex-nowrap align-start justify-start">
        <v-card
          min-width="225"
          :height="window.height - 100"
          shaped
          class="mr-5"
        >
          <TreeView
            :inputData="{
              list: this.settingHeaders,
              listName: 'Corevolfx Options',
            }"
            v-on:selection="ChangeSettings"
          />
        </v-card>

        <div v-bind:style="zoomLevel" class="divCol">
          <transition name="slide">
            <DviSetup v-if="settingSelection === 'Dvi Settings'" />
          </transition>
          <transition name="slide">
            <CrossSetup v-if="settingSelection === 'Cross Settings'" />
          </transition>
          <transition name="slide">
            <CcySetup v-if="settingSelection === 'Ccy Settings'" />
          </transition>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import DviSetup from "@/components/settings/DviSetup.vue";
import CrossSetup from "@/components/settings/CrossSetup.vue";
import CcySetup from "@/components/settings/CcySetup.vue";
import SettingsApi from "@/apis/SettingsApi";
import PopUpModal from "@/components/common/PopUpModal.vue";
import TreeView from "@/components/common/TreeView.vue";

export default {
  name: "Setup",
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  data: () => ({
    settingHeaders: ["Dvi Settings", "Cross Settings", "Ccy Settings"],
    settingSelection: "Dvi Settings",
    window: {
      width: 0,
      height: 0,
    },
  }),

  components: {
    DviSetup,
    CrossSetup,
    CcySetup,
    PopUpModal,
    TreeView,
  },

  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "90%";
      return {
        zoom: level,
      };
    },
  },

  methods: {
    ChangeSettings(setting) {
      this.settingSelection = setting;
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight - 65;

      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height}px`
      );
    },
  },
};
</script>


<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);

.overallContainer {
  display: flex;
  overflow: scroll;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}

.overallContainer .dviCol {
  display: flex;
  overflow-y: scroll;
}

.slide-enter-active {
  transition: 0.75s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
</style>
