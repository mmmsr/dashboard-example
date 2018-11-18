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
        <q-field
          label="URL or TEXT"
          helper="You can input URL of the document or directly input text to be summarized"
        >
          <q-option-group
            type="radio"
            v-model="inputType"
            :options="[
              { label: 'URL', value: 'url' },
              { label: 'TEXT', value: 'text' }
            ]"
          />
        </q-field>

        <q-field
          label=""
          helper=""
        >
          <q-input
            v-if="inputType==='url'"
            v-model="targetUrl"
            type="text"
            float-label="Input the URL of the document here"
          />
          <q-input
            v-if="inputType==='text'"
            v-model="targetText"
            type="textarea"
            float-label="Input the text here"
            :max-height="100"
            rows="7"
          />

        </q-field>
        <br>
        <q-field
          label="Language"
          helper="Select language of the document"
        >
          <q-option-group
            type="radio"
            v-model="language"
            :options="[
              { label: 'English', value: 'english' },
              { label: 'Japanese', value: 'japanese' }
            ]"
          />
        </q-field>
        <br>
        <q-field
          label="Number of sentences"
          helper=""
        >
          <q-input
            v-model="sentencesCount"
            type="number"
            float-label="Number of sentences" />
        </q-field>

        <q-field
          label="Algorithm"
          helper="You can select algorithm to be used for summarization"
        >
          <q-option-group
            type="radio"
            v-model="algorithm"
            :options="[
            { label: 'LEX RANK', value: 'lex_rank' },
              { label: 'TEXT RANK', value: 'text_rank' },
              { label: 'LUHN', value: 'luhn' },
              { label: 'LSA', value: 'lsa' }
            ]"
          />
        </q-field>

        <q-btn
          @click="summarize()"
          color="primary">
          summarize
        </q-btn>
      </q-card-main>

      <q-card-title>
        Summarized Text
        <!-- <span slot="subtitle">Stacked bar chart</span> -->
      </q-card-title>

      <q-card-main>
        <!-- title="Week 1" -->
        <!-- <q-input
          v-model="summarizedText"
          type="textarea"
          float-label="Summarized Text"
          :max-height="100"
          rows="7"
        /> -->
        <q-spinner-dots
          v-if="isLoading"
          color="primary"
          :size="30" />
        <div
          v-bind:key="sentence.idx"
          v-for="sentence in summarizedText">
          {{sentence}}
          <br>
        </div>
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
      inputType: 'url',
      algorithm: 'lex_rank',
      language: 'english',
      sentencesCount: 5,
      targetUrl: '',
      targetText: '',
      summarizedText: '',
      isLoading: false
      // startDate: null,
      // week1Columns: [],
      // week2Columns: [],
      // week1Data: [],
      // week2Data: []
    }
  },
  methods: {
    summarize: function () {
      let data = new FormData()
      this.isLoading = true
      this.hasResult = false
      this.fetchResult(data).then((data) => {
        this.summarizedText = []
        if (data) {
          // data = JSON.parse(data)
          console.log(data)
          // console.log(data.summary)
          // console.log(data['summary'])
          this.hasResult = true
        } else {
          // console.log('no result')
          this.hasResult = false
        }
        this.summarizedText = data.sentences // .join('\n')
        // this.summarizedText = data.summary.join('-')
        this.isLoading = false
      })
    },
    fetchResult: function (data) {
      // const url = `${process.env.SUMMPY_API_URL}/summarize?sent_limit=3&text=test`
      const url = `${process.env.SUMY_API_URL}/api/summarize`
      let formdata = {
        input_type: this.inputType,
        algorithm: this.algorithm,
        language: this.language,
        sentences_count: this.sentencesCount,
        target_url: this.targetUrl,
        target_text: this.targetText
      }
      /*
      input_type = form_json['input_type'] # url or text
      algorithm = form_json['algorithm']
      language = form_json['language']
      sentences_count = form_json['sentences_count']
      target_url = form_json['target_url']
      target_text = form_json['target_text']
      */
      // console.log(encodeURI(originalText))
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
