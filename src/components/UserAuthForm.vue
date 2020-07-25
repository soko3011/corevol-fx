<template>
  <v-card dark class="elevation-24">
    <v-toolbar color="dark" dark flat>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon
        v-if="title==='Login'"
        @click="() => $router.push({ name: 'UserRegistration' }).catch(() => {})"
      >mdi-account-plus-outline</v-icon>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid">
        <v-text-field
          v-model="userInfo.name"
          label="Name"
          :rules="[required('name')]"
          v-if="hasName"
        />

        <v-text-field
          v-model="userInfo.username"
          label="Username"
          :rules="[required('email'), emailFormat()]"
        />

        <v-text-field
          v-model="userInfo.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          counter="true"
          :rules="[required('password'), minLength('password', 8)]"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey darken-2" x-large @click="submitForm(userInfo)">{{ buttonText }}</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import validations from "@/utils/validations";

export default {
  data() {
    return {
      valid: false,
      showPassword: false,
      userInfo: {
        username: "",
        password: ""
      },
      ...validations
    };
  },
  props: ["submitForm", "buttonText", "hasName", "title"]
};
</script>

<style lang="scss" scoped>
</style>