<template>
  <div>
    <div ref="table"></div>
    <VueTabulator v-model="tableData" :options="options" />
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      tableData: [
        { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
        { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
        {
          id: 3,
          name: "Christine Lobowski",
          age: "42",
          col: "green",
          dob: "22/05/1982"
        },
        {
          id: 4,
          name: "Brendon Philips",
          age: "125",
          col: "orange",
          dob: "01/08/1980"
        },
        {
          id: 5,
          name: "Margret Marmajuke",
          age: "16",
          col: "yellow",
          dob: "31/01/1999"
        }
      ],
      options: {
        columns: [
          { title: "Name", field: "name", width: 150 },
          {
            title: "Age",
            field: "age",
            hozAlign: "left",
            formatter: "progress"
          },
          { title: "Favourite Color", field: "col" },
          { title: "Date Of Birth", field: "dob", hozAlign: "center" },
          {
            title: "Rating",
            field: "rating",
            hozAlign: "center",
            formatter: "star"
          },
          {
            title: "Passed?",
            field: "passed",
            hozAlign: "center",
            formatter: "tickCross"
          }
        ] //define table columns
      }

      //data for table to display
    };
  },
  watch: {}
};
</script>

<style lang="scss">
@import "~vue-tabulator/dist/scss/bootstrap/tabulator_bootstrap4";
</style>
