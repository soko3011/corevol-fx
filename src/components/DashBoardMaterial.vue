<template>
  <div>
    <!-- <v-btn @click="dev" /> -->
    <v-data-table
      dense
      :headers="headers"
      :items="tableData"
      item-key="name"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar height="40" class="mb-3" dark color="#385F73">
          <v-toolbar-title>{{toolbarData}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon small :color="warnColor" @click="gotoDvi(item)">mdi-lightning-bolt</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:footer>
        <v-system-bar height="5" :color="warnColor"></v-system-bar>
      </template>
    </v-data-table>
  </div>
</template>


<script>
export default {
  props: {
    surfData: { type: Array },
    toolbarData: { type: String },
    footerData: { type: String },
    warnColor: { type: String }
  },

  data: () => ({}),
  computed: {
    headers() {
      let headerArray = [];

      const titles = Object.keys(this.surfData[0]);
      for (var title of titles) {
        let headerObj = {
          text: title,
          align: "center",
          sortable: false,
          value: title
        };
        headerArray.push(headerObj);
      }

      return headerArray;
    },
    tableData() {
      return this.surfData;
    }
  },
  methods: {
    dev() {
      console.log(this.headers1);
    }
  }
};
</script>

