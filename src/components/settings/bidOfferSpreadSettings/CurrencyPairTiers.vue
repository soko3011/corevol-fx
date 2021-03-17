<template>
  <v-card flat>
    <v-data-table
      :headers="tableHeaders"
      :items="tableData"
      sort-by="Cross"
      dense
      disable-pagination
      hide-default-footer
    >
      <!-- eslint-disable-next-line vue/valid-v-slot-->
      <template v-slot:item.Tier="{ item }">
        {{ item.Tier.toFixed(2) }}
      </template>
      <template v-slot:top>
        <v-dialog v-model="dialog" max-width="350">
          <v-card>
            <v-container>
              <div class="d-flex flex-row flex-nowrap ">
                <div
                  class="textFieldCcyTier mr-3"
                  v-for="key in keys"
                  :key="key"
                >
                  <v-text-field
                    v-model="editedItem[key]"
                    :label="key"
                  ></v-text-field>
                </div>
              </div>
            </v-container>

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
</template>

<script>
export default {
  props: {
    inputData: { type: Array }
  },
  data: () => ({
    dialog: false,
    editedItem: {}
  }),

  computed: {
    tableData() {
      return this.inputData;
    },
    tableHeaders() {
      return this.get_headers(this.inputData[0]);
    },
    keys() {
      return Object.keys(this.inputData[0]);
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    get_headers(table_object) {
      let headers = [];
      const classText = "blue-grey darken-2 white--text font-weight-medium";

      for (const key of Object.keys(table_object)) {
        headers.push({
          text: key,
          align: "start",
          sortable: false,
          value: key,
          class: classText
        });
      }
      headers.push({
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        class: classText
      });
      return headers;
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },
    save(item) {
      this.$emit("saveCcyPairTier", item);
      this.dialog = false;
    }
  }
};
</script>

<style>
div.textFieldCcyTier {
  width: 150px;
  height: 50px;
}
</style>
