<template>
  <q-page
    class="layout-padding docs-input -row justify-center">
    <div
      style="width: 500px; max-width: 90vw;">
      <!-- :debounce="600" -->
      <q-search
        v-model="keyword"
        @input="onInput()"
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
    <q-card
      v-if="!hasResult && !isLoading"
      flat
      style="max-width: 700px">
      <q-item>
        <q-item-side icon="error_outline">
        </q-item-side>
        <q-item-main
          label="No Results"
          sublabel="There are no results to show">
        </q-item-main>
      </q-item>
    </q-card>
    <div
      v-if="hasResult"
      v-for="(tweet, index) in tweets"
      v-bind:key="index">
      <q-card
        flat
        style="max-width: 700px">
        <q-item
          highlight
          @click.native="onClickTweet(tweet._source.screen_name, tweet._source.tweet_id)"
          >
          <q-item-side
            :avatar="`${tweet._source.profile_image_url_https}`"
            >
            <!-- :avatar="imgURL(tweet)" -->
          </q-item-side>

          <q-item-main>
            <q-item-tile label>
              <!-- <text-highlight :queries="keyword"> -->
                {{ tweet._source.text }}
              <!-- </text-highlight> -->
            </q-item-tile>

            <q-item-tile sublabel>
              <!-- <text-highlight :queries="keyword"> -->
                {{ tweet._source.name }}
              <!-- </text-highlight> -->
            </q-item-tile>

          </q-item-main>
          <q-item-side right :stamp="`score: ${tweet._score}`" />
        </q-item>
        <q-card-separator />
      </q-card>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import { openURL } from 'quasar'

export default {
  data () {
    return {
      tweets: [],
      keyword: '',
      isLoading: false,
      hasResult: false
    }
  },
  methods: {
    onInput () {
      if (this.keyword === '') {
        this.tweets = []
        this.hasResult = false
        return
      }
      this.search(this.keyword)
    },
    search: function (keyword) {
      let data = new FormData()
      this.isLoading = true
      this.hasResult = false
      this.fetchResult(data, keyword).then((tweets) => {
        this.tweets = []
        if (tweets && tweets.length > 0) {
          // console.log(tweets)
          this.hasResult = true
        } else {
          // console.log('no result')
          this.hasResult = false
        }
        this.tweets = tweets
        this.isLoading = false
      })
    },
    fetchResult: function (data, keyword) {
      const url = `${process.env.ES_API_URL}/api/search`
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
    onClickTweet (screenName, tweetId) {
      openURL(`https://twitter.com/${screenName}/status/${tweetId}`)
    }
  },
  created () {
  }
}
</script>

<style>
a {
  text-decoration: none;
}
.small {
  max-width: 600px;
  margin:  150px auto;
}
</style>
