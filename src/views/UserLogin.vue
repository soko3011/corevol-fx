<template>
  <v-container>
    <h1>Login</h1>
    <UserAuthForm :submitForm="loginUser" buttonText="Login" />
  </v-container>
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

