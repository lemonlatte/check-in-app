<template>
  <div class="students container">
    <div class="row row-cols-5">
      <div class="col" v-for="[sid, student] in students" v-bind:key="student">
        <p>
          {{ student.name }} ({{ sid }})
          <br />
          <button
            type="button"
            v-bind:class="buttonClass(student.checkinTime)"
            class="btn"
            @click="checkin(sid)"
          >簽到</button>
          <br />
          <span>{{ moment(student.checkinTime) }}&nbsp;</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { checkinsCollection } from "../firebase";
import { StudentRecord } from "../interfaces/student";

import moment from "moment";

@Options({
  methods: {
    moment: function (checkinTime: number): string {
      if (checkinTime) {
        return moment(checkinTime).format("HH:mm");
      }
      return "";
    },

    buttonClass(checkinTime: number) {
      return {
        "btn-secondary": checkinTime == undefined,
        "btn-danger": checkinTime >= this.lateTime,
        "btn-success": checkinTime < this.lateTime,
      };
    },

    async checkin(seatNumber: number) {
      const data = {
        [`${seatNumber}`]: +new Date(),
      };

      try {
        await checkinsCollection.doc(this.dayKey).update(data);
      } catch (err) {
        await checkinsCollection.doc(this.dayKey).set(data);
      }
    },
  },

  props: {
    students: new Map<string, StudentRecord>(),
    lateTime: Number,
    dayKey: String,
  },
})
export default class Student extends Vue {}
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
