<template>
  <div class="d-flex flex-column">
    <div>
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
    <div
      class="d-flex flex-nowrap align-start justify-start"
      v-bind:style="zoomLevel"
    >
      <v-card
        min-width="225"
        :height="mainWindowHeight"
        shaped
        class="mr-3 mt-8"
        v-bind:style="zoomLevel"
      >
        <TreeView
          :inputData="{
            list: this.settingHeaders,
            listName: 'Corevolfx Options'
          }"
          v-on:selection="ChangeSettings"
        />
      </v-card>

      <v-container :style="containerStyle">
        <div v-bind:style="zoomLevel" class="mt-5">
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
      </v-container>
    </div>
  </div>
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
  data: () => ({
    settingHeaders: ["Dvi Settings", "Cross Settings", "Ccy Settings"],
    settingSelection: "Dvi Settings"
  }),

  components: {
    DviSetup,
    CrossSetup,
    CcySetup,
    PopUpModal,
    TreeView
  },

  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "100%";
      return {
        zoom: level
      };
    },
    mainWindowHeight() {
      return window.innerHeight - 250;
    },
    mainWindowWidth() {
      return window.innerWidth - 10;
    },
    containerStyle() {
      return ` display: flex;
            overflow-x: scroll;
            padding-left: 0px;
            padding-right: 0px;
            width: ${this.mainWindowWidth}px;
            height: ${this.mainWindowHeight}px;`;
    }
  },

  methods: {
    ChangeSettings(setting) {
      this.settingSelection = setting;
    }
  }
};
</script>

<style>
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
