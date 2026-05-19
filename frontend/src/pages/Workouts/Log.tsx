import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './Workouts.module.css';

const WorkoutLog: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const sportId = searchParams.get('sport') || 'musculacao';
  
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await api.post('/workouts', {
        name: formData.name || `Treino de ${sportId}`,
        sportType: sportId,
        date: formData.date,
        userId: user.id
      });
      alert('Treino registrado com sucesso!');
      navigate('/dashboard');
    } catch {
      console.error('Erro ao salvar treino');
      alert('Erro ao salvar treino.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.content}>
        <header>
          <h1>Registrar <span>Treino</span></h1>
          <p>Modalidade: <strong>{sportId.toUpperCase()}</strong></p>
        </header>

        <form onSubmit={handleSubmit} className={styles.logForm}>
          <div className={styles.inputGroup}>
            <label>Nome do Treino (Opcional)</label>
            <input 
              type="text" 
              placeholder="Ex: Treino de Perna, Corrida 5km..." 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Data do Treino</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar Registro'}
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/dashboard')}>
            Cancelar
          </button>
        </form>
      </main>
    </div>
  );
};

export default WorkoutLog;
