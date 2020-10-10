<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-icon :large="large" :color="color" v-bind="attrs" v-on="on">
          {{ icon }}
        </v-icon>
      </template>

      <v-card flush class="mx-auto" max-width="400">
        <v-toolbar height="30px" color="blue-grey" dark>
          <v-spacer />
          <v-toolbar-title class="ma-4">{{ title }}</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-actions>
          <v-text-field
            class="mt-5"
            :label="label"
            dense
            outlined
            color="red"
            @change="setTextValue"
          ></v-text-field>
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="emitToParent">Add</v-btn>
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
    dialog: false,
    textValue: "",
  }),
  props: {
    label: { type: String },
    icon: { type: String },
    color: { type: String },
    title: { type: String },
    large: { type: Boolean },
  },
  methods: {
    setTextValue(item) {
      this.textValue = item;
    },
    emitToParent() {
      this.$emit("selection", this.textValue);
      this.textValue = "";
      this.dialog = false;
    },
  },
};
</script>

<style></style>
