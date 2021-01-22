<template>
  <v-card flat color="grey darken-4" dark class="elevation-00">
    <v-card-text>
      <v-form v-model="valid">
        <v-text-field
          outlined
          v-model="userInfo.email"
          label="Email"
          :rules="[required('email'), emailFormat()]"
        />

        <v-text-field
          outlined
          v-model="userInfo.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          counter="true"
          :rules="[required('password'), minLength('password', 8)]"
        >
          <v-icon
            v-if="showPassword"
            slot="append"
            color="red"
            @click="showPassword = !showPassword"
            >mdi-eye</v-icon
          >
          <v-icon
            @click="showPassword = !showPassword"
            v-else
            slot="append"
            color="red"
            >mdi-eye-off</v-icon
          >
        </v-text-field>

        <v-text-field
          outlined
          v-model="userInfo.confirmPassword"
          label="Confirm Password"
          :type="showPassword ? 'text' : 'password'"
          counter="true"
          v-if="hasName"
          :rules="[
            required('confirmPassword'),
            minLength('confirmPassword', 8),
          ]"
        >
          <v-icon
            v-if="showPassword"
            slot="append"
            color="red"
            @click="showPassword = !showPassword"
            >mdi-eye</v-icon
          >
          <v-icon
            @click="showPassword = !showPassword"
            v-else
            slot="append"
            color="red"
            >mdi-eye-off</v-icon
          >
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        width="300"
        rounded
        class="mb-5"
        color="red darken-2"
        x-large
        @click="submitForm(userInfo)"
        >{{ buttonText }}</v-btn
      >
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import validations from "@/utils/validations";

export default {
  created() {
    this.setUserTimezone();
  },
  data() {
    return {
      valid: false,
      showPassword: false,
      userInfo: {
        email: "",
        password: "",
        confirmPassword: "",
        timezone: "",
      },
      ...validations,
    };
  },
  props: ["submitForm", "buttonText", "hasName", "title"],
  methods: {
    setUserTimezone() {
      this.userInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
