<template>
  <footer class="modern-footer">
    <!-- Sección principal del footer -->
    <div class="footer-main">
      <div class="footer-container">
        <!-- Contenido con logo a la izquierda y texto a la derecha -->
        <div class="footer-content">
          <!-- Logo centrado a la izquierda -->
          <div class="logo-section">
            <img src="/images/Logo1.jpeg" alt="Logo" class="footer-logo" />
          </div>

          <!-- Texto a la derecha -->
          <div class="text-section">
            <h2 class="brand-title">APPLE STORE <span class="highlight">PRO</span></h2>
            <p class="brand-description">Ofrecemos productos originales con garantía, la mejor experiencia de compra digital.</p>
          </div>
        </div>

        <!-- Redes sociales independientes a la derecha -->
        <div class="social-section">
          <h3 class="social-title">Síguenos en nuestras redes</h3>
          <div class="social-links">
            <a href="https://www.instagram.com/apple_storepro?igsh=bGhkZjA2d3dtbnY=" target="_blank" rel="noopener" class="social-link">
              <div class="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div class="social-info">
                <span class="social-name">Instagram</span>
                <span class="social-handle">@apple_storepro</span>
              </div>
            </a>

            <a href="https://www.tiktok.com/@apple_storepro" target="_blank" rel="noopener" class="social-link">
              <div class="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"/>
                </svg>
              </div>
              <div class="social-info">
                <span class="social-name">TikTok</span>
                <span class="social-handle">@apple_storepro</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra inferior -->
    <div class="footer-bottom">
      <div class="footer-container">
        <div class="copyright-section">
          <p>&copy; 2025 APPLE STORE PRO. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>

    <!-- Elementos decorativos -->
    <div class="footer-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
  </footer>
</template>

<style scoped>
.modern-footer {
  position: relative;
  background: var(--brand-gradient);
  color: var(--brand-primary-contrast);
  overflow: hidden;
}

.footer-main {
  padding: 4rem 1rem 2rem;
  position: relative;
  z-index: 2;
}

.footer-container {
  max-width: 1200px;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr); /* Solo logo y texto ahora */
  gap: 2.5rem;
  align-items: center;
  margin-bottom: 2rem;
}

/* Sección de texto a la izquierda */
.text-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: left;
  text-align: left;
}

/* Sección de logo a la derecha */
.logo-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.footer-logo {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid var(--brand-accent-alt);
  box-shadow: 0 12px 30px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.footer-logo:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 30px rgba(0,0,0,0.5), 0 0 0 2px var(--brand-accent);
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  padding-left: 4rem;
  color: var(--brand-primary-contrast);
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.brand-title .highlight {
  color: #26F7D7;
}

.brand-description {
  font-size: 0.95rem;
  line-height: 1.4;
  color: rgba(255,255,255,0.8);
  margin: 0;
  font-weight: 400;
  text-align: center;
  max-width: 420px;
}

/* Redes sociales independientes */
.social-section {
  position: absolute;
  top: 2rem;
  right: 4rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 1rem;
  max-width: 280px;
  z-index: 3;
}

.social-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--brand-accent-alt);
  margin: 0;
  position: relative;
}

.social-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 0;
  width: 35px;
  height: 2px;
  background: var(--brand-accent-gradient);
  border-radius: 2px;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.3s ease;
  width: 100%;
  justify-content: flex-start;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: var(--brand-accent-alt);
  transform: translateY(-1px);
}

.social-icon {
  width: 38px;
  height: 38px;
  background: var(--brand-accent-gradient);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px var(--brand-accent-glow);
}

.social-icon svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.social-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  flex: 1;
}

.social-name {
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
}

.social-handle {
  color: var(--brand-primary-contrast);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  margin-top: 0.1rem;
}

/* Barra inferior */
.footer-bottom {
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid var(--brand-border);
  padding: 1.5rem 0;
  position: relative;
  z-index: 2;
}

/* Sección del copyright */
.copyright-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

.copyright-section p {
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
  margin-left: 25rem;
}

.copyright-section .highlight {
  color: var(--brand-success);
}

/* Elementos decorativos */
.footer-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 5%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 4s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) scale(1);
    opacity: 0.7;
  }

  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-main {
    padding: 3rem 0 2rem;
  }

  .footer-container {
    padding: 0 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2.2rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .logo-section {
    order: 1;
    text-align: center;
    justify-self: center;
  }

  .text-section {
    order: 2;
    align-items: center;
  }

  .brand-title {
    padding-left: 0;
    font-size: 1.6rem;
    text-align: center;
  }

  .copyright-section{
    margin-left: 0;
  }

  .copyright-section p {
    margin-left: 0;
  }

  .brand-description {
    text-align: center;
  }

  .social-section {
    position: static;
    order: 3;
    align-items: center;
    text-align: center;
    max-width: 100%;
    margin-top: 2rem;
  }

  .social-title::after {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }

  .social-links {
    align-items: center;
    max-width: 250px;
  }

  .social-info {
    align-items: center;
    text-align: center;
  }

  .footer-logo {
    width: 110px;
    height: 110px;
  }

  .brand-description {
    font-size: 0.9rem;
  }
}@media (max-width: 480px) {
  .footer-main {
    padding: 2rem 0 1.5rem;
  }

  .footer-container {
    padding: 0 1rem;
  }

  .logo-section {
    text-align: center;
    justify-self: center;
  }

  .copyright-section{
    margin-left: 0;
  }

  .copyright-section p {
    margin-left: 0;
  }

  .brand-title {
    font-size: 1.4rem;
    text-align: center;
  }

  .footer-logo {
    width: 90px;
    height: 90px;
  }

  .brand-description {
    font-size: 0.85rem;
  }

  .social-icon {
    width: 35px;
    height: 35px;
  }

  .social-icon svg {
    width: 18px;
    height: 18px;
  }

  .social-name {
    font-size: 0.75rem;
  }

  .social-handle {
    font-size: 0.9rem;
  }

  .decoration-circle {
    display: none;
  }
}
</style>
