export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private puck: { x: number; y: number; dx: number; dy: number; radius: number };
  private coins: Array<{ x: number; y: number; collected: boolean }>;
  private score: number;
  private attempts: number;
  private puckImage: HTMLImageElement;
  private isRunning: boolean;
  private animationFrameId: number;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.puck = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      dx: 5,
      dy: 5,
      radius: 30
    };
    this.coins = [];
    this.score = 0;
    this.attempts = 6;
    this.puckImage = new Image();
    this.puckImage.src = '/lovable-uploads/975c0ca0-7cbb-4a25-a083-90e2c81e7743.png';
    this.isRunning = false;
    this.animationFrameId = 0;
    
    this.initializeCoins();
    this.setupEventListeners();
  }

  private initializeCoins() {
    this.coins = [];
    for (let i = 0; i < 100; i++) {
      this.coins.push({
        x: Math.random() * (this.canvas.width - 20) + 10,
        y: Math.random() * (this.canvas.height - 20) + 10,
        collected: false
      });
    }
  }

  private setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isRunning) return;
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Update puck position based on mouse movement
      const dx = mouseX - this.puck.x;
      const dy = mouseY - this.puck.y;
      this.puck.dx = dx * 0.1;
      this.puck.dy = dy * 0.1;
    });

    // Touch support for mobile
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.isRunning) return;
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const mouseX = touch.clientX - rect.left;
      const mouseY = touch.clientY - rect.top;
      
      const dx = mouseX - this.puck.x;
      const dy = mouseY - this.puck.y;
      this.puck.dx = dx * 0.1;
      this.puck.dy = dy * 0.1;
    });
  }

  private update() {
    if (!this.isRunning) return;

    // Update puck position
    this.puck.x += this.puck.dx;
    this.puck.y += this.puck.dy;

    // Bounce off walls
    if (this.puck.x - this.puck.radius < 0 || this.puck.x + this.puck.radius > this.canvas.width) {
      this.puck.dx *= -0.8;
      this.puck.x = Math.max(this.puck.radius, Math.min(this.canvas.width - this.puck.radius, this.puck.x));
    }
    if (this.puck.y - this.puck.radius < 0 || this.puck.y + this.puck.radius > this.canvas.height) {
      this.puck.dy *= -0.8;
      this.puck.y = Math.max(this.puck.radius, Math.min(this.canvas.height - this.puck.radius, this.puck.y));
    }

    // Check coin collisions
    this.coins.forEach(coin => {
      if (!coin.collected) {
        const dx = coin.x - this.puck.x;
        const dy = coin.y - this.puck.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.puck.radius + 10) {
          coin.collected = true;
          this.score += 1;
        }
      }
    });

    // Check if all coins are collected
    const allCollected = this.coins.every(coin => coin.collected);
    if (allCollected) {
      this.attempts--;
      if (this.attempts > 0) {
        this.initializeCoins();
      } else {
        this.isRunning = false;
      }
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw coins
    this.coins.forEach(coin => {
      if (!coin.collected) {
        this.ctx.beginPath();
        this.ctx.arc(coin.x, coin.y, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fill();
        this.ctx.closePath();
      }
    });

    // Draw puck with logo
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.puck.x, this.puck.y, this.puck.radius, 0, Math.PI * 2);
    this.ctx.clip();
    this.ctx.drawImage(
      this.puckImage,
      this.puck.x - this.puck.radius,
      this.puck.y - this.puck.radius,
      this.puck.radius * 2,
      this.puck.radius * 2
    );
    this.ctx.restore();

    // Draw score and attempts
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    this.ctx.fillText(`Attempts: ${this.attempts}`, 10, 60);
  }

  public start() {
    this.isRunning = true;
    this.score = 0;
    this.attempts = 6;
    this.initializeCoins();
    this.gameLoop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private gameLoop = () => {
    if (!this.isRunning) return;
    
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  public resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }
}