<template>
  <div class="time">
    <h1>706 每日簽到表</h1>
    <h2>現在時間：{{ diplayTime }}</h2>
  </div>
  <hr />
  <div class="home">
    <Student />
  </div>
</template>

<script lang="ts">
  import {
    Options,
    Vue
  } from 'vue-class-component';
  import moment from 'moment'
  import Student from '@/components/Student.vue'; // @ is an alias to /src

  moment.locale('zh_tw');

  @Options({
    computed: {
      diplayTime() {
        return moment(this.currentTime).format('ll (dddd) a h:mm:ss');
      }
    },

    methods: {
      updateTime() {
        this.currentTime = +new Date()
        setTimeout(this.updateTime, 1000)
      }
    },


    mounted() {
      this.updateTime()
    },

    data() {
      return {
        currentTime: 0
      }
    },

    components: {
      Student,
    },
  })
  export default class Home extends Vue {}
</script>
