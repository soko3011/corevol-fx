<template>
  <v-data-table
    :headers="headers"
    :items="data"
    sort-by="Cross"
    class="elevation-10"
    dense
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>CrossSetup</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
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
              <v-btn v-if="editMode" color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save(editedItem)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import SettingsApi from "@/apis/SettingsApi.js";
export default {
  data: () => ({
    dialog: false,
    keys: [],
    headers: [],
    data: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    editMode: true
  }),
  props: {
    newCcyPairAdded: { type: String }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    newCcyPairAdded() {
      this.editedItem = Object.assign({}, this.defaultItem);
      Object.assign(this.editedItem, { Cross: this.newCcyPairAdded });
      this.editMode = false;
      this.dialog = true;
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      SettingsApi.GetCrossSetup().then(response => {
        this.data = JSON.parse(response.data.crossSetup);
        let headersNew = [];
        let editedItem = {};
        this.keys = Object.keys(this.data[0]);
        this.keys.forEach(function(val) {
          headersNew.push({ text: val, value: val });
          editedItem[val] = 0;
        });

        headersNew.push({ text: "Actions", value: "actions", sortable: false });
        this.headers = headersNew;
        Object.assign(this.editedItem, editedItem);
        Object.assign(this.defaultItem, this.data[0]);
        console.log(this.defaultItem);
      });
    },

    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.data.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.data.splice(index, 1);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save(item) {
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
      } else {
        this.data.push(this.editedItem);
        this.$emit("newCcyPairSaved", item);
      }
      this.close();
    }
  }
};
</script>
