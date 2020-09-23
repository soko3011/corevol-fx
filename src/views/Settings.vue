<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12" lg="8">
        <div>
          <v-card>
            <v-btn absolute small fab top right color="pink" elevation="12">
              <PopUpModal
                :inputData="this.$store.state.crossList"
                :icon="'mdi-expand-all'"
                :color="'white'"
                :large="false"
                :title="'MIRROR CROSS'"
                v-on:selection="OpenDialog"
              />
            </v-btn>
          </v-card>
          <DviSetup
            v-on:ccyPairDeleted="refreshChildren = !refreshChildren"
            :refreshComponent="refreshChildren"
          />
        </div>
      </v-col>
      <v-col cols="12" sm="12" lg="4">
        <MarketData :refreshComponent="refreshChildren" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" lg="7">
        <CrossSetup :refreshComponent="refreshChildren" />
      </v-col>
      <v-col cols="12" sm="12" lg="5">
        <CcySetup />
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title>
          <span class="title">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="2" v-for="key in dviKeys" :key="key">
                <v-text-field v-model="dviEdited[key]" :label="key"></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="mt-5 mb-10" />
            <v-row>
              <v-col cols="12" sm="6" md="2" v-for="key in crossKeys" :key="key">
                <v-text-field v-model="crossEdited[key]" :label="key"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save(dviEdited,crossEdited)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DviSetup from "@/components/DviSetup.vue";
import CrossSetup from "@/components/CrossSetup.vue";
import CcySetup from "@/components/CcySetup.vue";
import MarketData from "@/components/MarketData.vue";
import SettingsApi from "@/apis/SettingsApi";
import PopUpModal from "@/components/PopUpModal.vue";

export default {
  name: "Setup",
  data: () => ({
    refreshChildren: false,
    dialog: false,
    dviKeys: [],
    crossKeys: [],
    dviEdited: {},
    crossEdited: {},
    mirroredCross: ""
  }),

  components: {
    DviSetup,
    CrossSetup,
    CcySetup,
    MarketData,
    PopUpModal
  },

  computed: {
    formTitle() {
      return `Mirror ${this.mirroredCross}`;
    }
  },
  created() {
    this.$store.dispatch("refreshCrossList");
  },
  methods: {
    OpenDialog(cross) {
      SettingsApi.MirrorCrossDets({ Cross: cross })
        .then(response => {
          const dvidata = JSON.parse(response.data.dviSetup);
          const crossdata = JSON.parse(response.data.crossSetup);
          delete crossdata.Cross;
          this.dviKeys = Object.keys(dvidata);
          this.crossKeys = Object.keys(crossdata);
          this.dviEdited = dvidata;
          this.mirroredCross = this.dviEdited.Cross;
          this.dviEdited.Cross = "";
          this.crossEdited = crossdata;

          this.dialog = true;
        })
        .catch(err => {
          if (err.toString().includes("403") === true) {
            err = "Admin Rights Required";
          }
          this.$store.dispatch("setSnackbar", {
            text: ` ${err}`,
            centered: true
          });
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },

    save(dvidata, crossdata) {
      crossdata.Cross = dvidata.Cross;

      SettingsApi.AddNewCcyPair({
        DviInputsUI: dvidata,
        CrossDetsUI: crossdata
      })
        .then(response => {
          this.$store.dispatch("refreshCrossList");
          alert(
            `${dvidata.Cross} updated succesfully. Status ${response.status}`
          );
          this.refreshChildren = !this.refreshChildren;
        })
        .catch(err => {
          if (err.toString().includes("403") === true) {
            err = "Admin Rights Required";
          }
          this.$store.dispatch("setSnackbar", {
            text: `Update unsucessful.  ${err}`,
            centered: true
          });
        });

      this.close();
    }
  }
};
</script>

<style></style>
