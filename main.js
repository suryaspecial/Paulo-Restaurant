document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: shrink on scroll ---------- */
  var nav = document.getElementById('prNav');
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('pr-nav-scrolled');
    } else {
      nav.classList.remove('pr-nav-scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

 /* ---------- Nav: mobile toggle ---------- */
var toggle = document.getElementById('navToggle');
var links = document.getElementById('navLinks');

function setMenu(open) {
  links.classList.toggle('open', open);
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

toggle.addEventListener('click', function () {
  setMenu(!links.classList.contains('open'));
});

links.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () { setMenu(false); });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') setMenu(false);
});

  /* ---------- Reservation form ---------- */
  var form = document.getElementById('reservationForm');
  var successBox = document.getElementById('formSuccess');
  var dateInput = document.getElementById('resDate');

  // Prevent picking a date in the past
  if (dateInput) {
    var today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  function setFieldValid(field, valid) {
    var wrapper = field.closest('.pr-field');
    if (!wrapper) return;
    wrapper.classList.toggle('pr-invalid', !valid);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    var valid = true;
    var required = form.querySelectorAll('[required]');

    required.forEach(function (field) {
      var fieldValid = field.value.trim() !== '';
      if (field.id === 'resEmail' && fieldValid) {
        fieldValid = isValidEmail(field.value.trim());
      }
      setFieldValid(field, fieldValid);
      if (!fieldValid) valid = false;
    });

    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successBox.classList.remove('show');

    if (!validateForm()) {
      var firstInvalid = form.querySelector('.pr-invalid input, .pr-invalid select');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // NOTE FOR DEVELOPER / CLIENT:
    // This form currently only validates client-side and shows a confirmation
    // message. Before launch, connect this to a real reservation workflow —
    // e.g. POST the form data to the restaurant's booking backend, a
    // reservations API, or an email-forwarding endpoint — so requests
    // actually reach the restaurant. No payment or cart is involved by design.
    var data = {
      name: form.resName.value.trim(),
      phone: form.resPhone.value.trim(),
      email: form.resEmail.value.trim(),
      date: form.resDate.value,
      time: form.resTime.value,
      guests: form.resGuests.value,
      notes: form.resNotes.value.trim()
    };
    console.log('Reservation request (not yet wired to a backend):', data);

    successBox.classList.add('show');
    form.reset();
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Clear the invalid state as soon as the visitor fixes a field
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      var wrapper = field.closest('.pr-field');
      if (wrapper && wrapper.classList.contains('pr-invalid')) {
        var fieldValid = field.value.trim() !== '';
        if (field.id === 'resEmail' && fieldValid) fieldValid = isValidEmail(field.value.trim());
        if (fieldValid) wrapper.classList.remove('pr-invalid');
      }
    });
  });

});