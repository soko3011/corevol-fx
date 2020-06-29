<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="200">
      <template v-slot:activator="{ on, attrs }">
        <v-icon :color="color" v-bind="attrs" v-on="on">{{ icon }}</v-icon>
      </template>

      <v-card flush class="mx-auto" max-width="200">
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
    color: { type: String }
  },
  methods: {
    emitToParent(item) {
      this.$emit("selection", item);
    }
  }
};
</script>

<style></style>
