<template>
  <div class="container">
    <div class="time">
      <h1>711 每日簽到表</h1>
      <h2>現在時間：{{ diplayTime }}</h2>
      <h2 v-if="todayGroup">上午打掃組別： {{ todayGroup }}</h2>
    </div>
    <ul class="nav nav-tabs justify-content-center">
      <li class="nav-item">
        <router-link :to="{ name: 'Checkin' }" active-class="active" class="nav-link">簽到</router-link>
      </li>
      <!-- <li class="nav-item">
        <router-link
          :to="{ name: 'Today' }"
          active-class="active"
          class="nav-link"
          >今日出席</router-link
        >
      </li> -->
      <!-- <li class="nav-item">
        <router-link :to="{ name: 'Summary'}" active-class="active" class="nav-link">統計</router-link>
      </li> -->
    </ul>
    <p></p>
    <router-view :students="students" :groups="groups" :dayKey="dayKey" :bufferTime="bufferTime" :lateTime="lateTime" :todayGroup="todayGroup"></router-view>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import moment from "moment";
import {
  studentsCollection,
  checkinsCollection,
  groupsCollection,
  dayGroupCollection,
} from "../firebase";
import {
  GroupRecord,
  DayGroupRecord,
  StudentRecord,
} from "../interfaces/student";

moment.locale("zh_tw");

@Options({
  computed: {
    diplayTime() {
      return moment(this.currentTime).format("ll (dddd) a h:mm:ss");
    },

    bufferTime() {
      return new Date(this.currentTime).setHours(7, 16, 0, 0);
    },

    lateTime() {
      return new Date(this.currentTime).setHours(7, 31, 0, 0);
    },

    todayGroup() {
      return this.dayGroup.get(this.dayKey);
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

    async loadStudents() {
      const students = new Map<string, StudentRecord>();
      (await studentsCollection.get()).docs.forEach(
        (doc: firebase.firestore.QueryDocumentSnapshot) => {
          const r: StudentRecord = doc.data() as StudentRecord;
          r.id = doc.id;
          students.set(doc.id, r);
        }
      );

      return students;
    },

    async loadGroups() {
      const groups = new Map<string, GroupRecord>();
      (await groupsCollection.get()).docs.forEach(
        (doc: firebase.firestore.QueryDocumentSnapshot) => {
          const r: GroupRecord = doc.data() as GroupRecord;
          groups.set(doc.id, r);
        }
      );
      return groups;
    },

    async loadDayGroup() {
      const dayGroup = new Map<string, string>();
      (await dayGroupCollection.get()).docs.forEach(
        (doc: firebase.firestore.QueryDocumentSnapshot) => {
          const r: DayGroupRecord = doc.data() as DayGroupRecord;
          dayGroup.set(doc.id, r.group);

          console.log(new Date(parseInt(doc.id)), r.group);
        }
      );
      return dayGroup;
    },
  },

  async mounted() {
    this.updateTime();
    this.students = await this.loadStudents();
    this.groups = await this.loadGroups();
    this.dayGroup = await this.loadDayGroup();

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
      groups: new Map<string, GroupRecord>(),
      dayGroup: new Map<string, string>(),
      dayKey: "",
    };
  },
})
export default class Home extends Vue {}
</script>
