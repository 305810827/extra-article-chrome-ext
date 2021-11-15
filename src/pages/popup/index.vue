<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <div v-html="html" style="text-align: left"></div>
  </div>
</template>

<script>
import sanitizeHtml from 'sanitize-html';
// import extraArticle from '@/utils/extraArticle.js';
import {Parser} from 'htmlparser2'
import Readability from '../../utils/readabilitySAX.js'
import { ref } from 'vue'
export default {
  name: 'App',
  setup () {
    let title = ref('')
    let html = ref('')

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
    let message = {
        info: '帮我获取页面innerHTML--来自popup的情书💌'
    }
    chrome.tabs.sendMessage(tabs[0].id, message, async res => {
        console.log(res, '成功');
        // const tags = sanitizeHtml.defaults.allowedTags.filter(item =>
        //         item !== 'footer' && item !== 'header' )
        // let transformTags = {}
        // tags.forEach(t => {
        //   transformTags[t] = function () {
        //     return { tagName: '$%^&xyj' }
        //   }
        // })
        // const clean = sanitizeHtml(res, {
        //   allowedTags: [],
        //
        //   // transformTags
        //   textFilter: function(text) {
        //     return text + '$%^&xyj';
        //   },
        // })
        const readable = new Readability();
        const parser = new Parser(readable, {})
        parser.write(res)
        const article = await readable.getArticle()
        title.value = article.title
        // html.value = article.html
        console.log(article, 'article');
        html.value = sanitizeHtml(article.html)
        // // const article = extraArticle(clean)
        // console.log(article, 'article');
    })
})
    //


    return { title, html }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  width: 800px;
  height: 500px;
  overflow-y: scroll;
}
</style>
