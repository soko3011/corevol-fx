<template>
  <div>
    <v-card flat color="#385F73" dark>
      <div>
        <v-card-title class="subtitle-1 green--text text--lighten-3"
          >CUSTOM DAY WGT RANGE
          <v-btn icon @click="dev">
            <v-icon class="mb-2" small color="blue lighten-3"
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
            :rules="[required('Range Name'), noSpaces()]"
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
              :min="tomorrowDate"
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
              :min="tomorrowDate"
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
              updateExistingRange();
            "
            class="mx-2"
            :rules="[required('dayWgt'), positiveNumber()]"
          ></v-text-field>
        </div>
        <div class="d-flex flex-nowrap justify-space-between userRange mt-6">
          <v-btn color="blue lighten-1" @click="activateNewRange(iData)"
            >Activate
          </v-btn>

          <v-btn color="red lighten-1" @click="removeRange()">Remove </v-btn>
          <v-btn color="green lighten-1" @click="updateExistingRange()"
            >Update
          </v-btn>
          <v-btn color="grey lighten-1" @click="clearExistingRange()"
            >Clear
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import validations from "@/utils/validations";
import { mapState } from "vuex";

export default {
  name: "rangeInput",
  async created() {},
  props: {
    activeRange: { type: Object }
  },
  data() {
    return {
      rangeName: "",
      keepExistingWgt: "FALSE",
      dayWgt: 1,
      action: "Add",
      ...validations,
      radio: "expiry",
      startTerm: "",
      endTerm: "",
      calDateStart: "",
      calDateEnd: "",
      menuStart: false,
      menuEnd: false,
      termsList: [
        "1D",
        "2D",
        "3D",
        "4D",
        "5D",
        "6D",
        "1W",
        "2W",
        "3W",
        "4W",
        "5W",
        "6W"
      ]
    };
  },
  computed: {
    ...mapState({
      apidata: state => state.dvi.userWgtRanges
    }),
    activeRangeListNames() {
      return this.apidata.map(x => x.RangeName);
    },
    currentRange() {
      return this.apidata.filter(
        x => (x.RangeName = this.rangeName.toUpperCase())
      )[0];
    },
    datesToggle() {
      return this.radio === "term" ? true : false;
    },
    startDate() {
      return this.radio === "expiry" ? this.calDateStart : this.startTerm;
    },
    endDate() {
      return this.radio === "expiry" ? this.calDateEnd : this.endTerm;
    },
    iData() {
      return {
        UserName: this.$store.state.currentUser,
        Cross: this.$store.getters.activeCrossGetter,
        UserEventRangeUI: {
          RangeName: this.rangeName.toUpperCase(),
          StartDate: this.startDate,
          EndDate: this.endDate,
          KeepExistingWgt: this.keepExistingWgt,
          DayWgt: this.dayWgt,
          Action: this.action
        }
      };
    },
    resetIdata() {
      return {
        UserName: this.$store.state.currentUser,
        Cross: this.$store.getters.activeCrossGetter,
        UserEventRangeUI: {
          RangeName: this.rangeName.toUpperCase(),
          StartDate: this.currentRange.StartDate,
          EndDate: this.currentRange.EndDate,
          KeepExistingWgt: this.keepExistingWgt,
          DayWgt: "CLEAR RANGE",
          Action: this.action
        }
      };
    },
    tomorrowDate() {
      const today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      return tomorrow.toISOString().substr(0, 10);
    }
  },
  methods: {
    dev() {},

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
    resetForm() {
      this.rangeName = "";
      this.keepExistingWgt = "FALSE";
      this.dayWgt = 1;
      this.radio = "expiry";
      this.startTerm = "";
      this.endTerm = "";
      this.calDateStart = new Date().toISOString().substr(0, 10);
      this.calDateEnd = new Date().toISOString().substr(0, 10);
      this.action = "Add";
    },
    isValidated() {
      const validate = {
        hasRange: this.rangeName !== "",
        hasDayWgt: this.dayWgt !== "",
        hasKeepExisting: this.keepExistingWgt !== "",
        hasStart: this.startDate !== "",
        hadEnd: this.endDate !== ""
      };

      return Object.values(validate).every(Boolean);
    },
    async activateNewRange(iDataObject) {
      if (
        this.activeRangeListNames.indexOf(this.rangeName.toUpperCase()) > -1 &&
        this.action === "Add"
      ) {
        this.$store.dispatch("setSnackbar", {
          text: `${this.rangeName} is already in use. Select another RangeName.`,
          centered: true
        });
        return;
      }
      if (this.isValidated()) {
        let response = await this.$store.dispatch(
          "returnDviAfterUserWgtRangeUpdate",
          iDataObject
        );
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `Check inputs`,
          centered: true
        });
      }
    },
    async removeRange() {
      this.dayWgt = "CLEAR RANGE";
      this.action = "Remove";
      await this.activateNewRange(this.iData);

      this.$store.dispatch("setSnackbar", {
        text: `${this.rangeName} has been removed`,
        centered: true
      });
      this.resetForm();
    },

    updateExistingRange() {
      this.action = "Update";

      this.activateNewRange(this.iData);
      this.action = "Add";
      this.$emit("dataSent");
    },
    clearExistingRange() {
      this.action = "Update";
      this.activateNewRange(this.resetIdata);
      this.action = "Add";
    }
  },
  watch: {
    activeRange() {
      this.refreshSelection();
    }
  }
};
</script>

<style></style>
