import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = React.useState({ weekly: 0, monthly: 0 });
  const navigate = useNavigate();

  React.useEffect(() => {
    async function loadStats() {
      if (!user?.id) return;
      try {
        const response = await api.get(`/workouts/user/${user.id}`);
        const workouts = response.data || [];
        
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(new Date().setDate(diff));
        monday.setHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        setStats({
          weekly: workouts.filter((w: any) => {
            const [y, m, d] = w.date.split('-').map(Number);
            return new Date(y, m-1, d) >= monday;
          }).length,
          monthly: workouts.filter((w: any) => {
            const [y, m, d] = w.date.split('-').map(Number);
            return new Date(y, m-1, d) >= firstDayOfMonth;
          }).length
        });
      } catch {
        // Silently fail stats for navbar
      }
    }
    loadStats();
  }, [user?.id]);

  function handleLogout() {
    signOut();
    navigate('/login');
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/dashboard">TRACK<span>FORM</span></Link>
        </div>

        <ul className={styles.links}>
          <li><Link to="/dashboard">Início</Link></li>
          <li>
            <Link to="/workouts">
              Treinos <span className={styles.navStat}>({stats.weekly}/{stats.monthly})</span>
            </Link>
          </li>
          <li><Link to="/progress/history">Evolução</Link></li>
        </ul>

        <div className={styles.user}>
          <span>Olá, {user?.name}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
        </div>
      </nav>

      {/* Mobile Header with only Logo and Logout */}
      <nav className={styles.mobileHeader}>
        <div className={styles.logo}>
          <span>TRACK<span>FORM</span></span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtnMobile}>Sair</button>
      </nav>
    </>
  );
};

// We need to import api since it was missing in the previous Navbar file write
import api from '../services/api';

export default Navbar;
