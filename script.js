// =================== CONFIGURAÇÕES =================== //

// Fórmulas das magias -> retorna a VELOCIDADE (não o bônus)
function calcularVelocidadeMagia(base, magia) {
  switch (magia) {
    case "haste":        return Math.round(base * 1.3 - 12);
    case "strong-haste": return Math.round(base * 1.7 - 28);
    case "charge":       return Math.round(base * 1.9 - 36);
    case "swift-foot":   return Math.round(base * 1.8);
    case "nenhuma":
    default:             return Math.round(base);
  }
}

// Valores dos equipamentos (usar o mesmo texto do value="" no HTML)
const equipamentoVelocidade = {
  helmet: {
    "Nenhum": 0,
    "Crest of the Deep Seas": 5,
    "Werewolf Helmet": 15,
    "Depth Galea": 300,
    "Tiara of Power": 20,
    "Helmet of the Deep": 300
  },
  armor: {
    "Nenhum": 0,
    "Zaoan Armor": 10,
    "Prismatic Armor": 15,
    "Elite Draken Mail": 10,
    "Swan Feather Cloak": 10
  },
  legs: {
    "Nenhum": 0,
    "Grasshopper Legs": 10
  },
  boots: {
    "Nenhum": 0,
    "Draken Boots": 15,
    "Zaoan Shoes": 5,
    "Prismatic Boots": 15,
    "Depth Calcei": -5,
    "Fur Boots": -6,
    "Boots of Haste": 20,
    "Badger Boots": 10,
    "Oriental Shoes": 15,
    "Void Boots": 30,
    "Cobra Boots": 10,
    "Winged Boots": 15,
    "Pair of Soulstalkers": 20,
    "Pair of Soulwalkers": 15,
    "Feverbloom Boots": 15,
    "Sanguine Galoshes": 10,
    "Sanguine Boots": 10,
    "Stoic Iks Boots": 15,
    "Soulsoles": 20,
    "Norcferatu Goretrampers": 15
  },
  amulet: {
    "Nenhum": 0,
    "Beetle Necklace": 2,
    "Shrunken Head Necklace": 10
  },
  ring: {
    "Nenhum": 0,
    "Time Ring": 30
  },
  shield: {
    "Nenhum": 0,
    "Sparking Rainbow Shield": 10
  },
  mount: {
    "Nao": 0,   // corresponde ao value="Nao"
    "Sim": 10
  },
  food: {
    "Nenhum": 0,
    "Filled Jalapeno Peppers": 100, // value sem acento (como no HTML)
    "Demonic Candy Ball": 100
  },
  trinket: {
    "Nenhum": 0,
    "Magical Torch": 25,
    "Celestial Torch": 25
  }
};

// Requisitos para os terrenos (use estes IDs no HTML, se quiser os ícones)
const condicoesTerrenos = [
  { id: "cond-ponte",            minimo: 499 },
  { id: "cond-cidades-depot",    minimo: 592 },
  { id: "cond-roshamull-terra",  minimo: 696 },
  { id: "cond-darashia",         minimo: 813 },
  { id: "cond-the-hive",         minimo: 876 },
  { id: "cond-grama-cascalho",   minimo: 1258 },
  { id: "cond-areia-neve",       minimo: 1443 },
  { id: "cond-lama",             minimo: 2444 },
  { id: "cond-underwater",       minimo: 4557 }
];

// IDs dos selects no seu HTML
const selectIds = {
  helmet:  "helmetSelect",
  armor:   "armorSelect",
  legs:    "legsSelect",
  boots:   "bootsSelect",
  amulet:  "amuletSelect",
  ring:    "ringSelect",
  shield:  "shieldSelect",
  mount:   "mountSelect",
  food:    "foodSelect",
  trinket: "trinketSelect"
};

// =================== FUNÇÕES =================== //

function obterSomaEquipamentosAbsoluta() {
  let soma = 0;
  for (const categoria in selectIds) {
    const el = document.getElementById(selectIds[categoria]);
    if (!el) continue;
    const valor = (equipamentoVelocidade[categoria] || {})[el.value] || 0;
    soma += Math.abs(valor); // valores ABSOLUTOS conforme solicitado
  }
  return soma;
}

function atualizarCondicoesTerrenos(velocidadeTotal) {
  condicoesTerrenos.forEach(({ id, minimo }) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = velocidadeTotal >= minimo ? "✅" : "❌";
    }
  });
}

function atualizarTudo() {
  // Base = Level + 109
  const levelEl = document.getElementById("level");
  const baseEl  = document.getElementById("velocidadeBase");
  const magiaSel = document.getElementById("magiaSelect");
  const velMagiaEl = document.getElementById("velocidadeMagia");
  const totalEl = document.getElementById("velocidadeTotal");

  const level = parseInt(levelEl?.value, 10) || 0;
  const velocidadeBase = level + 109;
  if (baseEl) baseEl.value = velocidadeBase;

  // Velocidade com Magia (valor absoluto já com base)
  const magia = magiaSel?.value || "nenhuma";
  const velocidadeComMagia = calcularVelocidadeMagia(velocidadeBase, magia);
  if (velMagiaEl) velMagiaEl.value = velocidadeComMagia;

  // Soma de equipamentos (ABS)
  const somaEquip = obterSomaEquipamentosAbsoluta();

  // Velocidade Total = Velocidade com Magia + soma(ABS equipamentos)
  const velocidadeTotal = Math.round(velocidadeComMagia + somaEquip);
  if (totalEl) totalEl.value = velocidadeTotal;

  // Atualiza os ícones de terreno (se existirem no HTML)
  atualizarCondicoesTerrenos(velocidadeTotal);
}

// =================== EVENTOS =================== //

document.addEventListener("DOMContentLoaded", () => {
  // Level e Magia
  document.getElementById("level")?.addEventListener("input", atualizarTudo);
  document.getElementById("magiaSelect")?.addEventListener("change", atualizarTudo);

  // Todos os selects de equipamentos
  Object.values(selectIds).forEach(id => {
    document.getElementById(id)?.addEventListener("change", atualizarTudo);
  });

  // Primeira execução
  atualizarTudo();
});
