export interface StudentRecord {
  id: string;
  name: string;
  checkinTime: number;
}

export interface GroupRecord {
  member: number[];
}

export interface DayGroupRecord {
  group: string;
}
