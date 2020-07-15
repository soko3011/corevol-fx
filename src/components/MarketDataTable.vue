<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      c
      class="elevation-10 custom-transform-class"
      dense
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar class="mb-3" dark color="blue lighten-2" dense>
          <v-toolbar-title>{{tableTitle}}</v-toolbar-title>

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
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    keys: [],
    headers: [],
    data: [],
    editedItem: {}
  }),
  components: {},
  props: {
    crossName: { type: String },
    title: { type: String },
    incomingData: { type: Array }
  },

  computed: {
    formTitle() {
      return `EDIT ${this.editedItem.Term}`;
    },
    tableTitle() {
      return `${this.crossName} ${this.title}`;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    crossName() {
      this.initialize();
    }
  },
  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.data = this.incomingData;
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
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },

    save() {
      this.close();
    }
  }
};
</script>




<style lang="sass">
.custom-transform-class
  text-transform: uppercase
</style>