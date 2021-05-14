<template>
  <div>
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
                  <v-list-item-title>{{
                    config.date_str.toUpperCase()
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-subheader>Actions </v-subheader>
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

              <v-subheader>Recently Used</v-subheader>
              <v-list-item
                @click="setRecentlyUsedCross(item)"
                v-for="item in this.recentCrosses"
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
    recentCrosses: { type: Array },
  },
  async created() {
    await this.getApiData();
    this.alert_config();
  },
  data() {
    return {
      filterHeaders: ["ALL", "SHORT DATES", "MID DATES", "LONG DATES", "SMILE"],
      loaded: false,
      chat_dates: [],
      date_str_toggle: false,
      config: {
        date_str: "",
        view: "SUMMARY",
        filter: "ALL",
      },
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
  },
  methods: {
    dev() {},
    async getApiData() {
      try {
        let response = await NlpApi.get_chat_dates();
        this.chat_dates = response.data.map((a) => a.DATES);
        this.config.date_str = this.chat_dates[0];
        this.loaded = true;
      } catch (error) {
        console.log(error);
      }
    },
    setDateStr(val) {
      this.config.date_str = val;
      this.config.view = "SUMMARY";
      this.alert_config();
    },
    setFilter(val) {
      this.config.filter = val;
      this.config.view = "NLP";
      this.alert_config();
    },
    setRecentlyUsedCross(val) {
      this.config.selectedCross = val;
      this.config.view = "NLP";
      this.config.filter = "ALL";
      this.alert_config();
    },
    selectSearchView() {
      this.$emit("toggle_search_view");
    },
    selectSummaryView() {
      this.config.view = "SUMMARY";
      this.alert_config();
    },
    alert_config() {
      this.$emit("alert_config", this.config);
    },

    handleWindowResize() {
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
        `${this.window.height}px`
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

.nlp_sidebar {
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
