// ======== CONFIGURA AQUÍ TUS CREDENCIALES SUPABASE ========
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY2V3Y2lncWlhY3p3a25lZHQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc2MTI3MTE5NywiZXhwIjoyMDc2ODQ3MTk3fQ.FDsk0JHxIqumSDb8VnHM9SaB8czrTZ5-hVfwb4ekwlA";

function base64UrlDecode(segment) {
  if (!segment) return null;
  try {
    const pad = segment.length % 4;
    if (pad) segment += "=".repeat(4 - pad);
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    return atob(normalized);
  } catch (error) {
    console.warn("No se pudo decodificar base64url de Supabase:", error);
    return null;
  }
}

function getSupabaseRefFromAnonKey(key) {
  if (!key || typeof key !== "string") return null;
  const parts = key.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1]) || "null");
    return typeof payload?.ref === "string" ? payload.ref : null;
  } catch (error) {
    console.warn("No se pudo derivar el proyecto Supabase desde la anon key:", error);
    return null;
  }
}

const metaUrl = document.querySelector('meta[name="supabase-url"]')?.content?.trim();
const metaAnonKey = document.querySelector('meta[name="supabase-anon-key"]')?.content?.trim();

const providedAnonKeyCandidate =
  (typeof window !== "undefined" && window.SUPABASE_ANON_KEY) ||
  metaAnonKey ||
  DEFAULT_SUPABASE_ANON_KEY;

let providedAnonKey =
  typeof providedAnonKeyCandidate === "string"
    ? providedAnonKeyCandidate.trim()
    : "";
if (!providedAnonKey) {
  providedAnonKey = DEFAULT_SUPABASE_ANON_KEY;
}

const supabaseRef = getSupabaseRefFromAnonKey(providedAnonKey);
const derivedUrlFromKey = supabaseRef ? `https://${supabaseRef}.supabase.co` : null;

const providedUrlRaw =
  (typeof window !== "undefined" && window.SUPABASE_URL) ||
  metaUrl ||
  "";

const sanitizedProvidedUrl = providedUrlRaw
  ? providedUrlRaw.trim().replace(/\/?$/, "")
  : "";

let finalSupabaseUrl = sanitizedProvidedUrl;
if (derivedUrlFromKey && sanitizedProvidedUrl && sanitizedProvidedUrl !== derivedUrlFromKey) {
  console.warn(
    "La URL de Supabase y la anon key no coinciden. Se usará la URL derivada del token para evitar errores de conexión."
  );
  finalSupabaseUrl = derivedUrlFromKey;
}
if (!finalSupabaseUrl) {
  finalSupabaseUrl = derivedUrlFromKey || "https://slcewcigqiauczwknedt.supabase.co";
}

const SUPABASE_URL = finalSupabaseUrl;
const SUPABASE_ANON_KEY = providedAnonKey;
// ==========================================================

