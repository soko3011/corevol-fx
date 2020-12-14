<template>
  <div>
    <v-card flat color="#385F73" dark>
      <div class="d-flex flex-nowrap justify-start">
        <div class="firstCol" v-if="showControllerToggle">
          <v-card-title class="subtitle-1 green--text text--lighten-3"
            >SMILE CONTROLS
            <v-btn icon @click="rrModelToggle = !rrModelToggle">
              <v-icon class="mb-2" small color="blue lighten-3"
                >mdi-dots-hexagon</v-icon
              ></v-btn
            >
          </v-card-title>
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
              label="RR1"
              v-model="RR1"
              outlined
              @focus="$event.target.select()"
              @keydown.enter="
                $event.target.select();
                setIdata();
              "
              class="mx-2"
              :rules="[required('RR'), anyNumber()]"
            ></v-text-field>

            <v-text-field
              dense
              color="blue lighten-3"
              label="RR2"
              v-model="RR2"
              outlined
              @focus="$event.target.select()"
              @keydown.enter="
                $event.target.select();
                setIdata();
              "
              class="mx-2"
              :rules="[required('RR'), anyNumber()]"
            ></v-text-field>
          </div>
          <div class="d-flex flex-nowrap justify-start textFields">
            <v-text-field
              dense
              color="blue lighten-3"
              label="FLY1"
              v-model="FLY1"
              outlined
              @focus="$event.target.select()"
              @keydown.enter="
                $event.target.select();
                setIdata();
              "
              class="mx-2"
              :rules="[required('FLY'), anyNumber()]"
            ></v-text-field>

            <v-text-field
              dense
              color="blue lighten-3"
              label="FLY2"
              v-model="FLY2"
              outlined
              @focus="$event.target.select()"
              @keydown.enter="
                $event.target.select();
                setIdata();
              "
              class="mx-2"
              :rules="[required('FLY'), anyNumber()]"
            ></v-text-field>
          </div>
        </div>
        <div class="secondCol" v-if="rrModelToggle">
          <v-card-title class="subtitle-1 green--text text--lighten-3"
            >RR MODEL
            <v-btn icon @click="rrModelToggle = !rrModelToggle">
              <v-icon class="mb-2" small color="blue lighten-3"
                >mdi-dots-hexagon</v-icon
              ></v-btn
            ></v-card-title
          >
          <div class="d-flex flex-nowrap justify-start textFields">
            <v-text-field
              dense
              label="WeightBarrier"
              color="blue lighten-3"
              v-model="wgtBar"
              outlined
              @focus="$event.target.select()"
              @keydown.enter="
                $event.target.select();
                setIdata();
              "
              class="mx-2"
              :rules="[required('WgtBar'), positiveNumber()]"
            ></v-text-field>

            <v-text-field
              dense
              color="blue lighten-3"
              label="RRCorr"
              v-model="rrCorr"
              outlined
              class="mx-2"
              @focus="$event.target.select()"
              @keydown.enter="
                $event.target.select();
                setIdata();
              "
              :rules="[required('RRCORR'), anyNumber()]"
            ></v-text-field>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import validations from "@/utils/validations";
export default {
  name: "smileController",
  created() {
    this.refreshFromApi();
  },
  data() {
    return {
      expiry1: "",
      expiry2: "",
      RR1: "",
      RR2: "",
      FLY1: "",
      FLY2: "",
      wgtBar: "",
      rrCorr: "",
      showControllerToggle: true,
      rrModelToggle: false,
      ...validations
    };
  },
  props: {
    smileControllerToggle: { type: Boolean }
  },
  computed: {
    ...mapState({
      apidata: state => state.dvi.smileInput
    })
  },
  methods: {
    refreshFromApi() {
      this.expiry1 = this.apidata[0].Expiry.toUpperCase();
      this.expiry2 = this.apidata[1].Expiry.toUpperCase();
      this.RR1 = this.apidata[0].RR25;
      this.RR2 = this.apidata[1].RR25;
      this.FLY1 = this.apidata[0].FLY25;
      this.FLY2 = this.apidata[1].FLY25;
      this.wgtBar = this.apidata[0].WgtBar;
      this.rrCorr = this.apidata[0].RRCORR;
    },

    setIdata() {
      this.$emit("dataSent");
      var iData = {
        Rr1: this.RR1,
        Rr2: this.RR2,
        Fly1: this.FLY1,
        Fly2: this.FLY2,
        Wgtbar: this.wgtBar,
        Rrcorr: this.rrCorr,
        Cross: this.$route.params.ccyPair,
        UserName: this.$store.state.currentUser,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch
      };
      this.$store.dispatch("returnDviAfterSmileUpdate", iData);
    }
  },
  watch: {
    apidata() {
      this.refreshFromApi();
    },
    smileControllerToggle() {
      this.showControllerToggle = this.smileControllerToggle;
      this.rrModelToggle = this.smileControllerToggle;
    }
  }
};
</script>

<style>
/* div.textFields {
  width: 230px;
} */
</style>
