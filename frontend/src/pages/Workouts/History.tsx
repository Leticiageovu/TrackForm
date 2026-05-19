import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import styles from './Workouts.module.css';

interface WorkoutRecord {
  id: number;
  name: string;
  sportType: string;
  date: string;
}

const sportsMap: Record<string, string> = {
  musculacao: 'Musculação',
  corrida: 'Corrida',
  natacao: 'Natação',
  ciclismo: 'Ciclismo',
  crossfit: 'CrossFit',
  luta: 'Luta',
  yoga: 'Yoga',
  outros: 'Outros',
};

const WorkoutHistory: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<WorkoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHistory() {
      try {
        if (user?.id) {
          const response = await api.get(`/workouts/user/${user.id}`);
          setHistory(response.data);
        }
      } catch {
        console.error('Erro ao carregar histórico de treinos');
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir este registro de treino?')) return;

    try {
      await api.delete(`/workouts/${id}`);
      setHistory(history.filter(item => item.id !== id));
      alert('Treino removido com sucesso!');
    } catch {
      console.error('Erro ao deletar treino');
      alert('Erro ao excluir o treino.');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.content}>
        <header>
          <h1>Histórico de <span>Treinos</span></h1>
          <p>Gerencie seus registros de atividades físicas.</p>
        </header>

        <div className={styles.historyCard}>
          {history.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Você ainda não possui treinos registrados.</p>
              <button onClick={() => navigate('/workouts')} className={styles.saveButton} style={{ width: 'auto' }}>
                Começar a Treinar
              </button>
            </div>
          ) : (
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Modalidade</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td>{new Date(record.date).toLocaleDateString('pt-BR')}</td>
                    <td>{sportsMap[record.sportType] || record.sportType}</td>
                    <td>{record.name}</td>
                    <td>
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDelete(record.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkoutHistory;
