<template>
  <div>
    <v-container v-if="loaded">
      <v-row no-gutters>
        <v-col
          v-for="item in apiData"
          :key="item.CROSS"
          cols="12"
          lg="2"
          md="3"
        >
          <v-card
            outlined
            elevation="6"
            class="ma-3"
            max-width="200"
            color="#385F73"
            @click="select_cross(item)"
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  class="subtitle-1 mb-1 font-weight-light green--text text--lighten-3"
                >
                  {{ item.CROSS }}
                </v-list-item-title>
                <v-list-item-subtitle class="font-weight-light white--text">{{
                  item.COUNT
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import NlpApi from "@/apis/pythonApis/NlpApi";

export default {
  name: "brokerChatSummary",
  components: {},
  props: {
    date_str: { type: String },
    batch_end_date_str: { type: String },
    isBatch: { type: Boolean },
  },
  data() {
    return {
      apiData: [],
      loaded: false,
    };
  },
  async created() {
    if (this.isBatch) {
      await this.getApiData_batch();
    } else {
      await this.getApiData();
    }
  },
  computed: {},
  methods: {
    select_cross(item) {
      this.$emit("crossSelected", item.CROSS);
    },
    async getApiData() {
      try {
        let response = await NlpApi.get_summary(this.date_str);
        this.apiData = response.data;
        this.loaded = true;
        this.$emit("alertLoaded", true);
      } catch (error) {
        console.log(error);
      }
    },
    async getApiData_batch() {
      try {
        let response = await NlpApi.get_summary_batch(
          this.date_str,
          this.batch_end_date_str
        );
        this.apiData = response.data;
        this.loaded = true;
        this.$emit("alertLoaded", true);
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {},
};
</script>

<style>
</style>