const supa = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class VotingApp {
  constructor() {
    this.currentPage = 'home';
    this.candidates = [
      { id: 1, name: "Planilla 1", party: "Planilla de Prueba", votes: 0 },
      { id: 2, name: "Planilla 2", party: "Planilla de Prueba", votes: 0 },
      { id: 3, name: "Planilla 3", party: "Planilla de Prueba", votes: 0 },
      { id: 4, name: "Planilla 4", party: "Planilla de Prueba", votes: 0 }
    ];
    this.hasVoted = false;
    this.currentSlide = 0;
    this.selectedCandidateId = null;
    this.userInteracting = false;
    this.totalRotation = 0;
    this.userId = null;
    this.realtimeChannel = null;

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.showPage('home');
    await this.handleExistingSession();
    this.setupAuthListener();
  }

  // ======== AUTH ========
  isInstitutionalEmail(email) {
    return /@unison\.mx$/i.test(email.trim());
  }

  async handleExistingSession() {
    const { data: { session } } = await supa.auth.getSession();
    if (session?.user) {
      this.userId = session.user.id;
      await this.postLoginBoot();
    }
  }

  setupAuthListener() {
    supa.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this.userId = session.user.id;
        await this.postLoginBoot();
      } else if (event === 'SIGNED_OUT') {
        this.userId = null;
        this.logout();
      }
    });
  }

  async handleLogin() {
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const emailError = document.getElementById('emailError');
    if (!this.isInstitutionalEmail(email)) {
      emailError.classList.remove('hidden');
      this.toast('Usa tu correo institucional @unison.mx', 'error');
      return;
    } else {
      emailError.classList.add('hidden');
    }
    if (!password || password.length < 6) {
      this.toast('Ingresa tu contraseña (mínimo 6 caracteres)', 'error');
      return;
    }

    try {
      const { error } = await supa.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this.toast('¡Acceso autorizado! Redirigiendo...', 'success');
      // postLoginBoot lo dispara onAuthStateChange
    } catch (err) {
      const msg = (err && err.message) ? err.message : 'Error de autenticación';
      this.toast(msg, 'error');
    }
  }

  async postLoginBoot() {
    this.showLoginSuccess();
    setTimeout(async () => {
      this.animateToVoting();
      await this.syncCountsFromDB();
      await this.checkIfUserHasVoted();
      this.initVotingSystem();
      this.subscribeRealtimeVotes();
    }, 800);
  }

  // ======== NAVEGACIÓN / UI ========
  setupEventListeners() {
    this.setupSlider();

    // Login submit
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Recuperar contraseña
    const recover = document.getElementById('recoverLink');
    if (recover) {
      recover.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('username').value || '').trim();
        if (!this.isInstitutionalEmail(email)) {
          this.toast('Escribe tu correo @unison.mx arriba y luego pulsa Recuperar.', 'error');
          return;
        }
        try {
          const { error } = await supa.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.href
          });
          if (error) throw error;
          this.toast('Te enviamos un correo para restablecer tu contraseña.', 'success');
        } catch (err) {
          this.toast(err.message || 'No se pudo iniciar la recuperación', 'error');
        }
      });
    }

    // Reset local (solo interfaz)
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetVotingLocal();
    });

    // Carrusel
    document.addEventListener('click', (e) => {
      if (e.target.id === 'prevBtn' || e.target.closest('#prevBtn')) this.previousSlide();
      if (e.target.id === 'nextBtn' || e.target.closest('#nextBtn')) this.nextSlide();
    });

    // Modal
    const cancelBtn = document.getElementById('cancelVote');
    const confirmBtn = document.getElementById('confirmVote');
    cancelBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.closeModal(); });
    confirmBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.confirmVote(); });

    // Cerrar modal al fondo
    document.getElementById('confirmationModal').addEventListener('click', (e) => {
      if (e.target.id === 'confirmationModal') this.closeModal();
    });
  }

  setupSlider() {
    const sliderButton = document.getElementById('sliderButton');
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderGlow = document.getElementById('sliderGlow');
    const sliderText = document.getElementById('sliderText');
    const sliderSuccess = document.getElementById('sliderSuccess');

    let isDragging = false, startX = 0, currentX = 0, isCompleted = false;
    const getMaxDistance = () => sliderTrack.offsetWidth - sliderButton.offsetWidth - 8;

    sliderButton.addEventListener('mousedown', (e) => {
      if (isCompleted) return;
      isDragging = true; startX = e.clientX - currentX;
      sliderButton.style.cursor = 'grabbing'; sliderGlow.style.opacity = '1'; sliderGlow.style.transition = 'opacity .2s ease';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging || isCompleted) return;
      e.preventDefault();
      const max = getMaxDistance();
      const newX = e.clientX - startX;
      currentX = Math.max(0, Math.min(newX, max));
      sliderButton.style.transform = `translateX(${currentX}px)`;
      const progress = currentX / max;
      sliderGlow.style.opacity = Math.min(1, progress * 1.5);
      sliderText.style.opacity = Math.max(0, 1 - (progress * 1.2));
      if (progress >= 0.95) complete();
    });
    document.addEventListener('mouseup', () => {
      if (!isDragging || isCompleted) return;
      isDragging = false; sliderButton.style.cursor = 'grab';
      const max = getMaxDistance(); const progress = currentX / max;
      if (progress < 0.95) reset();
    });

    sliderButton.addEventListener('touchstart', (e) => {
      if (isCompleted) return;
      isDragging = true; startX = e.touches[0].clientX - currentX;
      sliderGlow.style.opacity = '1'; sliderGlow.style.transition = 'opacity .2s ease';
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', (e) => {
      if (!isDragging || isCompleted) return;
      e.preventDefault();
      const max = getMaxDistance(); const newX = e.touches[0].clientX - startX;
      currentX = Math.max(0, Math.min(newX, max));
      sliderButton.style.transform = `translateX(${currentX}px)`;
      const progress = currentX / max;
      sliderGlow.style.opacity = Math.min(1, progress * 1.5);
      sliderText.style.opacity = Math.max(0, 1 - (progress * 1.2));
      if (progress >= 0.95) complete();
    }, { passive: false });
    document.addEventListener('touchend', () => {
      if (!isDragging || isCompleted) return;
      isDragging = false;
      const max = getMaxDistance(); const progress = currentX / max;
      if (progress < 0.95) reset();
    });

    const reset = () => {
      sliderButton.style.transition = 'transform .6s cubic-bezier(.25,.46,.45,.94)';
      sliderButton.style.transform = 'translateX(0px)';
      sliderGlow.style.transition = 'opacity .4s ease-out'; sliderGlow.style.opacity = '0';
      sliderText.style.transition = 'opacity .4s ease-out'; sliderText.style.opacity = '1';
      setTimeout(() => { currentX = 0; sliderButton.style.transition = ''; sliderGlow.style.transition = ''; sliderText.style.transition = ''; }, 600);
    };
    const complete = () => {
      isCompleted = true;
      sliderTrack.style.transition = 'opacity .5s ease-out'; sliderTrack.style.opacity = '0';
      setTimeout(() => {
        sliderTrack.style.display = 'none';
        sliderSuccess.style.display = 'flex'; sliderSuccess.style.opacity = '0'; sliderSuccess.style.transition = 'opacity .5s ease-in';
        setTimeout(() => { sliderSuccess.style.opacity = '1'; }, 50);
      }, 500);
      setTimeout(() => { this.animateToLogin(); }, 2500);
    };
  }

  animateToLogin() {
    const mainContent = document.getElementById('mainContent');
    mainContent.classList.add('slide-out-left');
    setTimeout(() => {
      this.showPage('login');
      document.getElementById('loginHeader').classList.add('slide-in-down');
      document.getElementById('loginCard').classList.add('form-appear');
    }, 600);
  }

  animateToHome() {
    const loginHeader = document.getElementById('loginHeader');
    const loginCard = document.getElementById('loginCard');
    loginHeader.classList.add('slide-out-up'); loginCard.classList.add('slide-out-left');
    setTimeout(() => {
      this.showPage('home');
      const mainContent = document.getElementById('mainContent'); const mainTitle = document.getElementById('mainTitle');
      mainContent.classList.remove('slide-out-left'); mainContent.classList.add('slide-in-right');
      loginHeader.classList.remove('slide-in-down','slide-out-up'); loginCard.classList.remove('form-appear','slide-out-left');
    }, 600);
  }

  showPage(page) {
    document.querySelector('main').classList.add('hidden');
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('votingSystem').classList.add('hidden');
    if (page === 'home') document.querySelector('main').classList.remove('hidden');
    if (page === 'login') document.getElementById('loginPage').classList.remove('hidden');
    if (page === 'voting') { document.getElementById('votingSystem').classList.remove('hidden'); this.initVotingSystem(); }
    this.currentPage = page;
  }

  animateToVoting() {
    const loginPage = document.getElementById('loginPage');
    const mainTitle = document.getElementById('mainTitle');
    mainTitle.classList.add('title-exit'); loginPage.classList.add('login-to-voting');
    setTimeout(() => {
      this.showPage('voting');
      document.getElementById('votingSystem').classList.add('voting-appear');
    }, 1200);
  }

  showLoginSuccess(){ this.toast('¡Acceso autorizado! Redirigiendo...', 'success'); }
  showLoginError(){ this.toast('Por favor completa todos los campos', 'error'); }

  logout() {
    const votingSystem = document.getElementById('votingSystem');
    votingSystem.classList.add('voting-exit');
    setTimeout(() => {
      this.hasVoted = false; this.userId = null;
      document.getElementById('username').value = ''; document.getElementById('password').value = '';
      this.showPage('home');
      const mainContent = document.getElementById('mainContent'); const mainTitle = document.getElementById('mainTitle');
      mainContent.classList.add('home-return'); mainTitle.classList.add('title-return');
      setTimeout(() => {
        votingSystem.classList.remove('voting-exit','voting-appear');
        mainContent.classList.remove('home-return'); mainTitle.classList.remove('title-exit','title-return');
        document.getElementById('loginPage').classList.remove('login-to-voting');
      }, 1000);
    }, 800);
  }

  // ======== VOTACIÓN ========
  initVotingSystem() {
    this.renderCandidates();
    this.renderResults();
    this.updateTotalVotes();
    this.startAutoCarousel();
  }
  startAutoCarousel() {
    if (this.carouselInterval) clearInterval(this.carouselInterval);
    this.carouselInterval = setInterval(() => {
      if (!this.hasVoted && !this.userInteracting) this.nextSlide();
    }, 4000);
  }
  stopAutoCarousel() { if (this.carouselInterval) { clearInterval(this.carouselInterval); this.carouselInterval = null; } }
  updateCarousel3D() {
    const carousel = document.getElementById('carousel3d');
    const angleStep = 360 / this.candidates.length;
    this.totalRotation = -this.currentSlide * angleStep;
    carousel.style.transform = `rotateY(${this.totalRotation}deg)`;
  }
  nextSlide() {
    this.userInteracting = true; this.stopAutoCarousel();
    this.currentSlide = (this.currentSlide + 1) % this.candidates.length;
    this.totalRotation -= 360 / this.candidates.length;
    document.getElementById('carousel3d').style.transform = `rotateY(${this.totalRotation}deg)`;
    this.updateDots();
    if (!this.hasVoted) setTimeout(() => { this.userInteracting = false; this.startAutoCarousel(); }, 3000);
  }
  previousSlide() {
    this.userInteracting = true; this.stopAutoCarousel();
    this.currentSlide = this.currentSlide === 0 ? this.candidates.length - 1 : this.currentSlide - 1;
    this.totalRotation += 360 / this.candidates.length;
    document.getElementById('carousel3d').style.transform = `rotateY(${this.totalRotation}deg)`;
    this.updateDots();
    if (!this.hasVoted) setTimeout(() => { this.userInteracting = false; this.startAutoCarousel(); }, 3000);
  }
  goToSlide(index) {
    this.userInteracting = true; this.stopAutoCarousel();
    this.currentSlide = index; this.updateCarousel3D(); this.updateDots();
    if (!this.hasVoted) setTimeout(() => { this.userInteracting = false; this.startAutoCarousel(); }, 3000);
  }
  updateDots() {
    const dotsContainer = document.getElementById('dotsContainer');
    dotsContainer.innerHTML = this.candidates.map((_, i) =>
      `<button class="w-4 h-4 rounded-full transition-all duration-300 ${i===this.currentSlide?'bg-white scale-125':'bg-white/40'}" onclick="votingApp.goToSlide(${i})"></button>`
    ).join('');
  }

  renderCandidates() {
    const carousel3d = document.getElementById('carousel3d');
    const dotsContainer = document.getElementById('dotsContainer');
    const angleStep = 360 / this.candidates.length;
    const radius = 220;

    carousel3d.innerHTML = this.candidates.map((candidate, index) => {
      const angle = index * angleStep;
      return `
        <div class="carousel-3d-item" style="position:absolute; left:50%; top:50%; width:220px; height:280px; margin-left:-110px; margin-top:-140px; transform: rotateY(${angle}deg) translateZ(${radius}px); transform-style:preserve-3d; backface-visibility:visible;">
          <div class="candidate-card rounded-2xl p-4 border border-gray-300 shadow-2xl relative overflow-hidden h-full transition-all duration-300" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>
            <div class="text-center mb-4 relative z-10">
              <div class="candidate-avatar w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold shadow-2xl relative">
                ${candidate.name.split(' ').map(n => n[0]).join('')}
                <div class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-1">${candidate.name}</h3>
              <p class="text-gray-600 text-xs font-medium">${candidate.party}</p>
              <p class="text-gray-500 text-xs mt-1">Partido de Prueba</p>
              <div class="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-2 rounded-full"></div>
            </div>
            <button class="modern-btn w-full flex items-center justify-center space-x-1 group/btn relative z-10 text-xs py-2 transition-all duration-300 ${this.hasVoted? 'opacity-50 cursor-not-allowed':''}" data-candidate-id="${candidate.id}" ${this.hasVoted? 'disabled':''}>
              ${this.hasVoted ? `
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Ya Votaste</span>` : `
                <svg class="w-3 h-3 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/></svg>
                <span>Votar por ${candidate.name.split(' ')[0]}</span>`
              }
            </button>
          </div>
        </div>
      `;
    }).join('');

    const voteButtons = carousel3d.querySelectorAll('button[data-candidate-id]');
    voteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const candidateId = parseInt(btn.getAttribute('data-candidate-id'));
        if (!this.hasVoted) this.openVoteModal(candidateId);
      });
    });

    this.updateCarousel3D();
    dotsContainer.innerHTML = this.candidates.map((_, i) =>
      `<button class="w-4 h-4 rounded-full transition-all duration-300 ${i===this.currentSlide?'bg-white scale-125':'bg-white/40'}" onclick="votingApp.goToSlide(${i})"></button>`
    ).join('');
  }

  openVoteModal(candidateId) {
    if (this.hasVoted) return;
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (candidate) {
      this.selectedCandidateId = candidateId;
      document.getElementById('selectedCandidate').textContent = candidate.name;
      const modal = document.getElementById('confirmationModal');
      const modalContent = document.getElementById('modalContent');
      modal.classList.remove('hidden');
      setTimeout(() => { modalContent.classList.remove('scale-95'); modalContent.classList.add('scale-100'); }, 10);
    }
  }

  closeModal() {
    const modal = document.getElementById('confirmationModal');
    const modalContent = document.getElementById('modalContent');
    if (modal && modalContent) {
      modalContent.classList.remove('scale-100'); modalContent.classList.add('scale-95');
      setTimeout(() => { modal.classList.add('hidden'); this.selectedCandidateId = null; }, 300);
    }
  }

  async confirmVote() {
    if (!this.selectedCandidateId || this.hasVoted) return;
    if (!this.userId) { this.toast('Debes iniciar sesión con tu correo UNISON', 'error'); return; }

    try {
      const { error } = await supa.from('votes').insert({
        user_id: this.userId,
        candidate_id: this.selectedCandidateId
      });
      if (error) {
        if (error.code === '23505') { // unique(user_id)
          this.toast('Ya registraste tu voto.', 'error');
          this.hasVoted = true;
          this.renderCandidates();
          return this.closeModal();
        }
        throw error;
      }

      this.hasVoted = true;
      this.closeModal();
      await this.syncCountsFromDB();
      this.renderCandidates();
      this.renderResults();
      this.updateTotalVotes();
      this.showVoteConfirmation(this.candidates.find(c => c.id === this.selectedCandidateId)?.name || 'candidato');
    } catch (err) {
      this.toast(err.message || 'No se pudo registrar el voto', 'error');
    }
  }

  // ======== DB / REALTIME ========
  async syncCountsFromDB() {
    const { data, error } = await supa
      .from('votes')
      .select('candidate_id, count:count(*)', { group: 'candidate_id' });

    if (error) {
      this.toast('No se pudieron cargar resultados', 'error');
      return;
    }
    this.candidates.forEach(c => c.votes = 0);
    (data || []).forEach(row => {
      const c = this.candidates.find(x => x.id === row.candidate_id);
      if (c) c.votes = row.count;
    });
    this.renderResults();
    this.updateTotalVotes();
  }

  async checkIfUserHasVoted() {
    if (!this.userId) { this.hasVoted = false; return; }
    const { data, error } = await supa
      .from('votes')
      .select('id')
      .eq('user_id', this.userId)
      .maybeSingle();
    if (error && error.code !== 'PGRST116') {
      this.toast('No se pudo verificar tu voto previo', 'error');
    }
    this.hasVoted = Boolean(data);
    this.renderCandidates();
  }

  subscribeRealtimeVotes() {
    if (this.realtimeChannel) {
      supa.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
    this.realtimeChannel = supa
      .channel('votes-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, async () => {
        await this.syncCountsFromDB();
      })
      .subscribe(() => {
        this.syncCountsFromDB();
      });
  }

  // ======== RESULTADOS ========
  renderResults() {
    const container = document.getElementById('resultsContainer');
    const totalVotes = this.getTotalVotes();
    container.innerHTML = this.candidates.map((candidate, index) => {
      const percentage = totalVotes > 0 ? (candidate.votes / totalVotes * 100).toFixed(1) : 0;
      const isLeading = totalVotes > 0 && candidate.votes === Math.max(...this.candidates.map(c => c.votes));
      const colors = ['from-blue-400 to-blue-600','from-green-400 to-green-600','from-purple-400 to-purple-600','from-red-400 to-red-600'];
      return `
        <div class="mb-4 p-4 rounded-lg ${isLeading && totalVotes>0 ? 'bg-yellow-500/10 border border-yellow-400/30' : 'bg-white/5'}">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br ${colors[index]} rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <span class="font-semibold text-white flex items-center space-x-2">
                <span>${candidate.name}</span>
                ${isLeading && totalVotes>0 ? `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`:``}
              </span>
            </div>
            <div class="flex items-center space-x-2 text-white/80">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>${candidate.votes} votos (${percentage}%)</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div class="h-3 rounded-full transition-all duration-800 ease-in-out bg-gradient-to-r ${colors[index]} relative" style="width:${percentage}%;">
              ${percentage>0? `<div class="absolute inset-0 bg-white/20 animate-pulse"></div>`:''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  getTotalVotes(){ return this.candidates.reduce((t,c)=> t + (c.votes||0), 0); }
  updateTotalVotes(){ document.getElementById('totalVotes').textContent = this.getTotalVotes(); }

  resetVotingLocal() {
    this.candidates.forEach(c => c.votes = 0);
    this.hasVoted = false;
    this.renderCandidates(); this.renderResults(); this.updateTotalVotes(); this.startAutoCarousel();
    this.toast('Reinicio local (no afecta conteo en servidor)', 'info');
  }

  // ======== TOAST ========
  toast(msg, type='info'){
    const bg = type==='success' ? 'bg-green-500' : type==='error' ? 'bg-red-500' : 'bg-slate-700';
    const el = document.createElement('div');
    el.className = `fixed top-4 right-4 ${bg} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    el.innerHTML = msg; document.body.appendChild(el);
    setTimeout(()=>{ el.remove(); }, 3500);
  }
  showVoteConfirmation(name){ this.toast(`¡Voto registrado para ${name}!`, 'success'); }
}

// Inicializa la app y expone la instancia global para los onclick del carrusel
window.votingApp = new VotingApp();
