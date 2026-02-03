const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav') || document.querySelector('.navigation');
const navLinks = document.querySelectorAll('.navigation a');

function setAriaExpanded(value){
    if(menuToggle) menuToggle.setAttribute('aria-expanded', String(value));
}

function openMenu(){
    if(!menuToggle || !navigation) return;
    menuToggle.classList.add('active');
    navigation.classList.add('active');
    setAriaExpanded(true);
    setTimeout(updateBodyTopPadding, 120);
}

function closeMenu(){
    if(!menuToggle || !navigation) return;
    menuToggle.classList.remove('active');
    navigation.classList.remove('active');
    setAriaExpanded(false);
    setTimeout(updateBodyTopPadding, 120);
}

function toggleMenu(){
    if(!menuToggle || !navigation) return;
    if(navigation.classList.contains('active')) closeMenu(); else openMenu();
}

function handleOutsideClick(e){
    if(!navigation || !menuToggle) return;
    const isOpen = navigation.classList.contains('active');
    if(!isOpen) return;
    if(navigation.contains(e.target) || menuToggle.contains(e.target)) return;
    closeMenu();
}

function updateBodyTopPadding(){
    const header = document.querySelector('header');
    if(!header) return;
    const headerH = header.getBoundingClientRect().height || 0;
    let extra = 0;
    if(navigation && navigation.classList.contains('active')){
        extra = navigation.getBoundingClientRect().height || 0;
    }
    document.body.style.paddingTop = (headerH + extra) + 'px';
}

if(menuToggle){
    menuToggle.addEventListener('click', toggleMenu);
    if(!menuToggle.hasAttribute('aria-expanded')) setAriaExpanded(false);
}

navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', handleOutsideClick);
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeMenu(); });

function onPageLoad(){
    closeMenu();
    setTimeout(updateBodyTopPadding, 100);
}

window.addEventListener('load', onPageLoad);
window.addEventListener('resize', updateBodyTopPadding);

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', onPageLoad);
} else {
    onPageLoad();
}
window.onload = function() {
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('email');
  if (!form) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Clear any previous error message
    const prevError = form.querySelector('.error-message');
    if (prevError) prevError.remove();
    if (emailInput) emailInput.classList.remove('input-invalid');

    // Validate email using built-in validity (works with type="email" and required)
    if (!emailInput || !emailInput.checkValidity()) {
      if (emailInput) emailInput.classList.add('input-invalid');
      const err = document.createElement('div');
      err.className = 'error-message';
      err.setAttribute('role', 'alert');
      err.textContent = 'الرجاء إدخال بريد إلكتروني صالح'; // Arabic message
      form.appendChild(err);
      if (emailInput) emailInput.focus();
      return;
    }

    // Disable submit button to prevent duplicate submissions
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.origText = submitBtn.textContent;
      submitBtn.textContent = 'جارٍ الإرسال...';
    }

    // Replace with your Service ID, Template ID, and Public Key
    const serviceID = 'service_tq8ccer';
    const templateID = 'template_ubcrdya';
    const publicKey = 'z_lgbfOSm2ac8XI3v';

    emailjs.sendForm(serviceID, templateID, this, publicKey)
      .then(() => {
        alert('تم الاشتراك بنجاح!');
        this.reset(); // Reset form fields after submission
      })
      .catch((error) => {
        console.error('FAILED...', error);
        alert('حدث خطأ، حاول مرة أخرى لاحقًا.');
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.origText || 'اشترك';
        }
      });
  });

  // Remove error message on input
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      this.classList.remove('input-invalid');
      const prev = form.querySelector('.error-message');
      if (prev) prev.remove();
    });
  }
}