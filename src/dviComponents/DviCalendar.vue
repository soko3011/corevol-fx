
<template lang="html">
  <div class="wrapper-jexcel">

    <div id="spreadsheet" ref="spreadsheet"></div>
  </div>
</template>

<script>
import jexcelStyle from 'jexcel/dist/jexcel.css' // eslint-disable-line no-unused-vars
import jexcel from 'jexcel' // eslint-disable-line no-unused-vars
import setData from 'jexcel' // eslint-disable-line no-unused-vars
import * as customFunctions from '@/externaljs/customfunctions.js' // eslint-disable-line no-unused-vars
import * as cellElements from '@/externaljs/cellElements.js'

export default {
  name: 'dviCalendar',
  created: function () {
    document.addEventListener('keydown', this.EventListeners)
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.EventListeners)
  },
  data () {
    return {
      colWidthsSurf: [200, 100, 50, 80],
      row: [],
      col: []
    }
  },
  props: {
    calData: { type: Array }
  },
  computed: {
    config () {
      return {
        columnSorting: false,
        colWidths: this.colWidthsSurf,
        onchange: this.OnChange,
        allowInsertRow: false,
        onselection: this.selectionActive
      }
    },
    apidata () {
      // return this.$store.getters.forCalGetter;
      return this.calData
    },
    jExcelOptions () {
      return customFunctions.JexcelTableSettings(this.apidata, this.config)
    }
  },
  methods: {
    OnChange (instance, cell, x, y, value) {
      // eslint-disable-line no-unused-vars

      this.FormatTable(this.apidata, this.jExcelObj)
      this.FormatTable(this.apidata, this.jExcelObj)
    },
    selectionActive (instance, x1, y1, x2, y2, origin) {
      this.row = y1
      this.col = x1
    },
    EventListeners (event) {
      if (event.code === 'Space' && this.col === 0) {
        event.preventDefault()

        var cell = cellElements.getCellFromCoords(
          this.jExcelObj,
          this.col,
          this.row
        )

        var myArr = this.jExcelObj.getValueFromCoords(this.col, this.row)
        var result = myArr.split(',')

        cellElements.openEditor(
          this.jExcelObj,
          cell,
          'empty',
          'dropdown',
          result,
          this.col,
          this.row
        )
      }
    },
    RefreshTable () {
      this.jExcelObj.setData(customFunctions.ReFormatJson(this.apidata))
      this.FormatTable(this.apidata, this.jExcelObj)
    },
    FormatTable (data, table) {
      table.hideIndex()

      for (var i = 0; i < data.length; i++) {
        var row = i + 1
        const col1Name = 'B' + row

        table.setStyle(col1Name, 'color', '#000080')
        // table.setStyle( col1Name, 'font-weight', 'bold');
      }
    }
  },
  mounted: function () {
    const jExcelObj = jexcel(this.$refs.spreadsheet, this.jExcelOptions)
    this.FormatTable(this.apidata, jExcelObj)
    Object.assign(this, { jExcelObj }) // tucks all methods under jExcelObj object in component instance
  },
  watch: {
    apidata () {
      this.RefreshTable()
    }
  }
}
</script>

<style>
</style>
