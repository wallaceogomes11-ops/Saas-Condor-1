// storage.js - Gerenciamento de dados locais

const Storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch { return false; }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // Perfil do usuário
  getProfile() {
    return this.get('fitcal_profile');
  },

  setProfile(data) {
    return this.set('fitcal_profile', { ...data, updatedAt: Date.now() });
  },

  // Histórico de treinos
  getWorkoutHistory() {
    return this.get('fitcal_history', []);
  },

  addWorkoutSession(session) {
    const history = this.getWorkoutHistory();
    history.unshift({ ...session, id: Date.now() });
    if (history.length > 90) history.splice(90);
    this.set('fitcal_history', history);
  },

  // Nível de cada exercício
  getExerciseLevels() {
    return this.get('fitcal_exercise_levels', {});
  },

  setExerciseLevel(exerciseId, level) {
    const levels = this.getExerciseLevels();
    levels[exerciseId] = level;
    this.set('fitcal_exercise_levels', levels);
  },

  // XP e gamificação
  getGameData() {
    return this.get('fitcal_game', {
      xp: 0,
      level: 1,
      streak: 0,
      lastWorkout: null,
      totalWorkouts: 0,
      achievements: []
    });
  },

  updateGameData(updates) {
    const current = this.getGameData();
    return this.set('fitcal_game', { ...current, ...updates });
  },

  addXP(amount) {
    const game = this.getGameData();
    game.xp += amount;
    const newLevel = Math.floor(game.xp / 500) + 1;
    game.level = newLevel;
    this.set('fitcal_game', game);
    return game;
  },

  updateStreak() {
    const game = this.getGameData();
    const today = new Date().toDateString();
    const lastDate = game.lastWorkout ? new Date(game.lastWorkout).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastDate === today) return game;
    if (lastDate === yesterday) {
      game.streak += 1;
    } else if (lastDate !== today) {
      game.streak = 1;
    }
    game.lastWorkout = Date.now();
    game.totalWorkouts += 1;
    this.set('fitcal_game', game);
    return game;
  },

  // Peso histórico
  getWeightHistory() {
    return this.get('fitcal_weight_history', []);
  },

  addWeight(weight) {
    const history = this.getWeightHistory();
    history.push({ weight, date: Date.now() });
    if (history.length > 60) history.shift();
    this.set('fitcal_weight_history', history);
  },

  // Treino de hoje
  getTodayWorkout() {
    return this.get('fitcal_today_workout');
  },

  setTodayWorkout(workout) {
    this.set('fitcal_today_workout', { ...workout, date: new Date().toDateString() });
  }
};
