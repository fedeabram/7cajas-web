// ============================
// SLIDER HERO (AUTOPLAY + BOTONES)
// ============================

document.addEventListener("DOMContentLoaded", function () {

  // Slides
  const slides = document.querySelectorAll('.slide');
  const btnPrev = document.querySelector('.slider-btn.prev');
  const btnNext = document.querySelector('.slider-btn.next');

  let index = 0;
  let autoplayInterval;

  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[n].classList.add('active');
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  // Controles
  btnNext.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  btnPrev.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  showSlide(index);
  startAutoplay();



  // ============================
  // MODAL DE PRODUCTOS (MULTI-IMAGEN)
  // ============================

  const productos = document.querySelectorAll(".producto");
  let modal = null;

  function crearModal() {
    modal = document.createElement("div");
    modal.classList.add("modal-producto");
    modal.innerHTML = `
      <div class="modal-contenido">
        <button class="modal-cerrar">&times;</button>

        <div class="modal-gallery"></div>

        <h3 class="modal-titulo"></h3>
        <p class="modal-descripcion"></p>

        <ul class="modal-lista">
          <li><strong>Tipo:</strong> <span class="modal-tipo"></span></li>
          <li><strong>Acidez:</strong> <span class="modal-acidez"></span></li>
          <li><strong>Origen:</strong> <span class="modal-origen"></span></li>
          <li><strong>Usos recomendados:</strong> <span class="modal-usos"></span></li>
          <li><strong>Presentaciones:</strong> <span class="modal-presentacion"></span></li>
        </ul>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("modal-cerrar")) {
        modal.classList.remove("activo");
      }
    });
  }

  function mostrarModal(producto) {
    if (!modal) crearModal();

    const titulo = producto.dataset.tipo || "Producto";
    const descripcion = producto.querySelector("p").textContent;

    const gallery = modal.querySelector(".modal-gallery");
    gallery.innerHTML = "";

    const imagenes = (producto.dataset.img || "").split(",");
    imagenes.forEach(src => {
      const img = document.createElement("img");
      img.src = src.trim();
      img.alt = titulo;
      gallery.appendChild(img);
    });

    modal.querySelector(".modal-titulo").textContent = titulo;
    modal.querySelector(".modal-descripcion").textContent = descripcion;

    modal.querySelector(".modal-tipo").textContent = producto.dataset.tipo || "";
    modal.querySelector(".modal-acidez").textContent = producto.dataset.acidez || "";
    modal.querySelector(".modal-origen").textContent = producto.dataset.origen || "";
    modal.querySelector(".modal-usos").textContent = producto.dataset.usos || "";
    modal.querySelector(".modal-presentacion").textContent = producto.dataset.presentacion || "";

    modal.classList.add("activo");
  }

  productos.forEach(prod => {
    prod.addEventListener("click", () => mostrarModal(prod));
  });
// ============================
// GALERÍA / CARRUSEL
// ============================

const galeriaTrack = document.querySelector(".galeria-track");
const galeriaSlides = document.querySelectorAll(".galeria-slide");
const galeriaPrev = document.querySelector(".galeria-btn.prev");
const galeriaNext = document.querySelector(".galeria-btn.next");

if (galeriaTrack && galeriaSlides.length > 0) {

  let index = 0;
  let autoplay;

  function update() {
    const slideWidth = galeriaSlides[0].offsetWidth;
    const gap = 30;
    galeriaTrack.style.transform =
      `translateX(-${index * (slideWidth + gap)}px)`;
  }

  galeriaNext.addEventListener("click", () => {
    index = (index + 1) % galeriaSlides.length;
    update();
  });

  galeriaPrev.addEventListener("click", () => {
    index = (index - 1 + galeriaSlides.length) % galeriaSlides.length;
    update();
  });

  function startAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => {
      index = (index + 1) % galeriaSlides.length;
      update();
    }, 3000);
  }

  galeriaTrack.addEventListener("mouseenter", () => clearInterval(autoplay));
  galeriaTrack.addEventListener("mouseleave", startAutoplay);

  update();
  startAutoplay();

  window.addEventListener("resize", update);
}

// ============================
// MAP TOOLTIPS + SUCURSAL INTERACTION
// ============================
const mapPoints = document.querySelectorAll('.map-point');
const mapTooltip = document.getElementById('map-tooltip');
const sucursales = document.querySelectorAll('.sucursal');

// Map point → tooltip on hover
if (mapTooltip && mapPoints.length > 0) {
  mapPoints.forEach(point => {
    point.addEventListener('mouseenter', () => {
      mapTooltip.textContent = point.getAttribute('data-info');
      mapTooltip.style.opacity = '1';
      // Also highlight matching sucursal
      const city = point.getAttribute('data-city');
      sucursales.forEach(s => s.classList.toggle('active', s.dataset.city === city));
    });

    point.addEventListener('mousemove', (e) => {
      const container = point.closest('.expansion-img');
      const rect = container.getBoundingClientRect();
      mapTooltip.style.left = (e.clientX - rect.left) + 'px';
      mapTooltip.style.top = (e.clientY - rect.top - 40) + 'px';
    });

    point.addEventListener('mouseleave', () => {
      mapTooltip.style.opacity = '0';
      sucursales.forEach(s => s.classList.remove('active'));
    });
  });
}

// Sucursal hover → highlight map point
sucursales.forEach(sucursal => {
  sucursal.addEventListener('mouseenter', () => {
    const city = sucursal.dataset.city;
    mapPoints.forEach(point => {
      point.classList.toggle('highlighted', point.getAttribute('data-city') === city);
    });
  });

  sucursal.addEventListener('mouseleave', () => {
    mapPoints.forEach(point => point.classList.remove('highlighted'));
  });
});

// ============================
// FORM → EMAIL (mailto)
// ============================
// TODO: Replace EMAIL_ADDRESS with the actual email when defined
const EMAIL_ADDRESS = 'info@7cajas.com';
const contactForm = document.querySelector('#contacto-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = contactForm.querySelector('[name="nombre"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const tel = contactForm.querySelector('[name="telefono"]').value.trim();
    const mensaje = contactForm.querySelector('[name="mensaje"]').value.trim();

    if (!nombre || !email || !mensaje) return;

    const subject = encodeURIComponent('Consulta desde sitio web - ' + nombre);
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}${tel ? '\nTeléfono: ' + tel : ''}\n\nMensaje:\n${mensaje}`
    );
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;

    // Show success message
    const successMsg = contactForm.querySelector('.form-success');
    if (successMsg) {
      successMsg.style.display = 'block';
      setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
    }
  });
}

});
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 0) {              // ← Cambiado: activa desde el primer pixel de scroll
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

