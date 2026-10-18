/*
 * Fundo de código em cascata (matrix rain) — DSG-04, aprovado pelo Rafael.
 * Base: reference/matrix-background.html (fora do git), com ajustes:
 *   1. Velocidade REDUZIDA: 0.9 → 0.6 → 0.5 px por tick (35 ms) — ainda mais
 *      lenta que a referência, ajuste fino pedido pelo Rafael (17/10/2026).
 *   2. Paleta do NOSSO site (DSG-02): fade #010a13, texto #005a6e —
 *      a referência usava outra paleta (#01060a / #1e7b8c).
 *   3. Segurança/robustez: JS externo (CSP script-src 'self', SEC-12),
 *      respeita prefers-reduced-motion (MOB-07), pausa com a aba oculta
 *      (bateria/CPU) e não intercepta cliques (pointer-events: none).
 * Decorativo: o site funciona integralmente sem este arquivo (SEC-20).
 */
(function () {
  'use strict';

  var canvas = document.getElementById('codigo-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  // MOB-07: nenhuma animação contínua contra prefers-reduced-motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var BG_FADE = 'rgba(1, 10, 19, 0.15)'; // --bg-color #010a13
  var CODE_COLOR = 'rgba(0, 90, 110, 0.6)'; // --border-color #005a6e
  var FONT_SIZE = 14;
  var COLUMN_WIDTH = 200; // cabe trecho de código inteiro
  var SPEED = 0.5; // px por tick — referência usava 0.9; Rafael pediu mais lento ainda
  var TICK_MS = 35;
  var RESET_CHANCE = 0.95;

  var snippets = [
    'def func():', 'console.log()', 'SELECT * FROM',
    'import pandas as pd', 'interface App{}', 'std::cout <<',
    'async function()', 'docker-compose up', 'git commit -m',
    'fastapi dev', 'engine = create_engine()', 'npm run build',
    'impl Trait for Struct', 'fn main()', 'BEGIN TRANSACTION;',
  ];

  var drops = [];
  var timer = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDrops();
  }

  function initDrops() {
    var columns = Math.ceil(canvas.width / COLUMN_WIDTH);
    drops = [];
    for (var x = 0; x < columns; x++) {
      // Começa acima da tela para não tudo cair de uma vez
      drops[x] = Math.random() * -100;
    }
  }

  function draw() {
    // Rastro: a opacidade do fade controla o comprimento da cauda
    ctx.fillStyle = BG_FADE;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = CODE_COLOR;
    ctx.font = FONT_SIZE + 'px "Share Tech Mono", ui-monospace, monospace';

    for (var i = 0; i < drops.length; i++) {
      var text = snippets[Math.floor(Math.random() * snippets.length)];
      ctx.fillText(text, i * COLUMN_WIDTH + 10, drops[i] * FONT_SIZE);

      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > RESET_CHANCE) {
        drops[i] = 0;
      }

      drops[i] += SPEED; // ← o "levemente mais lenta" mora aqui
    }
  }

  function start() {
    if (timer === null) timer = setInterval(draw, TICK_MS);
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  start();

  // Economia de bateria/CPU quando a aba não está visível
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });
})();
