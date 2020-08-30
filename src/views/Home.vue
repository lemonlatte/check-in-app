<template>
  <div class="container">
    <div class="time">
      <h1>706 每日簽到表</h1>
      <h2>現在時間：{{ diplayTime }}</h2>
    </div>
    <ul class="nav nav-tabs justify-content-center">
      <li class="nav-item">
        <router-link to="/checkin" active-class="active" class="nav-link">簽到</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/today" active-class="active" class="nav-link">今日出席</router-link>
      </li>
    </ul>
    <p></p>
    <router-view :students="students" :dayKey="dayKey" :lateTime="lateTime"></router-view>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import moment from "moment";
import { studentsCollection, checkinsCollection } from "../firebase";
import { StudentRecord } from "../interfaces/student";

moment.locale("zh_tw");

@Options({
  computed: {
    diplayTime() {
      return moment(this.currentTime).format("ll (dddd) a h:mm:ss");
    },

    lateTime() {
      return new Date(this.currentTime).setHours(7, 26, 0, 0);
    },
  },

  methods: {
    today() {
      return new Date().setHours(0, 0, 0, 0);
    },

    updateTime() {
      const now = new Date();
      this.currentTime = +now;
      this.dayKey = `${now.setHours(0, 0, 0, 0)}`;
      setTimeout(this.updateTime, 1000);
    },
  },

  async mounted() {
    this.updateTime();

    (await studentsCollection.get()).docs
      .sort((doc1, doc2: firebase.firestore.QueryDocumentSnapshot) => {
        const i1 = Number(doc1.id);
        const i2 = Number(doc2.id);
        return i1 - i2;
      })
      .forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
        const r: StudentRecord = doc.data() as StudentRecord;
        r.seatNumber = doc.id;
        this.students.set(doc.id, r);
      });

    checkinsCollection.doc(this.dayKey).onSnapshot((snapshot) => {
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
      currentTime: 0,
      students: new Map<string, StudentRecord>(),
      dayKey: "",
    };
  },
})
export default class Home extends Vue {}
</script>
