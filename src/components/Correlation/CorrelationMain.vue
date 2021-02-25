<template>
  <div>
    <li v-for="item in staticCorrs" :key="item.Term">
      {{ item.Term }}
    </li>
  </div>
</template>

<script>
import CorrelationApi from "@/apis/CorrelationApi.js";
export default {
  props: {
    cross: { type: String }
  },
  data() {
    return {
      corrModel: [],
      atmModel: [],
      staticCorrs: []
    };
  },
  async created() {
    try {
      let response = await CorrelationApi.getCorrelationModel({
        Cross: this.cross,
        UserName: this.$store.state.currentUser
      });

      this.corrModel = JSON.parse(response.data.corrModel);
      this.atmModel = JSON.parse(response.data.atmModel);
      this.staticCorrs = this.corrModel.StaticCorrs;
      console.log(this.corrModel);
      console.log(this.atmModel);
      console.log(this.staticCorrs);
    } catch (error) {
      console.log(error);
    }
  },
  computed: {}
};
</script>

<style></style>
