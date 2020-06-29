<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="200">
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on">mdi-plus-circle-outline</v-icon>
      </template>

      <v-card flush class="mx-auto" max-width="200">
        <v-list>
          <v-list-item-group mandatory color="indigo">
            <v-list-item
              class="text-center"
              dense
              v-for="(item, index) in this.$store.state.crossList"
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
  methods: {
    emitToParent(item) {
      this.$emit("ccyPairSelection", item);
    }
  }
};
</script>

<style></style>
