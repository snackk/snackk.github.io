(function () {
	'use strict';

	/* ---------- Navbar scroll state + Scrollspy ---------- */
	var navbar = document.querySelector('.navbar');
	var backToTop = document.querySelector('.back-to-top');
	var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
	var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a, .mobile-nav a'));

	function updateActiveNav() {
		var scrollPos = window.scrollY + 140;
		var currentId = sections.length ? sections[0].id : null;
		sections.forEach(function (sec) {
			if (sec.offsetTop <= scrollPos) currentId = sec.id;
		});
		navAnchors.forEach(function (a) {
			var match = a.getAttribute('href') === '#' + currentId;
			a.classList.toggle('active', match);
		});
	}

	function onScroll() {
		var y = window.scrollY || window.pageYOffset;
		if (navbar) navbar.classList.toggle('scrolled', y > 12);
		if (backToTop) backToTop.classList.toggle('show', y > 500);
		updateActiveNav();
	}
	document.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	if (backToTop) {
		backToTop.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	/* ---------- Mobile nav ---------- */
	var navToggle = document.querySelector('.nav-toggle');
	var mobileNav = document.querySelector('.mobile-nav');
	if (navToggle && mobileNav) {
		navToggle.addEventListener('click', function () {
			var open = mobileNav.classList.toggle('open');
			navToggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
			document.body.style.overflow = open ? 'hidden' : '';
		});
		mobileNav.querySelectorAll('a').forEach(function (a) {
			a.addEventListener('click', function () {
				mobileNav.classList.remove('open');
				navToggle.innerHTML = '<i class="fas fa-bars"></i>';
				document.body.style.overflow = '';
			});
		});
	}

	/* ---------- Reveal on scroll ---------- */
	var revealEls = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window) {
		// Low threshold + top-anchored rootMargin so tall sections (e.g. the
		// projects grid) reveal as soon as they start entering the viewport,
		// instead of requiring a large % of their (very tall) area to be visible.
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('in');
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
		revealEls.forEach(function (el) { io.observe(el); });

		// Safety net: in case an element is already fully visible before JS
		// runs, or the observer never fires for any reason, force-reveal
		// everything shortly after load so content is never stuck hidden.
		window.setTimeout(function () {
			revealEls.forEach(function (el) { el.classList.add('in'); });
		}, 1500);
	} else {
		revealEls.forEach(function (el) { el.classList.add('in'); });
	}

	/* ---------- Project filters ---------- */
	var chips = document.querySelectorAll('.filter-chip');
	var cards = document.querySelectorAll('.project-card');
	chips.forEach(function (chip) {
		chip.addEventListener('click', function () {
			chips.forEach(function (c) { c.classList.remove('active'); });
			chip.classList.add('active');
			var filter = chip.getAttribute('data-filter');
			cards.forEach(function (card) {
				var cats = (card.getAttribute('data-category') || '').split(' ');
				var show = filter === 'all' || cats.indexOf(filter) !== -1;
				card.classList.toggle('hidden', !show);
			});
		});
	});

	/* ---------- Age calculation ---------- */
	function calculateAge(birthday) {
		var birthDate = new Date(birthday);
		var today = new Date();
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
		return age;
	}
	var ageIntro = document.getElementById('age-intro');
	var ageStat = document.getElementById('age-stat');
	var age = calculateAge('1992-12-17');
	if (ageIntro) ageIntro.textContent = age;
	if (ageStat) ageStat.textContent = age;

	/* ---------- Footer year ---------- */
	var yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();
})();



