import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Summary {
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  currentWeight: number;
  currentWeightDate: string;
  weightChange: number;
  evolutionRange: string;
}

const sportsMap: Record<string, { name: string, icon: string }> = {
  musculacao: { name: 'Musculação', icon: '🏋️' },
  corrida: { name: 'Corrida', icon: '🏃' },
  natacao: { name: 'Natação', icon: '🏊' },
  ciclismo: { name: 'Ciclismo', icon: '🚴' },
  crossfit: { name: 'CrossFit', icon: '🤸' },
  luta: { name: 'Luta', icon: '🥊' },
  yoga: { name: 'Yoga', icon: '🧘' },
  outros: { name: 'Outros', icon: '🎯' },
};

const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const Dashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [workoutStatus, setWorkoutStatus] = useState<Record<string, Record<string, boolean>>>({});
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [weightData, setWeightData] = useState<any[]>([]);
  const navigate = useNavigate();

  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) return;

      try {
        const workoutsResponse = await api.get(`/workouts/user/${user.id}`);
        const progressResponse = await api.get(`/progress/user/${user.id}`);
        
        const workouts = workoutsResponse.data || [];
        const progress = progressResponse.data || [];
        
        setHistoryData(workouts);
        setWeightData(progress);

        const latestProgress = progress.length > 0 ? progress[0] : null;
        const initialProgress = progress.length > 0 ? progress[progress.length - 1] : null;
        
        const latestWeight = latestProgress ? latestProgress.weight : 0;
        const initialWeight = initialProgress ? initialProgress.weight : 0;
        const change = progress.length > 1 ? (latestWeight - initialWeight) : 0;

        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(new Date().setDate(diff));
        monday.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const weeklyWorkouts = workouts.filter((w: any) => parseLocalDate(w.date) >= monday).length;
        const monthlyWorkouts = workouts.filter((w: any) => parseLocalDate(w.date) >= firstDayOfMonth).length;

        const currentWeightDate = latestProgress ? parseLocalDate(latestProgress.date).toLocaleDateString('pt-BR') : '';
        const evolutionRange = progress.length > 1 
          ? `${parseLocalDate(initialProgress.date).toLocaleDateString('pt-BR')} a ${parseLocalDate(latestProgress.date).toLocaleDateString('pt-BR')}`
          : '';

        setSummary({
          weeklyWorkouts,
          monthlyWorkouts,
          currentWeight: latestWeight,
          currentWeightDate,
          weightChange: parseFloat(change.toFixed(1)),
          evolutionRange
        });

        const initialStatus: Record<string, Record<string, boolean>> = {};
        const dayMap: Record<number, string> = {
          1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb', 0: 'Dom'
        };

        [...(user.preferredSports || []), ...(user.customSports || []).map(s => s.name)].forEach(sportId => {
          initialStatus[sportId] = {};
        });

        workouts.forEach((w: any) => {
          const wDate = parseLocalDate(w.date);
          if (wDate >= monday) {
            const dayName = dayMap[wDate.getDay()];
            if (initialStatus[w.sportType]) {
              initialStatus[w.sportType][dayName] = true;
            }
          }
        });

        setWorkoutStatus(initialStatus);

      } catch (err) {
        console.error('Erro ao carregar dados do dashboard', err);
      }
    }

    loadDashboardData();
  }, [user?.id, user?.preferredSports, user?.customSports]);

  const handleDayClick = (sportId: string, day: string) => {
    const now = new Date();
    const dayNamesOrder = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const targetDayIndex = dayNamesOrder.indexOf(day);
    const currentDayIndex = now.getDay();
    const diff = targetDayIndex - currentDayIndex;
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + diff);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const date = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${date}`;
    navigate(`/workouts/log?sport=${sportId}&date=${dateStr}`);
  };

  const handleRemoveSport = async (sportId: string, isCustom: boolean) => {
    if (!user || !window.confirm(`Deseja remover ${sportId} do seu planejamento?`)) return;
    try {
      if (isCustom) {
        const newCustom = user.customSports.filter(s => s.name !== sportId);
        await api.post(`/users/${user.id}/custom-sports`, newCustom);
        updateUser({ ...user, customSports: newCustom });
      } else {
        const newPreferred = user.preferredSports.filter(id => id !== sportId);
        await api.post(`/users/${user.id}/sports`, newPreferred);
        updateUser({ ...user, preferredSports: newPreferred });
      }
    } catch {
    console.error('Erro ao remover modalidade');
    }
    };
  // Charts Config
  const weightChartData = useMemo(() => ({
    labels: [...weightData].reverse().map(p => parseLocalDate(p.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
    datasets: [{
      label: 'Peso (kg)',
      data: [...weightData].reverse().map(p => p.weight),
      borderColor: '#00d1b2',
      backgroundColor: 'rgba(0, 209, 178, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
    }]
  }), [weightData]);

  const volumeChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const counts = last7Days.map(date => 
      historyData.filter(w => w.date === date).length
    );

    return {
      labels: last7Days.map(d => parseLocalDate(d).toLocaleDateString('pt-BR', { weekday: 'short' })),
      datasets: [{
        label: 'Treinos por Dia',
        data: counts,
        backgroundColor: '#00d1b2',
        borderRadius: 4,
      }]
    };
  }, [historyData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { 
        grid: { color: '#333' }, 
        ticks: { color: '#888', font: { size: 10 } } 
      },
      x: { 
        grid: { display: false }, 
        ticks: { color: '#888', font: { size: 10 } } 
      }
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.content}>
        <header>
          <h1>Olá, <span>{user?.name}</span></h1>
          <p>Acompanhe seu desempenho e sua evolução com o TrackForm.</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Total Treinos Semanal</h3>
            <p className={styles.value}>{summary?.weeklyWorkouts}</p>
            <div className={styles.goalTrack}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${Math.min((summary?.weeklyWorkouts || 0) / (user?.weeklyGoal || 3) * 100, 100)}%` }}
                ></div>
              </div>
              <span className={styles.goalText}>Meta: {user?.weeklyGoal} treinos</span>
            </div>
          </div>
          <div className={styles.card}>
            <h3>Total Treinos Mensal</h3>
            <p className={styles.value}>{summary?.monthlyWorkouts}</p>
          </div>
          <div className={styles.card}>
            <h3>Peso Atual</h3>
            <p className={styles.value}>{summary?.currentWeight} kg</p>
            {summary?.currentWeightDate && <span className={styles.cardDate}>{summary.currentWeightDate}</span>}
          </div>
          <div className={styles.card}>
            <h3>Evolução</h3>
            <p className={`${styles.value} ${summary && summary.weightChange <= 0 ? styles.positive : styles.negative}`}>
              {summary && summary.weightChange > 0 ? `+${summary.weightChange}` : summary?.weightChange} kg
            </p>
            {summary?.evolutionRange && <span className={styles.cardDate}>{summary.evolutionRange}</span>}
          </div>
        </div>

        {/* Analytics Section */}
        <section className={styles.chartsSection}>
          <div className={styles.chartContainer}>
            <h3>Evolução de Peso</h3>
            <div className={styles.chartWrapper}>
              <Line data={weightChartData} options={chartOptions} />
            </div>
          </div>
          <div className={styles.chartContainer}>
            <h3>Volume Semanal</h3>
            <div className={styles.chartWrapper}>
              <Bar data={volumeChartData} options={chartOptions} />
            </div>
          </div>
        </section>

        {user && (user.preferredSports?.length > 0 || user.customSports?.length > 0) ? (
          <section className={styles.sportsSection}>
            <h2>Seu Planejamento Semanal</h2>
            <div className={styles.sportDashboardGrid}>
              {/* Predefined Sports */}
              {user.preferredSports?.map(sportId => {
                const sport = sportsMap[sportId];
                if (!sport) return null;
                return (
                  <div key={sportId} className={styles.sportPlannerCard}>
                    <button className={styles.removeSportBtnRight} onClick={() => handleRemoveSport(sportId, false)}>✕</button>
                    <div className={styles.sportHeader}>
                      <span className={styles.icon}>{sport.icon}</span>
                      <h3>{sport.name}</h3>
                    </div>
                    <div className={styles.weeklySchedule}>
                      {daysOfWeek.map(day => (
                        <div 
                          key={day} 
                          className={`${styles.dayCircle} ${workoutStatus[sportId]?.[day] ? styles.active : ''}`}
                          onClick={() => handleDayClick(sportId, day)}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <button 
                      className={styles.logBtn}
                      onClick={() => navigate(`/workouts/log?sport=${sportId}`)}
                    >
                      Registrar Treino
                    </button>
                  </div>
                );
              })}

              {/* Custom Sports */}
              {user.customSports?.map(sport => (
                <div key={sport.name} className={styles.sportPlannerCard}>
                  <button className={styles.removeSportBtnRight} onClick={() => handleRemoveSport(sport.name, true)}>✕</button>
                  <div className={styles.sportHeader}>
                    <span className={styles.icon}>{sport.icon}</span>
                    <h3>{sport.name}</h3>
                  </div>
                  <div className={styles.weeklySchedule}>
                    {daysOfWeek.map(day => (
                      <div 
                        key={day} 
                        className={`${styles.dayCircle} ${workoutStatus[sport.name]?.[day] ? styles.active : ''}`}
                        onClick={() => handleDayClick(sport.name, day)}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <button 
                    className={styles.logBtn}
                    onClick={() => navigate(`/workouts/log?sport=${sport.name}`)}
                  >
                    Registrar Treino
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className={styles.noSports}>
            <p>Você ainda não selecionou suas modalidades esportivas.</p>
            <button onClick={() => navigate('/workouts')}>Configurar Modalidades</button>
          </section>
        )}

        <section className={styles.actions}>
          <h2>Ações Rápidas</h2>
          <div className={styles.actionButtons}>
            <button 
              className={styles.primaryAction} 
              onClick={() => navigate('/workouts')}
            >
              Gerenciar Modalidades
            </button>
            <button 
              className={styles.secondaryAction}
              onClick={() => navigate('/progress')}
            >
              Registrar Medidas
            </button>
            <button 
              className={styles.secondaryAction}
              style={{ backgroundColor: '#333', color: '#fff' }}
              onClick={() => navigate('/progress/history')}
            >
              Histórico de Medidas
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
