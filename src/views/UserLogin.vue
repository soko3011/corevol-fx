<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <UserAuthForm :submitForm="loginUser" buttonText="Login" title="Login" />
    </v-col>
  </v-row>
</template>

<script>
import UserAuthForm from "@/components/UserAuthForm";

export default {
  components: {
    UserAuthForm
  },
  methods: {
    async loginUser(loginInfo) {
      let user = await this.$store.dispatch("login", loginInfo);
      console.log(user);
      if (user.error || user.IsAuthed === false) {
        this.$store.dispatch("setSnackbar", {
          text: "There is an error. Please try again or register"
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: "Thank you for signing in, " + user.Username
        });
        this.$store
          .dispatch("initApp")
          .then(() => {
            this.$router.push("/settings");
          })
          .catch(error => {
            alert(error);
          });
      }
    }
  }
};
</script>

