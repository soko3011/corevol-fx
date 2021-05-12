<template>
  <div>
    <v-container class="center">
      <v-progress-linear v-if="!dataLoaded" indeterminate></v-progress-linear>
    </v-container>
    <div class="d-flex flex-row mb-5 flex-nowrap">
      <v-toolbar color="#385F73" min-width="400" collapse>
        <v-btn icon>
          <v-icon
            @click="showSideControl = !showSideControl"
            color="blue lighten-3"
            >{{
              showSideControl ? "mdi-chevron-down" : "mdi-chevron-up"
            }}</v-icon
          >
        </v-btn>
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
            {{ selectedCross }}

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
      <div class="d-flex flex-column dviCol mr-1">
        <v-card v-if="showSideControl" min-width="225" :height="window.height">
          <v-list dense>
            <v-subheader>Model Date</v-subheader>
            <v-list-item @click="date_str_toggle = !date_str_toggle">
              <v-list-item-action>
                <v-btn ripple small icon>
                  <v-icon color="#385F73">mdi-calendar-sync</v-icon>
                </v-btn>
                <ModalNoButton
                  :inputData="chat_dates"
                  :title="'SELECT DATE'"
                  :vmodel="date_str_toggle"
                  v-on:setvmodel="(data) => (date_str_toggle = data)"
                  v-on:selection="update_date_str"
                />
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ date_str }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="changeSummary()" ripple>
              <v-list-item-action>
                <v-icon color="blue darken-3">mdi-dots-triangle</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>OVERVIEW</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list dense>
            <v-subheader>Filters</v-subheader>

            <v-list-item
              @click="changeSettings(item)"
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
          <v-list dense>
            <v-subheader>Recently Used</v-subheader>
            <v-list-item
              @click="changeCross(item)"
              v-for="item in this.recentlyUsedHeaders"
              :key="item"
              ripple
            >
              <v-list-item-action>
                <v-icon color="green darken-3">mdi-dots-square</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <div class="analyticContainer">
        <transition name="slide">
          <BrokerChatNlp
            v-if="view_mode === 'nlp_model'"
            :cross="selectedCross"
            :key="componentKey"
            :filter="settingSelection"
            :screen_height="window.height"
            :date_str="date_str"
            @alertLoaded="setLoaded"
          />
        </transition>
        <transition name="slide">
          <BrokerChatSummary
            v-if="view_mode === 'overview'"
            :screen_height="window.height"
            :date_str="date_str"
            :key="componentKey"
            @crossSelected="crossSelectedFromSummary"
            @alertLoaded="setLoaded"
          />
        </transition>
      </div>
    </div>
  </div>
</template>


<script>
import NlpApi from "@/apis/pythonApis/NlpApi";
import BrokerChatNlp from "@/components/NlpModel/BrokerChatNlp.vue";
import BrokerChatSummary from "@/components/NlpModel/BrokerChatSummary.vue";
import PopUpModal from "@/components/common/PopUpModal.vue";
import ModalNoButton from "@/components/common/ModalNoButton.vue";
import { mapState } from "vuex";
export default {
  components: {
    BrokerChatNlp,
    BrokerChatSummary,
    PopUpModal,
    ModalNoButton,
  },
  async created() {
    await this.getApiData();
    this.$store.dispatch("refreshCrossList");
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  data() {
    return {
      showSideControl: true,
      componentKey: 0,
      settingHeaders: [
        "ALL",
        "SHORT DATES",
        "MID DATES",
        "LONG DATES",
        "SMILE",
      ],
      recentlyUsedHeaders: [this.$store.getters.activeCrossGetter],
      settingSelection: "ALL",
      view_mode: "overview",
      dataLoaded: false,
      selectedCross: this.$store.getters.activeCrossGetter,
      chat_dates: [],
      date_str: "02_may_2021",
      date_str_toggle: false,
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
  },
  methods: {
    dev() {},
    async getApiData() {
      try {
        let response = await NlpApi.get_chat_dates();
        this.chat_dates = response.data.map((a) => a.DATES);
      } catch (error) {
        console.log(error);
      }
    },
    update_date_str(val) {
      this.dataLoaded = false;
      this.date_str = val;
      this.componentKey += 1;
    },
    setLoaded(val) {
      this.dataLoaded = val;
    },

    changeSummary() {
      this.view_mode = "overview";
    },
    changeSettings(setting) {
      this.view_mode = "nlp_model";
      if (setting === this.settingSelection) {
        return;
      }
      this.dataLoaded = false;
      this.settingSelection = setting;
    },
    changeCross(val) {
      this.dataLoaded = false;
      this.selectedCross = val;
      if (this.crosses.indexOf(val) > -1) {
        this.$store.dispatch("setActivecross", val);
      }
      this.settingSelection = "ALL";
      this.view_mode = "nlp_model";
      this.componentKey += 1;
    },
    crossSelectedFromSummary(val) {
      this.changeCross(val);

      if (this.recentlyUsedHeaders.indexOf(val) === -1) {
        this.recentlyUsedHeaders.push(val);
      }
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
      document.documentElement.style.setProperty(
        "--dviCol-height",
        `${this.window.height - 160}px`
      );
    },
  },
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);
$dviColHeight: var(--dviCol-height);

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
.dviCol::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 10px;
}

.dviCol::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.dviCol::-webkit-scrollbar-thumb {
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
