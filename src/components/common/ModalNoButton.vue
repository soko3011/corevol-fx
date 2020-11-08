<template>
  <v-row justify="center">
    <v-dialog v-model="dialogToggle" max-width="300">
      <v-card class="mx-auto" max-width="300">
        <v-toolbar height="40px" color="blue-grey" dark>
          <v-spacer />
          <v-toolbar-title class="ma-4">{{ title }}</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-list>
          <v-list-item-group mandatory color="indigo">
            <v-list-item
              class="text-center"
              dense
              v-for="(item, index) in inputData"
              :key="index"
              @click="emitToParent(item)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
                <v-divider class="mt-2" light></v-divider>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogToggle = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    inputData: { type: Array },
    title: { type: String },
    vmodel: { type: Boolean },
  },
  computed: {
    dialogToggle: {
      get() {
        return this.vmodel;
      },
      set(val) {
        this.$emit("setvmodel", val);
      },
    },
  },

  methods: {
    emitToParent(item) {
      this.$emit("selection", item);
      this.dialogToggle = false;
    },
  },
};
</script>

<style></style>
