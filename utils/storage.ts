
import { Class } from '../types';

const STORAGE_KEY = 'maestro_notifica_data';

export const loadClasses = (): Class[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [
    {
      id: '1',
      name: 'Classe A - Initiation Piano',
      students: [
        { id: '101', name: 'Jean Dupont', parentEmail: 'parent.jean@exemple.com', parentPhone: '0612345678' },
        { id: '102', name: 'Marie Leroy', parentEmail: 'parent.marie@exemple.com', parentPhone: '0687654321' }
      ]
    },
    {
      id: '2',
      name: 'Classe B - Violon Avancé',
      students: [
        { id: '201', name: 'Pierre Martin', parentEmail: 'parent.pierre@exemple.com', parentPhone: '0733445566' }
      ]
    }
  ];
  return JSON.parse(data);
};

export const saveClasses = (classes: Class[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
};
