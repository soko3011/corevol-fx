<template>
  <div>
    <v-data-table
      dense
      :headers="headers"
      :items="tableData"
      item-key="name"
      class="elevation-0"
      :options="options"
      hide-default-footer
    >
      <!-- eslint-disable-next-line vue/valid-v-slot-->
      <template #[`item.${currentTermStructure}`]="{ item }">
        <div class="blue--text text--darken-4 font-weight-bold">
          {{ item[currentTermStructure] }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    inputData: { type: Array },
    inputHeaders: { type: Array },
    rowsPerPage: { type: Number, default: 15 },
  },

  data: () => ({}),
  computed: {
    options() {
      return {
        itemsPerPage: this.rowsPerPage,
      };
    },
    currentTermStructure() {
      return this.inputHeaders[1];
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
      console.log(this.currentTermStructure);
    },
  },
};
</script>
