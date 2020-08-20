<template>
  <div class="container">
    <div class="row row justify-content-md-center">
      <div class="col-6">
        <form>
          <div class="form-group row">
            <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="staticEmail" v-model="email">
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
            <div class="col-sm-10">
              <input type="password" class="form-control" id="inputPassword" v-model="password">
            </div>
          </div>
          <button type="button" class="btn btn-primary" @click="login">Login</button>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .container {
    padding-top: 40px;
  }
</style>

<script lang="ts">
  import {
    Options,
    Vue
  } from 'vue-class-component';

  import {
    auth
  } from '../firebase'

  @Options({
    methods: {
      login() {
        auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$router.replace({
              name: "Home"
            });
          })
          .catch(err => {
            alert(err.message)
          });
      }
    },
    data() {
      return {
        email: "",
        password: ""
      }
    }
  })
  export default class Login extends Vue {}
</script>
