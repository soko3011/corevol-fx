<template>
  <div v-if="apiDataReturned">
    <v-card>
      <v-toolbar dense class="mb-2" dark color="#385F73">
        <v-toolbar-title>EXPIRY CUT SETTINGS</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn dark x-small fab top right color="pink" @click="addNewOptionCut">
          <v-icon>mdi-expand-all</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="data"
      sort-by="CutName"
      dense
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-card-title>
              <v-spacer />
              <span class="title">{{ formTitle }}</span>
              <v-spacer />
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="editedItem['CutName']"
                label="CutName"
              ></v-text-field>

              <v-select
                v-model="editedItem['TimeZone']"
                :items="cutIds"
                label="TimeZone"
              ></v-select>
              <v-text-field
                v-model="editedItem['TimeAtCutCenter']"
                label="TimeAtCutCenter"
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save(editedItem)"
                >Save</v-btn
              >
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot-->
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" rounded="pill" centered elevation="20">
        {{ snackbarMessage }}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false"
            >Close</v-btn
          >
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import SettingsApi from "@/apis/SettingsApi.js";
import PopUpModal from "@/components/common/PopUpModal.vue";
export default {
  data: () => ({
    dialog: false,
    keys: [],
    headers: [],
    data: [],
    editedItem: {},
    addNew: false,
    snackbar: false,
    snackbarMessage: "",
    apiDataReturned: false,
    cutIds: [],
  }),
  components: {
    PopUpModal,
  },

  computed: {
    formTitle() {
      return this.addNew === true
        ? "NEW CUT"
        : `EDIT ${this.editedItem.CutName} CUT`;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
    SettingsApi.GetTimeZoneInfos().then((response) => {
      this.cutIds = JSON.parse(response.data.tzInfo);
    });
  },

  methods: {
    initialize() {
      SettingsApi.GetOptCutSettings()
        .then((response) => {
          this.data = JSON.parse(response.data.optCuts);
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
          this.apiDataReturned = true;
        })
        .catch((err) => {
          this.snackbarMessage = ` Error: ${err}`;
          this.snackbar = true;
        });
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    addNewOptionCut() {
      this.addNew = true;
      this.dialog = true;
    },

    deleteItem(item) {
      confirm(`Are you sure you want to delete ${item.CutName}?`) &&
        SettingsApi.DeleteOptionCut({ Cut: item.CutName })
          .then((response) => {
            this.snackbarMessage = `${item.CutName} deleted succesfully.`;
            this.snackbar = true;

            this.initialize();
          })
          .catch((err) => {
            if (err.toString().includes("403") === true) {
              err = "Admin Rights Required";
            }
            this.snackbarMessage = ` Delete Unsuccessful. ${err}`;
            this.snackbar = true;
          });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },

    async save(item) {
      try {
        let response = await SettingsApi.UpdateOptionCut(item);
        this.snackbarMessage = `${item.CutName} updated succesfully.`;
        this.snackbar = true;

        this.initialize();
      } catch (err) {
        if (err.toString().includes("403") === true) {
          err = "Admin Rights Required";
        }
        this.snackbarMessage = `Update unsucessful. ${err}`;
        this.snackbar = true;
      }

      this.close();
    },
  },
};
</script>

<style lang="sass">
.custom-transform-class
  text-transform: uppercase
</style>
