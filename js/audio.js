/**
 * ペットしいくゲーム - オーディオシステム (Web Audio API)
 * すべての音をシンセサイズドサウンドで生成するため、外部ファイルの読み込みが不要で安全・軽量です。
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmGain = null;
    this.currentBgmTheme = null;
    this.bgmTimer = null;
    this.bgmLoopEndTime = 0;
    this.bgmVolume = 0.16; // 心地よいBGM音量
    this.speechVoice = null;
    this.initSpeechVoices();
  }

  // Web Speech APIのボイス初期化 (Google日本語ボイス等を優先探索)
  initSpeechVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        // Google 日本語、または ja-JP / ja のボイスを優先
        this.speechVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Chrome')) && v.lang.startsWith('ja'))
          || voices.find(v => v.lang.startsWith('ja'))
          || voices.find(v => v.lang.includes('ja'))
          || null;
      };

      updateVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoice;
      }
    }
  }

  // オーディオコンテキストの初期化 (ユーザー操作時に呼び出し)
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
        this.bgmGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ミュート切り替え
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.bgmGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.bgmVolume;
      this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, this.ctx.currentTime);
      this.bgmGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
    }
    return this.isMuted;
  }

  // ボタンを押したときの音 (ポコッ)
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // ドアのベルの音 (チリンチリン)
  playDoorbell() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [1318.5, 1046.5]; // E6, C6
    notes.forEach((freq, idx) => {
      const startTime = this.ctx.currentTime + idx * 0.15;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // もぐもぐ食べる音 (サクッ、もぐもぐ)
  playEat() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 3; i++) {
      const startTime = this.ctx.currentTime + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260 + (i % 2) * 80, startTime);
      osc.frequency.exponentialRampToValueAtTime(180, startTime + 0.08);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.08);
    }
  }

  // ごくごく・うがいの音
  playDrink() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 3; i++) {
      const startTime = this.ctx.currentTime + i * 0.14;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, startTime);
      osc.frequency.exponentialRampToValueAtTime(900, startTime + 0.1);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    }
  }

  // 歯磨きの音 (シャカシャカ)
  playBrush() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3500;
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.25;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // 水を流す音・シャワー (ザー)
  playWater(duration = 0.8) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // せっけん・あわあわの音 (シュワシュワ・キュッ)
  playSoap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // ボールを投げる音 (ポヨーン、ポン)
  playBallBounce() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  // すべり台をすべる音 (シューーーン！)
  playSlideDown() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(850, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.75);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.75);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.75);
  }

  // 階段を登る足音 (トントン)
  playStep() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // ペットの鳴き声 (Web Speech API によるGoogle音声合成 + フォールバック)
  playPetVoice(type) {
    if (this.isMuted) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // ペットごとの鳴き声セリフと声質パラメータ設定
      const voiceConfig = {
        dog: {
          words: ['ワン！', 'わんわん！', 'ワフッ！'],
          pitch: 1.4, // 元気な犬の声
          rate: 1.3
        },
        cat: {
          words: ['にゃー！', 'にゃ〜ん', 'みゃお！'],
          pitch: 1.7, // 甘えんぼな猫の声
          rate: 1.1
        },
        rabbit: {
          words: ['ぴょん！', 'ぷぅぷぅ', 'きゅっ'],
          pitch: 1.9, // 高音の小動物ボイス
          rate: 1.4
        },
        guinea_pig: {
          words: ['きゅいっ！', 'ぷいぷい！', 'きゅるる'],
          pitch: 1.8, // テンポの良い高音ボイス
          rate: 1.5
        }
      };

      const cfg = voiceConfig[type] || { words: ['ワン！'], pitch: 1.4, rate: 1.2 };
      const text = cfg.words[Math.floor(Math.random() * cfg.words.length)];

      try {
        // 直前の鳴き声をキャンセルして即応性を向上
        window.speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        if (!this.speechVoice) {
          const voices = window.speechSynthesis.getVoices();
          this.speechVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Chrome')) && v.lang.startsWith('ja'))
            || voices.find(v => v.lang.startsWith('ja'))
            || null;
        }

        if (this.speechVoice) {
          utter.voice = this.speechVoice;
        }
        utter.lang = 'ja-JP';
        utter.pitch = cfg.pitch;
        utter.rate = cfg.rate;
        utter.volume = 1.0;

        window.speechSynthesis.speak(utter);
        return;
      } catch (e) {
        console.warn('SpeechSynthesis error, falling back to Web Audio:', e);
      }
    }

    // Web Speech API 非対応時のフォールバック (オシレーターによるシンセ音)
    this.playPetSynthVoice(type);
  }

  // Web Audio API によるシンセサイザー鳴き声 (フォールバック用)
  playPetSynthVoice(type) {
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    if (type === 'dog') {
      // 犬のワン！
      for (let i = 0; i < 2; i++) {
        const start = t + i * 0.16;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(420, start);
        osc.frequency.exponentialRampToValueAtTime(260, start + 0.12);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.12);
      }
    } else if (type === 'cat') {
      // 猫のニャーオ♪
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(950, t + 0.18);
      osc.frequency.exponentialRampToValueAtTime(680, t + 0.4);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.4);
    } else if (type === 'rabbit') {
      // ウサギのピピッ
      for (let i = 0; i < 2; i++) {
        const start = t + i * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, start);
        osc.frequency.exponentialRampToValueAtTime(1800, start + 0.08);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.08);
      }
    } else if (type === 'guinea_pig') {
      // モルモットのキュイッキュイッ！
      for (let i = 0; i < 3; i++) {
        const start = t + i * 0.11;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100 + i * 150, start);
        osc.frequency.exponentialRampToValueAtTime(1600 + i * 150, start + 0.09);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.09);
      }
    }
  }

  // よろこびジングル (キラキラ〜ン)
  playJoy() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const start = this.ctx.currentTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  // ねんねオルゴール (すやすやメロディ)
  playLullaby() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [783.99, 659.25, 659.25, 698.46, 587.33, 587.33, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const start = this.ctx.currentTime + idx * 0.28;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.6);
    });
  }

  // あさの小鳥のさえずり
  playMorningBirds() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 4; i++) {
      const start = this.ctx.currentTime + i * 0.18;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200 + (i % 2) * 400, start);
      osc.frequency.exponentialRampToValueAtTime(2800, start + 0.07);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.08);
    }
  }

  // ==========================================
  // BGMシーケンサー (完全オリジナル・プログラマブルBGM)
  // ==========================================

  // 単音の生成 (トイピアノ・マリンバ・木琴風の温かい音)
  playTone(freq, startTime, duration = 0.28, type = 'triangle', peakGain = 0.16, decay = 0.25) {
    if (!this.ctx || !this.bgmGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.max(duration, decay));

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(startTime);
    osc.stop(startTime + Math.max(duration, decay) + 0.05);
  }

  // BGMの再生開始 (テーマ別: 'shop' | 'living' | 'outdoor')
  startBGM(theme = 'living') {
    this.init();
    if (!this.ctx || !this.bgmGain) return;

    if (this.currentBgmTheme === theme) return;

    this.stopBGM();
    this.currentBgmTheme = theme;

    this.bgmLoopEndTime = this.ctx.currentTime + 0.05;
    this.scheduleNextLoop(theme);

    this.bgmTimer = setInterval(() => {
      if (!this.ctx || !this.currentBgmTheme) return;
      if (this.bgmLoopEndTime - this.ctx.currentTime < 2.5) {
        this.scheduleNextLoop(this.currentBgmTheme);
      }
    }, 1000);
  }

  // BGMの停止
  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.currentBgmTheme = null;
  }

  // ループスケジュール
  scheduleNextLoop(theme) {
    if (!this.ctx) return;
    const startTime = Math.max(this.bgmLoopEndTime, this.ctx.currentTime + 0.05);

    if (theme === 'shop') {
      this.bgmLoopEndTime = this.scheduleShopBGM(startTime);
    } else if (theme === 'outdoor') {
      this.bgmLoopEndTime = this.scheduleOutdoorBGM(startTime);
    } else {
      this.bgmLoopEndTime = this.scheduleLivingBGM(startTime);
    }
  }

  // ① おうち・リビングのテーマ曲 (Cメジャー、ほのぼのトイピアノ)
  scheduleLivingBGM(t0) {
    const b = 0.57; // 1拍 (BPM 105)
    const F = {
      C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
    };

    // 4小節の伴奏 (ベース & アルペジオ)
    const chords = [
      { bass: F.C3, arp: [F.G3, F.C4, F.E4, F.G4] }, // C
      { bass: F.G3, arp: [F.D4, F.G4, F.B4, F.D5] }, // G
      { bass: F.A3, arp: [F.E4, F.A4, F.C5, F.E5] }, // Am
      { bass: F.F3, arp: [F.C4, F.F4, F.A4, F.C5] }  // F
    ];

    chords.forEach((chord, barIdx) => {
      const barStart = t0 + barIdx * 4 * b;
      // ベース (1拍目・3拍目)
      this.playTone(chord.bass, barStart, b * 0.8, 'sine', 0.22, 0.4);
      this.playTone(chord.bass, barStart + 2 * b, b * 0.8, 'sine', 0.18, 0.4);
      // アルペジオ (4拍)
      chord.arp.forEach((note, beatIdx) => {
        this.playTone(note, barStart + beatIdx * b + b * 0.5, b * 0.4, 'triangle', 0.08, 0.2);
      });
    });

    // 4小節のメロディ (トイピアノ)
    const melody = [
      // 小節1: ミ〜 ソ〜 ミレ ド〜
      { n: F.E5, t: 0, d: 0.9 }, { n: F.G5, t: 1, d: 0.9 },
      { n: F.E5, t: 2, d: 0.45 }, { n: F.D5, t: 2.5, d: 0.45 }, { n: F.C5, t: 3, d: 0.9 },
      // 小節2: レ〜 ソ〜 ファ〜 ミ〜
      { n: F.D5, t: 4, d: 0.9 }, { n: F.G5, t: 5, d: 0.9 },
      { n: F.F5, t: 6, d: 0.9 }, { n: F.E5, t: 7, d: 0.9 },
      // 小節3: ド〜 ミ〜 ラ〜 ソ〜
      { n: F.C5, t: 8, d: 0.9 }, { n: F.E5, t: 9, d: 0.9 },
      { n: F.A5, t: 10, d: 0.9 }, { n: F.G5, t: 11, d: 0.9 },
      // 小節4: ファ〜 ミレ ド〜〜
      { n: F.F5, t: 12, d: 0.9 }, { n: F.E5, t: 13, d: 0.45 },
      { n: F.D5, t: 13.5, d: 0.45 }, { n: F.C5, t: 14, d: 1.8 }
    ];

    melody.forEach(m => {
      this.playTone(m.n, t0 + m.t * b, m.d * b, 'sine', 0.16, 0.35);
    });

    return t0 + 16 * b; // 16拍分の長さ
  }

  // ② ペットショップのテーマ曲 (Fメジャー、軽快な木琴マーチ)
  scheduleShopBGM(t0) {
    const b = 0.50; // 1拍 (BPM 120)
    const F = {
      F3: 174.61, C3: 130.81, Bb3: 233.08,
      F4: 349.23, A4: 440.00, C5: 523.25, D5: 587.33, E5: 659.25,
      F5: 698.46, G5: 783.99, A5: 880.00, Bb5: 932.33, C6: 1046.50
    };

    const chords = [
      { bass: F.F3, arp: [F.A4, F.C5] },  // F
      { bass: F.C3, arp: [F.G5, F.C5] },  // C
      { bass: F.Bb3, arp: [F.D5, F.F5] }, // Bb
      { bass: F.C3, arp: [F.E5, F.G5] }   // C
    ];

    chords.forEach((chord, barIdx) => {
      const barStart = t0 + barIdx * 4 * b;
      for (let i = 0; i < 4; i++) {
        this.playTone(chord.bass, barStart + i * b, b * 0.4, 'triangle', 0.18, 0.2);
        this.playTone(chord.arp[i % 2], barStart + i * b + b * 0.5, b * 0.3, 'sine', 0.08, 0.15);
      }
    });

    // 軽快なメロディ
    const melody = [
      // 小節1
      { n: F.A5, t: 0, d: 0.45 }, { n: F.C6, t: 0.5, d: 0.45 },
      { n: F.A5, t: 1, d: 0.9 }, { n: F.F5, t: 2, d: 0.9 }, { n: F.G5, t: 3, d: 0.9 },
      // 小節2
      { n: F.E5, t: 4, d: 0.45 }, { n: F.G5, t: 4.5, d: 0.45 },
      { n: F.E5, t: 5, d: 0.9 }, { n: F.C5, t: 6, d: 0.9 }, { n: F.D5, t: 7, d: 0.9 },
      // 小節3
      { n: F.D5, t: 8, d: 0.45 }, { n: F.F5, t: 8.5, d: 0.45 },
      { n: F.Bb5, t: 9, d: 0.9 }, { n: F.A5, t: 10, d: 0.9 }, { n: F.G5, t: 11, d: 0.9 },
      // 小節4
      { n: F.F5, t: 12, d: 0.9 }, { n: F.G5, t: 13, d: 0.9 }, { n: F.F5, t: 14, d: 1.8 }
    ];

    melody.forEach(m => {
      this.playTone(m.n, t0 + m.t * b, m.d * b, 'triangle', 0.18, 0.25);
    });

    return t0 + 16 * b;
  }

  // ③ お外・公園のテーマ曲 (Gメジャー、スキップ調の明るいステップ)
  scheduleOutdoorBGM(t0) {
    const b = 0.52; // 1拍 (BPM 115)
    const F = {
      G3: 196.00, D3: 146.83, E3: 164.81, C3: 130.81,
      G4: 392.00, B4: 493.88, D5: 587.33, E5: 659.25, Fs5: 739.99,
      G5: 783.99, A5: 880.00, B5: 987.77, C6: 1046.50
    };

    const chords = [
      { bass: F.G3, high: F.B4 }, // G
      { bass: F.D3, high: F.Fs5 }, // D
      { bass: F.E3, high: F.G4 }, // Em
      { bass: F.C3, high: F.E5 }  // C
    ];

    chords.forEach((chord, barIdx) => {
      const barStart = t0 + barIdx * 4 * b;
      // 弾むウォーキングベース
      this.playTone(chord.bass, barStart, b * 0.5, 'sine', 0.2, 0.3);
      this.playTone(chord.high, barStart + b, b * 0.3, 'triangle', 0.08, 0.2);
      this.playTone(chord.bass, barStart + 2 * b, b * 0.5, 'sine', 0.2, 0.3);
      this.playTone(chord.high, barStart + 3 * b, b * 0.3, 'triangle', 0.08, 0.2);
    });

    // スキップするメロディ
    const melody = [
      // 小節1
      { n: F.D5, t: 0, d: 0.9 }, { n: F.G5, t: 1, d: 0.45 },
      { n: F.A5, t: 1.5, d: 0.45 }, { n: F.B5, t: 2, d: 0.9 }, { n: F.G5, t: 3, d: 0.9 },
      // 小節2
      { n: F.A5, t: 4, d: 0.9 }, { n: F.D5, t: 5, d: 0.45 },
      { n: F.E5, t: 5.5, d: 0.45 }, { n: F.Fs5, t: 6, d: 0.9 }, { n: F.A5, t: 7, d: 0.9 },
      // 小節3
      { n: F.G5, t: 8, d: 0.9 }, { n: F.B5, t: 9, d: 0.45 },
      { n: F.C6, t: 9.5, d: 0.45 }, { n: F.B5, t: 10, d: 0.9 }, { n: F.G5, t: 11, d: 0.9 },
      // 小節4
      { n: F.E5, t: 12, d: 0.45 }, { n: F.G5, t: 12.5, d: 0.45 },
      { n: F.A5, t: 13, d: 0.9 }, { n: F.G5, t: 14, d: 1.8 }
    ];

    melody.forEach(m => {
      this.playTone(m.n, t0 + m.t * b, m.d * b, 'sine', 0.17, 0.3);
    });

    return t0 + 16 * b;
  }
}

// グローバルインスタンス
const soundSystem = new SoundSystem();
window.soundSystem = soundSystem;
