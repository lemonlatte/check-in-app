<style scoped>
.group {
  margin: 15px 0;
  padding-top: 16px;
}

.group.today {
  border: #1b7dc3 solid 2px;
  border-radius: 0.25rem !important;
}
</style>

<template>
  <div class="students container">

    <div class="row row-cols-2 group" :class="{today: todayGroup == groupIndex}" v-for="[groupIndex] in groups" v-bind:key="groupIndex">
      <div class="col-md-2">
        <p>第 {{ groupIndex}} 組</p>
      </div>
      <div class="col-md-10">
        <div class="row row-cols-7">
          <div class="col" v-for="(student, index) in studentsInGroup(groupIndex)" v-bind:key="index">
            <p v-if="student" class="border border-secondary rounded">
              {{ student.name }} ({{ student.id }})
              <br />
              <button type="button" :class="buttonClass(groupIndex, student.checkinTime)" class="btn" :disabled="student.checkinTime" @click="confirmCheckin(student.id)">
                簽到
              </button>
              <br />
              <span>{{ moment(student.checkinTime) }}&nbsp;</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div :class="{ 'modal-backdrop': openConfirm, show: openConfirm }"></div>
  <div class="modal" tabindex="-1" :style="{ display: openConfirm ? 'block' : 'none' }" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content" v-if="targetStudentID">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ students.get(targetStudentID).name }}簽到
          </h5>
        </div>
        <div class="modal-body">
          <div class="container-fluid" v-if="targetStudentID">
            <div class="row justify-content-center">
              <div class="col">
                <button type="button" class="mr-2 btn btn-primary" @click="checkin">
                  確認
                </button>
                <button type="button" class="btn btn-secondary" @click="closeConfirm">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
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
  computed: {},
  methods: {
    moment: function (checkinTime: number): string {
      if (checkinTime) {
        return moment(checkinTime).format("HH:mm");
      }
      return "";
    },

    studentsInGroup(id: string): StudentRecord[] {
      const groupStudents: StudentRecord[] = [];
      const members = this.groups.get(id).member;
      for (let i = 0; i < members.length; i++) {
        const s = this.students.get(members[i].toString());
        groupStudents.push(s);
      }
      return groupStudents;
    },

    studentByID(id: number): string {
      return this.students.get(id.toString()).name;
    },

    buttonClass(groupIndex: string, checkinTime: number) {
      return {
        "btn-secondary": checkinTime === undefined,
        "btn-danger":
          (this.todayGroup == groupIndex && checkinTime >= this.bufferTime) ||
          (this.todayGroup != groupIndex && checkinTime >= this.lateTime),
        "btn-success":
          (this.todayGroup == groupIndex && checkinTime < this.bufferTime) ||
          (this.todayGroup != groupIndex && checkinTime < this.lateTime),
      };
    },

    confirmCheckin(id: string) {
      this.targetStudentID = id;
      this.openConfirm = true;
    },

    closeConfirm() {
      this.openConfirm = false;
      this.targetStudentID = "";
    },

    async checkin() {
      const data = {
        [this.targetStudentID]: +new Date(),
      };

      try {
        await checkinsCollection.doc(this.dayKey).update(data);
      } catch (err) {
        await checkinsCollection.doc(this.dayKey).set(data);
      }
      this.closeConfirm();
    },
  },

  props: {
    groups: Map,
    students: Map,
    lateTime: Number,
    bufferTime: Number,
    todayGroup: String,
    dayKey: String,
  },

  data() {
    return {
      targetStudentID: "",
      openConfirm: false,
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
