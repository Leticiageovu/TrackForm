import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import styles from './Progress.module.css'; // Reusing styles

interface ProgressRecord {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  chest: number;
  shoulders: number;
  leftBiceps: number;
  rightBiceps: number;
  waist: number;
  abdomen: number;
  hips: number;
  leftThigh: number;
  rightThigh: number;
  leftCalf: number;
  rightCalf: number;
  date: string;
}

const ProgressHistory: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHistory() {
      try {
        if (user) {
          const response = await api.get(`/progress/user/${user.id}`);
          setHistory(response.data);
        }
      } catch {
        console.error('Erro ao carregar histórico');
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [user]);

  const calculateDiff = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff === 0) return <span style={{ color: '#888' }}>-</span>;
    const color = diff > 0 ? '#ff4d4d' : '#00d1b2';
    return <span style={{ color }}>{diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}</span>;
  };

  if (loading) return <div>Carregando...</div>;

  const latest = history[0];
  const previous = history[1];

  return (
    <div className={styles.container} style={{ maxWidth: '1200px' }}>
      <Navbar />
      <div className={styles.card} style={{ marginTop: '2rem' }}>
        <h1>HISTÓRICO E <span>EVOLUÇÃO</span></h1>
        <p>Acompanhe suas mudanças ao longo do tempo</p>

        {history.length >= 2 && (
          <div className={styles.comparisonGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className={styles.compareCard} style={{ background: '#222', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>VARIAÇÃO DE PESO</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                {calculateDiff(latest.weight, previous.weight)} kg
              </div>
            </div>
            <div className={styles.compareCard} style={{ background: '#222', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>VARIAÇÃO DE IMC</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                {calculateDiff(latest.bmi, previous.bmi)}
              </div>
            </div>
            <div className={styles.compareCard} style={{ background: '#222', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>VARIAÇÃO DE CINTURA</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                {calculateDiff(latest.waist, previous.waist)} cm
              </div>
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Nenhum registro encontrado. 
            <button onClick={() => navigate('/progress')} className={styles.button} style={{ width: 'auto', padding: '0.5rem 1rem', marginLeft: '1rem' }}>
              Registrar Medidas
            </button>
          </div>
        ) : (
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Peso</th>
                <th>IMC</th>
                <th>Cintura</th>
                <th>Peito</th>
                <th>Bíceps (D/E)</th>
                <th>Coxa (D/E)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, index) => {
                const prev = history[index + 1];
                return (
                  <tr key={record.id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      {record.weight} kg {prev && calculateDiff(record.weight, prev.weight)}
                    </td>
                    <td>
                      {record.bmi} {prev && calculateDiff(record.bmi, prev.bmi)}
                    </td>
                    <td>
                      {record.waist} cm {prev && calculateDiff(record.waist, prev.waist)}
                    </td>
                    <td>
                      {record.chest} cm {prev && calculateDiff(record.chest, prev.chest)}
                    </td>
                    <td>
                      {record.rightBiceps}/{record.leftBiceps}
                    </td>
                    <td>
                      {record.rightThigh}/{record.leftThigh}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);
};

export default ProgressHistory;
