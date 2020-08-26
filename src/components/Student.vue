<template>
  <div class="students container">
    <div class="row row-cols-5">
      <div class="col" v-for="sid in studentIDs" v-bind:key="sid">
        <p>
          {{ students.get(sid).name }} ({{ sid }})
          <br />
          <button
            type="button"
            v-bind:class="buttonClass(students.get(sid).checkinTime)"
            class="btn"
            @click="checkin(sid)"
          >簽到</button>
          <br />
          <span>{{ moment(students.get(sid).checkinTime) }}&nbsp;</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "firebase";
import { Options, Vue } from "vue-class-component";
import { checkinsCollection, studentsCollection } from "../firebase";

import moment from "moment";

interface StudentRecord {
  seatNumber: string;
  name: string;
  checkinTime: number;
}

@Options({
  methods: {
    moment: function (checkinTime: number): string {
      if (checkinTime) {
        return moment(checkinTime).format("HH:mm");
      }
      return "";
    },

    buttonClass(checkinTime: number) {
      const lateTime = new Date().setHours(7, 25, 0, 0);
      return {
        "btn-secondary": checkinTime == undefined,
        "btn-danger": checkinTime >= lateTime,
        "btn-success": checkinTime < lateTime,
      };
    },

    today() {
      return new Date().setHours(0, 0, 0, 0);
    },

    async checkin(seatNumber: number) {
      const dayKey = `${this.today()}`;

      const data = {
        [`${seatNumber}`]: +new Date(),
      };

      try {
        await checkinsCollection.doc(dayKey).update(data);
      } catch (err) {
        await checkinsCollection.doc(dayKey).set(data);
      }
    },
  },

  async mounted() {
    const dayKey = `${this.today()}`;
    const data = await checkinsCollection.doc(dayKey).get();
    const checkins = data.data();

    for (const c in checkins) {
      this.numbers[Number(c) + 1] = checkins[c];
    }

    let studentIDs: string[] = [];
    const students: Map<string, StudentRecord> = new Map<
      string,
      StudentRecord
    >();
    (await studentsCollection.get()).docs.forEach(
      (doc: firebase.firestore.QueryDocumentSnapshot) => {
        const r: StudentRecord = doc.data() as StudentRecord;
        r.seatNumber = doc.id;
        students.set(doc.id, r);
        studentIDs.push(doc.id);
      }
    );

    studentIDs = studentIDs.sort((s1, s2: string) => {
      const i1 = Number(s1);
      const i2 = Number(s2);
      return i1 - i2;
    });

    this.studentIDs = studentIDs;
    this.students = students;

    checkinsCollection.doc(dayKey).onSnapshot((snapshot) => {
      const checkinData = snapshot.data();

      if (checkinData) {
        for (const index of Object.keys(checkinData)) {
          const student = this.students.get(index);
          if (student) {
            student.checkinTime = checkinData[index];
          }
        }
      }
    });
  },

  data() {
    return {
      numbers: Array(22).fill(0),
      studentIDs: [],
      students: {},
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
