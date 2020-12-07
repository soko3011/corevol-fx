<template>
  <div>
    <v-card flat color="#385F73" dark>
      <div>
        <v-card-title class="subtitle-1 green--text text--lighten-3"
          >ATM CONTROLS
          <v-btn icon>
            <v-icon small color="blue lighten-3" @click="toggleSmileController"
              >mdi-dots-hexagon</v-icon
            ></v-btn
          ></v-card-title
        >
        <div class="d-flex flex-nowrap justify-start textFields">
          <v-text-field
            dense
            label="Expiry1"
            color="blue lighten-3"
            v-model="expiry1"
            outlined
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            class="mx-2"
            :rules="[required('Expiry')]"
          ></v-text-field>

          <v-text-field
            dense
            color="blue lighten-3"
            label="Expiry2"
            v-model="expiry2"
            outlined
            class="mx-2"
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            :rules="[required('Expiry')]"
          ></v-text-field>
        </div>
        <div class="d-flex flex-nowrap justify-start textFields">
          <v-text-field
            dense
            color="blue lighten-3"
            label="Vol1"
            v-model="vol1"
            outlined
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            class="mx-2"
            :rules="[required('Vol'), positiveNumber()]"
          ></v-text-field>

          <v-text-field
            dense
            color="blue lighten-3"
            label="Vol2"
            v-model="vol2"
            outlined
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            class="mx-2"
            :rules="[required('Vol'), positiveNumber()]"
          ></v-text-field>
        </div>
        <div class="d-flex flex-nowrap justify-start textFields">
          <v-text-field
            dense
            color="blue lighten-3"
            label="Dk"
            v-model="dk"
            outlined
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            class="mx-2"
            :rules="[required('DK'), anyNumber()]"
          ></v-text-field>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import validations from "@/utils/validations";

export default {
  name: "atmController",
  created() {
    this.refreshFromApi();
  },
  data() {
    return {
      expiry1: "",
      expiry2: "",
      vol1: "",
      vol2: "",
      dk: "",
      ...validations,
    };
  },
  computed: {
    ...mapState({
      apidata: (state) => state.dvi.volInput,
    }),
  },
  methods: {
    refreshFromApi() {
      this.expiry1 = this.apidata[0].Expiry.toUpperCase();
      this.expiry2 = this.apidata[1].Expiry.toUpperCase();
      this.vol1 = this.apidata[0].Vols;
      this.vol2 = this.apidata[1].Vols;
      this.dk = this.apidata[0].DK;
    },

    setIdata() {
      this.$emit("dataSent");
      var iData = {
        UserName: this.$store.state.currentUser,
        Cross: this.$store.getters.activeCrossGetter,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch,
        Mat1: this.expiry1,
        Mat2: this.expiry2,
        Vol1: this.vol1,
        Vol2: this.vol2,
        Dk: this.dk,
      };

      this.$store.dispatch("returnDviAfterVolUpdate", iData);
    },
    toggleSmileController() {
      this.$emit("setSmileToggler");
    },
  },
  watch: {
    apidata() {
      this.refreshFromApi();
    },
  },
};
</script>

<style>
/* div.textFields {
  width: 230px;
} */
</style>
