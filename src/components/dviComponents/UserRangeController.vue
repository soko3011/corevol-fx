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
            label="rangeName"
            color="blue lighten-3"
            v-model="rangeName"
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
            label="startDate"
            v-model="startDate"
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
            label="endDate"
            v-model="endDate"
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
            label="dayWgt"
            v-model="dayWgt"
            outlined
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            class="mx-2"
            :rules="[required('dayWgt'), anyNumber()]"
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
  name: "userRangeController",
  created() {
    this.refreshFromApi();
  },
  data() {
    return {
      rangeName: "",
      startDate: "",
      endDate: "",
      keepExistingWgt: "",
      dayWgt: "",
      ...validations
    };
  },
  computed: {
    ...mapState({
      apidata: state => state.dvi.userWgtRanges
    })
  },
  methods: {
    refreshFromApi() {
      this.rangeName = this.apidata[0].Expiry.toUpperCase();
      this.startDate = this.apidata[1].Expiry.toUpperCase();
      this.endDate = this.apidata[0].Vols;
      this.keepExistingWgt = this.apidata[1].Vols;
      this.dayWgt = this.apidata[0].dayWgt;
    },

    setIdata() {
      this.$emit("dataSent");
      var iData = {
        UserName: this.$store.state.currentUser,
        Cross: this.$store.getters.activeCrossGetter,
        UserEventRangeUI: {
          RangeName: this.rangeName,
          StartDate: this.startDate,
          EndDate: this.endDate,
          KeepExistingWgt: this.keepExistingWgt,
          DayWgt: this.dayWgt
        }
      };

      if (
        iData.UserEventRangeUI.StartDate != "" &&
        iData.UserEventRangeUI.EndDate != "" &&
        iData.UserEventRangeUI.DayWgt != "" &&
        iData.UserEventRangeUI.keepExistingWgt != ""
      ) {
        this.$store.dispatch("returnDviAfterUserWgtRangeUpdate", iData);
      }
    }
  },
  watch: {
    apidata() {
      this.refreshFromApi();
    }
  }
};
</script>

<style>
div.textFields {
  width: 230px;
}
</style>
