// Inicialização segura (funciona com o script no fim do <body>)
(function start(init) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})(function init() {
  // ---------- Referências ----------
  const levelInput           = document.getElementById("level");
  const velBaseInput         = document.getElementById("velocidade-base");
  const magiaSelect          = document.getElementById("magia");
  const velMagiaInput        = document.getElementById("velocidade-magia");
  const velTotalInput        = document.getElementById("velocidade-total");

  const equipsIds = ["helmet","armor","legs","boots","amulet","ring","shield","mount","food","trinket"];
  const equipSelects = equipsIds.map(id => document.getElementById(id)).filter(Boolean);

  const terrenosMin = {
    ponte: 499,
    cidades: 592,
    terra: 696,       // Roshamull / Terra
    darashia: 813,
    hive: 876,        // The Hive
    grama: 1258,
    areia: 1443,
    lama: 2444,
    underwater: 4557
  };

  // ---------- Util ----------
  const toNum = v => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  function velComMagia(base, magia) {
    switch (magia) {
      case "haste":        return Math.floor(base * 1.3 - 12);
      case "strong-haste": return Math.floor(base * 1.7 - 28);
      case "charge":       return Math.floor(base * 1.9 - 36);
      case "swift-foot":   return Math.floor(base * 1.8);
      case "nenhuma":
      default:             return base;
    }
  }

  function somaEquipAbs() {
    // Soma absoluta de TODOS os selects de equipamento
    return equipSelects.reduce((acc, sel) => acc + Math.abs(toNum(sel.value)), 0);
  }

  function atualizaTerrenos(velTotal) {
    Object.entries(terrenosMin).forEach(([id, minimo]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = velTotal >= minimo ? "✅" : "❌";
    });
  }

  // ---------- Cálculo principal ----------
  function atualizar() {
    const level = toNum(levelInput?.value);
    const velBase = Math.round(level + 109);
    if (velBaseInput) velBaseInput.value = velBase;

    const magia = magiaSelect?.value || "nenhuma";
    const velMagia = velComMagia(velBase, magia);
    if (velMagiaInput) velMagiaInput.value = velMagia;

    const somaAbs = somaEquipAbs();
    const velTotal = Math.round(velMagia + somaAbs);
    if (velTotalInput) velTotalInput.value = velTotal;

    atualizaTerrenos(velTotal);
  }

  // ---------- Eventos ----------
  levelInput?.addEventListener("input", atualizar);
  magiaSelect?.addEventListener("change", atualizar);
  equipSelects.forEach(sel => sel.addEventListener("change", atualizar));

  // ---------- Tema (toggle + preferência salva) ----------
  const toggleBtn = document.getElementById("toggle-theme");

  // Tema inicial: preferência salva OU sistema
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || (!stored && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.textContent = "🌙 Modo Escuro";
  }

  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const dark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", dark ? "dark" : "light");
    toggleBtn.textContent = dark ? "🌙 Modo Escuro" : "☀️ Modo Claro";
  });

  // Primeira atualização garante preenchimento de todos os campos e ícones
  atualizar();
});
