// workout.js - Lógica de treinos e exercícios

const EXERCISES = {
  // PEITO
  flexao: {
    id: 'flexao', name: 'Flexão de Braço', muscle: 'Peito',
    icon: '💪',
    levels: [
      { name: 'No Joelho', reps: '8-10', sets: 3, description: 'Apoio nos joelhos, corpo reto' },
      { name: 'Normal', reps: '10-15', sets: 3, description: 'Apoio nos pés, corpo alinhado' },
      { name: 'Declinada', reps: '8-12', sets: 3, description: 'Pés elevados, foco no peitoral superior' },
      { name: 'Explosiva', reps: '6-10', sets: 4, description: 'Impulsionar as mãos do chão' }
    ],
    animation: 'pushup'
  },
  diamante: {
    id: 'diamante', name: 'Flexão Diamante', muscle: 'Tríceps',
    icon: '🔷',
    levels: [
      { name: 'Iniciante', reps: '5-8', sets: 3, description: 'Mãos juntas formando diamante' },
      { name: 'Normal', reps: '8-12', sets: 3, description: 'Amplitude completa' },
      { name: 'Lenta', reps: '6-10', sets: 3, description: '3s descendo, 1s subindo' },
      { name: 'Explosiva', reps: '5-8', sets: 4, description: 'Impulso máximo' }
    ],
    animation: 'diamond'
  },
  mergulho: {
    id: 'mergulho', name: 'Mergulho (Dips)', muscle: 'Tríceps',
    icon: '🏊',
    levels: [
      { name: 'Em Cadeira', reps: '10-15', sets: 3, description: 'Apoio em cadeira atrás' },
      { name: 'Pernas Estendidas', reps: '8-12', sets: 3, description: 'Pernas retas na frente' },
      { name: 'Com Peso', reps: '8-10', sets: 3, description: 'Adicionar mochila com peso' },
      { name: 'Ring Dips', reps: '5-8', sets: 4, description: 'Entre duas superfícies' }
    ],
    animation: 'dips'
  },
  // COSTAS
  remada: {
    id: 'remada', name: 'Remada Invertida', muscle: 'Costas',
    icon: '🔙',
    levels: [
      { name: 'Com Mesa', reps: '8-12', sets: 3, description: 'Embaixo de mesa, puxar o corpo' },
      { name: 'Pernas Dobradas', reps: '10-15', sets: 3, description: 'Ângulo de 45°' },
      { name: 'Pernas Estendidas', reps: '8-12', sets: 3, description: 'Corpo paralelo ao chão' },
      { name: 'Com Pausa', reps: '6-10', sets: 4, description: '2s no topo' }
    ],
    animation: 'row'
  },
  superman: {
    id: 'superman', name: 'Superman', muscle: 'Lombar',
    icon: '🦸',
    levels: [
      { name: 'Iniciante', reps: '10x', sets: 3, description: 'Elevar braços e pernas alternados' },
      { name: 'Completo', reps: '12-15x', sets: 3, description: 'Elevar tudo ao mesmo tempo' },
      { name: 'Com Pausa', reps: '10x', sets: 3, description: '3s no topo' },
      { name: 'Nadador', reps: '20s', sets: 4, description: 'Movimento de natação' }
    ],
    animation: 'superman'
  },
  // BÍCEPS
  curlToalha: {
    id: 'curlToalha', name: 'Curl com Toalha', muscle: 'Bíceps',
    icon: '💪',
    levels: [
      { name: 'Básico', reps: '10-12', sets: 3, description: 'Toalha em porta, curl' },
      { name: 'Unilateral', reps: '8-10', sets: 3, description: 'Um braço por vez' },
      { name: 'Com Isometria', reps: '8x', sets: 3, description: '5s isometria no topo' },
      { name: 'Explosivo', reps: '8-10', sets: 4, description: 'Subida rápida' }
    ],
    animation: 'curl'
  },
  // PERNAS
  agachamento: {
    id: 'agachamento', name: 'Agachamento', muscle: 'Pernas',
    icon: '🦵',
    levels: [
      { name: 'Com Cadeira', reps: '12-15', sets: 3, description: 'Tocar a cadeira e subir' },
      { name: 'Normal', reps: '15-20', sets: 3, description: 'Paralelo ao chão' },
      { name: 'Búlgaro', reps: '10x cada', sets: 3, description: 'Pé traseiro elevado' },
      { name: 'Pistol', reps: '5-8x cada', sets: 4, description: 'Uma perna só' }
    ],
    animation: 'squat'
  },
  afundo: {
    id: 'afundo', name: 'Afundo (Lunge)', muscle: 'Pernas',
    icon: '🚶',
    levels: [
      { name: 'Estático', reps: '10x cada', sets: 3, description: 'No lugar, sem deslocamento' },
      { name: 'Caminhada', reps: '12x cada', sets: 3, description: 'Avançando com cada passo' },
      { name: 'Reverso', reps: '10x cada', sets: 3, description: 'Passo para trás' },
      { name: 'Saltando', reps: '8x cada', sets: 4, description: 'Troca de perna pulando' }
    ],
    animation: 'lunge'
  },
  calfRaise: {
    id: 'calfRaise', name: 'Elevação de Panturrilha', muscle: 'Panturrilha',
    icon: '👟',
    levels: [
      { name: 'Normal', reps: '20-25', sets: 3, description: 'Subir na ponta dos pés' },
      { name: 'Unilateral', reps: '15x cada', sets: 3, description: 'Uma perna de cada vez' },
      { name: 'Com Peso', reps: '20x', sets: 3, description: 'Mochila com peso' },
      { name: 'Isometria', reps: '30s', sets: 4, description: 'Segurar no topo' }
    ],
    animation: 'calf'
  },
  // ABDÔMEN
  prancha: {
    id: 'prancha', name: 'Prancha', muscle: 'Core',
    icon: '🏋️',
    levels: [
      { name: 'No Joelho', reps: '20s', sets: 3, description: 'Apoio nos joelhos' },
      { name: 'Completa', reps: '30-45s', sets: 3, description: 'Corpo reto, cotovelos' },
      { name: 'Com Elevação', reps: '30s', sets: 3, description: 'Elevar perna alternada' },
      { name: 'Dinâmica', reps: '40s', sets: 4, description: 'Mountain climbers' }
    ],
    animation: 'plank'
  },
  abdominal: {
    id: 'abdominal', name: 'Abdominal Crunch', muscle: 'Abdômen',
    icon: '🫀',
    levels: [
      { name: 'Básico', reps: '15-20', sets: 3, description: 'Cabeça e ombros saem do chão' },
      { name: 'Com Torção', reps: '12-15x', sets: 3, description: 'Cotovelo ao joelho oposto' },
      { name: 'Bicicleta', reps: '20x', sets: 3, description: 'Pedaladas alternadas' },
      { name: 'V-sit', reps: '10-12x', sets: 4, description: 'Equilíbrio em V' }
    ],
    animation: 'crunch'
  },
  // FULL BODY
  burpee: {
    id: 'burpee', name: 'Burpee', muscle: 'Full Body',
    icon: '⚡',
    levels: [
      { name: 'Sem Pulo', reps: '8-10', sets: 3, description: 'Sem saltar no final' },
      { name: 'Completo', reps: '10-12', sets: 3, description: 'Pulo + flexão' },
      { name: 'Com Flexão', reps: '8-10', sets: 3, description: 'Flexão completa no chão' },
      { name: 'Explosivo', reps: '6-8', sets: 4, description: 'Máxima velocidade' }
    ],
    animation: 'burpee'
  },
  mountainClimber: {
    id: 'mountainClimber', name: 'Mountain Climber', muscle: 'Core + Cardio',
    icon: '🏔️',
    levels: [
      { name: 'Lento', reps: '30s', sets: 3, description: 'Ritmo controlado' },
      { name: 'Moderado', reps: '40s', sets: 3, description: 'Ritmo médio' },
      { name: 'Rápido', reps: '30s', sets: 4, description: 'Alta velocidade' },
      { name: 'Cross-body', reps: '40s', sets: 4, description: 'Joelho ao cotovelo oposto' }
    ],
    animation: 'mountainclimber'
  }
};

