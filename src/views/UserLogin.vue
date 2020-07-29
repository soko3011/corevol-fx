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
      if (user.error) {
        this.$store.dispatch("setSnackbar", {
          text: user.error
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: "Welcome back " + user.UserName
        });

        this.$router.push("/settings");
      }
    }
  }
};
</script>

