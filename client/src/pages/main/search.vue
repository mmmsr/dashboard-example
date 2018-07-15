<template>
  <!-- <div
    style="
    width: 500px;
    max-width: 100vw;
    ">
    class="flex flex-center"
  </div> -->
  <q-page
    class="layout-padding docs-input -row justify-center">
    <div
      style="width: 500px; max-width: 90vw;">
      <!-- <q-input
      v-model="keyword"
        @change="onChange"
        autocomplete="off"
        color="secondary"
        type="text"
        float-label="Keyword">
      </q-input> -->

      <q-search
        v-model="keyword"
        @input="onInput()"
        :debounce="600"
        placeholder="keyword"
        icon="search"
        float-label="Input keyword">
        <q-spinner-dots
          v-if="isLoading"
          color="primary"
          :size="30" />
      </q-search>
      <br>
    </div>

    <div
      v-for="(tweet, index) in tweets"
      v-bind:key="index">
      <q-card
        flat
        style="max-width: 700px">
        <q-card-title>
          {{ tweet._source.text }}
          <span slot="subtitle">{{ tweet._source.name }}</span>
        </q-card-title>
        <!-- <q-card-main>
        </q-card-main> -->
      </q-card>
      <!-- <br> -->
    </div>

  </q-page>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import HorizontalBarChart from './horizontal-bar-chart'
import axios from 'axios'
// import LineChart from './LineChart.js'

export default {
  components: {
    HorizontalBarChart
  },
  data () {
    return {
      tweets: [],
      keyword: '',
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
      isLoading: false,
      email: '',
      password: ''
    }
  },
  validations: {
    email: { required, email }
  },
  methods: {
    onInput () {
      console.log('onInput')
      console.log(this.keyword)
      if (this.keyword === '') {
        return
      }
      this.search(this.keyword)
    },

    search: function (keyword) {
      let data = new FormData()
      this.isLoading = true
      this.hasResult = false
      this.fetchResult(data, keyword).then((tweets) => {
        if (tweets && tweets.length > 0) {
          // console.log('OK!')
          // console.log(tweets)
          this.hasResult = true
        } else {
          this.hasResult = false
        }
        this.tweets = tweets
        this.isLoading = false
      })
    },
    fetchResult: function (data, keyword) {
      const url = `${process.env.ES_API_URL}/test2`
      let formdata = {
        keyword: keyword
      }
      let formJson = JSON.stringify(formdata)
      data.append('form_json', formJson)
      return axios.post(
        url,
        data,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      ).then(response => response.data)
    }
  },
  created () {
  }
}
</script>

<style>
.small {
  max-width: 600px;
  margin:  150px auto;
}
</style>
