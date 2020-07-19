<template>
  <div>
    <v-card>
      <v-btn absolute small fab top right color="pink" elevation="12">
        <PopUpModal
          :inputData="ccyList"
          :icon="'mdi-expand-all'"
          :color="'white'"
          :large="false"
          :title="'MIRROR CCY'"
          v-on:selection="AddNewCcy"
        />
      </v-btn>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="data"
      sort-by="Ccy"
      class="elevation-10 custom-transform-class"
      dense
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar dense class="mb-3" dark color="blue-grey darken-2">
          <v-toolbar-title>Ccy Settings</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="1000px">
            <v-card>
              <v-card-title>
                <span class="title">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="2" v-for="key in keys" :key="key">
                      <v-text-field v-model="editedItem[key]" :label="key"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save(editedItem)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
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
        {{snackbarMessage}}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import SettingsApi from "@/apis/SettingsApi.js";
import PopUpModal from "@/components/PopUpModal.vue";
export default {
  data: () => ({
    dialog: false,
    keys: [],
    headers: [],
    data: [],
    editedItem: {},
    addNew: false,
    snackbar: false,
    snackbarMessage: ""
  }),
  components: {
    PopUpModal
  },
  props: {
    refreshComponent: { type: Boolean, default: false }
  },

  computed: {
    formTitle() {
      return this.addNew === true ? "NEW CCY" : `EDIT ${this.editedItem.Ccy}`;
    },
    ccyList() {
      return this.data.map(x => x.Ccy);
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    refreshComponent() {
      this.initialize();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      SettingsApi.GetCcySetup()
        .then(response => {
          this.data = JSON.parse(response.data.ccySetup);
          let headersNew = [];
          this.keys = Object.keys(this.data[0]);
          this.keys.forEach(function(val) {
            headersNew.push({ text: val, value: val, align: "center" });
          });

          headersNew.push({
            text: "Actions",
            value: "actions",
            align: "center",
            sortable: false
          });
          this.headers = headersNew;
          console.log(this.headers);
        })
        .catch(err => {
          this.snackbarMessage = ` Error: ${err}`;
          this.snackbar = true;
        });
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    AddNewCcy(ccy) {
      this.addNew = true;
      const index = this.ccyList.indexOf(ccy);
      Object.assign(this.editedItem, this.data[index]);
      delete this.editedItem.Ccy;

      this.dialog = true;
    },

    deleteItem(item) {
      confirm(`Are you sure you want to delete ${item.Ccy}?`) &&
        SettingsApi.DeleteCcyData({ name: item.Ccy })
          .then(response => {
            this.snackbarMessage = `${item.Ccy} deleted succesfully. Status ${response.status}`;
            this.snackbar = true;

            this.initialize();
          })
          .catch(err => {
            this.snackbarMessage = ` Delete Unsuccessful.Error: ${err}`;
            this.snackbar = true;
          });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },

    save(item) {
      SettingsApi.UpdateCcyDets(item)
        .then(response => {
          this.snackbarMessage = `${item.Ccy} updated succesfully. Status ${response.status}`;
          this.snackbar = true;

          this.initialize();
        })
        .catch(err => {
          this.snackbarMessage = `Update unsucessful. Error: ${err}`;
          this.snackbar = true;
        });

      this.close();
    }
  }
};
</script>

<style lang="sass">
.custom-transform-class
  text-transform: uppercase
</style>


