// Script de alternância de tema
// - Alterna entre os temas 'claro' e 'escuro' no <body>
// - Troca as imagens do logotipo e do ícone de alternância para corresponder ao tema selecionado
// - Mantém a seleção de tema no localStorage
// - Usa prefers-color-scheme se nenhuma preferência estiver salva

(function () {
	const THEME_KEY = 'theme';
	const body = document.body;
	const toggler = document.querySelector('.btn-modo');
	const headerLogo = document.querySelector('.cabecalho img');
	const modeIcon = toggler ? toggler.querySelector('img') : null;

	// caminhos para os recursos específicos do tema
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
		// remover classes de tema anteriores (caso já existam algumas definidas)
		body.classList.remove('light', 'dark');
		body.classList.add(theme);
		// mantem também um atributo de dados para seletores CSS.
		document.documentElement.setAttribute('data-theme', theme);

		// troca a imagem do logotipo, se disponível.
		if (headerLogo) {
			headerLogo.src = logos[theme] || headerLogo.src;
			headerLogo.alt = theme === 'light' ? 'Logo preto da Tecboard' : 'Logo branco da Tecboard';
		}

		// ícone do modo de troca e etiqueta de acessibilidade
		if (modeIcon) {
			modeIcon.src = icons[theme] || modeIcon.src;
			modeIcon.alt = theme === 'light' ? 'Modo Claro' : 'Modo Escuro';
		}

		if (toggler) {
			toggler.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
			toggler.setAttribute('aria-label', theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro');
		}

		// persistir escolha
		try {
			localStorage.setItem(THEME_KEY, theme);
		} catch (e) {
			// ignorar se o localStorage não estiver disponível
			// (ex.: modo de bolso) — continuar sem persistir
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
		// se o usuário não tiver nenhuma escolha salva, aceite o esquema de cores preferido do sistema.
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

	// inicializa em DOMContentLoaded
	document.addEventListener('DOMContentLoaded', () => {
		// determina o tema inicial
		const saved = getSavedTheme();
		const initial = saved || getPreferredTheme();
		applyTheme(initial);

		// ddiciona manipulador de cliques ao botão de alternância
		if (toggler) {
			toggler.addEventListener('click', () => toggleTheme());
		} else {
			console.warn('Botão .btn-modo não encontrado. O toggle de tema não está disponível.');
		}
	});
})();
