<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="300">
      <template v-slot:activator="{ on, attrs }">
        <v-icon :color="color" v-bind="attrs" v-on="on">{{ icon }}</v-icon>
      </template>

      <v-card flush class="mx-auto" max-width="300">
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
    inputData: { type: Array },
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
