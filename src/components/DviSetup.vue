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
        <v-toolbar-title>DviSetup</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="1000px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
              @click="newItem()"
            >Add CcyPair</v-btn>
          </template>
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
    defaultItem: {}
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NEW CCYPAIR" : "EDIT CCYPAIR";
    },
    editedItemKey(key) {
      return this.editedItem[key];
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      SettingsApi.GetDviSetup().then(response => {
        this.data = JSON.parse(response.data.dviSetup);
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
      });
    },
    newItem() {
      this.defaultItem.Cross = "";
      this.editedItem = Object.assign({}, this.defaultItem);
    },

    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.data.indexOf(item);
      confirm(`Are you sure you want to delete ${item.Cross}?`) &&
        this.data.splice(index, 1);
      this.$emit("deleteCcyPair", item);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save(item) {
      const ccyPairList = this.data.map(x => x.Cross);
      const index = ccyPairList.indexOf(item.Cross);

      if (index > -1) {
        Object.assign(this.data[index], this.editedItem);
        this.$emit("updateDvi", this.editedItem);
      } else {
        this.data.push(this.editedItem);
        this.$emit("addNewCrossDvi", item);
      }

      this.close();
    }
  }
};
</script>
