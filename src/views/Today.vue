<template>
  <div class="today container">
    <h3>今日出席狀況</h3>
    <h5>準時</h5>
    <dl class="row">
      <p v-if="!onTimeStudents.length" class="col-12">無</p>
      <dd class="col-4" v-for="student in onTimeStudents" v-bind:key="student">{{ student.name }} ({{ student.id}}) - {{ moment(student.checkinTime) }}</dd>
    </dl>
    <h5>遲到</h5>
    <dl class="row">
      <p v-if="!lateStudents.length" class="col-12">無</p>
      <dd class="col-4" v-for="student in lateStudents" v-bind:key="student">{{ student.name }} ({{ student.id}}) - {{ moment(student.checkinTime) }}</dd>
    </dl>
    <h5>缺席</h5>
    <dl class="row">
      <p v-if="!absentStudents.length" class="col-12">無</p>
      <dd class="col-4" v-for="student in absentStudents" v-bind:key="student">{{ student.name }} ({{ student.id}})</dd>
    </dl>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { StudentRecord } from "../interfaces/student";

import moment from "moment";

@Options({
  computed: {
    onTimeStudents() {
      const students = this.students as Map<string, StudentRecord>;
      return Array.from(students.values()).filter(
        (student: StudentRecord) => student.checkinTime < this.lateTime
      );
    },

    lateStudents() {
      const students = this.students as Map<string, StudentRecord>;
      return Array.from(students.values()).filter(
        (student: StudentRecord) => student.checkinTime >= this.lateTime
      );
    },

    absentStudents() {
      const students = this.students as Map<string, StudentRecord>;
      return Array.from(students.values()).filter(
        (student: StudentRecord) => student.checkinTime === undefined
      );
    },
  },

  methods: {
    moment: function (checkinTime: number): string {
      if (checkinTime) {
        return moment(checkinTime).format("HH:mm");
      }
      return "";
    },
  },

  props: {
    students: new Map<string, StudentRecord>(),
    lateTime: Number,
  },
})
export default class Today extends Vue {}
</script>
