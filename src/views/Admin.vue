<template>
  <div>
    <div class="d-flex flex-row flex-nowrap">
      <div class="d-flex flex-column">
        <v-card
          min-width="225"
          :height="window.height"
          class="mr-3 d-flex flex-column"
        >
          <v-list dense>
            <v-subheader>COREVOLFX ADMIN</v-subheader>
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

            <v-list-item @click="refreshEventsFromApi()" ripple>
              <v-list-item-action>
                <v-progress-circular
                  v-if="dayWgtProgress"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-icon v-else color="green darken-3">mdi-dots-hexagon</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Refresh Api Day Wgts</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="refreshEventsFromApi()" ripple>
              <v-list-item-action>
                <v-progress-circular
                  v-if="dayWgtProgress"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-icon v-else color="green darken-3">mdi-dots-hexagon</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Refresh Historical Spots</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <div class="divCol">
        <transition name="slide">
          <v-card
            width="1000"
            :height="window.height"
            v-if="settingSelection === 'System Log'"
          >
            <v-btn ripple small icon class="ma-2" @click="updateLog()">
              <v-icon color="blue">mdi-refresh-circle</v-icon>
            </v-btn>
            <v-card-title>
              System Log
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              dense
              :items-per-page="15"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :headers="logHeaders"
              :items="log"
              :search="search"
            >
              <!-- eslint-disable-next-line vue/valid-v-slot-->
              <template v-slot:item.LogTime="{ item }">
                <span>{{ new Date(item.LogTime).toLocaleString() }}</span>
              </template></v-data-table
            >
          </v-card>
        </transition>
        <transition name="slide">
          <v-card
            width="1000"
            :height="window.height"
            v-if="settingSelection === 'Manage Users'"
          >
            <v-data-table
              :headers="headers"
              :items="data"
              sort-by="UserName"
              dense
              disable-pagination
              hide-default-footer
            >
              <!-- eslint-disable-next-line vue/valid-v-slot-->
              <template v-slot:item.IsAdmin="{ item }">
                <v-simple-checkbox
                  v-ripple
                  v-model="item.IsAdmin"
                ></v-simple-checkbox>
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot-->
              <template v-slot:item.IsAuthed="{ item }">
                <v-simple-checkbox
                  v-ripple
                  v-model="item.IsAuthed"
                ></v-simple-checkbox>
              </template>
              <template v-slot:top>
                <v-toolbar dense class="mb-3" dark color="blue-grey darken-2">
                  <v-toolbar-title>Manage Users</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot-->
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="save(item)"
                  >mdi-content-save</v-icon
                >
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-card>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import LoginApi from "@/apis/authenticationApis/LoginApi.js";
import SettingsApi from "@/apis/SettingsApi.js";
import DayWgtSetupApi from "@/apis/DayWgtSetupApi";

export default {
  data: () => ({
    keys: [],
    headers: [],
    data: [],
    addNew: false,
    window: {
      width: 0,
      height: 0,
    },
    search: "",
    log: [],
    logHeaders: [
      {
        text: "MESSAGE",
        align: "start",
        sortable: false,
        value: "Message",
      },
      { text: "LOG TIME", value: "LogTime" },
    ],
    sortBy: "LogTime",
    sortDesc: true,
    settingHeaders: ["System Log", "Manage Users"],
    settingSelection: "System Log",
    backupProgress: false,
    dayWgtProgress: false,
  }),
  components: {},
  props: {
    refreshComponent: { type: Boolean, default: false },
  },

  computed: {
    userList() {
      return this.data.map((x) => x.UserName);
    },
  },

  watch: {
    refreshComponent() {
      this.initialize();
    },
  },

  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.initialize();
  },

  methods: {
    handleResize() {
      this.window.width = window.innerWidth - 50;
      this.window.height = window.innerHeight - 65;
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
    ChangeSettings(setting) {
      this.settingSelection = setting;
    },
    async initialize() {
      try {
        await this.updateLog();
        let response = await LoginApi.GetAllUsers();
        this.data = JSON.parse(response.data.userProfiles);
        let headersNew = [];
        this.keys = Object.keys(this.data[0]);

        this.keys.forEach(function (val) {
          headersNew.push({ text: val, value: val, align: "center" });
        });

        headersNew.push({
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
        });
        this.headers = headersNew;
      } catch (err) {
        if (err.toString().includes("403") === true) {
          err = "Admin Rights Required";
        }

        this.$store.dispatch("setSnackbar", {
          text: `  ${err}`,
          centered: true,
        });
      }
    },
    async updateLog() {
      try {
        let response = await SettingsApi.GetLog();
        this.log = JSON.parse(response.data.log);
      } catch (err) {
        this.$store.dispatch("setSnackbar", {
          text: `  ${err}`,
          centered: true,
        });
      }
    },

    async refreshEventsFromApi() {
      try {
        this.dayWgtProgress = true;
        this.$store.dispatch("setSnackbar", {
          text: `Refreshing DayWgts From API...`,
          centered: true,
        });
        await DayWgtSetupApi.refreshEventsFromApi();
        this.$store.dispatch("setSnackbar", {
          text: `DayWgts Updated From API...`,
          centered: true,
        });
        this.dayWgtProgress = false;
      } catch (err) {
        this.$store.dispatch("setSnackbar", {
          text: ` Update Unsuccessful. ${err}`,
          centered: true,
        });
      }
    },

    deleteItem(item) {
      confirm(`Are you sure you want to delete ${item.UserName}?`) &&
        LoginApi.DeleteUser(item)
          .then((response) => {
            this.$store.dispatch("setSnackbar", {
              text: `${item.UserName} deleted succesfully. `,
              centered: true,
            });

            this.initialize();
          })
          .catch((err) => {
            if (err.toString().includes("403") === true) {
              err = "Admin Rights Required";
            }
            this.$store.dispatch("setSnackbar", {
              text: ` Delete Unsuccessful. ${err}`,
              centered: true,
            });
          });
    },

    save(item) {
      LoginApi.UpdateUser(item)
        .then((response) => {
          this.$store.dispatch("setSnackbar", {
            text: `${item.UserName} updated succesfully.`,
            centered: true,
          });

          this.initialize();
        })
        .catch((err) => {
          if (err.toString().includes("403") === true) {
            err = "Admin Rights Required";
          }
          this.$store.dispatch("setSnackbar", {
            text: ` Update Unsuccessful. ${err}`,
            centered: true,
          });
        });
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
</style>
