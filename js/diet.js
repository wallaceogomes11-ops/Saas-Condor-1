// diet.js - Lógica de dieta e nutrição

const FOODS = {
  ovo: {
    name: 'Ovo Inteiro', unit: 'unidade', gramsPerUnit: 50,
    cal: 78, protein: 6, carb: 0.6, fat: 5.3,
    cost: 0.65, emoji: '🥚'
  },
  claraOvo: {
    name: 'Clara de Ovo', unit: 'unidade', gramsPerUnit: 35,
    cal: 17, protein: 3.6, carb: 0.2, fat: 0,
    cost: 0.35, emoji: '🍳'
  },
  frango: {
    name: 'Frango (filé)', unit: 'g', gramsPerUnit: 1,
    cal: 1.65, protein: 0.31, carb: 0, fat: 0.036,
    cost: 0.024, emoji: '🍗'
  },
  sardinha: {
    name: 'Sardinha em lata', unit: 'g', gramsPerUnit: 1,
    cal: 1.44, protein: 0.21, carb: 0, fat: 0.075,
    cost: 0.018, emoji: '🐟'
  },
  arroz: {
    name: 'Arroz cozido', unit: 'g', gramsPerUnit: 1,
    cal: 1.28, protein: 0.026, carb: 0.285, fat: 0.001,
    cost: 0.004, emoji: '🍚'
  },
  feijao: {
    name: 'Feijão cozido', unit: 'g', gramsPerUnit: 1,
    cal: 0.77, protein: 0.048, carb: 0.138, fat: 0.005,
    cost: 0.006, emoji: '🫘'
  },
  aveia: {
    name: 'Aveia em flocos', unit: 'g', gramsPerUnit: 1,
    cal: 3.94, protein: 0.139, carb: 0.664, fat: 0.066,
    cost: 0.012, emoji: '🌾'
  },
  macarrao: {
    name: 'Macarrão cozido', unit: 'g', gramsPerUnit: 1,
    cal: 1.31, protein: 0.051, carb: 0.252, fat: 0.011,
    cost: 0.005, emoji: '🍝'
  },
  banana: {
    name: 'Banana', unit: 'unidade', gramsPerUnit: 120,
    cal: 89, protein: 1.1, carb: 23, fat: 0.3,
    cost: 0.40, emoji: '🍌'
  }
};

