<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-5 col-sm-6 col-10">
        <form>
          <div class="form-group row">
            <label for="inputUsername" class="col-sm-3 col-4 col-form-label">帳號</label>
            <div class="col-sm-9 col-8">
              <input type="text" class="form-control" id="inputUsername" v-model="email" />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-4 col-form-label">密碼</label>
            <div class="col-sm-9 col-8">
              <input type="password" class="form-control" id="inputPassword" v-model="password" />
            </div>
          </div>
          <div class="form-group row justify-content-center">
            <div class="btn-group col-md-8 col-sm-8 col-6" role="group">
              <button type="button" class="btn btn-primary" @click="login">登入</button>
              <button type="button" class="btn btn-secondary" @click="reset">清除</button>
            </div>
          </div>
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
import { Options, Vue } from "vue-class-component";

import { auth } from "../firebase";

@Options({
  methods: {
    login() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push({ name: "Home" });
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    reset() {
      (this.email = ""), (this.password = "");
    },
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
})
export default class Login extends Vue {}
</script>
