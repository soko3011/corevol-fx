<template>
  <div>
    <v-card color="#385F73" dark>
      <v-card-title class="headline">Forward Vols</v-card-title>

      <v-card-subtitle>Scroll over any two dates to get the fwd vol</v-card-subtitle>
      <div class="mx-2">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              dense
              label="CalDay1"
              :value="fwdVolInputs.cal1"
              outlined
              @change="userCal1"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              dense
              label="Mat1"
              :value="fwdVolInputs.mat1"
              outlined
              style="font-size: 14px;"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field dense label="Vol1" :value="fwdVolInputs.vol1" outlined @change="userVol1"></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="mx-2">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              dense
              label="Calday2"
              :value="fwdVolInputs.cal2"
              outlined
              @change="userCal2"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              dense
              label="Mat2"
              :value="fwdVolInputs.mat2"
              outlined
              style="font-size: 14px;"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field dense label="Vol2" :value="fwdVolInputs.vol2" outlined @change="userVol2"></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="mx-2">
        <v-row>
          <v-col cols="12">
            <v-text-field dense label="Fwd Vol" :value="fwdVolResult" outlined></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { watch } from "fs";
export default {
  name: "fwdVol",

  methods: {
    calcFwdVol() {
      var a =
        this.fwdVolInputs.vol2 *
        this.fwdVolInputs.vol2 *
        (this.fwdVolInputs.cal2 / 365);
      var b =
        this.fwdVolInputs.vol1 *
        this.fwdVolInputs.vol1 *
        (this.fwdVolInputs.cal1 / 365);
      var c = (this.fwdVolInputs.cal2 - this.fwdVolInputs.cal1) / 365;
      var d = (a - b) / c;

      this.fwdVolInputs.fwdD = this.fwdVolInputs.cal2 - this.fwdVolInputs.cal1;
      this.fwdVolInputs.fwdV = Math.sqrt(d).toFixed(2);
    },

    userVol1(val) {
      this.fwdVolInputs.vol1 = val;
      this.calcFwdVol();
    },
    userVol2(val) {
      this.fwdVolInputs.vol2 = val;
      this.calcFwdVol();
    },
    userCal1(val) {
      this.fwdVolInputs.cal1 = val;
      this.fwdVolInputs.vol1 = this.fwdVolInputs.volArr[val - 1];
      this.fwdVolInputs.mat1 = this.fwdVolInputs.dateArr[val - 1];

      this.calcFwdVol();
    },
    userCal2(val) {
      this.fwdVolInputs.cal2 = val;
      this.fwdVolInputs.vol2 = this.fwdVolInputs.volArr[val - 1];
      this.fwdVolInputs.mat2 = this.fwdVolInputs.dateArr[val - 1];
      this.calcFwdVol();
    }
  },
  computed: {
    ...mapState({
      fwdVolInputs: state => state.fwdVolInputs
    }),
    fwdVolResult() {
      return `${this.fwdVolInputs.fwdD} day vol in ${this.fwdVolInputs.cal1} days time is ${this.fwdVolInputs.fwdV}`;
    }
  }
};
</script>

<style>
</style>