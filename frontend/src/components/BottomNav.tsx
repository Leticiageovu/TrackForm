import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.css';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <nav className={styles.bottomNav}>
      <Link to="/dashboard" className={`${styles.navItem} ${isActive('/dashboard')}`}>
        <span className={styles.icon}>🏠</span>
      </Link>
      
      <Link to="/workouts" className={`${styles.navItem} ${isActive('/workouts')}`}>
        <span className={styles.icon}>🏋️</span>
      </Link>
      
      <Link to="/progress/history" className={`${styles.navItem} ${isActive('/progress/history')}`}>
        <span className={styles.icon}>📈</span>
      </Link>
      
      <Link to="/progress" className={`${styles.navItem} ${isActive('/progress')}`}>
        <span className={styles.icon}>📏</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
