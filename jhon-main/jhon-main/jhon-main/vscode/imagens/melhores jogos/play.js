const platforms = [
    {
        name: "🖥️ PC",
        icon: "🖥️",
        games: [
            {
                title: "Elden Ring",
                description: "Um RPG de ação épico de mundo aberto criado pela FromSoftware. Explore um vasto mundo interconectado cheio de perigos, chefes incríveis e uma narrativa profunda. Considerado um dos melhores jogos de todos os tempos pela liberdade e desafio que oferece."
            },
            {
                title: "Cyberpunk 2077",
                description: "Um RPG futurista em mundo aberto ambientado na distópica Night City. Com uma história envolvente, personagens memoráveis e gráficos de última geração, o jogo oferece uma experiência imersiva única."
            },
            {
                title: "Half-Life 2",
                description: "Clássico revolucionário de FPS com física inovadora e narrativa cinematográfica. Um marco nos jogos que ainda impressiona pela qualidade e influência na indústria."
            }
        ]
    },
    {
        name: "🎮 PlayStation",
        icon: "🎮",
        games: [
            {
                title: "The Last of Us Part II",
                description: "Uma obra-prima narrativa que explora temas profundos de vingança, perda e humanidade. Gráficos impressionantes, jogabilidade refinada e uma história que emociona."
            },
            {
                title: "God of War (2018)",
                description: "Reboot épico da franquia que reinventa Kratos em uma jornada nórdica emocionante com seu filho Atreus. Combate brutal, exploração e uma narrativa inesquecível."
            },
            {
                title: "Ghost of Tsushima",
                description: "Um samurai épico no Japão feudal com combate fluido, mundo aberto deslumbrante e uma história cativante sobre honra e vingança."
            }
        ]
    },
    {
        name: "💠 Xbox",
        icon: "💠",
        games: [
            {
                title: "Halo Infinite",
                description: "O retorno triunfal do Master Chief com combate perfeito, mundo aberto expansivo e multiplayer incrível. Um dos melhores FPS da geração."
            },
            {
                title: "Forza Horizon 5",
                description: "A melhor experiência de corrida arcade em mundo aberto no México. Centenas de carros, gráficos impressionantes e jogabilidade perfeita."
            },
            {
                title: "Starfield",
                description: "A tão esperada aventura espacial da Bethesda com exploração de planetas, construção de naves e uma narrativa sci-fi épica."
            }
        ]
    },
    {
        name: "🎮 Nintendo Switch",
        icon: "🎮",
        games: [
            {
                title: "The Legend of Zelda: Breath of the Wild",
                description: "Revolucionou os jogos de mundo aberto com liberdade total de exploração, quebra-cabeças criativos e um mundo vivo e mágico."
            },
            {
                title: "Super Mario Odyssey",
                description: "A aventura 3D mais criativa de Mario com mundos únicos, mecânicas inovadoras de captura e diversão pura para todas as idades."
            },
            {
                title: "Animal Crossing: New Horizons",
                description: "O simulador de vida mais relaxante e criativo. Construa sua ilha dos sonhos, colecione itens e viva no seu próprio ritmo."
            }
        ]
    },
    {
        name: "📱 Mobile",
        icon: "📱",
        games: [
            {
                title: "Genshin Impact",
                description: "RPG de ação em mundo aberto gratuito com gráficos anime incríveis, combate dinâmico e centenas de horas de conteúdo."
            },
            {
                title: "PUBG Mobile",
                description: "Battle Royale mais jogado do mundo mobile com mapas gigantes, armas realistas e partidas tensas até o último momento."
            },
            {
                title: "Call of Duty Mobile",
                description: "FPS mobile perfeito com multiplayer intenso, battle royale e modos variados. Gráficos e jogabilidade de console no celular."
            }
        ]
    }
];

// Criar partículas de fundo
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Criar cards das plataformas
function createPlatforms() {
    const grid = document.getElementById('platformsGrid');
    platforms.forEach((platform, index) => {
        const card = document.createElement('div');
        card.className = 'platform-card scroll-animation';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="platform-icon platform-${platform.name.toLowerCase().replace(/[^a-z]/g, '')}">
                ${platform.icon}
            </div>
            <h2 class="platform-name">${platform.name}</h2>
            <ul class="game-list">
                ${platform.games.map(game => 
                    `<li class="game-item" data-description="${game.description.replace(/"/g, '&quot;')}">
                        <div class="game-title">⭐ ${game.title}</div>
                    </li>`
                ).join('')}
            </ul>
        `;
        
        grid.appendChild(card);
    });
}

// Modal functionality
function setupModals() {
    const modal = document.getElementById('gameModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close');
    const gameItems = document.querySelectorAll('.game-item');

    gameItems.forEach(item => {
        item.addEventListener('click', () => {
            modalBody.textContent = item.dataset.description;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.platform-card').forEach(card => {
        observer.observe(card);
    });
}

// Hover effects extras
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createPlatforms();
    setupModals();
    setupScrollAnimations();

    // Animação de entrada do título
    const title = document.querySelector('h1');
    title.style.opacity = '0';
    title.style.transform = 'translateY(50px)';
    setTimeout(() => {
        title.style.transition = 'all 1s ease';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }, 500);
});

// Efeito de mouse trail
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.width = '6px';
    trail.style.height = '6px';
    trail.style.background = 'rgba(78, 205, 196, 0.6)';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '999';
    trail.style.transition = 'all 0.3s ease';
    document.body.appendChild(trail);

    setTimeout(() => {
        trail.style.transform = 'scale(0)';
        trail.style.opacity = '0';
        setTimeout(() => trail.remove(), 300);
    }, 100);
});