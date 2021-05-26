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
            >
              <v-list-item-action>
                <v-icon color="green darken-3">mdi-dots-hexagon</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="refreshEventsFromApi()">
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
            <v-list-item @click="updateHistoricalSpots()">
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
              :items="userProfiles"
              sort-by="UserName"
              dense
              disable-pagination
              hide-default-footer
              ><template v-slot:top>
                <v-toolbar dense class="mb-3" dark color="blue-grey darken-2">
                  <v-toolbar-title>Manage Users</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot-->
              <template v-slot:item.IsAdmin="{ item }">
                <v-simple-checkbox
                  color="primary"
                  v-model="item.IsAdmin"
                  @input="updateUserProfile(item)"
                ></v-simple-checkbox>
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot-->
              <template v-slot:item.IsAuthed="{ item }">
                <v-simple-checkbox
                  color="primary"
                  v-model="item.IsAuthed"
                  @input="updateUserProfile(item)"
                ></v-simple-checkbox>
              </template>

              <!-- eslint-disable-next-line vue/valid-v-slot-->
              <template v-slot:item.actions="{ item }">
                <v-icon small @click="deleteUser(item)">mdi-delete</v-icon>
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
import UserPrefsApi from "@/apis/UserPrefsApi";
import DayWgtSetupApi from "@/apis/DayWgtSetupApi";
import VolAnalyticsApi from "@/apis/pythonApis/VolAnalyticsApi";
import { mapState } from "vuex";

export default {
  data: () => ({
    headers: [
      {
        text: "UserName",
        value: "UserName",
        sortable: false,
        align: "center",
      },
      {
        text: "IsAdmin",
        value: "IsAdmin",
        sortable: false,
        align: "center",
      },
      {
        text: "IsAuthed",
        value: "IsAuthed",
        sortable: false,
        align: "center",
      },
      {
        text: "Delete User",
        value: "actions",
        sortable: false,
        align: "center",
      },
    ],
    userProfiles: [],
    settingHeaders: ["Manage Users"],
    settingSelection: "Manage Users",
    dayWgtProgress: false,
    histSpotProgress: false,
  }),
  components: {},

  computed: {
    ...mapState({
      window: (state) => state.window,
    }),
    userList() {
      return this.userProfiles.map((x) => x.UserName);
    },
  },

  async created() {
    await this.getUserProfiles();
  },

  methods: {
    async getUserProfiles() {
      try {
        let response = await LoginApi.GetAllUsers();
        this.userProfiles = JSON.parse(response.data.userProfiles);
        console.log(this.userProfiles);
      } catch (error) {}
    },
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
          text: `${JSON.parse(response.data)}`,
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
    async updateUserProfile(item) {
      try {
        await LoginApi.UpdateUser(item);
        this.$store.dispatch("setSnackbar", {
          text: `${item.UserName} profile has been updated succesfully.`,
          centered: true,
        });
        this.getUserProfiles();
      } catch (err) {
        this.$store.dispatch("setSnackbar", {
          text: ` Update Unsuccessful. ${err}`,
          centered: true,
        });
      }
    },

    async deleteUser(item) {
      try {
        confirm(`Are you sure you want to delete ${item.UserName}?`) &&
          (await LoginApi.DeleteUser(item));
        this.$store.dispatch("setSnackbar", {
          text: `${item.UserName} deleted succesfully. `,
          centered: true,
        });

        this.getUserProfiles();
        await UserPrefsApi.deleteUserPrefsFromDB({ UserName: item.UserName });
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: ` Delete Unsuccessful. ${error}`,
          centered: true,
        });
      }
    },
  },
};
</script>


