import React, { useState, useEffect } from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = dateTime.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const formattedTime = dateTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <footer className={styles.footer}>
      <div className={styles.divider}></div>
      <div className={styles.content}>
        <div className={styles.identity}>
          <span className={styles.signature}>Desenvolvido por <span className={styles.name}>Letícia Geovú</span></span>
        </div>
        <div className={styles.timestamp}>
          <span className={styles.date}>{formattedDate}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.time}>{formattedTime}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
