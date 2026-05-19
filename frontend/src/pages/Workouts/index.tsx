import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './Workouts.module.css';

const sportsList = [
  { id: 'musculacao', name: 'Musculação', icon: '🏋️' },
  { id: 'corrida', name: 'Corrida', icon: '🏃' },
  { id: 'natacao', name: 'Natação', icon: '🏊' },
  { id: 'ciclismo', name: 'Ciclismo', icon: '🚴' },
  { id: 'crossfit', name: 'CrossFit', icon: '🤸' },
  { id: 'luta', name: 'Luta', icon: '🥊' },
  { id: 'yoga', name: 'Yoga', icon: '🧘' },
  { id: 'outros', name: 'Outros', icon: '🎯' },
];

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

const iconOptions = ['🎯', '⚽', '🏀', '🎾', '🏐', '🥋', '🎿', '⛸️', '🛹', '🛶', '🏄', '🏌️', '🏇', '🏋️', '🚴', '🏃'];

interface WorkoutRecord {
  id: number;
  name: string;
  sportType: string;
  date: string;
}

const Workouts: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  const [selectedSports, setSelectedSports] = useState<string[]>(user?.preferredSports || []);
  const [customSports, setCustomSports] = useState<{name: string, icon: string}[]>(user?.customSports || []);
  const [newCustomSport, setNewCustomSport] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [history, setHistory] = useState<WorkoutRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<WorkoutRecord>>({});
  const [stats, setStats] = useState({ weekly: 0, monthly: 0 });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        const response = await api.get(`/workouts/user/${user.id}`);
        const workouts = response.data || [];
        setHistory(workouts);

        // Calculate Stats
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(new Date().setDate(diff));
        monday.setHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        setStats({
          weekly: workouts.filter((w: any) => {
            const [y, m, d] = w.date.split('-').map(Number);
            return new Date(y, m - 1, d) >= monday;
          }).length,
          monthly: workouts.filter((w: any) => {
            const [y, m, d] = w.date.split('-').map(Number);
            return new Date(y, m - 1, d) >= firstDayOfMonth;
          }).length
        });

      } catch {
        console.error('Erro ao carregar dados de treinos');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const handleSportToggle = (sportId: string) => {
    if (selectedSports.includes(sportId)) {
      setSelectedSports(selectedSports.filter(id => id !== sportId));
    } else {
      setSelectedSports([...selectedSports, sportId]);
    }
  };

  const handleAddCustomSport = () => {
    if (newCustomSport.trim() && !customSports.some(s => s.name === newCustomSport.trim())) {
      setCustomSports([...customSports, { name: newCustomSport.trim(), icon: selectedIcon }]);
      setNewCustomSport('');
      setShowCustomInput(false);
    }
  };

  const handleRemoveCustomSport = (name: string) => {
    setCustomSports(customSports.filter(s => s.name !== name));
  };

  const handleDeleteWorkout = async (id: number) => {
    if (!window.confirm('Excluir este registro de treino?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      setHistory(history.filter(w => w.id !== id));
      alert('Treino removido com sucesso!');
    } catch {
      alert('Erro ao excluir.');
    }
  };

  const handleStartEdit = (record: WorkoutRecord) => {
    setEditingId(record.id);
    setEditFormData(record);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async () => {
    if (!editingId || !user) return;
    try {
      const response = await api.post(`/workouts`, {
        ...editFormData,
        id: editingId,
        userId: user.id
      });
      setHistory(history.map(w => w.id === editingId ? response.data : w));
      setEditingId(null);
      alert('Treino atualizado com sucesso!');
    } catch {
      alert('Erro ao atualizar treino.');
    }
  };

  const handleSaveSports = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.post(`/users/${user.id}/sports`, selectedSports);
      const response = await api.post(`/users/${user.id}/custom-sports`, customSports);
      updateUser({ 
        ...user, 
        preferredSports: selectedSports,
        customSports: response.data.customSports 
        });
        alert('Modalidades atualizadas!');
        } catch {
        alert('Erro ao salvar modalidades.');
        } finally {
      setSaving(false);
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter(record => {
      const [year, month] = record.date.split('-').map(Number);
      return year === selectedYear && (month - 1) === selectedMonth;
    });
  }, [history, selectedMonth, selectedYear]);

  const monthsList = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const yearsList = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2024;
    const list = [];
    for (let y = currentYear; y >= startYear; y--) {
      list.push(y);
    }
    return list;
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.content}>
        <header>
          <h1>Central de <span>Treinos</span></h1>
          <p>Gerencie suas modalidades, histórico e acompanhe seu volume de treino.</p>
        </header>

        {/* 1. Stats Section */}
        <section className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Treinos nesta Semana</span>
            <span className={styles.statValue}>{stats.weekly}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Treinos neste Mês</span>
            <span className={styles.statValue}>{stats.monthly}</span>
          </div>
        </section>

        {/* 2. Modalidades Section */}
        <section className={styles.sectionArea}>
          <h2>Minhas Modalidades</h2>
          <div className={styles.sportGrid}>
            {sportsList.filter(s => s.id !== 'outros').map((sport) => (
              <div 
                key={sport.id} 
                className={`${styles.sportCard} ${selectedSports.includes(sport.id) ? styles.selected : ''}`}
                onClick={() => handleSportToggle(sport.id)}
              >
                <span className={styles.sportIcon}>{sport.icon}</span>
                <h3>{sport.name}</h3>
                {selectedSports.includes(sport.id) && <span className={styles.check}>✓</span>}
              </div>
            ))}

            {customSports.map((sport) => (
              <div key={sport.name} className={`${styles.sportCard} ${styles.selected}`}>
                <span className={styles.sportIcon}>{sport.icon}</span>
                <h3>{sport.name}</h3>
                <span className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); handleRemoveCustomSport(sport.name); }}>✕</span>
              </div>
            ))}

            <div className={styles.addCard} onClick={() => setShowCustomInput(true)}>
              <span className={styles.addIcon}>+</span>
              <h3>Customizar</h3>
            </div>
          </div>

          {showCustomInput && (
            <div className={styles.customInputCard}>
              <h3>Nova Modalidade</h3>
              <div className={iconOptions.includes(selectedIcon) ? styles.iconSelector : styles.iconSelector}>
                {iconOptions.map(icon => (
                  <span 
                    key={icon} 
                    className={`${styles.iconOption} ${selectedIcon === icon ? styles.activeIcon : ''}`}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    {icon}
                  </span>
                ))}
              </div>
              <div className={styles.inputRow}>
                <input 
                  type="text" 
                  placeholder="Nome do esporte..." 
                  value={newCustomSport}
                  onChange={(e) => setNewCustomSport(e.target.value)}
                />
                <button onClick={handleAddCustomSport}>Adicionar</button>
                <button onClick={() => setShowCustomInput(false)} className={styles.cancelBtn}>Cancelar</button>
              </div>
            </div>
          )}

          <button className={styles.saveButton} onClick={handleSaveSports} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações de Modalidades'}
          </button>
        </section>

        {/* 3. History Section */}
        <section className={styles.sectionArea}>
          <div className={styles.sectionHeader}>
            <h2>Histórico de Atividades</h2>
            <div className={styles.filters}>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className={styles.filterSelect}
              >
                {monthsList.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className={styles.filterSelect}
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.historyCard}>
            {filteredHistory.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                Nenhum treino registrado em {monthsList[selectedMonth]} de {selectedYear}.
              </p>
            ) : (
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Dia</th>
                    <th>Modalidade</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((record) => {
                    const [year, month, day] = record.date.split('-').map(Number);
                    const dateObj = new Date(year, month - 1, day);
                    const dayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dateObj.getDay()];
                    
                    const isEditing = editingId === record.id;

                    return (
                      <tr key={record.id}>
                        <td>
                          {isEditing ? (
                            <input 
                              type="date" 
                              className={styles.editInput}
                              value={editFormData.date} 
                              onChange={e => setEditFormData({...editFormData, date: e.target.value})}
                            />
                          ) : dateObj.toLocaleDateString('pt-BR')}
                        </td>
                        <td>{dayName}</td>
                        <td>
                          {isEditing ? (
                            <select 
                              className={styles.editInput}
                              value={editFormData.sportType}
                              onChange={e => setEditFormData({...editFormData, sportType: e.target.value})}
                            >
                              {sportsList.filter(s => s.id !== 'outros').map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                              {customSports.map(s => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                              ))}
                            </select>
                          ) : (sportsMap[record.sportType] || record.sportType.toUpperCase())}
                        </td>
                        <td>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className={styles.editInput}
                              value={editFormData.name} 
                              onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                            />
                          ) : record.name}
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            {isEditing ? (
                              <>
                                <button className={styles.confirmBtn} onClick={handleSaveEdit}>Salvar</button>
                                <button className={styles.cancelLink} onClick={handleCancelEdit}>Cancelar</button>
                              </>
                            ) : (
                              <>
                                <button className={styles.editBtn} onClick={() => handleStartEdit(record)}>Editar</button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteWorkout(record.id)}>Excluir</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Workouts;
