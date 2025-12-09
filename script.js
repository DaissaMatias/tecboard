// Theme toggle script for Tecboard
// - toggles between 'light' and 'dark' theme classes on the <body>
// - swaps logo and toggle icon images to match the selected theme
// - persists theme selection in localStorage
// - uses prefers-color-scheme if no saved preference

(function () {
	const THEME_KEY = 'theme';
	const body = document.body;
	const toggler = document.querySelector('.btn-modo');
	const headerLogo = document.querySelector('.cabecalho img');
	const modeIcon = toggler ? toggler.querySelector('img') : null;

	// paths for the theme-specific assets
	const icons = {
		light: 'img/modo-dark.png',
		dark: 'img/modo-light.png',
	};

	const logos = {
		light: 'img/logo-tecboard-preto.png',
		dark: 'img/logo-tecboard-branco.png',
	};

	function applyTheme(theme) {
		if (!theme) return;
		// remove previous theme classes (in case some already set)
		body.classList.remove('light', 'dark');
		body.classList.add(theme);
		// also keep a data attribute for CSS selectors
		document.documentElement.setAttribute('data-theme', theme);

		// swap logo image if available
		if (headerLogo) {
			headerLogo.src = logos[theme] || headerLogo.src;
			headerLogo.alt = theme === 'light' ? 'Logo preto da Tecboard' : 'Logo branco da Tecboard';
		}

		// swap mode icon and accessible label
		if (modeIcon) {
			modeIcon.src = icons[theme] || modeIcon.src;
			modeIcon.alt = theme === 'light' ? 'Modo Claro' : 'Modo Escuro';
		}

		if (toggler) {
			toggler.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
			toggler.setAttribute('aria-label', theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro');
		}

		// persist choice
		try {
			localStorage.setItem(THEME_KEY, theme);
		} catch (e) {
			// ignore if localStorage is unavailable
			// (e.g., pocket mode) — continue without persisting
			console.warn('Não foi possível salvar a preferência de tema:', e);
		}
	}

	function getSavedTheme() {
		try {
			return localStorage.getItem(THEME_KEY);
		} catch (e) {
			return null;
		}
	}

	function getPreferredTheme() {
		// If user has no saved choice, accept system prefers-color-scheme
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}
		return 'light';
	}

	function toggleTheme() {
		const current = body.classList.contains('dark') ? 'dark' : 'light';
		const next = current === 'dark' ? 'light' : 'dark';
		applyTheme(next);
	}

	// initialize on DOMContentLoaded
	document.addEventListener('DOMContentLoaded', () => {
		// Determine initial theme
		const saved = getSavedTheme();
		const initial = saved || getPreferredTheme();
		applyTheme(initial);

		// add click handler to toggle button
		if (toggler) {
			toggler.addEventListener('click', () => toggleTheme());
		} else {
			console.warn('Botão .btn-modo não encontrado. O toggle de tema não está disponível.');
		}
	});
})();