const DietEngine = {
  // Calcula TMB (Harris-Benedict revisado)
  calcTMB(weight, height, age, gender = 'male') {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  },

  // Calorias diárias com fator de atividade
  calcDailyCalories(tmb, goal = 'muscle') {
    const activity = 1.375; // moderadamente ativo
    const tdee = tmb * activity;
    if (goal === 'muscle') return Math.round(tdee + 300);  // superávit
    if (goal === 'cut') return Math.round(tdee - 400);     // déficit
    return Math.round(tdee);                               // manutenção
  },

  // Proteína ideal
  calcProtein(weight, level = 'intermediate') {
    const multipliers = { beginner: 1.6, intermediate: 1.9, advanced: 2.2 };
    const m = multipliers[level] || 1.9;
    return { min: Math.round(weight * 1.6), ideal: Math.round(weight * m), max: Math.round(weight * 2.2) };
  },

  // IMC
  calcIMC(weight, height) {
    const h = height / 100;
    const imc = weight / (h * h);
    let cat = 'Normal';
    if (imc < 18.5) cat = 'Abaixo do peso';
    else if (imc >= 25 && imc < 30) cat = 'Sobrepeso';
    else if (imc >= 30) cat = 'Obesidade';
    return { value: imc.toFixed(1), category: cat };
  },

  // Gera plano alimentar completo
  generateMealPlan(profile) {
    const { weight, height, age, level, goal } = profile;
    const tmb = this.calcTMB(weight, height, age);
    const targetCals = this.calcDailyCalories(tmb, goal);
    const protein = this.calcProtein(weight, level);

    // Distribuição calórica: café 25%, almoço 40%, jantar 35%
    const meals = {
      breakfast: this._buildBreakfast(targetCals * 0.25, protein.ideal * 0.25),
      lunch: this._buildLunch(targetCals * 0.40, protein.ideal * 0.40),
      dinner: this._buildDinner(targetCals * 0.35, protein.ideal * 0.35)
    };

    const totalCals = Object.values(meals).reduce((s, m) => s + m.totalCals, 0);
    const totalProtein = Object.values(meals).reduce((s, m) => s + m.totalProtein, 0);
    const totalCost = Object.values(meals).reduce((s, m) => s + m.totalCost, 0);

    return { meals, targetCals, totalCals: Math.round(totalCals), totalProtein: Math.round(totalProtein), totalCost: totalCost.toFixed(2), protein };
  },

  _buildBreakfast(targetCals, targetProtein) {
    const items = [
      { food: 'ovo', qty: 3 },
      { food: 'aveia', qty: 80 },
      { food: 'banana', qty: 1 }
    ];
    return this._calcMeal('☀️ Café da Manhã', items);
  },

  _buildLunch(targetCals, targetProtein) {
    const items = [
      { food: 'frango', qty: 200 },
      { food: 'arroz', qty: 200 },
      { food: 'feijao', qty: 150 }
    ];
    return this._calcMeal('🌿 Almoço', items);
  },

  _buildDinner(targetCals, targetProtein) {
    const items = [
      { food: 'sardinha', qty: 150 },
      { food: 'macarrao', qty: 200 },
      { food: 'ovo', qty: 2 }
    ];
    return this._calcMeal('🌙 Jantar', items);
  },

  _calcMeal(name, items) {
    let totalCals = 0, totalProtein = 0, totalCarb = 0, totalFat = 0, totalCost = 0;
    const foods = items.map(({ food, qty }) => {
      const f = FOODS[food];
      const multiplier = f.unit === 'unidade' ? qty : qty / f.gramsPerUnit;
      const cals = f.cal * (f.unit === 'unidade' ? multiplier : qty);
      const prot = f.protein * (f.unit === 'unidade' ? multiplier : qty);
      const carb = f.carb * (f.unit === 'unidade' ? multiplier : qty);
      const fat = f.fat * (f.unit === 'unidade' ? multiplier : qty);
      const cost = f.unit === 'unidade' ? f.cost * qty : f.cost * qty;

      totalCals += cals;
      totalProtein += prot;
      totalCarb += carb;
      totalFat += fat;
      totalCost += cost;

      return {
        name: f.name,
        emoji: f.emoji,
        qty: f.unit === 'unidade' ? `${qty} ${qty > 1 ? 'unidades' : 'unidade'}` : `${qty}g`,
        cals: Math.round(cals),
        protein: Math.round(prot * 10) / 10
      };
    });

    return {
      name,
      foods,
      totalCals: Math.round(totalCals),
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarb: Math.round(totalCarb),
      totalFat: Math.round(totalFat),
      totalCost: totalCost.toFixed(2)
    };
  },

  // Assistente de substituições
  getFoodSwaps(foodId) {
    const swaps = {
      frango: ['sardinha em lata', 'ovo (3 unidades = 100g frango)', 'atum em lata'],
      arroz: ['macarrão cozido', 'mandioca cozida', 'batata-doce'],
      feijao: ['lentilha', 'grão-de-bico', 'ervilha'],
      aveia: ['granola caseira', 'farinha de aveia', 'tapioca'],
      ovo: ['tofu firme', 'sardinha', 'queijo cottage']
    };
    return swaps[foodId] || ['Sem substituições disponíveis'];
  },

  getAssistantResponse(query) {
    const q = query.toLowerCase();
    const responses = [
      { pattern: /proteína|protein/, answer: 'Para hipertrofia, consuma entre 1.6 a 2.2g de proteína por kg corporal. Priorize ovo, frango e sardinha.' },
      { pattern: /substituir? frango|sem frango/, answer: 'Pode substituir frango por: sardinha em lata (200g), 4 ovos, ou atum em lata. Todas são fontes baratas de proteína.' },
      { pattern: /horário|quando comer/, answer: 'Coma a cada 3-4 horas. Proteína em todas as refeições. Carboidratos são melhores ao redor do treino.' },
      { pattern: /não tenho tempo|rápido/, answer: 'Opções rápidas: ovo mexido + aveia (5min), sardinha com arroz já cozido (3min), banana com pasta de amendoim.' },
      { pattern: /suplemento|whey|creatina/, answer: 'Não precisa de suplementos! Ovo + frango + sardinha cobrem sua proteína. Se quiser um extra: creatina monohidratada é o mais custo-benefício.' },
      { pattern: /emagrecer|perder gordu/, answer: 'Para emagrecer mantendo músculo: déficit calórico de 300-500 kcal/dia, proteína alta (2g/kg), e mantenha os treinos de força.' },
      { pattern: /ganhar massa|hipertrofia/, answer: 'Para hipertrofia: superávit de 200-300 kcal, proteína 1.8-2g/kg, treino progressivo. Consistência é mais importante que perfeição.' },
      { pattern: /dor muscular|dor/, answer: 'Dor muscular (DOMS) é normal 24-48h após treino. Não é sinal de crescimento, mas de adaptação. Descanse, hidrate e durma bem.' }
    ];

    for (const r of responses) {
      if (r.pattern.test(q)) return r.answer;
    }
    return 'Boa pergunta! Para resultados ótimos: treine consistentemente, durma 7-8h, beba água suficiente (35ml/kg) e siga a dieta. A progressão vem com o tempo! 💪';
  }
};
