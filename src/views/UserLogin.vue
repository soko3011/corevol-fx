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
        />
        <UserAuthForm
          :submitForm="loginUser"
          buttonText="Log in"
          title="Log in"
        />
        <div class="text-center mt-6 white--text">
          <p font-weight-light>Register</p>
          <v-icon
            color="red"
            @click="
              () => $router.push({ name: 'UserRegistration' }).catch(() => {})
            "
            >mdi-account-plus-outline</v-icon
          >
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import UserAuthForm from "@/components/userAuth/UserAuthForm";
export default {
  components: {
    UserAuthForm
  },
  methods: {
    async loginUser(loginInfo) {
      let user = await this.$store.dispatch("login", loginInfo);
      if (user.error) {
        this.$store.dispatch("setSnackbar", {
          text: user.error,
          top: true
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: "Welcome back " + user.UserName,
          top: true
        });

        this.$router.push("/splashScreen");
      }
    }
  }
};
</script>
