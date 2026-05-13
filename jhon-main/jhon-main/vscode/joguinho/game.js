class MinecraftClone {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Configurações do mundo
        this.worldWidth = 32;
        this.worldHeight = 24;
        this.blockSize = 32;
        this.world = this.generateWorld();
        
        // Jogador
        this.player = {
            x: 16 * this.blockSize,
            y: 8 * this.blockSize,
            width: this.blockSize,
            height: this.blockSize * 2,
            vx: 0,
            vy: 0,
            speed: 4,
            jumpPower: 12,
            onGround: false,
            selectedSlot: 0
        };
        
        // Inventário
        this.inventory = {
            hotbar: [1, 0, 2, 3, 0, 0, 0, 0, 0],
            main: Array(27).fill(0),
            open: false
        };
        
        // Texturas (simuladas com cores por enquanto)
        this.textures = {
            0: null, // Ar
            1: '#8B4513', // Terra
            2: '#228B22', // Grama
            3: '#696969', // Pedra
            4: '#D2691E'  // Madeira
        };
        
        // Controles
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.addEventListener('keyup', (e) => this.handleKeyup(e));
        document.addEventListener('mousemove', (e) => this.handleMousemove(e));
        document.addEventListener('click', (e) => this.handleClick(e));
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Hotbar
        document.querySelectorAll('.hotbar-slot').forEach((slot, index) => {
            slot.addEventListener('click', () => this.selectHotbarSlot(index));
        });
        
        // Inventário
        document.getElementById('inventory').addEventListener('click', (e) => {
            if (e.target.classList.contains('inv-slot')) {
                // Lógica de arrastar itens aqui
            }
        });
        
        this.gameLoop();
    }
    
    generateWorld() {
        const world = [];
        for (let x = 0; x < this.worldWidth; x++) {
            world[x] = [];
            for (let y = 0; y < this.worldHeight; y++) {
                if (y > 16) {
                    world[x][y] = 3; // Pedra
                } else if (y > 12) {
                    world[x][y] = 1; // Terra
                } else if (y === 12) {
                    world[x][y] = 2; // Grama
                } else {
                    world[x][y] = 0; // Ar
                }
            }
        }
        return world;
    }
    
    handleKeydown(e) {
        this.keys[e.code] = true;
        
        // Teclas 1-9 para hotbar
        if (e.code >= 'Digit1' && e.code <= 'Digit9') {
            this.selectHotbarSlot(parseInt(e.code[5]) - 1);
        }
        
        // E para abrir inventário
        if (e.code === 'KeyE') {
            this.toggleInventory();
        }
    }
    
    handleKeyup(e) {
        this.keys[e.code] = false;
    }
    
    handleMousemove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((this.mouseX - rect.left) / this.blockSize);
        const y = Math.floor((this.mouseY - rect.top) / this.blockSize);
        
        if (e.button === 0) { // Clique esquerdo - quebrar
            this.breakBlock(x, y);
        } else if (e.button === 2) { // Clique direito - colocar
            this.placeBlock(x, y);
        }
    }
    
    selectHotbarSlot(slot) {
        this.player.selectedSlot = slot;
        document.querySelectorAll('.hotbar-slot').forEach((s, i) => {
            s.classList.toggle('active', i === slot);
        });
    }
    
    toggleInventory() {
        this.inventory.open = !this.inventory.open;
        document.getElementById('inventory').classList.toggle('active', this.inventory.open);
    }
    
    updatePlayer() {
        // Movimento horizontal
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.player.vx = -this.player.speed;
        } else if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.player.vx = this.player.speed;
        } else {
            this.player.vx *= 0.8;
        }
        
        // Pulo
        if ((this.keys['KeyW'] || this.keys['ArrowUp'] || this.keys['Space']) && this.player.onGround) {
            this.player.vy = -this.player.jumpPower;
            this.player.onGround = false;
        }
        
        // Gravidade
        this.player.vy += 0.5;
        
        // Colisão horizontal
        let newX = this.player.x + this.player.vx;
        if (!this.collides(newX, this.player.y) && !this.collides(newX, this.player.y + this.player.height - 1)) {
            this.player.x = newX;
        }
        
        // Colisão vertical
        let newY = this.player.y + this.player.vy;
        if (this.collides(this.player.x, newY + this.player.height - 1)) {
            this.player.vy = 0;
            this.player.onGround = true;
            this.player.y = Math.floor((newY + this.player.height - 1) / this.blockSize) * this.blockSize;
        } else {
            this.player.y = newY;
            this.player.onGround = false;
        }
    }
    
    collides(x, y) {
        const blockX = Math.floor(x / this.blockSize);
        const blockY = Math.floor(y / this.blockSize);
        return this.world[blockX] && this.world[blockX][blockY] !== 0;
    }
    
    breakBlock(x, y) {
        if (this.world[x] && this.world[x][y] !== 0) {
            this.world[x][y] = 0;
            // Adicionar ao inventário
            const item = this.inventory.hotbar[this.player.selectedSlot];
            if (item > 0) {
                this.addToInventory(this.world[x][y]);
            }
        }
    }
    
    placeBlock(x, y) {
        const item = this.inventory.hotbar[this.player.selectedSlot];
        if (item > 0 && this.world[x] && this.world[x][y] === 0) {
            this.world[x][y] = item;
            // Remover do inventário (simplificado)
        }
    }
    
    addToInventory(itemId) {
        // Lógica simplificada de inventário
        for (let i = 0; i < this.inventory.hotbar.length; i++) {
            if (this.inventory.hotbar[i] === 0) {
                this.inventory.hotbar[i] = itemId;
                this.updateHotbarUI();
                break;
            }
        }
    }
    
    updateHotbarUI() {
        document.querySelectorAll('.hotbar-slot').forEach((slot, index) => {
            const item = this.inventory.hotbar[index];
            slot.innerHTML = item ? `<div style="background: ${this.textures[item]}; width: 48px; height: 48px; border-radius: 4px;"></div>` : '';
        });
    }
    
    render() {
        // Limpar canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Renderizar mundo
        const startX = Math.max(0, Math.floor((this.player.x - this.canvas.width/2) / this.blockSize));
        const endX = Math.min(this.worldWidth, startX + Math.ceil(this.canvas.width / this.blockSize) + 1);
        const startY = Math.max(0, Math.floor((this.player.y - this.canvas.height/2) / this.blockSize));
        const endY = Math.min(this.worldHeight, startY + Math.ceil(this.canvas.height / this.blockSize) + 1);
        
        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                if (this.world[x] && this.world[x][y] !== 0) {
                    this.ctx.fillStyle = this.textures[this.world[x][y]];
                    this.ctx.fillRect(
                        x * this.blockSize - this.player.x + this.canvas.width/2,
                        y * this.blockSize - this.player.y + this.canvas.height/2,
                        this.blockSize,
                        this.blockSize
                    );
                    
                    // Borda dos blocos
                    this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(
                        x * this.blockSize - this.player.x + this.canvas.width/2,
                        y * this.blockSize - this.player.y + this.canvas.height/2,
                        this.blockSize,
                        this.blockSize
                    );
                }
            }
        }
        
        // Renderizar jogador
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fillRect(
            this.canvas.width/2 - this.player.width/2,
            this.canvas.height/2 - this.player.height/2,
            this.player.width,
            this.player.height
        );
        
        // Item selecionado
        const selectedItem = this.inventory.hotbar[this.player.selectedSlot];
        if (selectedItem) {
            this.ctx.fillStyle = this.textures[selectedItem];
            this.ctx.fillRect(
                this.canvas.width/2 + 20,
                this.canvas.height - 100,
                32,
                32
            );
        }
    }
    
    gameLoop() {
        this.updatePlayer();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Inicializar jogo
window.addEventListener('load', () => {
    new MinecraftClone();
});