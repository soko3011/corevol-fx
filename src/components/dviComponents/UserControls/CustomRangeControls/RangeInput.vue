<template>
  <div>
    <v-card flat color="#385F73" dark>
      <div class="d-flex flex-nowrap justify-space-between">
        <div class="customRangeInputs">
          <v-card-title class="subtitle-1 green--text text--lighten-3"
            >CUSTOM DAY WGT RANGE
            <v-btn icon @click="resetForm()">
              <v-icon class="mb-2" small color="blue lighten-3"
                >mdi-dots-hexagon</v-icon
              ></v-btn
            >
          </v-card-title>
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
              :rules="[required('term')]"
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
                  :rules="[required('date')]"
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
              :rules="[required('term')]"
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
                  :rules="[required('date')]"
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
              :items="[true, false]"
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
          <div class="d-flex flex-nowrap justify-space-around userRange mt-6">
            <v-btn
              color="blue lighten-1"
              @click="activateNewRange(iData)"
              v-if="isNewRange"
              >Activate
            </v-btn>
            <v-btn
              v-if="!isNewRange"
              color="green lighten-1"
              @click="updateExistingRange()"
              >Update
            </v-btn>

            <v-btn
              color="blue lighten-1"
              @click="clearExistingRange()"
              v-if="!isNewRange"
              >Clear
            </v-btn>
            <v-btn
              color="red lighten-1"
              @click="removeRange()"
              v-if="!isNewRange"
              >Remove
            </v-btn>
          </div>
        </div>
        <div class="activeRangesList userRange">
          <v-card-title class="subtitle-1 green--text text--lighten-3">
            <v-spacer />ACTIVE RANGES
            <v-btn icon @click="dev()">
              <v-icon small color="blue lighten-3"
                >mdi-dots-hexagon</v-icon
              ></v-btn
            >
            <v-spacer
          /></v-card-title>
          <v-list color="#385F73" rounded>
            <v-list-item-group color="blue lighten-3">
              <v-list-item
                v-if="apidata.length === 0"
                dark
                class="text-center"
                dense
              >
                <v-list-item-content>
                  <v-list-item-title
                    >THERE ARE NO CUSTOM RANGES SET
                  </v-list-item-title>
                  <v-divider class="mt-2" light></v-divider>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-else
                dark
                class="text-center"
                dense
                v-for="(item, index) in this.apidata"
                :key="index"
                @click="setActiveRange(item)"
              >
                <v-list-item-content>
                  <v-list-item-title
                    >Range Name:
                    <strong class="green--text text--lighten-3">{{
                      item.RangeName
                    }}</strong>
                  </v-list-item-title>
                  <v-divider class="mt-2" light></v-divider>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import validations from "@/utils/validations";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "rangeInput",
  async created() {},

  data() {
    return {
      rangeName: "",
      keepExistingWgt: true,
      dayWgt: "",
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
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch,
        UserEventRangeUI: {
          RangeName: this.rangeName.toUpperCase(),
          IsTerm: this.radio === "term" ? "true" : "false",
          StartDate: this.startDate,
          EndDate: this.endDate,
          KeepExistingWgt: this.keepExistingWgt.toString(),
          DayWgt: this.dayWgt,
          Action: this.action
        }
      };
    },
    isNewRange() {
      return this.activeRangeListNames.indexOf(this.rangeName.toUpperCase()) >
        -1
        ? false
        : true;
    },
    tomorrowDate() {
      const today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      return tomorrow.toISOString().substr(0, 10);
    }
  },
  methods: {
    dev() {
      console.log(this.apidata);
    },
    setActiveRange(item) {
      this.rangeName = item.RangeName;
      this.keepExistingWgt = item.KeepExistingWgt;
      this.dayWgt = item.DayWgt;
      if (item.IsTerm === true) {
        this.radio = "term";
        this.startTerm = item.StartTerm;
        this.endTerm = item.EndTerm;
      } else {
        this.radio = "expiry";
        this.calDateStart = item.StartDate.substr(0, 10);
        this.calDateEnd = item.EndDate.substr(0, 10);
      }
    },
    resetForm() {
      this.rangeName = "";
      this.keepExistingWgt = true;
      this.dayWgt = "";
      this.radio = "expiry";
      this.startTerm = "";
      this.endTerm = "";
      this.calDateStart = "";
      this.calDateEnd = "";
      this.action = "Add";
    },
    isUniqueRangeName() {
      if (
        this.activeRangeListNames.indexOf(this.rangeName.toUpperCase()) > -1
      ) {
        this.$store.dispatch("setSnackbar", {
          text: `${this.rangeName} is already in use. Select another RangeName.`,
          centered: true
        });
        return false;
      }

      return true;
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
    isDatesOrdered() {
      if (this.radio === "expiry") {
        return moment(this.calDateEnd).isAfter(this.calDateStart);
      }
      return (
        this.termsList.indexOf(this.startTerm) <
        this.termsList.indexOf(this.endTerm)
      );
    },

    async sendRangeToServer() {
      if (!this.isDatesOrdered()) {
        this.$store.dispatch("setSnackbar", {
          text: `END DATE MUST BE AFTER START DATE`,
          centered: true
        });
        return;
      }

      if (!this.isValidated()) {
        this.$store.dispatch("setSnackbar", {
          text: `Check inputs`,
          centered: true
        });
        return;
      }

      console.log(this.iData);
      await this.$store.dispatch(
        "returnDviAfterUserWgtRangeUpdate",
        this.iData
      );
    },
    activateNewRange() {
      if (!this.isUniqueRangeName()) {
        return;
      }
      this.sendRangeToServer();
    },
    removeRange() {
      this.action = "Remove";
      this.sendRangeToServer();

      this.$store.dispatch("setSnackbar", {
        text: `${this.rangeName} has been removed`,
        centered: true
      });
      this.resetForm();
    },
    updateExistingRange() {
      if (this.isNewRange) {
        return;
      }
      this.sendRangeToServer();
      this.$emit("dataSent");
    },
    clearExistingRange() {
      this.dayWgt = "CLEARED";
      this.sendRangeToServer();
    }
  },
  watch: {}
};
</script>

<style></style>
