<template>
  <div>
    <v-data-table
      dense
      :headers="headers"
      :items="tableData"
      item-key="name"
      class="elevation-0"
      :options="options"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot-->
      <!-- <template v-slot:item.MAT="{ item }">
        {{ item.MAT }}
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    inputData: { type: Array },
    inputHeaders: { type: Array },
    rowsPerPage: { type: Number, default: 25 },
  },

  data: () => ({}),
  computed: {
    options() {
      return {
        itemsPerPage: this.rowsPerPage,
      };
    },
    headers() {
      let headerArray = [];
      const classText = "blue-grey darken-2 white--text font-weight-medium";

      for (var item of this.inputHeaders) {
        let headerObj = {
          text: item,
          align: "center",
          sortable: false,
          value: item,
          class: classText,
        };
        headerArray.push(headerObj);
      }

      return headerArray;
    },
    tableData() {
      return this.inputData;
    },
  },
  methods: {
    dev() {
      console.log(this.tableData);
    },
  },
};
</script>
