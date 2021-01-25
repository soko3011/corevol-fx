<template>
  <div>
    <v-card flat color="#385F73" dark>
      <div>
        <v-card-title class="subtitle-1 green--text text--lighten-3"
          >LONG DATES CONTROLS
          <v-btn icon>
            <v-icon class="mb-2" small color="blue lighten-3" @click="dev"
              >mdi-dots-hexagon</v-icon
            ></v-btn
          ></v-card-title
        >
        <div
          class="d-flex flex-nowrap justify-start subtitle-2 blue--text text--lighten-3 mb-4 ml-3"
        >
          Spreads To One Year
        </div>
        <div
          v-for="spread in spreads"
          :key="spread.Term"
          class="d-flex flex-nowrap justify-start textFieldsLong"
        >
          <v-text-field
            dense
            :label="`${spread.Term} ATM`"
            color="blue lighten-3"
            v-model="spread.AtmVolSpreadToOneYear"
            outlined
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            class="mx-2"
            :rules="[anyNumber()]"
          ></v-text-field>

          <v-text-field
            dense
            :label="`${spread.Term} RR`"
            color="blue lighten-3"
            v-model="spread.RrSpreadToOneYear"
            outlined
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            class="mx-2"
            :rules="[anyNumber()]"
          ></v-text-field>

          <v-text-field
            dense
            :label="`${spread.Term} FLY`"
            color="blue lighten-3"
            v-model="spread.FlySpreadToOneYear"
            outlined
            @focus="$event.target.select()"
            @keydown.enter="
              $event.target.select();
              setIdata();
            "
            class="mx-2"
            :rules="[anyNumber()]"
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
  name: "longDateController",
  data() {
    return {
      ...validations,
    };
  },
  props: {
    spreads: { type: Array },
  },
  computed: {
    ...mapState({
      apidata: (state) => state.dvi.volInput,
    }),
  },
  methods: {
    dev() {},
    setFloats() {
      this.spreads.forEach((element) => {
        for (const [key, value] of Object.entries(element)) {
          if (key !== "Term") {
            element[key] = parseFloat(value);
          }
        }
      });
    },
    setIdata() {
      this.$emit("dataSent");
      this.setFloats();

      var iData = {
        UserName: this.$store.state.currentUser,
        Cross: this.$store.getters.activeCrossGetter,
        AutoSave: this.$store.state.dviPrefs.autoSaveSwitch,
        LongDateSpreads: this.spreads,
      };

      this.$store.dispatch("returnDviAfterLongDateSpreadUpdate", iData);
    },
    toggleSmileController() {
      this.$emit("setSmileToggler");
    },
  },
};
</script>

<style>
div.textFieldsLong {
  width: 460px;
  height: 50px;
}
</style>
