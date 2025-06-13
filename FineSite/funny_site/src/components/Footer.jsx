import React from 'react';
import styles from '../css/footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <h3 className={styles.contactTitle}>Связаться с нами о рекламе или мероприятиях</h3>
          <a 
            href="mailto:funnysite@bk.ru" 
            className={styles.contactEmail}
            title="Отправить письмо"
          >
            <span className={styles.emailIcon}>✉️</span>
            funnysite@bk.ru
          </a>
          <div className={styles.copyright}>
            © {currentYear} FunnySite. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
};