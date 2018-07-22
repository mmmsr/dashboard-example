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
        Input text
        <!-- <span slot="subtitle">Basic horizontal bar chart</span> -->
      </q-card-title>
      <q-card-main>
        <!-- With floating label -->
        <q-input
          v-model="originalText"
          type="textarea"
          float-label="Original Text"
          :max-height="100"
          rows="7"
        />
        <q-btn
          @click="summarize()"
          color="primary">
          summarize
        </q-btn>
      </q-card-main>

      <q-card-title>
        要約結果
        <!-- <span slot="subtitle">Stacked bar chart</span> -->
      </q-card-title>

      <q-card-main>
        <!-- title="Week 1" -->
        <q-input
          v-model="summarizedText"
          type="textarea"
          float-label="Summarized Text"
          :max-height="100"
          rows="7"
        />
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
// import { date } from 'quasar'
import axios from 'axios'

export default {
  data () {
    return {
      originalText: '',
      summarizedText: '',
      startDate: null,
      week1Columns: [],
      week2Columns: [],
      week1Data: [],
      week2Data: []
    }
  },
  methods: {
    summarize: function () {
      let data = new FormData()
      this.isLoading = true
      this.hasResult = false
      this.fetchResult(data, this.originalText).then((data) => {
        this.summarizedText = []
        if (data) {
          data = JSON.parse(data)
          console.log(data)
          console.log(data.summary)
          console.log(data['summary'])
          this.hasResult = true
        } else {
          // console.log('no result')
          this.hasResult = false
        }
        this.summarizedText = data.summary.join('\n')
        // this.summarizedText = data.summary.join('-')
        this.isLoading = false
      })
    },
    fetchResult: function (data, originalText) {
      // const url = `${process.env.SUMMPY_API_URL}/summarize?sent_limit=3&text=test`
      const url = `${process.env.SUMMPY_API_URL}/api/test`
      let formdata = {
        originalText: encodeURI(originalText)
      }
      console.log(encodeURI(originalText))
      let formJson = JSON.stringify(formdata)
      data.append('form_json', formJson)
      // return axios.get(
      return axios.post(
        url,
        data,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
          }
        }
      ).then(
        response => response.data
      ).catch(
        error => {
          console.log(error)
          this.$q.notify({
            icon: 'warning',
            color: 'negative',
            message: `Server not running`,
            detail: 'Please contact developer',
            position: 'top-right' // 'top', 'left', 'bottom-left' etc
          })
        }
      )
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
