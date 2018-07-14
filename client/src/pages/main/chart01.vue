<template>
  <!-- <div
    style="
    width: 500px;
    max-width: 100vw;
    ">
    class="flex flex-center"
  </div> -->
  <q-page
    class="layout-padding"
    >
    <q-card
      flat
      style="max-width: 700px"
      >
      <q-card-title>
        Example Chart 1
        <span slot="subtitle">Basic horizontal bar chart</span>
      </q-card-title>
      <q-card-main>
        <horizontal-bar-chart
          :chart-data="datacollection">
        </horizontal-bar-chart>
        <!-- <button @click="fillData()">Randomize</button> -->
        <!-- <div class="_small">
        </div> -->
      </q-card-main>

      <q-card-title>
        Example Chart 2
        <span slot="subtitle">Stacked bar chart</span>
      </q-card-title>
      <q-card-main>
        <horizontal-bar-chart
          :chart-data="datacollection2"
          :options="options2">
        </horizontal-bar-chart>
        <!-- <button @click="fillData()">Randomize</button> -->
        <!-- <div class="_small">
        </div> -->
      </q-card-main>

    </q-card>
    <!-- <q-input v-model="number" type="number" float-label="Number" /> -->
    <!-- <q-input
      color="secondary"
      v-model="email"
      type="email"
      @blur="$v.email.$touch"
      :error="$v.email.$error"
    /> -->
    <!-- <line-chart
      :data="chartData"
      :options="{responsive: false, maintainAspectRatio: false}"
      :width="400"
      :height="200"
    >
    </line-chart> -->
  </q-page>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import HorizontalBarChart from './horizontal-bar-chart'
// import LineChart from './LineChart.js'

export default {
  components: {
    HorizontalBarChart
  },
  data () {
    return {
      revenue1: 0,
      revenue2: 0,
      cost1: 0,
      cost2: 0,
      rate1: 0,
      rate2: 0,
      rate3: 0,
      rate4: 0,
      term: 12,
      // number: 0,
      datacollection: null,
      datacollection2: null,
      options2: null,
      // chartdata: {
      //   labels: ['January', 'February'],
      //   datasets: [
      //     {
      //       label: 'GitHub Commits',
      //       backgroundColor: '#f87979',
      //       data: [40, 20]
      //     }
      //   ]
      // },
      email: '',
      password: ''
    }
  },
  validations: {
    email: { required, email }
  },
  methods: {
    fillData () {
      console.log('fillData')
      this.datacollection = {
        // labels: this.getLabels(this.term),
        labels: ['All dept.', 'Dept. A', 'Dept. B', 'Dept. C', 'Dept. D', 'Dept. E'],
        // labels: [this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Yearly goal',
            backgroundColor: '#C0C0C0',
            data: [37000, 15000, 9500, 5500, 2500, 4500]
            // data: [{x: '2016-12-25', y: 20}, {x: '2016-12-26', y: 10}]
            // data: this.makeHistoricalData(this.revenue1, this.term, this.rate1)
            // data: [this.getRandomInt(), this.getRandomInt()]
          },
          {
            label: 'Actual',
            backgroundColor: '#00FFFF',
            data: [8430, 3000, 1425, 605, 250, 3150]
            // data: this.makeHistoricalData(this.revenue2, this.term, this.rate2)
            // data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }

      this.datacollection2 = {
        // labels: this.getLabels(this.term),
        labels: ['All dept.', 'Dept. A', 'Dept. B', 'Dept. C', 'Dept. D', 'Dept. E'],
        // labels: [this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Actual',
            backgroundColor: '#00FFFF',
            data: [22.7, 20, 15, 11, 10, 70]
          },
          {
            label: 'Remaining',
            backgroundColor: '#C0C0C0',
            data: [77.3, 80, 85, 89, 90, 30]
          }
        ]
      }
      this.options2 = {
        scales: {
          xAxes: [{
            stacked: true,
            barPercentage: 0.9
          }],
          yAxes: [{
            stacked: true,
            barPercentage: 0.6
          }]
        }
      }
    },
    makeHistoricalData (value, term, rate) {
      let result = []
      console.log(value)
      console.log(term)
      console.log(rate)
      for (let i = 0; i < term; i++) {
        value = value * rate
        result.push(value)
      }
      console.log(result)
      return result
    },
    getLabels (term) {
      let result = []
      for (let i = 0; i < term; i++) {
        result.push(i + 1)
      }
      return result
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  },
  created () {
    this.fillData()
  }
  // name: 'PageIndex'
}
</script>

<style>
.small {
  max-width: 600px;
  margin:  150px auto;
}
</style>
