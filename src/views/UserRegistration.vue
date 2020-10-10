<template>
  <v-app class="grey darken-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-toolbar
          class="mb-10"
          prominent
          flat
          color="grey darken-4"
          src="@/logo/corevollogo.png"
        ></v-toolbar>
        <UserAuthForm
          :submitForm="registerUser"
          buttonText="Register"
          hasName="true"
          title="Register"
        />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import UserAuthForm from "@/components/userAuth/UserAuthForm.vue";
export default {
  components: {
    UserAuthForm
  },
  methods: {
    async registerUser(registrationInfo) {
      let user = await this.$store.dispatch("register", registrationInfo);
      if (user.error) {
        this.$store.dispatch("setSnackbar", {
          text: user.error,
          centered: true
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: "Welcome " + user.UserName,
          top: true
        });

        this.$router.push("/settings");
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