// Divisão semanal de treinos
const WEEKLY_SPLIT = {
  0: { name: 'Descanso Ativo', type: 'rest', exercises: [] }, // Domingo
  1: { // Segunda
    name: 'Peito + Tríceps',
    type: 'strength',
    exercises: ['flexao', 'diamante', 'mergulho', 'prancha']
  },
  2: { // Terça
    name: 'Costas + Bíceps',
    type: 'strength',
    exercises: ['remada', 'superman', 'curlToalha', 'abdominal']
  },
  3: { // Quarta
    name: 'Descanso',
    type: 'rest',
    exercises: []
  },
  4: { // Quinta
    name: 'Pernas',
    type: 'strength',
    exercises: ['agachamento', 'afundo', 'calfRaise', 'prancha']
  },
  5: { // Sexta
    name: 'Full Body',
    type: 'strength',
    exercises: ['burpee', 'flexao', 'agachamento', 'mountainClimber', 'abdominal']
  },
  6: { // Sábado
    name: 'Descanso',
    type: 'rest',
    exercises: []
  }
};

const WorkoutEngine = {
  // Retorna o treino do dia
  getTodayWorkout(userLevel = 0) {
    const dayOfWeek = new Date().getDay();
    const split = WEEKLY_SPLIT[dayOfWeek];
    const exerciseLevels = Storage.getExerciseLevels();

    const workout = {
      ...split,
      dayOfWeek,
      exercises: split.exercises.map(id => {
        const ex = EXERCISES[id];
        const savedLevel = exerciseLevels[id] ?? userLevel;
        const clampedLevel = Math.min(Math.max(savedLevel, 0), ex.levels.length - 1);
        return {
          ...ex,
          currentLevel: clampedLevel,
          currentVariant: ex.levels[clampedLevel],
          completed: false,
          feedback: null
        };
      })
    };
    return workout;
  },

  // Ajusta nível baseado no feedback
  adjustLevel(exerciseId, feedback) {
    const ex = EXERCISES[exerciseId];
    const levels = Storage.getExerciseLevels();
    let current = levels[exerciseId] ?? 1;

    if (feedback === 'easy' && current < ex.levels.length - 1) {
      current += 1;
    } else if (feedback === 'hard' && current > 0) {
      current -= 1;
    }

    Storage.setExerciseLevel(exerciseId, current);
    return current;
  },

  // Calcula XP da sessão
  calculateXP(completedExercises, streak) {
    let xp = completedExercises * 50;
    if (streak >= 7) xp *= 1.5;
    else if (streak >= 3) xp *= 1.2;
    return Math.floor(xp);
  },

  // Gera resumo da semana
  getWeekSummary() {
    const history = Storage.getWorkoutHistory();
    const week = {};
    const now = Date.now();
    const weekAgo = now - 7 * 86400000;

    history
      .filter(s => s.timestamp > weekAgo)
      .forEach(s => {
        const day = new Date(s.timestamp).toLocaleDateString('pt-BR', { weekday: 'short' });
        week[day] = (week[day] || 0) + 1;
      });

    return week;
  },

  // Verifica conquistas
  checkAchievements(gameData) {
    const achievements = [];
    const { totalWorkouts, streak, xp } = gameData;

    const milestones = [
      { id: 'first_workout', name: '🎯 Primeiro Treino', condition: totalWorkouts >= 1 },
      { id: 'week_streak', name: '🔥 7 Dias Seguidos', condition: streak >= 7 },
      { id: 'month_warrior', name: '⚔️ 30 Treinos', condition: totalWorkouts >= 30 },
      { id: 'xp_500', name: '⭐ 500 XP', condition: xp >= 500 },
      { id: 'xp_2000', name: '💎 Elite (2000 XP)', condition: xp >= 2000 }
    ];

    const existing = gameData.achievements || [];
    milestones.forEach(m => {
      if (m.condition && !existing.includes(m.id)) {
        achievements.push(m);
      }
    });

    return achievements;
  },

  getAllExercises() { return EXERCISES; }
};
