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

      <template
        v-for="header in inputHeaders.filter(header => header !== 'Term')"
        #[`item.${header}`]="{ item }"
      >
        {{ item[header].toFixed(2) }}
      </template>
      <template v-if="applyFormat" #[`item.${formatHeaderColumns}`]="{ item }">
        <div class="blue--text text--darken-4 font-weight-bold">
          {{ item[formatHeaderColumns].toFixed(2) }}
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
    applyFormat: { type: Boolean, default: false },
    formatHeaders: { type: String }
  },

  data: () => ({}),
  computed: {
    options() {
      return {
        itemsPerPage: this.rowsPerPage
      };
    },
    formatHeaderColumns() {
      let index = this.inputHeaders.indexOf(this.formatHeaders);
      return this.inputHeaders[index];
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
          width: "1%"
        };
        headerArray.push(headerObj);
      }

      return headerArray;
    },
    tableData() {
      return this.inputData;
    }
  },
  methods: {
    dev() {
      console.log(this.formatHeaderColumns);
    }
  }
};
</script>
