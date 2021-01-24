<template>
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
              >mdi-dots-hexagon</v-icon
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
    <div class="d-flex flex-row">
      <v-card
        flat
        class="d-flex flex-column mr-3 settingsContainer"
        min-width="225"
      >
        <v-list dense>
          <v-subheader>COREVOLFX OPTIONS</v-subheader>
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

      <div>
        <transition name="slide">
          <DviSetup
            v-if="settingSelection === 'Dvi Settings'"
            class="settingsContainer"
          />
        </transition>
        <transition name="slide">
          <CrossSetup
            v-if="settingSelection === 'Cross Settings'"
            class="settingsContainer"
          />
        </transition>
        <transition name="slide">
          <CcySetup
            v-if="settingSelection === 'Ccy Settings'"
            class="settingsContainer"
          />
        </transition>
        <transition name="slide">
          <ExpiryCutSettings
            v-if="settingSelection === 'Expiry Cut Settings'"
          />
        </transition>
        <transition name="slide">
          <UserSettings v-if="settingSelection === 'User Settings'" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import DviSetup from "@/components/settings/DviSetup.vue";
import CrossSetup from "@/components/settings/CrossSetup.vue";
import CcySetup from "@/components/settings/CcySetup.vue";
import ExpiryCutSettings from "@/components/settings/ExpiryCutSettings.vue";
import UserSettings from "@/components/settings/UserSettings.vue";
import SettingsApi from "@/apis/SettingsApi";
import PopUpModal from "@/components/common/PopUpModal.vue";

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
    settingHeaders: [
      "Dvi Settings",
      "Cross Settings",
      "Ccy Settings",
      "Expiry Cut Settings",
      "User Settings",
    ],
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
    UserSettings,
    ExpiryCutSettings,
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

      document.documentElement.style.setProperty(
        "--dviCol-height",
        `${this.window.height - 90}px`
      );
    },
  },
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);
$dviColHeight: var(--dviCol-height);

.settingsContainer {
  overflow-x: auto;
  overflow-y: auto;
  padding-left: 0px;
  padding-right: 0px;
  height: $dviColHeight;
  display: flex;
}

.settingsContainer::-webkit-scrollbar {
  width: 6px; /* width of the entire scrollbar */
  height: 6px;
}

.settingsContainer::-webkit-scrollbar-track {
  background: #eceff1; /* color of the tracking area */
}

.settingsContainer::-webkit-scrollbar-thumb {
  background-color: #385f73; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 2px solid #eceff1; /* creates padding around scroll thumb */
}

.dviCol {
  display: flex;
  overflow-y: auto;
  height: $dviColHeight;
}
</style>
