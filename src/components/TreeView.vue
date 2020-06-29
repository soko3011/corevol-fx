<template>
  <v-treeview
    v-model="tree"
    :open="open"
    :items="listItems"
    activatable
    item-key="name"
    open-on-click
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="!item.file">
        {{ open ? "mdi-folder-open" : "mdi-folder" }}
      </v-icon>
      <v-icon v-else>
        {{ files[item.file] }}
      </v-icon>
    </template>
  </v-treeview>
</template>

<script>
export default {
  props: {
    inputData: { type: Object }
  },
  computed: {
    listItems() {
      const children = [];
      this.inputData.list.forEach(element => {
        const child = {
          name: element,
          file: "html"
        };

        children.push(child);
      });
      const parent = [];
      parent.push({ name: this.inputData.listName, children: children });

      return parent;
    }
  },
  data: () => ({
    open: ["public"],
    files: {
      html: "mdi-language-html5",
      js: "mdi-nodejs",
      json: "mdi-json",
      md: "mdi-markdown",
      pdf: "mdi-file-pdf",
      png: "mdi-file-image",
      txt: "mdi-file-document-outline",
      xls: "mdi-file-excel"
    },
    tree: [],
    items: [
      {
        name: "ActivePricers",
        children: [
          {
            name: "favicon.ico",
            file: "png"
          },
          {
            name: "index.html",
            file: "html"
          }
        ]
      }
    ]
  }),
  mounted() {
    console.log(this.listItems);
  }
};
</script>

<style></style>
