<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <UserAuthForm
        :submitForm="registerUser"
        buttonText="Register"
        hasName="true"
        title="Register"
      />
    </v-col>
  </v-row>
</template>

<script>
import UserAuthForm from "@/components/UserAuthForm.vue";
export default {
  components: {
    UserAuthForm,
  },
  methods: {
    async registerUser(registrationInfo) {
      let user = await this.$store.dispatch("register", registrationInfo);
      if (user.error) {
        this.$store.dispatch("setSnackbar", {
          text: user.error,
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: "Welcome to our app, " + user.Username,
        });
        this.$store
          .dispatch("initApp")
          .then(() => {
            this.$router.push("/settings");
          })
          .catch((error) => {
            alert(error);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>