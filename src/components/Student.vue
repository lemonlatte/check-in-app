<template>
  <div class="students container">
    <div class="row row-cols-5" v-for="i in Math.ceil(numbers.length / 5)" v-bind:key="i">
      <div class="col" v-for="n in numbers.slice((i - 1) * 5, i * 5)" v-bind:key="n">
        <p>座號: {{n}}<br>
        <button type="button" class="btn btn-success">簽到</button>
        </p>
        <p> </p>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import {
    Options,
    Vue
  } from 'vue-class-component';

  @Options({
    data() {
      return {
        numbers: Array(22).fill(0).map((v, i) => i + 1)
      }
    }
  })
  export default class Student extends Vue {

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
