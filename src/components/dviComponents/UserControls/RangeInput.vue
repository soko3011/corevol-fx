<template>
  <div>
    <v-card flat color="#385F73" dark>
      <div>
        <v-card-title class="subtitle-1 green--text text--lighten-3"
          >CUSTOM DAY WGT RANGE
          <v-btn icon>
            <v-icon small color="blue lighten-3"
              >mdi-dots-hexagon</v-icon
            ></v-btn
          ></v-card-title
        >
        <div class="d-flex flex-nowrap justify-start userRange mb-2">
          <v-text-field
            dense
            label="RangeName"
            color="blue lighten-3"
            v-model="rangeName"
            @focus="$event.target.select()"
            class="mx-2"
            :rules="[required('Range Name')]"
          ></v-text-field>
        </div>
        <div class="d-flex flex-nowrap justify-start userRange">
          <v-select
            v-if="datesToggle"
            prepend-icon="mdi-calendar"
            color="blue lighten-3"
            dense
            v-model="startTerm"
            :items="termsList"
            label="Select Term"
            :rules="[required('Start Term')]"
          >
          </v-select>
          <v-menu
            v-else
            v-model="menuStart"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            width="100px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                v-model="calDateStart"
                label="Start Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[required('Start Date')]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="calDateStart"
              @input="menuStart = false"
            ></v-date-picker>
          </v-menu>

          <v-select
            v-if="datesToggle"
            prepend-icon="mdi-calendar"
            color="blue lighten-3"
            dense
            v-model="endTerm"
            :items="termsList"
            label="Select Term"
            :rules="[required('End Term')]"
          >
          </v-select>
          <v-menu
            v-else
            v-model="menuEnd"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            width="100px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                v-model="calDateEnd"
                label="End Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[required('End Date')]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="calDateEnd"
              @input="menuEnd = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <div
          class="d-flex flex-nowrap justify-space-around userRange mt-n2 mb-4"
        >
          <v-radio-group v-model="radio" row dense>
            <v-spacer />
            <v-radio label="Term" value="term"></v-radio>
            <v-radio label="Expiry" value="expiry"></v-radio>
            <v-spacer />
          </v-radio-group>
        </div>
        <div class="d-flex flex-nowrap justify-start userRange mb-2">
          <v-select
            prepend-icon="mdi-dots-square"
            color="blue lighten-3"
            dense
            v-model="keepExistingWgt"
            :items="['TRUE', 'FALSE']"
            label="KeepExistingWgts"
          >
          </v-select>
          <v-text-field
            dense
            outlined
            color="blue lighten-3"
            label="DayWgt"
            v-model="dayWgt"
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            class="mx-2"
            :rules="[required('dayWgt'), positiveNumber()]"
          ></v-text-field>
        </div>
        <div class="d-flex flex-nowrap justify-start userRange">
          <v-spacer />
          <v-btn color="blue lighten-1" @click="activateNewRange()"
            >Activate Custom Range</v-btn
          >
          <v-spacer />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import validations from "@/utils/validations";
import PricerApi from "@/apis/PricerApi";

export default {
  name: "rangeInput",
  async created() {
    try {
      let response = await PricerApi.getGlobalTermsList();
      this.termsList = JSON.parse(response.data.termsList);
    } catch (error) {
      alert(error);
    }
  },
  props: {
    activeRange: { type: Object },
  },
  data() {
    return {
      rangeName: "",
      keepExistingWgt: "FALSE",
      dayWgt: 1,
      ...validations,
      radio: "expiry",
      selection: "",
      startTerm: "",
      endTerm: "",
      calDateStart: new Date().toISOString().substr(0, 10),
      calDateEnd: new Date().toISOString().substr(0, 10),
      menuStart: false,
      menuEnd: false,
      termsList: [],
    };
  },
  computed: {
    datesToggle() {
      return this.radio === "term" ? true : false;
    },
    startDate() {
      return this.radio === "expiry" ? this.calDateStart : this.startTerm;
    },
    endDate() {
      return this.radio === "expiry" ? this.calDateEnd : this.endTerm;
    },
  },
  methods: {
    refreshSelection() {
      this.rangeName = this.activeRange.RangeName;
      this.keepExistingWgt = this.activeRange.KeepExistingWgt;
      this.dayWgt = this.activeRange.DayWgt;

      if (this.activeRange.StartDate.length > 2) {
        this.radio = "expiry";
        this.calDateStart = this.activeRange.StartDate;
        this.calDateEnd = this.activeRange.EndDate;
      } else {
        this.radio = "term";
        this.startTerm = this.activeRange.StartDate;
        this.endTerm = this.activeRange.EndDate;
      }
    },
    activateNewRange() {
      var iData = {
        UserName: this.$store.state.currentUser,
        Cross: this.$store.getters.activeCrossGetter,
        UserEventRangeUI: {
          RangeName: this.rangeName,
          StartDate: this.startDate,
          EndDate: this.endDate,
          KeepExistingWgt: this.keepExistingWgt,
          DayWgt: this.dayWgt,
        },
      };
      console.log(this.radio);
      console.log(iData);
      if (
        iData.UserEventRangeUI.RangeName != "" &&
        iData.UserEventRangeUI.StartDate != "" &&
        iData.UserEventRangeUI.EndDate != "" &&
        iData.UserEventRangeUI.DayWgt != "" &&
        iData.UserEventRangeUI.keepExistingWgt != ""
      ) {
        this.$store.dispatch("returnDviAfterUserWgtRangeUpdate", iData);
      }
    },

    setIdata() {
      this.$emit("dataSent");
      // var iData = {
      //   UserName: this.$store.state.currentUser,
      //   Cross: this.$store.getters.activeCrossGetter,
      //   UserEventRangeUI: {
      //     RangeName: this.rangeName,
      //     StartDate: this.startDate,
      //     EndDate: this.endDate,
      //     overrideDayWgt: this.overrideDayWgt,
      //     DayWgt: this.dayWgt,
      //   },
      // };

      // if (
      //   iData.UserEventRangeUI.StartDate != "" &&
      //   iData.UserEventRangeUI.EndDate != "" &&
      //   iData.UserEventRangeUI.DayWgt != "" &&
      //   iData.UserEventRangeUI.overrideDayWgt != ""
      // ) {
      //   this.$store.dispatch("returnDviAfterUserWgtRangeUpdate", iData);
      // }
    },
  },
  watch: {
    activeRange() {
      console.log(this.startDate.length);
      console.log(this.endDate);
      console.log(this.radio);
      this.refreshSelection();
    },
  },
};
</script>

<style>
</style>
