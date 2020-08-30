<template>
  <div class="students container">
    <div class="row row-cols-6">
      <div class="col" v-for="(student, index) in studentsInSeat" v-bind:key="index">
        <p v-if="student" class="border border-secondary rounded">
          {{ student.name }} ({{ student.seatNumber }})
          <br />
          <button
            type="button"
            v-bind:class="buttonClass(student.checkinTime)"
            class="btn"
            @click="checkin(student.seatNumber)"
          >簽到</button>
          <br />
          <span>{{ moment(student.checkinTime) }}&nbsp;</span>
        </p>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-2 border border-secondary rounded">
        <p></p>
        <p>講台</p>
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
  computed: {
    studentsInSeat(): Map<string, StudentRecord> | null {
      return this.seatArray.map((seatNumber: string) => {
        if (seatNumber) {
          return this.students.get(seatNumber);
        }
        return null;
      });
    },
  },
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

    async checkin(seatNumber: string) {
      const data = {
        [seatNumber]: +new Date(),
      };

      try {
        await checkinsCollection.doc(this.dayKey).update(data);
      } catch (err) {
        await checkinsCollection.doc(this.dayKey).set(data);
      }
    },
  },

  props: {
    students: Map,
    lateTime: Number,
    dayKey: String,
  },

  data() {
    return {
      seatArray: [
        "",
        "6",
        "11",
        "18",
        "",
        "",
        "2",
        "5",
        "10",
        "17",
        "23",
        "25",
        "1",
        "4",
        "9",
        "16",
        "22",
        "24",
        "",
        "3",
        "7",
        "15",
        "21",
        "",
        "",
      ],
    };
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
