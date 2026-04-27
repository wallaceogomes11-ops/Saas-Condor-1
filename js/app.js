// app.js - FitCal Main Application

const App = {
  currentScreen: 'onboarding',
  todayWorkout: null,
  mealPlan: null,
  activeExercises: {},

  init() {
    this.registerSW();
    const profile = Storage.getProfile();
    if (profile) {
      this.showMainApp();
      this.loadDashboard();
    } else {
      this.showScreen('onboarding');
    }
    this.hideLoader();
    this.setupNav();
    this.setupOnboarding();
    this.setupWorkoutScreen();
    this.setupDietScreen();
    this.setupProgressScreen();
    this.setupAssistant();
    this.updateStreak();
  },

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(r => console.log('SW registered'))
        .catch(e => console.warn('SW error', e));
    }
  },

  hideLoader() {
    setTimeout(() => {
      const loader = document.getElementById('loading-screen');
      if (loader) loader.classList.add('hidden');
    }, 1200);
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`screen-${name}`);
    if (target) {
      target.classList.add('active');
      this.currentScreen = name;
    }
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.screen === name);
    });
  },

  showMainApp() {
    document.getElementById('bottom-nav').style.display = 'flex';
    this.showScreen('dashboard');
  },

  setupNav() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.dataset.screen;
        this.showScreen(screen);
        if (screen === 'workout') this.renderWorkout();
        if (screen === 'diet') this.renderDiet();
        if (screen === 'progress') this.renderProgress();
        if (screen === 'dashboard') this.loadDashboard();
      });
    });
  },

  // ─── ONBOARDING ───
  setupOnboarding() {
    let selectedLevel = 'beginner';
    let selectedGoal = 'muscle';

    document.querySelectorAll('.seg-btn[data-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.seg-btn[data-level]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedLevel = btn.dataset.level;
      });
    });

    document.querySelectorAll('.seg-btn[data-goal]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.seg-btn[data-goal]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedGoal = btn.dataset.goal;
      });
    });

    document.getElementById('btn-start').addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('input-weight').value);
      const height = parseFloat(document.getElementById('input-height').value);
      const age = parseInt(document.getElementById('input-age').value);

      if (!weight || !height || !age || weight < 30 || height < 100 || age < 10) {
        this.showToast('⚠️ Preencha todos os dados corretamente!');
        return;
      }

      const imc = DietEngine.calcIMC(weight, height);
      const tmb = DietEngine.calcTMB(weight, height, age);
      const calories = DietEngine.calcDailyCalories(tmb, selectedGoal);
      const protein = DietEngine.calcProtein(weight, selectedLevel);
      const levelMap = { beginner: 0, intermediate: 1, advanced: 2 };

      const profile = {
        weight, height, age,
        level: selectedLevel,
        levelNum: levelMap[selectedLevel] || 0,
        goal: selectedGoal,
        imc: imc.value,
        imcCategory: imc.category,
        tmb: Math.round(tmb),
        calories,
        protein
      };

      Storage.setProfile(profile);
      Storage.addWeight(weight);
      Storage.updateGameData({ xp: 0, level: 1, streak: 1, lastWorkout: null, totalWorkouts: 0, achievements: [] });

      this.showMainApp();
      this.loadDashboard();
      this.showToast('🔥 Perfil criado! Bora treinar!');
    });
  },

  // ─── DASHBOARD ───
  loadDashboard() {
    const profile = Storage.getProfile();
    const game = Storage.getGameData();
    if (!profile) return;

    document.getElementById('dash-name').textContent = `Nível ${game.level}`;
    document.getElementById('dash-calories').textContent = profile.calories;
    document.getElementById('dash-protein').textContent = `${profile.protein.ideal}g`;
    document.getElementById('dash-imc').textContent = profile.imc;
    document.getElementById('dash-imc-cat').textContent = profile.imcCategory;
    document.getElementById('dash-weight').textContent = `${profile.weight}kg`;
    document.getElementById('dash-streak').textContent = game.streak;
    document.getElementById('dash-workouts').textContent = game.totalWorkouts;

    // XP bar
    const xpForLevel = game.level * 500;
    const xpProgress = (game.xp % 500) / 500 * 100;
    document.getElementById('xp-fill').style.width = `${xpProgress}%`;
    document.getElementById('xp-current').textContent = `${game.xp} XP`;
    document.getElementById('xp-next').textContent = `Nível ${game.level + 1}: ${xpForLevel} XP`;

    // Streak dots
    this.renderStreakDots(game.streak);

    // Today's workout preview
    this.renderTodayPreview();

    // Quick achievements
    this.renderMiniAchievements(game);
  },

  renderStreakDots(streak) {
    const container = document.getElementById('streak-dots');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const dot = document.createElement('div');
      dot.className = `streak-dot ${i < (streak % 7) ? 'active' : ''}`;
      container.appendChild(dot);
    }
  },

  renderTodayPreview() {
    const workout = WorkoutEngine.getTodayWorkout(Storage.getProfile()?.levelNum || 0);
    const el = document.getElementById('today-preview');
    if (!el) return;
    if (workout.type === 'rest') {
      el.innerHTML = `<div style="text-align:center;padding:16px"><span style="font-size:40px">😴</span><p style="color:var(--white-50);margin-top:8px">Dia de descanso — recuperação é treino!</p></div>`;
    } else {
      el.innerHTML = `
        <div class="day-badge">📅 ${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][workout.dayOfWeek]} — ${workout.name}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${workout.exercises.map(e => `<span style="background:var(--orange-soft);border:1px solid var(--orange);border-radius:50px;padding:4px 12px;font-size:12px;color:var(--orange)">${e.emoji} ${e.name}</span>`).join('')}
        </div>
        <button class="btn btn-primary" style="margin-top:14px" onclick="App.showScreen('workout');App.renderWorkout()">🏋️ Iniciar Treino</button>
      `;
    }
  },

  renderMiniAchievements(game) {
    const el = document.getElementById('dash-achievements');
    if (!el) return;
    const all = [
      { id: 'first_workout', icon: '🎯', name: 'Primeiro Treino', condition: game.totalWorkouts >= 1 },
      { id: 'week_streak', icon: '🔥', name: '7 Dias Seguidos', condition: game.streak >= 7 },
      { id: 'xp_500', icon: '⭐', name: '500 XP', condition: game.xp >= 500 },
      { id: 'month_warrior', icon: '⚔️', name: '30 Treinos', condition: game.totalWorkouts >= 30 },
      { id: 'xp_2000', icon: '💎', name: 'Elite', condition: game.xp >= 2000 }
    ];
    el.innerHTML = all.map(a => `
      <div class="achievement-item ${a.condition ? '' : 'locked'}">
        <span style="font-size:24px">${a.icon}</span>
        <div>
          <div class="achievement-name">${a.name}</div>
          <div class="achievement-desc">${a.condition ? '✅ Conquistado' : '🔒 Bloqueado'}</div>
        </div>
      </div>
    `).join('');
  },

  // ─── WORKOUT ───
  setupWorkoutScreen() {},

  renderWorkout() {
    const profile = Storage.getProfile();
    const workout = WorkoutEngine.getTodayWorkout(profile?.levelNum || 0);
    this.todayWorkout = workout;

    const container = document.getElementById('workout-container');
    if (!container) return;

    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    document.getElementById('workout-day-label').textContent = dayNames[workout.dayOfWeek];
    document.getElementById('workout-name-label').textContent = workout.name;

    if (workout.type === 'rest') {
      container.innerHTML = `
        <div class="card rest-day-card">
          <span class="rest-icon">🌙</span>
          <h3>Dia de Descanso</h3>
          <p>Recuperação é parte do treino. Seus músculos crescem enquanto você descansa. Hidrate-se e durma bem!</p>
          <div style="margin-top:20px">
            <p style="color:var(--orange);font-weight:700;font-size:13px">DICAS PARA HOJE:</p>
            <p style="margin-top:8px;color:var(--white-50);font-size:13px">✅ Alongamento leve 10-15 min<br>✅ Beber 2-3L de água<br>✅ Dormir 7-8 horas<br>✅ Proteína em todas refeições</p>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = workout.exercises.map((ex, i) => this.renderExerciseCard(ex, i)).join('');
    this.setupExerciseActions();
  },

  renderExerciseCard(ex, index) {
    const variant = ex.currentVariant;
    const svgAnim = AnimationSVGs.get(ex.animation || 'pushup');
    return `
      <div class="exercise-card" id="ex-card-${ex.id}" data-id="${ex.id}" data-index="${index}">
        <div class="exercise-card-header">
          <span class="exercise-emoji">${ex.icon}</span>
          <div class="exercise-meta">
            <div class="exercise-name">${ex.name}</div>
            <div class="exercise-muscle">${ex.muscle}</div>
            <div class="exercise-variant">Nível: ${variant.name}</div>
          </div>
        </div>
        <div class="anim-container">${svgAnim}</div>
        <div class="exercise-info">
          <div class="reps-display">
            <span class="reps-num">${variant.reps}</span>
            <span class="reps-label">reps × ${variant.sets} séries</span>
          </div>
          <div class="exercise-desc">${variant.description}</div>
        </div>
        <div class="exercise-actions">
          <div class="feedback-row">
            <button class="feedback-btn easy" data-ex="${ex.id}" data-feedback="easy">😊 Fácil</button>
            <button class="feedback-btn medium" data-ex="${ex.id}" data-feedback="medium">😐 Médio</button>
            <button class="feedback-btn hard" data-ex="${ex.id}" data-feedback="hard">😤 Difícil</button>
          </div>
          <button class="complete-btn" data-ex="${ex.id}">✓ Concluir Exercício</button>
        </div>
      </div>`;
  },

  setupExerciseActions() {
    document.querySelectorAll('.feedback-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.dataset.ex;
        const feedback = btn.dataset.feedback;
        const row = btn.closest('.feedback-row');
        row.querySelectorAll('.feedback-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.activeExercises[exId] = this.activeExercises[exId] || {};
        this.activeExercises[exId].feedback = feedback;
        WorkoutEngine.adjustLevel(exId, feedback);
      });
    });

    document.querySelectorAll('.complete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.dataset.ex;
        const card = document.getElementById(`ex-card-${exId}`);
        if (!card.classList.contains('completed')) {
          card.classList.add('completed');
          btn.classList.add('done');
          btn.textContent = '✅ Concluído!';
          this.activeExercises[exId] = this.activeExercises[exId] || {};
          this.activeExercises[exId].done = true;

          const allDone = document.querySelectorAll('.exercise-card').length ===
            Object.values(this.activeExercises).filter(e => e.done).length;

          if (allDone) setTimeout(() => this.completeWorkout(), 500);
        }
      });
    });
  },

  completeWorkout() {
    const doneCount = Object.values(this.activeExercises).filter(e => e.done).length;
    const game = Storage.updateStreak();
    const xpGained = WorkoutEngine.calculateXP(doneCount, game.streak);
    Storage.addXP(xpGained);

    const session = {
      timestamp: Date.now(),
      name: this.todayWorkout?.name,
      exercises: doneCount,
      xp: xpGained
    };
    Storage.addWorkoutSession(session);
    this.activeExercises = {};

    this.showToast(`🎉 Treino completo! +${xpGained} XP`);
    setTimeout(() => {
      this.showScreen('dashboard');
      this.loadDashboard();
    }, 1500);
  },

  // ─── DIET ───
  setupDietScreen() {},

  renderDiet() {
    const profile = Storage.getProfile();
    if (!profile) return;
    const plan = DietEngine.generateMealPlan(profile);
    this.mealPlan = plan;

    document.getElementById('diet-calories').textContent = plan.totalCals;
    document.getElementById('diet-protein').textContent = `${plan.totalProtein}g`;
    document.getElementById('diet-cost').textContent = `R$ ${plan.totalCost}`;

    const container = document.getElementById('meals-container');
    container.innerHTML = Object.values(plan.meals).map(meal => this.renderMealCard(meal)).join('');
    this.setupMealToggles();
  },

  renderMealCard(meal) {
    return `
      <div class="meal-card">
        <div class="meal-header" onclick="App.toggleMeal(this)">
          <div class="meal-title">${meal.name}</div>
          <span class="meal-cal-badge">${meal.totalCals} kcal</span>
          <span class="meal-chevron">▼</span>
        </div>
        <div class="meal-body">
          ${meal.foods.map(f => `
            <div class="food-item">
              <span class="food-emoji">${f.emoji}</span>
              <div class="food-info">
                <div class="food-name">${f.name}</div>
                <div class="food-detail">${f.qty} · ${f.cals} kcal</div>
              </div>
              <div class="food-protein">${f.protein}g prot</div>
            </div>
          `).join('')}
          <div class="macro-chips" style="margin-top:10px">
            <span class="macro-chip protein">🥩 ${meal.totalProtein}g proteína</span>
            <span class="macro-chip carb">🌾 ${meal.totalCarb}g carb</span>
            <span class="macro-chip fat">🫙 ${meal.totalFat}g gordura</span>
          </div>
        </div>
      </div>`;
  },

  toggleMeal(header) {
    const body = header.nextElementSibling;
    const chevron = header.querySelector('.meal-chevron');
    const isOpen = body.style.display !== 'none' && body.style.display !== '';
    body.style.display = isOpen ? 'none' : 'block';
    chevron.textContent = isOpen ? '▼' : '▲';
  },

  setupMealToggles() {
    document.querySelectorAll('.meal-body').forEach((body, i) => {
      body.style.display = i === 0 ? 'block' : 'none';
    });
  },

  // ─── PROGRESS ───
  renderProgress() {
    const history = Storage.getWorkoutHistory();
    const weights = Storage.getWeightHistory();
    const game = Storage.getGameData();

    document.getElementById('prog-total').textContent = game.totalWorkouts;
    document.getElementById('prog-streak').textContent = game.streak;
    document.getElementById('prog-xp').textContent = game.xp;
    document.getElementById('prog-level').textContent = `Nível ${game.level}`;

    this.renderWeightChart(weights);
    this.renderHistoryList(history.slice(0, 10));
  },

  renderWeightChart(weights) {
    const container = document.getElementById('weight-chart');
    if (!container || weights.length < 2) {
      if (container) container.innerHTML = '<p style="color:var(--white-50);text-align:center;padding:20px;font-size:13px">Adicione mais pesagens para ver o gráfico</p>';
      return;
    }
    const last15 = weights.slice(-15);
    const min = Math.min(...last15.map(w => w.weight)) - 2;
    const max = Math.max(...last15.map(w => w.weight)) + 2;
    const range = max - min;

    const bars = last15.map(w => {
      const heightPct = ((w.weight - min) / range) * 100;
      const date = new Date(w.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      return `<div class="chart-bar" style="height:${heightPct}%;min-height:10px" title="${w.weight}kg">
        <span class="chart-bar-label">${date}</span>
      </div>`;
    });

    container.innerHTML = `<div class="mini-chart" style="padding-bottom:24px">${bars.join('')}</div>`;
  },

  renderHistoryList(history) {
    const el = document.getElementById('history-list');
    if (!el) return;
    if (history.length === 0) {
      el.innerHTML = '<p style="color:var(--white-50);text-align:center;padding:20px;font-size:13px">Nenhum treino registrado ainda</p>';
      return;
    }
    el.innerHTML = history.map(s => `
      <div class="history-item">
        <div class="history-dot"></div>
        <div class="history-info">
          <div class="history-name">${s.name || 'Treino'}</div>
          <div class="history-date">${new Date(s.id).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="history-xp">+${s.xp || 0} XP</div>
      </div>
    `).join('');
  },

  setupProgressScreen() {
    const btn = document.getElementById('btn-add-weight');
    if (btn) {
      btn.addEventListener('click', () => {
        const val = parseFloat(document.getElementById('weight-entry').value);
        if (!val || val < 30 || val > 300) { this.showToast('⚠️ Peso inválido!'); return; }
        Storage.addWeight(val);
        const profile = Storage.getProfile();
        if (profile) { profile.weight = val; Storage.setProfile(profile); }
        document.getElementById('weight-entry').value = '';
        this.renderProgress();
        this.showToast('⚖️ Peso registrado!');
      });
    }
  },

  // ─── ASSISTANT ───
  setupAssistant() {
    const sendBtn = document.getElementById('btn-send-chat');
    const input = document.getElementById('chat-input');
    if (!sendBtn || !input) return;

    const send = () => {
      const q = input.value.trim();
      if (!q) return;
      this.addChatMessage(q, 'user');
      input.value = '';
      setTimeout(() => {
        const ans = DietEngine.getAssistantResponse(q);
        this.addChatMessage(ans, 'bot');
      }, 500);
    };

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

    // Quick questions
    document.querySelectorAll('.quick-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.textContent.replace(/^[""]|[""]$/g, '');
        this.addChatMessage(q, 'user');
        setTimeout(() => {
          const ans = DietEngine.getAssistantResponse(q);
          this.addChatMessage(ans, 'bot');
        }, 500);
      });
    });
  },

  addChatMessage(text, type) {
    const wrap = document.getElementById('chat-messages');
    if (!wrap) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.textContent = text;
    wrap.appendChild(msg);
    wrap.scrollTop = wrap.scrollHeight;
  },

  updateStreak() {
    const profile = Storage.getProfile();
    if (profile) Storage.updateStreak();
  },

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
};

// ─── SVG ANIMATIONS ───
const AnimationSVGs = {
  get(type) {
    const animations = {
      pushup: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="100" x2="180" y2="100" class="ground-line"/>
        <g class="pushup-animated">
          <circle cx="100" cy="38" r="10" class="stick-figure"/>
          <line x1="100" y1="48" x2="100" y2="78" class="stick-figure"/>
          <line x1="100" y1="58" x2="75" y2="80" class="stick-figure"/>
          <line x1="75" y1="80" x2="65" y2="100" class="stick-figure"/>
          <line x1="100" y1="58" x2="125" y2="80" class="stick-figure"/>
          <line x1="125" y1="80" x2="135" y2="100" class="stick-figure"/>
          <line x1="100" y1="78" x2="90" y2="100" class="stick-figure"/>
          <line x1="100" y1="78" x2="110" y2="100" class="stick-figure"/>
        </g>
        <text x="100" y="120" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">FLEXÃO</text>
      </svg>`,

      squat: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="105" x2="180" y2="105" class="ground-line"/>
        <g class="squat-animated">
          <circle cx="100" cy="28" r="10" class="stick-figure"/>
          <line x1="100" y1="38" x2="100" y2="68" class="stick-figure"/>
          <line x1="100" y1="48" x2="78" y2="60" class="stick-figure"/>
          <line x1="100" y1="48" x2="122" y2="60" class="stick-figure"/>
          <line x1="100" y1="68" x2="88" y2="88" class="stick-figure"/>
          <line x1="88" y1="88" x2="82" y2="105" class="stick-figure"/>
          <line x1="100" y1="68" x2="112" y2="88" class="stick-figure"/>
          <line x1="112" y1="88" x2="118" y2="105" class="stick-figure"/>
        </g>
        <text x="100" y="122" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">AGACHAMENTO</text>
      </svg>`,

      plank: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="95" x2="180" y2="95" class="ground-line"/>
        <g class="plank-animated">
          <circle cx="145" cy="52" r="10" class="stick-figure"/>
          <line x1="135" y1="58" x2="60" y2="75" class="stick-figure"/>
          <line x1="60" y1="75" x2="55" y2="95" class="stick-figure"/>
          <line x1="115" y1="69" x2="108" y2="95" class="stick-figure"/>
          <line x1="60" y1="75" x2="50" y2="65" class="stick-figure"/>
          <line x1="135" y1="58" x2="148" y2="46" class="stick-figure" stroke-dasharray="3 2"/>
        </g>
        <text x="100" y="115" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">PRANCHA</text>
      </svg>`,

      curl: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="105" x2="180" y2="105" class="ground-line"/>
        <circle cx="100" cy="28" r="10" class="stick-figure"/>
        <line x1="100" y1="38" x2="100" y2="78" class="stick-figure"/>
        <line x1="100" y1="78" x2="85" y2="105" class="stick-figure"/>
        <line x1="100" y1="78" x2="115" y2="105" class="stick-figure"/>
        <g class="curl-animated" style="transform-origin: 100px 58px">
          <line x1="100" y1="55" x2="75" y2="75" class="stick-figure"/>
          <line x1="75" y1="75" x2="65" y2="62" class="stick-figure" stroke="var(--orange-hot)"/>
          <circle cx="65" cy="62" r="5" fill="rgba(255,107,0,0.3)" stroke="var(--orange)" stroke-width="1.5"/>
        </g>
        <line x1="100" y1="55" x2="126" y2="68" class="stick-figure"/>
        <line x1="126" y1="68" x2="140" y2="58" class="stick-figure"/>
        <text x="100" y="122" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">CURL COM TOALHA</text>
      </svg>`,

      dips: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="62" width="10" height="40" rx="2" fill="var(--white-08)" stroke="var(--white-20)" stroke-width="1"/>
        <rect x="160" y="62" width="10" height="40" rx="2" fill="var(--white-08)" stroke="var(--white-20)" stroke-width="1"/>
        <line x1="30" y1="62" x2="170" y2="62" class="ground-line"/>
        <g class="pushup-animated">
          <circle cx="100" cy="32" r="10" class="stick-figure"/>
          <line x1="100" y1="42" x2="100" y2="72" class="stick-figure"/>
          <line x1="100" y1="52" x2="40" y2="62" class="stick-figure"/>
          <line x1="100" y1="52" x2="160" y2="62" class="stick-figure"/>
          <line x1="100" y1="72" x2="90" y2="95" class="stick-figure"/>
          <line x1="100" y1="72" x2="110" y2="95" class="stick-figure"/>
        </g>
        <text x="100" y="118" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">MERGULHO</text>
      </svg>`,

      row: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="55" width="140" height="6" rx="3" fill="var(--white-08)" stroke="var(--white-20)" stroke-width="1"/>
        <g class="pushup-animated" style="transform-origin:100px 68px; animation-name:row-anim">
          <circle cx="100" cy="26" r="10" class="stick-figure"/>
          <line x1="100" y1="36" x2="100" y2="66" class="stick-figure"/>
          <line x1="100" y1="46" x2="55" y2="58" class="stick-figure"/>
          <line x1="55" y1="58" x2="40" y2="55" class="stick-figure"/>
          <line x1="100" y1="46" x2="145" y2="58" class="stick-figure"/>
          <line x1="145" y1="58" x2="160" y2="55" class="stick-figure"/>
          <line x1="100" y1="66" x2="88" y2="90" class="stick-figure"/>
          <line x1="100" y1="66" x2="112" y2="90" class="stick-figure"/>
        </g>
        <text x="100" y="118" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">REMADA INVERTIDA</text>
      </svg>`,

      superman: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="70" x2="180" y2="70" class="ground-line"/>
        <g class="plank-animated" style="transform-origin:100px 60px">
          <circle cx="100" cy="48" r="9" class="stick-figure"/>
          <line x1="100" y1="57" x2="100" y2="82" class="stick-figure"/>
          <line x1="100" y1="62" x2="55" y2="50" class="stick-figure"/>
          <line x1="100" y1="62" x2="145" y2="50" class="stick-figure"/>
          <line x1="100" y1="82" x2="85" y2="70" class="stick-figure"/>
          <line x1="100" y1="82" x2="115" y2="70" class="stick-figure"/>
        </g>
        <text x="100" y="112" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">SUPERMAN</text>
      </svg>`,

      lunge: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="105" x2="180" y2="105" class="ground-line"/>
        <g class="lunge-animated">
          <circle cx="95" cy="28" r="10" class="stick-figure"/>
          <line x1="95" y1="38" x2="95" y2="70" class="stick-figure"/>
          <line x1="95" y1="50" x2="75" y2="62" class="stick-figure"/>
          <line x1="95" y1="50" x2="115" y2="62" class="stick-figure"/>
          <line x1="95" y1="70" x2="75" y2="95" class="stick-figure"/>
          <line x1="75" y1="95" x2="62" y2="105" class="stick-figure"/>
          <line x1="95" y1="70" x2="115" y2="88" class="stick-figure"/>
          <line x1="115" y1="88" x2="130" y2="105" class="stick-figure"/>
        </g>
        <text x="100" y="122" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">AFUNDO</text>
      </svg>`,

      calf: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="105" x2="180" y2="105" class="ground-line"/>
        <g class="squat-animated" style="animation-duration:1.2s">
          <circle cx="100" cy="28" r="10" class="stick-figure"/>
          <line x1="100" y1="38" x2="100" y2="75" class="stick-figure"/>
          <line x1="100" y1="50" x2="78" y2="62" class="stick-figure"/>
          <line x1="100" y1="50" x2="122" y2="62" class="stick-figure"/>
          <line x1="100" y1="75" x2="88" y2="98" class="stick-figure"/>
          <line x1="88" y1="98" x2="85" y2="105" class="stick-figure"/>
          <line x1="100" y1="75" x2="112" y2="98" class="stick-figure"/>
          <line x1="112" y1="98" x2="115" y2="105" class="stick-figure"/>
        </g>
        <text x="100" y="122" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">PANTURRILHA</text>
      </svg>`,

      crunch: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="100" x2="180" y2="100" class="ground-line"/>
        <g class="pushup-animated" style="animation-duration:1.8s;transform-origin:100px 85px">
          <circle cx="100" cy="65" r="10" class="stick-figure"/>
          <line x1="100" y1="75" x2="100" y2="95" class="stick-figure"/>
          <line x1="100" y1="80" x2="75" y2="70" class="stick-figure"/>
          <line x1="100" y1="80" x2="125" y2="70" class="stick-figure"/>
          <line x1="100" y1="95" x2="82" y2="100" class="stick-figure"/>
          <line x1="100" y1="95" x2="118" y2="100" class="stick-figure"/>
          <line x1="82" y1="100" x2="68" y2="100" class="stick-figure"/>
          <line x1="118" y1="100" x2="132" y2="100" class="stick-figure"/>
        </g>
        <text x="100" y="120" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">ABDOMINAL</text>
      </svg>`,

      burpee: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="105" x2="180" y2="105" class="ground-line"/>
        <g class="burpee-animated">
          <circle cx="100" cy="30" r="10" class="stick-figure"/>
          <line x1="100" y1="40" x2="100" y2="72" class="stick-figure"/>
          <line x1="100" y1="52" x2="78" y2="64" class="stick-figure"/>
          <line x1="100" y1="52" x2="122" y2="64" class="stick-figure"/>
          <line x1="100" y1="72" x2="88" y2="95" class="stick-figure"/>
          <line x1="88" y1="95" x2="83" y2="105" class="stick-figure"/>
          <line x1="100" y1="72" x2="112" y2="95" class="stick-figure"/>
          <line x1="112" y1="95" x2="117" y2="105" class="stick-figure"/>
          <polyline points="88,12 100,2 112,12" class="stick-figure" stroke="var(--orange)" stroke-dasharray="4 3" opacity="0.5"/>
        </g>
        <text x="100" y="122" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">BURPEE</text>
      </svg>`,

      diamond: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="100" x2="180" y2="100" class="ground-line"/>
        <g class="pushup-animated" style="animation-duration:1.3s">
          <circle cx="100" cy="38" r="10" class="stick-figure"/>
          <line x1="100" y1="48" x2="100" y2="78" class="stick-figure"/>
          <line x1="100" y1="58" x2="82" y2="78" class="stick-figure"/>
          <line x1="82" y1="78" x2="88" y2="100" class="stick-figure"/>
          <line x1="100" y1="58" x2="118" y2="78" class="stick-figure"/>
          <line x1="118" y1="78" x2="112" y2="100" class="stick-figure"/>
          <polygon points="88,100 100,90 112,100 100,86" fill="rgba(255,107,0,0.15)" stroke="var(--orange)" stroke-width="1.5"/>
          <line x1="100" y1="78" x2="90" y2="100" class="stick-figure"/>
          <line x1="100" y1="78" x2="110" y2="100" class="stick-figure"/>
        </g>
        <text x="100" y="118" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">FLEXÃO DIAMANTE</text>
      </svg>`,

      mountainclimber: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="100" x2="180" y2="100" class="ground-line"/>
        <g class="plank-animated" style="animation-duration:0.6s;animation-name:pushup-body">
          <circle cx="140" cy="45" r="10" class="stick-figure"/>
          <line x1="130" y1="51" x2="60" y2="72" class="stick-figure"/>
          <line x1="60" y1="72" x2="52" y2="100" class="stick-figure"/>
          <line x1="100" y1="65" x2="88" y2="82" class="stick-figure"/>
          <line x1="88" y1="82" x2="82" y2="100" class="stick-figure"/>
          <line x1="115" y1="60" x2="126" y2="80" class="stick-figure" stroke="var(--orange-hot)" stroke-dasharray="3 2"/>
          <line x1="130" y1="51" x2="148" y2="42" class="stick-figure" stroke-dasharray="3 2"/>
        </g>
        <text x="100" y="118" text-anchor="middle" fill="rgba(255,107,0,0.6)" font-size="8" font-family="sans-serif">MOUNTAIN CLIMBER</text>
      </svg>`
    };
    return animations[type] || animations.pushup;
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
