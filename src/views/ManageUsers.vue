<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      sort-by="UserName"
      class="elevation-10 custom-transform-class"
      dense
      disable-pagination
      hide-default-footer
    >
      <template v-slot:item.IsAdmin="{ item }">
        <v-simple-checkbox v-model="item.IsAdmin"></v-simple-checkbox>
      </template>
      <template v-slot:item.IsAuthed="{ item }">
        <v-simple-checkbox v-model="item.IsAuthed"></v-simple-checkbox>
      </template>
      <template v-slot:top>
        <v-toolbar dense class="mb-3" dark color="blue-grey darken-2">
          <v-toolbar-title>Manage Users</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="save(item)">mdi-content-save</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import LoginApi from "@/apis/LoginApi.js";

export default {
  data: () => ({
    keys: [],
    headers: [],
    data: [],
    addNew: false
  }),
  components: {},
  props: {
    refreshComponent: { type: Boolean, default: false }
  },

  computed: {
    userList() {
      return this.data.map(x => x.UserName);
    }
  },

  watch: {
    refreshComponent() {
      this.initialize();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      LoginApi.GetAllUsers()
        .then(response => {
          this.data = JSON.parse(response.data.userProfiles);
          let headersNew = [];
          this.keys = Object.keys(this.data[0]);

          this.keys.forEach(function(val) {
            headersNew.push({ text: val, value: val, align: "center" });
          });

          headersNew.push({
            text: "Actions",
            value: "actions",
            align: "center",
            sortable: false
          });
          this.headers = headersNew;
        })
        .catch(err => {
          if (err.toString().includes("403") === true) {
            err = "Admin Rights Required";
          }

          this.$store.dispatch("setSnackbar", {
            text: `  ${err}`
          });
        });
    },

    deleteItem(item) {
      confirm(`Are you sure you want to delete ${item.UserName}?`) &&
        LoginApi.DeleteUser(item)
          .then(response => {
            this.$store.dispatch("setSnackbar", {
              text: `${item.UserName} deleted succesfully. Status ${response.status}`
            });

            this.initialize();
          })
          .catch(err => {
            if (err.toString().includes("403") === true) {
              err = "Admin Rights Required";
            }
            this.$store.dispatch("setSnackbar", {
              text: ` Delete Unsuccessful. ${err}`
            });
          });
    },

    save(item) {
      console.log(item);
      LoginApi.UpdateUser(item)
        .then(response => {
          this.$store.dispatch("setSnackbar", {
            text: `${item.UserName} updated succesfully. Status ${response.status}`
          });

          this.initialize();
        })
        .catch(err => {
          if (err.toString().includes("403") === true) {
            err = "Admin Rights Required";
          }
          this.$store.dispatch("setSnackbar", {
            text: ` Update Unsuccessful. ${err}`
          });
        });
    }
  }
};
</script>

<style lang="sass">
.custom-transform-class
    text-transform: uppercase
</style>


