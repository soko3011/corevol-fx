<template>
  <div v-if="apiDataReturned">
    <v-card flat>
      <v-toolbar dense class="mb-2" dark color="#385F73">
        <v-toolbar-title>CROSS SETTINGS</v-toolbar-title>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="data"
        sort-by="Cross"
        dense
        disable-pagination
        hide-default-footer
      >
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="1000px">
            <v-card>
              <v-card-title>
                <span class="title">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="2"
                      v-for="key in keys"
                      :key="key"
                    >
                      <v-text-field
                        v-model="editedItem[key]"
                        :label="key"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save(editedItem)"
                  >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot-->
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        </template>
      </v-data-table>
    </v-card>
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
export default {
  data: () => ({
    dialog: false,
    keys: [],
    headers: [],
    data: [],
    editedItem: {},
    snackbar: false,
    snackbarMessage: "",
    apiDataReturned: false,
  }),

  computed: {
    formTitle() {
      return `EDIT ${this.editedItem.Cross}`;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      SettingsApi.GetCrossSetup()
        .then((response) => {
          this.data = JSON.parse(response.data.crossSetup);
          let headersNew = [];
          this.keys = Object.keys(this.data[0]);
          this.keys.forEach(function (val) {
            headersNew.push({ text: val, value: val, align: "center" });
          });

          headersNew.push({
            text: "Actions",
            value: "actions",
            align: "center",
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

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },

    async save(item) {
      try {
        let response = await SettingsApi.UpdateCrossDets(item);
        this.snackbarMessage = `${item.Cross} updated succesfully.`;
        this.snackbar = true;
        this.initialize();
      } catch (err) {
        if (err.toString().includes("403") === true) {
          err = "Admin Rights Required";
        }
        this.snackbarMessage = `Update unsucessful.  ${err}`;
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
