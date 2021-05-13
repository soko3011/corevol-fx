<template>
  <div class="nlp_container ml-1">
    <div>
      <v-container class="center">
        <v-progress-linear
          v-if="!incoming_data_loaded"
          indeterminate
        ></v-progress-linear>
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
        <div class="d-flex flex-column nlp_sidebar mr-1">
          <v-card
            v-if="showSideControl"
            min-width="225"
            :height="window.height"
          >
            <v-list dense>
              <v-subheader
                >Model Date
                <v-spacer />
                <v-switch
                  dense
                  inset
                  v-model="isBatch"
                  color="#126496"
                  @change="toggleBatch()"
                ></v-switch>
              </v-subheader>
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
              <v-list-item
                v-if="isBatch"
                @click="batch_end_date_str_toggle = !batch_end_date_str_toggle"
              >
                <v-list-item-action>
                  <v-btn ripple small icon>
                    <v-icon color="#385F73">mdi-calendar-sync</v-icon>
                  </v-btn>
                  <ModalNoButton
                    :inputData="chat_dates"
                    :title="'SELECT DATE'"
                    :vmodel="batch_end_date_str_toggle"
                    v-on:setvmodel="
                      (data) => (batch_end_date_str_toggle = data)
                    "
                    v-on:selection="set_batch_end_date_str"
                  />
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{
                    batch_end_date_str
                  }}</v-list-item-title>
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
              <v-list-item @click="toggleSearchText()" ripple>
                <v-list-item-action>
                  <v-icon color="blue darken-3">mdi-file-search-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>SEARCH TEXT</v-list-item-title>
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

        <div v-if="pageInitialized">
          <transition name="slide">
            <BrokerChatNlp
              v-if="view_mode === 'nlp_model'"
              :cross="selectedCross"
              :key="componentKey"
              :filter="settingSelection"
              :tableHeight="sidebarHeight"
              :date_str="date_str"
              :searchTxtToggle="searchTxtToggle"
              @alertLoaded="set_incoming_data_toggle"
            />
          </transition>
          <transition name="slide">
            <BrokerChatSummary
              v-if="view_mode === 'overview'"
              :screen_height="sidebarHeight"
              :date_str="date_str"
              :key="componentKey"
              @crossSelected="crossSelectedFromSummary"
              @alertLoaded="set_incoming_data_toggle"
            />
          </transition>
        </div>
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
      isBatch: false,
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
      incoming_data_loaded: false,
      pageInitialized: false,
      selectedCross: this.$store.getters.activeCrossGetter,
      chat_dates: [],
      date_str: "",
      batch_end_date_str: "",
      date_str_toggle: false,
      batch_end_date_str_toggle: false,
      searchTxtToggle: false,
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
    sidebarHeight() {
      return this.window.height - 150;
    },
  },
  methods: {
    dev() {},
    toggleBatch() {
      this.batch_end_date_str = this.date_str;
    },
    toggleSearchText() {
      this.searchTxtToggle = !this.searchTxtToggle;
    },
    async getApiData() {
      try {
        let response = await NlpApi.get_chat_dates();
        this.chat_dates = response.data.map((a) => a.DATES);
        this.date_str = this.chat_dates[0];
        this.pageInitialized = true;
      } catch (error) {
        console.log(error);
      }
    },
    update_date_str(val) {
      this.incoming_data_loaded = false;
      this.date_str = val;
      this.componentKey += 1;
    },
    set_batch_end_date_str(val) {
      this.batch_end_date_str = val;
    },
    set_incoming_data_toggle(bool) {
      this.incoming_data_loaded = bool;
    },
    changeSummary() {
      this.view_mode = "overview";
    },
    changeSettings(setting) {
      this.view_mode = "nlp_model";
      if (setting === this.settingSelection) {
        return;
      }
      this.incoming_data_loaded = false;
      this.settingSelection = setting;
    },
    changeCross(val) {
      this.incoming_data_loaded = false;
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
      this.window.height = window.innerHeight - 60;

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
        "--nlp_sidebar-height",
        `${this.window.height - 150}px`
      );
    },
  },
};
</script>



<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);
$nlp_sidebarHeight: var(--nlp_sidebar-height);

.center {
  margin: 0;
  width: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.nlp_container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}
.nlp_container .nlp_sidebar {
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  height: $nlp_sidebarHeight;
}

.nlp_sidebar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 10px;
}

.nlp_sidebar::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.nlp_sidebar::-webkit-scrollbar-thumb {
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
