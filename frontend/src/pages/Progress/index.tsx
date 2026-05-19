import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './Progress.module.css';

const Progress: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    gender: user?.gender || 'male',
    bmi: '',
    muscleMassPercentage: '',
    chest: '',
    shoulders: '',
    leftBiceps: '',
    rightBiceps: '',
    waist: '',
    abdomen: '',
    hips: '',
    leftThigh: '',
    rightThigh: '',
    leftCalf: '',
    rightCalf: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate BMI if height and weight are present
      if (name === 'height' || name === 'weight') {
        const h = parseFloat(updated.height) / 100;
        const w = parseFloat(updated.weight);
        if (h > 0 && w > 0) {
          updated.bmi = (w / (h * h)).toFixed(2);
        }
      }
      
      return updated;
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        userId: user?.id,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        bmi: formData.bmi ? parseFloat(formData.bmi) : null,
        muscleMassPercentage: formData.muscleMassPercentage ? parseFloat(formData.muscleMassPercentage) : null,
        chest: formData.chest ? parseFloat(formData.chest) : null,
        shoulders: formData.shoulders ? parseFloat(formData.shoulders) : null,
        leftBiceps: formData.leftBiceps ? parseFloat(formData.leftBiceps) : null,
        rightBiceps: formData.rightBiceps ? parseFloat(formData.rightBiceps) : null,
        waist: formData.waist ? parseFloat(formData.waist) : null,
        abdomen: formData.abdomen ? parseFloat(formData.abdomen) : null,
        hips: formData.hips ? parseFloat(formData.hips) : null,
        leftThigh: formData.leftThigh ? parseFloat(formData.leftThigh) : null,
        rightThigh: formData.rightThigh ? parseFloat(formData.rightThigh) : null,
        leftCalf: formData.leftCalf ? parseFloat(formData.leftCalf) : null,
        rightCalf: formData.rightCalf ? parseFloat(formData.rightCalf) : null,
      };

      await api.post('/progress', dataToSend);
      alert('Medidas registradas com sucesso!');
      navigate('/dashboard');
    } catch {
      setError('Erro ao registrar medidas. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>REGISTRAR <span>EVOLUÇÃO</span></h1>
        <p>Acompanhe suas mudanças físicas com precisão</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.section}>
            <h2>Geral</h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label htmlFor="date">Data</label>
                <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="gender">Gênero</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="height">Altura (cm)</label>
                <input id="height" name="height" type="number" step="0.1" placeholder="175.0" value={formData.height} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="weight">Peso (kg)</label>
                <input id="weight" name="weight" type="number" step="0.1" placeholder="75.5" value={formData.weight} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="bmi">IMC (Calculado)</label>
                <input id="bmi" name="bmi" type="number" step="0.01" placeholder="24.5" value={formData.bmi} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Medidas Corporais (cm)</h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label htmlFor="waist">Cintura (Umbigo)</label>
                <input id="waist" name="waist" type="number" step="0.1" value={formData.waist} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="chest">Peito</label>
                <input id="chest" name="chest" type="number" step="0.1" value={formData.chest} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="shoulders">Ombros</label>
                <input id="shoulders" name="shoulders" type="number" step="0.1" value={formData.shoulders} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="abdomen">Abdômen</label>
                <input id="abdomen" name="abdomen" type="number" step="0.1" value={formData.abdomen} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="hips">Quadril</label>
                <input id="hips" name="hips" type="number" step="0.1" value={formData.hips} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Membros Superiores (cm)</h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label htmlFor="leftBiceps">Bíceps Esq.</label>
                <input id="leftBiceps" name="leftBiceps" type="number" step="0.1" value={formData.leftBiceps} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="rightBiceps">Bíceps Dir.</label>
                <input id="rightBiceps" name="rightBiceps" type="number" step="0.1" value={formData.rightBiceps} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Membros Inferiores (cm)</h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label htmlFor="leftThigh">Coxa Esq.</label>
                <input id="leftThigh" name="leftThigh" type="number" step="0.1" value={formData.leftThigh} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="rightThigh">Coxa Dir.</label>
                <input id="rightThigh" name="rightThigh" type="number" step="0.1" value={formData.rightThigh} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="leftCalf">Panturrilha Esq.</label>
                <input id="leftCalf" name="leftCalf" type="number" step="0.1" value={formData.leftCalf} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="rightCalf">Panturrilha Dir.</label>
                <input id="rightCalf" name="rightCalf" type="number" step="0.1" value={formData.rightCalf} onChange={handleChange} />
              </div>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Medidas'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Progress;
