<template>
  <div class="nlp_container ml-1">
    <div>
      <div class="d-flex flex-row">
        <div class="d-flex flex-column nlp_sidebar mr-1">
          <v-card
            v-if="showSideControl"
            min-width="225"
            :height="window.height"
          >
            <v-list dense>
              <v-subheader>Model Date </v-subheader>
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
                    v-on:selection="setDateStr"
                  />
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ date_str }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="selectSummaryView()" ripple>
                <v-list-item-action>
                  <v-icon color="blue darken-3">mdi-dots-triangle</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>SUMMARY</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="selectSearchView()" ripple>
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
                @click="setFilter(item)"
                v-for="item in this.filterHeaders"
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
                @click="setRecentlyUsedCross(item)"
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
      </div>
    </div>
  </div>
</template>


<script>
import NlpApi from "@/apis/pythonApis/NlpApi";
import ModalNoButton from "@/components/common/ModalNoButton.vue";
import { mapState } from "vuex";
export default {
  components: {
    ModalNoButton,
  },
  props: {
    showSideControl: { type: Boolean },
  },
  async created() {
    await this.getApiData();
  },
  data() {
    return {
      filterHeaders: ["ALL", "SHORT DATES", "MID DATES", "LONG DATES", "SMILE"],
      recentlyUsedHeaders: [this.$store.getters.activeCrossGetter],
      filter: "ALL",
      loaded: false,
      chat_dates: [],
      date_str: "",
      date_str_toggle: false,
      view: "",
      recentlyUsedCross: "",
    };
  },
  computed: {
    ...mapState({
      crosses: (state) => state.crossList,
      window: (state) => state.window,
    }),
    sidebarHeight() {
      return this.window.height - 150;
    },
    config() {
      return {
        date_str: this.date_str,
        view: this.view,
        filter: this.filter,
        recentlyUsedCross: this.recentlyUsedCross,
      };
    },
  },
  methods: {
    dev() {},
    async getApiData() {
      try {
        let response = await NlpApi.get_chat_dates();
        this.chat_dates = response.data.map((a) => a.DATES);
        this.date_str = this.chat_dates[0];
        this.loaded = true;
      } catch (error) {
        console.log(error);
      }
    },
    setDateStr(val) {
      this.date_str = val;
      this.view = "SUMMARY";
      this.alert_config();
    },
    setFilter(val) {
      if (val === this.filter) {
        return;
      }
      this.filter = val;
      this.view = "NLP";
      this.alert_config();
    },
    setRecentlyUsedCross(val) {
      this.recentlyUsedCross = val;
      this.view = "NLP";
      this.filter = "ALL";
      this.alert_config();
    },
    selectSearchView() {
      this.view = "SEARCH";
      this.alert_config();
    },
    selectSummaryView() {
      this.view = "SUMMARY";
      this.alert_config();
    },
    alert_config() {
      this.$emit("alert_config", this.config);
    },

    handleWindowResize() {
      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width - 100}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height - 60}px`
      );
      document.documentElement.style.setProperty(
        "--nlp_sidebar-height",
        `${this.window.height - 150}px`
      );
    },
  },
  watch: {
    window() {
      this.handleWindowResize();
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
