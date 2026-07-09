/* Capta+Edu — interactions */
(function () {
  'use strict';

  /* nav scrolled state */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var burger = document.querySelector('.nav__burger');
  var menu = document.querySelector('.mobile-menu');
  function closeMenu() { menu.classList.remove('open'); document.body.style.overflow = ''; }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* FAQ accordion */
  document.querySelectorAll('.qa').forEach(function (qa) {
    var btn = qa.querySelector('.qa__q');
    var ans = qa.querySelector('.qa__a');
    btn.addEventListener('click', function () {
      var isOpen = qa.classList.contains('open');
      if (isOpen) {
        qa.classList.remove('open');
        ans.style.maxHeight = '';
      } else {
        qa.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* Mind map nodes — toggle active (one at a time on desktop) */
  var nodes = Array.prototype.slice.call(document.querySelectorAll('.node'));
  nodes.forEach(function (node) {
    node.addEventListener('click', function () {
      var was = node.classList.contains('active');
      nodes.forEach(function (n) { n.classList.remove('active'); });
      if (!was) node.classList.add('active');
    });
  });
  if (nodes[0]) nodes[0].classList.add('active');

  /* scroll reveal — position based (works in all environments) */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  function checkReveals() {
    var trigger = window.innerHeight * 0.92;
    for (var i = 0; i < reveals.length; i++) {
      var el = reveals[i];
      if (el.classList.contains('in')) continue;
      if (el.getBoundingClientRect().top < trigger) el.classList.add('in');
    }
  }
  /* active nav link on scroll */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var links = {};
  document.querySelectorAll('.nav__link').forEach(function (l) {
    var id = l.getAttribute('href');
    if (id && id.charAt(0) === '#') links[id.slice(1)] = l;
  });
  function checkSpy() {
    var mid = window.innerHeight * 0.4;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { current = sections[i].id; break; }
    }
    Object.keys(links).forEach(function (k) { links[k].classList.toggle('active-link', k === current); });
  }
  var ticking = false;
  function onFrame() {
    checkReveals();
    checkSpy();
    ticking = false;
  }
  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  checkReveals();
  checkSpy();
  /* safety: ensure nothing stays hidden if something goes wrong */
  setTimeout(function () { reveals.forEach(function (el) { el.classList.add('in'); }); }, 2500);

  /* contact form (RD Station shadow form integration) */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Helper to set native value (bypasses React's wrapper if present)
      function setNativeValue(element, value) {
        var proto = Object.getPrototypeOf(element);
        var setter = Object.getOwnPropertyDescriptor(proto, 'value');
        if (setter && setter.set) {
          setter.set.call(element, value);
        } else {
          element.value = value;
        }
        element.dispatchEvent(new Event('focus', { bubbles: true }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
      }

      // Funcao auxiliar para preencher um campo no formulário RD oculto
      function fillRdField(rdForm, customValue, keywords) {
        var fields = rdForm.querySelectorAll('input, select, textarea');
        var matched = false;
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          if (field.type === 'submit' || field.type === 'button' || field.type === 'hidden') continue;
          
          var name = (field.name || '').toLowerCase();
          var id = (field.id || '').toLowerCase();
          var placeholder = (field.placeholder || '').toLowerCase();
          
          var labelText = '';
          if (field.id) {
            var label = rdForm.querySelector('label[for="' + field.id + '"]');
            if (label) labelText = label.textContent.toLowerCase();
          }
          if (!labelText) {
            var parentLabel = field.closest('label');
            if (parentLabel) labelText = parentLabel.textContent.toLowerCase();
          }
          
          var matchesKeyword = keywords.some(function(kw) {
            return name.indexOf(kw) !== -1 || id.indexOf(kw) !== -1 || placeholder.indexOf(kw) !== -1 || labelText.indexOf(kw) !== -1;
          });
          
          if (matchesKeyword) {
            if (field.type === 'radio' || field.type === 'checkbox') {
              if (field.value.toLowerCase() === customValue.toLowerCase() || 
                  (field.nextSibling && field.nextSibling.textContent.toLowerCase().indexOf(customValue.toLowerCase()) !== -1)) {
                field.click(); // Click is more robust for checkboxes/radios
              }
            } else if (field.tagName.toLowerCase() === 'select') {
              var options = Array.prototype.slice.call(field.options);
              var matchedOption = options.find(function(opt) { return opt.text.toLowerCase().indexOf(customValue.toLowerCase()) !== -1; });
              if (matchedOption) {
                setNativeValue(field, matchedOption.value);
              } else {
                setNativeValue(field, customValue);
              }
            } else {
              setNativeValue(field, customValue);
            }
            matched = true;
            break;
          }
        }
        if (!matched) console.warn("RD Station: Não encontrou campo para", keywords);
        return matched;
      }


      var rdContainer = document.getElementById('formulario-diagnostico-home-043dfe69640c8ef5538a');
      var rdForm = rdContainer ? rdContainer.querySelector('form') : null;

      if (rdForm) {
        // Coletar os valores do nosso formulário (via IDs explícitos)
        var nome = document.getElementById('f-nome') ? document.getElementById('f-nome').value : '';
        var email = document.getElementById('f-email') ? document.getElementById('f-email').value : '';
        var telefone = document.getElementById('f-tel') ? document.getElementById('f-tel').value : '';
        var instituicao = document.getElementById('f-inst') ? document.getElementById('f-inst').value : '';
        var cargo = document.getElementById('f-cargo') ? document.getElementById('f-cargo').value : '';
        var site = document.getElementById('f-site') ? document.getElementById('f-site').value : '';
        var prefContatoEl = form.querySelector('input[name="contato-pref"]:checked');
        var prefContato = prefContatoEl ? prefContatoEl.value : '';

        // Preencher o RD Station form
        if (nome) fillRdField(rdForm, nome, ['name', 'nome']);
        if (email) fillRdField(rdForm, email, ['email', 'e-mail']);
        if (telefone) fillRdField(rdForm, telefone, ['phone', 'telefone', 'tel', 'celular']);
        if (instituicao) fillRdField(rdForm, instituicao, ['company', 'empresa', 'instituicao', 'instituição']);
        if (cargo) fillRdField(rdForm, cargo, ['job', 'cargo', 'title', 'funcao', 'função']);
        if (site) fillRdField(rdForm, site, ['site', 'website', 'url']);
        if (prefContato) fillRdField(rdForm, prefContato, ['contato', 'prefer', 'canal', 'comunicacao']);

        // Submeter o RD Station form
        var rdSubmitBtn = rdForm.querySelector('button[type="submit"], input[type="submit"], .rd-button');
        if (rdSubmitBtn) {
          rdSubmitBtn.click();
        } else {
          rdForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
      } else {
        console.warn('Formulário RD Station não encontrado ou ainda não carregado.');
      }

      // Mostrar mensagem de sucesso e limpar form local
      var ok = form.querySelector('.form-ok');
      if (ok) ok.classList.add('show');
      form.querySelectorAll('input, textarea').forEach(function (f) {
        if (f.type === 'radio' || f.type === 'checkbox') f.checked = false;
        else f.value = '';
      });
      setTimeout(function() { if (ok) ok.classList.remove('show'); }, 6000);
    });
  }
})();
