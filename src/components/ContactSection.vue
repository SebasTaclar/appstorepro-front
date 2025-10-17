<template>
  <section class="contact-section">
    <div class="container">
      <!-- Header de la sección -->
      <div class="contact-header">
        <h2 class="contact-title">
          Contáctanos o <span class="highlight">Visítanos</span>
        </h2>
        <p class="contact-subtitle">
          Encuentra nuestros productos Apple originales en nuestra tienda física
        </p>
      </div>

      <!-- Contenido principal -->
      <div class="contact-content">
        <!-- Columna izquierda: Ubicación y Llámanos -->
        <div class="left-column">
          <div class="info-card">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>Nuestra Ubicación</h3>
              <p class="address">Centro comercial Unilago, Bogotá - Loc. 1-124</p>
              <p class="district">Cra. 15 # 78 - 33, Bogotá D.C.</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>Llámanos</h3>
              <p class="phone">+57 320 986 0099</p>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Horarios y Mapa -->
        <div class="right-column">
          <div class="info-card">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>Horarios de Atención</h3>
              <div class="schedule">
                <p><strong>Lunes - Sábado:</strong> 9:30 AM - 7:00 PM</p>
                <p><strong>Domingos:</strong> Cada 15 Días</p>
              </div>
            </div>
          </div>

          <div class="map-container">
            <a
              href="https://www.google.com/maps/place/Cra.+15+%2378-33,+Bogot%C3%A1,+Colombia"
              target="_blank"
              rel="noopener"
              class="map-link"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8066!2d-74.06219!3d4.64753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a6e5c7b8d1b%3A0x1234567890abcdef!2sCra.%2015%20%2378-33%2C%20Bogot%C3%A1%2C%20Colombia!5e0!3m2!1ses!2sco!4v1234567890123!5m2!1ses!2sco"
                width="100%"
                height="200"
                style="border:0; border-radius: 15px;"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
              <div class="map-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Ver en Google Maps</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ContactSection'
})
</script>

<style scoped>
.contact-section {
  padding: 3rem 0;
  background: var(--brand-gradient);
  position: relative;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.contact-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.contact-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: #ffffff;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.contact-title .highlight {
  color: #ffffff;
}

.contact-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 500px;
  margin: 0 auto;
}

/* Contenido principal */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--brand-surface);
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.info-icon {
  background: var(--brand-success);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25);
}

.info-content h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.address {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--brand-success);
  margin-bottom: 0.5rem;
}

.district, .phone, .availability {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.25rem;
}

.phone {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--brand-success);
  margin-bottom: 0.5rem;
}

.schedule p {
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.schedule strong {
  color: #ffffff;
}

/* Acciones de contacto */

.map-container {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.map-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.map-link {
  position: relative;
  display: block;
  text-decoration: none;
}

.map-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  opacity: 0.8;
}

.map-overlay:hover {
  opacity: 1;
  background: rgba(16, 185, 129, 0.9);
}

.map-placeholder {
  background: var(--brand-surface);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.map-placeholder:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.map-icon {
  color: var(--brand-success);
  margin-bottom: 1rem;
}

.map-placeholder p {
  color: #666;
  font-weight: 600;
}

/* Características de la tienda */
.store-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--brand-surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.feature:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  background: linear-gradient(135deg, var(--brand-success), #0d9466);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature span {
  font-weight: 600;
  color: #ffffff;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .contact-section {
    padding: 1.5rem 0;
  }

  .contact-header {
    margin-bottom: 1.5rem;
  }

  .contact-title {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  .contact-subtitle {
    font-size: 0.95rem;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .info-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .info-icon {
    width: 40px;
    height: 40px;
  }

  .info-content h3 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }

  .address, .phone {
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }

  .schedule p {
    margin-bottom: 0.3rem;
    font-size: 0.9rem;
  }

  .map-container iframe {
    height: 150px;
  }

  .store-features {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1.5rem 0;
  }

  .feature {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .contact-section {
    padding: 1rem 0;
  }

  .contact-header {
    margin-bottom: 1rem;
  }

  .contact-title {
    font-size: 1.5rem;
    margin-bottom: 0.4rem;
  }

  .contact-subtitle {
    font-size: 0.9rem;
  }

  .contact-content {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .info-card {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .info-icon {
    width: 30px;
    height: 30px;
  }

  .info-content h3 {
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }

  .address, .phone {
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }

  .district, .availability {
    font-size: 0.85rem;
  }

  .schedule p {
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }

  .map-container iframe {
    height: 120px;
  }

  .map-overlay {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }

  .store-features {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem 0;
  }

  .feature {
    padding: 0.6rem;
  }

  .feature-icon {
    width: 32px;
    height: 32px;
  }

  .feature span {
    font-size: 0.8rem;
  }
}
</style>
