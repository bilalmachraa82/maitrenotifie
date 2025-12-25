
export interface Student {
  id: string;
  name: string;
  parentEmail: string;
  parentPhone: string;
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
}

export interface HomeworkLog {
  id: string;
  classId: string;
  content: string;
  date: string;
  status: 'draft' | 'sent';
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  CLASS_DETAIL = 'CLASS_DETAIL',
  SCANNING = 'SCANNING',
  VALIDATING = 'VALIDATING',
  SENDING = 'SENDING'
}
