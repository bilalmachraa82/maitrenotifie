
import { Class } from '../types';

/**
 * CONFIGURAÇÃO DO BANCO DE DADOS POSTGRESQL (NEON)
 * Connection String: postgresql://neondb_owner:npg_lmPNEJQD43RM@ep-plain-dust-agi8mk82-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
 * 
 * Nota Técnica: Em um ambiente frontend, usamos o LocalStorage como buffer de alta velocidade.
 * O Banco de Dados PostgreSQL deve ser acessado via API Middleware (Serverless) para 
 * segurança das credenciais e conformidade com o protocolo TCP.
 */

const STORAGE_KEY = 'maestro_notifica_data_v3';

export const loadClasses = (): Class[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [
    {
      id: '1',
      name: 'Classe A - Initiation Piano',
      students: [
        { id: '101', name: 'Jean Dupont', parentEmail: 'parent.jean@exemple.com', parentPhone: '0612345678' }
      ]
    },
    {
      id: '2',
      name: 'Classe B - Violon Débutant',
      students: [
        { id: '102', name: 'Marie Curie', parentEmail: 'parent.marie@exemple.com', parentPhone: '0687654321' }
      ]
    }
  ];
  return JSON.parse(data);
};

export const saveClasses = (classes: Class[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  // Sincronização Neon implementada via middleware em produção
};
