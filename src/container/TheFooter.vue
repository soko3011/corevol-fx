<template>
  <v-footer color="blue-grey lighten-1" app>
    <span class="white--text">Jamie Sokolsky &copy; 2020</span>
    <v-spacer />
    <span class="white--text">User: {{userName}}</span>
  </v-footer>
</template>

<script>
export default {
  name: "TheFooter",
  data() {
    return {
      userName: this.$store.state.currentUser
    };
  }
};
</script>
