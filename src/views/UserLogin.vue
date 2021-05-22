<template>
  <transition name="fade">
    <v-app v-if="loading" class="grey darken-4">
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
          <div class="d-flex flex-column">
            <span
              class="font-weight-light text-center mt-6 mb-3 white--text"
              @click="
                () => $router.push({ name: 'UserRegistration' }).catch(() => {})
              "
            >
              Register
            </span>

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
  </transition>
</template>

<script>
import UserAuthForm from "@/components/userAuth/UserAuthForm";
export default {
  components: {
    UserAuthForm,
  },
  computed: {
    loading() {
      return this.$store.state.appLoaded;
    },
  },
  methods: {
    async loginUser(loginInfo) {
      let user = await this.$store.dispatch("login", loginInfo);
      if (user.error) {
        this.$store.dispatch("setSnackbar", {
          text: user.error,
          top: true,
        });
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `Welcome back ${user.UserName}`.toUpperCase(),
          top: true,
        });

        this.$router.push("/splashScreen");
      }
    },
  },
};
</script>

<style >
span {
  cursor: pointer;
}
</style>
