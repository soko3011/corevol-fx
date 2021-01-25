<template>
  <div>
    <v-card color="#385F73" class="mx-2" min-width="770" v-if="hasData">
      <v-container>
        <div class="d-flex flex-nowrap justify-space-between">
          <v-spacer />
          <v-btn @click="$emit('toggle')" color="green lighten-3" dark icon>
            <v-icon>mdi-repeat</v-icon>
          </v-btn>
        </div>
        <div class="d-flex flex-nowrap justify-space-between">
          <LongDateController
            :spreads="spreads"
            v-on:dataSent="alertUserDviChange()"
          />
        </div>
        <v-progress-linear
          :value="progress"
          color="green lighten-3"
          absolute
          height="7"
        ></v-progress-linear>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import LongDateController from "@/components/dviComponents/UserControls/LongDateControls/LongDateController.vue";
import DviApi from "@/apis/DviApi";

export default {
  name: "longDateUserControl",
  components: {
    LongDateController,
  },
  async created() {
    try {
      let response = await DviApi.getLongDateSpreads({
        UserName: this.$store.state.currentUser,
        Cross: this.$route.params.ccyPair,
      });
      this.spreads = JSON.parse(response.data.longDateSpreads);
    } catch (error) {
      alert(error);
    }
  },

  data() {
    return {
      progress: 0,
      spreads: [],
    };
  },
  computed: {
    hasData() {
      if (this.spreads.length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    alertUserDviChange() {
      this.progress = 100;
      setTimeout(() => {
        this.progress = 0;
      }, 650);
    },
  },
  watch: {},
};
</script>


