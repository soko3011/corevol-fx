<template>
  <div>
    <!-- <v-btn color="red" @click="dev">dev</v-btn> -->
    <div class="d-flex flex-row mb-5 flex-nowrap">
      <v-toolbar color="#385F73" min-width="400" collapse>
        <v-spacer></v-spacer>
        <div class="d-flex flex-column">
          <h4
            class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
          >
            corevolFX Correlations
          </h4>
          <h4
            class="font-weight-light text-center text-uppercase green--text text--lighten-3"
            align="center"
            justify="center"
          >
            {{ cross }}

            <v-btn icon x-small class="mb-4" elevation="21">
              <PopUpModal
                :inputData="crosses"
                :icon="'mdi-dots-hexagon'"
                :color="'green lighten-3'"
                :small="true"
                :title="'Select Cross'"
                v-on:selection="changeCross"
              />
            </v-btn>
          </h4>
        </div>

        <v-spacer></v-spacer>
      </v-toolbar>
    </div>
    <div class="d-flex flex-row flex-nowrap">
      <CorrelationMain
        :cross="cross"
        :crossList="crosses"
        v-on:crossChanged="changeCross"
        :key="componentKey"
      />
    </div>
  </div>
</template>

<script>
import CorrelationMain from "@/components/Correlation/CorrelationMain.vue";
import PopUpModal from "@/components/common/PopUpModal.vue";
import ModalNoButton from "@/components/common/ModalNoButton.vue";
export default {
  components: {
    CorrelationMain,
    PopUpModal,
    ModalNoButton
  },
  created() {
    this.$store.dispatch("refreshCrossList");
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  data() {
    return {
      componentKey: 0,
      window: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    cross() {
      return this.$store.getters.corrCrossGetter;
    },
    crosses() {
      return this.$store.state.crossList.filter(x => {
        return !x.includes("USD");
      });
    }
  },
  methods: {
    dev() {
      console.log(this.$store.getters.corrCrossGetter);
    },
    changeCross(val) {
      this.$store.dispatch("setActivecross", val);
      this.componentKey += 1;
    },
    handleResize() {
      this.window.width = window.innerWidth - 100;
      this.window.height = window.innerHeight - 95;

      this.setContainerDimensions();
    },
    setContainerDimensions() {
      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height}px`
      );
      document.documentElement.style.setProperty(
        "--dwCol-height",
        `${this.window.height - 70}px`
      );
    }
  }
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);
$dviColHeight: var(--dwCol-height);

.dwCol {
  overflow-y: auto;
  height: $dviColHeight;
  display: flex;
}

.dwContainer {
  overflow-x: auto;
  overflow-y: auto;
  padding-left: 0px;
  padding-right: 0px;
  height: $dviColHeight;
  display: flex;
}

.dwContainer::-webkit-scrollbar {
  width: 6px; /* width of the entire scrollbar */
  height: 6px;
}

.dwContainer::-webkit-scrollbar-track {
  background: #eceff1; /* color of the tracking area */
}

.dwContainer::-webkit-scrollbar-thumb {
  background-color: #385f73; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 2px solid #eceff1; /* creates padding around scroll thumb */
}
</style>
