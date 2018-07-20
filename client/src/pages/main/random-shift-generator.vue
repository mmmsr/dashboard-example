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
  <div class="-layout-padding">
    <q-card
      flat
      style="max-width: 800px"
      >
      <q-card-title>
        STEP 1:
        <span slot="subtitle">Basic horizontal bar chart</span>
      </q-card-title>
      <q-card-main>
        <!-- With floating label -->
        <q-chips-input
          v-model="members"
          float-label="Imput members here"
          add-icon="checked" />
      </q-card-main>

      <q-card-main>
        <!-- Only Date -->
        <q-datetime v-model="startDate" type="date" />
      </q-card-main>

      <q-card-title>
        Example Chart 2
        <span slot="subtitle">Stacked bar chart</span>
      </q-card-title>

      <q-card-main>
        <q-table
          title="Table Title"
          :data="tableData"
          :columns="columns"
          row-key="name"
        />
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
  <!-- </q-page> -->
  </div>
</template>

<script>
// import { required, email } from 'vuelidate/lib/validators'
// import HorizontalBarChart from './horizontal-bar-chart'
// import LineChart from './LineChart.js'

export default {
  // components: {
  //   HorizontalBarChart
  // },
  data () {
    return {
      members: [],
      startDate: null,

      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'calories',
          required: true,
          label: 'calories',
          align: 'left',
          field: 'calories',
          sortable: true
        }
      ],
      tableData: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        }
      ],

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
  // validations: {
  //   email: { required, email }
  // },
  methods: {
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
    // this.fillData()
  }
  // name: 'PageIndex'
}
</script>

<style>
/* .small {
  max-width: 600px;
  margin:  150px auto;
} */
</style>
