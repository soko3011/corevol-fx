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
            <v-list-item @click="updateHistoricalSpots()" ripple>
              <v-list-item-action>
                <v-progress-circular
                  v-if="histSpotProgress"
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

      <div>
        <transition name="slide">
          <v-card
            :width="window.width - 500"
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
import DayWgtSetupApi from "@/apis/DayWgtSetupApi";
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import { mapState } from "vuex";

export default {
  data: () => ({
    keys: [],
    headers: [],
    data: [],
    addNew: false,
    search: "",
    log: [],
    logHeaders: [
      {
        text: "MESSAGE",
        align: "start",
        sortable: false,
        value: "Message",
      },
    ],
    sortBy: "LogTime",
    sortDesc: true,
    settingHeaders: ["Manage Users"],
    settingSelection: "Manage Users",
    backupProgress: false,
    dayWgtProgress: false,
    histSpotProgress: false,
  }),
  components: {},

  computed: {
    ...mapState({
      window: (state) => state.window,
    }),
    userList() {
      return this.data.map((x) => x.UserName);
    },
  },

  created() {},

  methods: {
    ChangeSettings(setting) {
      this.settingSelection = setting;
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
        this.dayWgtProgress = false;
      }
    },
    async updateHistoricalSpots() {
      try {
        this.histSpotProgress = true;
        this.$store.dispatch("setSnackbar", {
          text: `Refreshing Historical Spots From Python API...`,
          centered: true,
        });
        let response = await VolAnalyticsApi.refresh_historical_spots();
        this.$store.dispatch("setSnackbar", {
          text: `${JSON.parse(response)}`,
          centered: true,
        });
        this.histSpotProgress = false;
      } catch (err) {
        this.$store.dispatch("setSnackbar", {
          text: ` Update Unsuccessful. ${err}`,
          centered: true,
        });
        this.histSpotProgress = false;
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


