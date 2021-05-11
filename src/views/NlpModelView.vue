<template>
  <div>
    <v-container class="center">
      <v-progress-linear v-if="!dataLoaded" indeterminate></v-progress-linear>
    </v-container>
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div class="d-flex flex-row mb-5 flex-nowrap">
      <v-toolbar color="#385F73" min-width="400" collapse>
        <v-spacer></v-spacer>
        <div class="d-flex flex-column">
          <h4
            class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
          >
            corevolFX Broker Prices NLP
          </h4>
          <h4
            class="font-weight-light text-center text-uppercase green--text text--lighten-3"
            align="center"
            justify="center"
          >
            {{ activecross }}

            <v-btn icon x-small class="mb-4" elevation="21">
              <PopUpModal
                :inputData="this.$store.state.crossList"
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
      <v-card flat class="d-flex flex-column mr-3" min-width="225">
        <v-list dense>
          <v-subheader>Filters</v-subheader>
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

      <div class="analyticContainer">
        <transition name="slide">
          <div>
            <BrokerChatNlp
              :cross="activecross"
              :key="componentKey"
              :filter="settingSelection"
              :screen_height="window.height"
              @alertLoaded="setLoaded"
            />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>


<script>
import BrokerChatNlp from "@/components/NlpModel/BrokerChatNlp.vue";
import PopUpModal from "@/components/common/PopUpModal.vue";
import { mapState } from "vuex";
export default {
  components: {
    BrokerChatNlp,
    PopUpModal,
  },
  created() {
    this.$store.dispatch("refreshCrossList");
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  data() {
    return {
      componentKey: 0,
      settingHeaders: [
        "ALL",
        "SHORT DATES",
        "MID DATES",
        "LONG DATES",
        "SMILE",
      ],

      settingSelection: "ALL",
      dataLoaded: false,
      window: {
        width: 0,
        height: 0,
      },
    };
  },
  computed: {
    ...mapState({
      crosses: (state) => state.crossList,
    }),

    activecross() {
      let cross = this.$store.getters.activeCrossGetter;
      return cross;
    },
  },
  methods: {
    dev() {
      console.log(this.available_crosses);
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
      this.settingSelection = "ALL";
      this.componentKey += 1;
    },
    handleResize() {
      this.window.width = window.innerWidth - 100;
      this.window.height = window.innerHeight - 165;

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
    },
  },
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

.analyticContainer {
  display: flex;
  overflow-x: auto;
  overflow-y: auto;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}

.analyticContainer::-webkit-scrollbar-track {
  background-color: #eceff1;
  border-radius: 10px;
}

.analyticContainer::-webkit-scrollbar {
  width: 6px;
  height: 10px;
  background-color: #eceff1;
}

.analyticContainer::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.44, rgb(122, 153, 217)),
    color-stop(0.72, rgb(73, 125, 189)),
    color-stop(0.86, rgb(28, 58, 148))
  );
}
</style>
