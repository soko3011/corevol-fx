<template>
  <v-treeview
    v-model="tree"
    open-all
    :items="listItems"
    activatable
    item-key="name"
    open-on-click
    @update:active="emitToParentSelection"
  >
    <div></div>
    <template v-slot:prepend="{ item, open }">
      <v-icon color="black" v-if="!item.file">
        {{ open ? "mdi-folder-open" : "mdi-folder" }}
      </v-icon>
      <v-icon color="blue-grey" v-else>
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
          file: "txt"
        };

        children.push(child);
      });
      const parent = [];
      parent.push({ name: this.inputData.listName, children: children });

      return parent;
    }
  },
  data: () => ({
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
    tree: []
  }),
  methods: {
    emitToParentSelection(value) {
      this.$emit("selection", value[0]);
    }
  }
};
</script>

<style></style>
