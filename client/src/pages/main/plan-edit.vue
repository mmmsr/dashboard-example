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
      inline style="width: 300px"
      >
      TEST
      <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
      <!-- <q-input
        color="secondary"
        dark
        v-model="email"
        type="email"
        :float-label="$v.email.$error ? errorMsg($v.email, 'email') : 'Email'"
        :error="$v.email.$error"
        @blur="$v.email.$touch"
      /> -->
      <q-card-main>
        <q-input v-model="revenue1" type="number" float-label="Revenue1" @input="fillData()" />
        <q-input v-model="rate1" type="number" float-label="rate1" @input="fillData()" />
        <q-input v-model="revenue2" type="number" float-label="Revenue2" @input="fillData()" />
        <q-input v-model="rate2" type="number" float-label="rate2" @input="fillData()" />
        <q-input v-model="cost1" type="number" float-label="Cost1" @input="fillData()" />
        <q-input v-model="rate3" type="number" float-label="rate3" @input="fillData()" />
        <q-input v-model="cost2" type="number" float-label="Cost2" @input="fillData()" />
        <q-input v-model="rate4" type="number" float-label="rate4" @input="fillData()" />
        <q-input v-model="term" type="number" float-label="term" @input="fillData()" />
      </q-card-main>

    </q-card>

    <q-card
      flat
      inline style="width: 300px"
      >
      <q-card-main>
        <line-chart :chart-data="datacollection"></line-chart>
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
import LineChart from './line-chart'
// import LineChart from './LineChart.js'

export default {
  components: {
    LineChart
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
        labels: this.getLabels(this.term),
        // labels: [this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: this.makeHistoricalData(this.revenue1, this.term, this.rate1)
            // data: [this.getRandomInt(), this.getRandomInt()]
          },
          {
            label: 'Data Two',
            backgroundColor: '#fFFFFF',
            data: this.makeHistoricalData(this.revenue2, this.term, this.rate2)
            // data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
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
