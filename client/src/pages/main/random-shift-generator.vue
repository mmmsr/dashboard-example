<template>
  <!-- <div
    style="
    width: 500px;
    max-width: 100vw;
    ">
    class="flex flex-center"
  </div> -->
  <!-- <q-page
    class="-layout-padding"
    > -->
  <div class="layout-padding">
    <q-card
      flat
      style="max-width: 800px"
      >
      <q-card-title>
        ランダム振り分け対象者名を入力
        <!-- <span slot="subtitle">Basic horizontal bar chart</span> -->
      </q-card-title>
      <q-card-main>
        <!-- With floating label -->
        <q-chips-input
          v-model="members"
          float-label="Imput members here"
          add-icon="checked" />
      </q-card-main>

      <q-card-title>
        振り分け対象日の初日を入力
        <!-- <span slot="subtitle">Basic horizontal bar chart</span> -->
      </q-card-title>
      <q-card-main>
        <!-- Only Date -->
        <q-datetime
          modal
          v-model="startDate"
          type="date"
          @change="initColumns()" />
      </q-card-main>
      <q-card-main>
        <q-btn
          @click="randomAssign()"
          color="primary">
          振り分け実施
        </q-btn>
      </q-card-main>

      <q-card-title>
        振り分け結果
        <!-- <span slot="subtitle">Stacked bar chart</span> -->
      </q-card-title>

      <q-card-main>
        <!-- title="Week 1" -->
        <q-table
          :columns="week1Columns"
          :data="week1Data"
          row-key="name"
          hide-bottom
        />
        <q-table
          :columns="week2Columns"
          :data="week2Data"
          row-key="name"
          hide-bottom
        />
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import { date } from 'quasar'

const JPN_DAYS = {
  0: '日',
  1: '月',
  2: '火',
  3: '水',
  4: '木',
  5: '金',
  6: '土'
}

export default {
  data () {
    return {
      members: [],
      startDate: null,
      week1Columns: [],
      week2Columns: [],
      week1Data: [],
      week2Data: []
    }
  },
  methods: {
    saveMembers () {
      this.$q.localStorage.set('members', this.members)
    },
    loadMembers () {
      if (this.$q.localStorage.get.item('members')) {
        this.members = this.$q.localStorage.get.item('members')
      }
    },
    initDate () {
      if (this.startDate === null) {
        this.startDate = new Date()
      }
    },
    initColumns () {
      this.week1Columns = []
      this.week2Columns = []
      let tmpDate = this.startDate
      let i = 0
      let tbl1row1 = {}
      let tbl1row2 = {}
      let tbl2row1 = {}
      let tbl2row2 = {}
      while (i < 14) {
        if (tmpDate.getDay() === 0 || tmpDate.getDay() === 6) {
          // console.log('not business date')
        } else {
          let column = {
            name: `date${i}`,
            label: `${date.formatDate(tmpDate, 'MM/DD')}(${JPN_DAYS[tmpDate.getDay()]})`,
            align: 'left',
            field: `date${i}`,
            sortable: false
          }
          if (i < 7) {
            this.week1Columns.push(column)
          } else {
            this.week2Columns.push(column)
          }
        }
        tmpDate = date.addToDate(tmpDate, { days: 1 })
        i++
      }
      this.week1Data[0] = tbl1row1
      this.week1Data[1] = tbl1row2
      this.week2Data[0] = tbl2row1
      this.week2Data[1] = tbl2row2
    },
    randomAssign () {
      if (this.members.length === 0) {
        alert('enter members')
        return
      }
      let tempRow1 = []
      let tempRow2 = []

      let i = 0
      let isUnfair = false
      while (i < 10) {
        tempRow1[i] = this.members[Math.floor(Math.random() * this.members.length)]
        tempRow2[i] = this.members[Math.floor(Math.random() * this.members.length)]
        isUnfair = (tempRow1[i] === tempRow2[i])
        if (isUnfair) {
          // console.log('isUnfair: SAME PERSON')
          continue
        }
        if (i > 0) {
          isUnfair = (tempRow1[i - 1] === tempRow1[i]) || (tempRow2[i - 1] === tempRow2[i])
          if (isUnfair) {
            // console.log('isUnfair: 連続アサイン')
            continue
          }
        }
        if (!isUnfair) {
          // console.log(i)
          // console.log('FAIR')
          i++
        }
      }

      i = 0
      let tempRow1Week1 = tempRow1.slice(0, 5)
      let tempRow1Week2 = tempRow1.slice(5)
      let tempRow2Week1 = tempRow2.slice(0, 5)
      let tempRow2Week2 = tempRow2.slice(5)
      while (i < this.members.length) {
        isUnfair = (tempRow1Week1.indexOf(this.members[i]) === -1 && tempRow1Week2.indexOf(this.members[i]) === -1)
        if (isUnfair) {
          console.log('isUnfair: 1回もアサインされてない人がいる')
          return this.randomAssign()
        }
        i++
      }
      i = 0
      let week1Data0 = {}
      let week1Data1 = {}
      let week2Data0 = {}
      let week2Data1 = {}
      while (i < 5) {
        week1Data0[this.week1Columns[i].field] = tempRow1Week1[i]
        week1Data1[this.week1Columns[i].field] = tempRow2Week1[i]
        week2Data0[this.week2Columns[i].field] = tempRow1Week2[i]
        week2Data1[this.week2Columns[i].field] = tempRow2Week2[i]
        i++
      }
      this.week1Data = [week1Data0, week1Data1]
      this.week2Data = [week2Data0, week2Data1]
      this.saveMembers()
    }
  },
  created () {
    this.loadMembers()
    this.initDate()
    this.initColumns()
  }
  // name: 'PageIndex'
}
</script>

<style>
.q-table-container {
  box-shadow: none;
}
/* .small {
  max-width: 600px;
  margin:  150px auto;
} */
</style>
