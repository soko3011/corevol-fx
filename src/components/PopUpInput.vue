<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-icon :color="color" v-bind="attrs" v-on="on">{{ icon }}</v-icon>
      </template>

      <v-card flush class="mx-auto" max-width="400">
        <v-toolbar height="40px" color="blue-grey" dark>
          <v-spacer />
          <v-toolbar-title class="ma-4">{{ title }}</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-text-field :label="label" @change="emitToParent"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false
  }),
  props: {
    label: { type: String },
    icon: { type: String },
    color: { type: String },
    title: { type: String }
  },
  methods: {
    emitToParent(item) {
      this.$emit("selection", item);
    }
  }
};
</script>

<style></style>
