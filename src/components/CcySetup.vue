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
      class="elevation-10"
      dense
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar class="mb-3" dark color="blue-grey darken-2">
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
    addNew: false
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
            headersNew.push({ text: val, value: val });
          });

          headersNew.push({
            text: "Actions",
            value: "actions",
            sortable: false
          });
          this.headers = headersNew;
          console.log(this.headers);
        })
        .catch(err => {
          alert(err);
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
            alert(`${item.Ccy} deleted succesfully. Status ${response.status}`);
            this.initialize();
          })
          .catch(err => {
            alert(`Delete unsucessful. Error: ${err}`);
          });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },

    save(item) {
      SettingsApi.UpdateCcyDets(item)
        .then(response => {
          alert(`${item.Ccy} updated succesfully. Status ${response.status}`);
          this.initialize();
        })
        .catch(err => {
          alert(`Update unsucessful. Error: ${err}`);
        });

      this.close();
    }
  }
};
</script>




