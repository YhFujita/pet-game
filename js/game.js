/**
 * ペットしいくゲーム - メインゲームコントローラー (GameApp)
 * シーン管理、タイムサイクル、お世話インタラクション、ローカルストレージを制御
 */

class GameApp {
  constructor() {
    this.currentScene = 'shop_exterior'; // 'shop_exterior' | 'shop_interior' | 'living' | 'bathroom' | 'bath' | 'walk_trail' | 'walk_park'
    this.pet = null;

    // 生活リズムスケジュール (朝ごはん・自由時間・昼ごはん・自由時間・夕ごはん・夜のおしたく)
    this.timeSchedule = [
      { id: 'breakfast', name: 'あさごはん', phase: 'meal', timeOfDay: 'morning', icon: '🍳' },
      { id: 'free_morning', name: 'じゆうじかん（あさ）', phase: 'free', timeOfDay: 'morning', icon: '🎈' },
      { id: 'lunch', name: 'ひるごはん', phase: 'meal', timeOfDay: 'noon', icon: '🍱' },
      { id: 'free_afternoon', name: 'じゆうじかん（ひる）', phase: 'free', timeOfDay: 'noon', icon: '🎈' },
      { id: 'dinner', name: 'ゆうごはん', phase: 'meal', timeOfDay: 'evening', icon: '🍲' },
      { id: 'night_prep', name: 'よるの おしたく', phase: 'night', timeOfDay: 'night', icon: '🌙' }
    ];

    this.timeIndex = 0; // あさごはんから開始
    this.dayCount = 1;

    // お世話ステート
    this.hasBrushedTeeth = false;
    this.hasWashedHands = false;
    this.hasUsedToilet = false;
    this.bathStep = 0; // 0: なし, 1: あわあわ, 2: シャワー, 3: ふわふわかんせい

    // 夜のおしたく完了ステート (トイレ、歯磨き、お風呂の3つ)
    this.nightTasks = {
      toilet: false,
      teeth: false,
      bath: false
    };

    // 選択中ペット一時保存
    this.selectedPetType = 'dog';
    this.petNameInput = '';

    // ローカルストレージ要件: 「次回遊ぶ時は引き継がない」
    // 新しいセッション開始時は前回の名前を引き継がずにリセット
    try {
      localStorage.removeItem('pet_current_name');
      localStorage.removeItem('pet_current_type');
    } catch (e) {
      console.warn('Storage clear exception:', e);
    }
  }

  // 初期化
  init() {
    soundSystem.init();
    this.renderLayout();
    this.changeScene('shop_exterior');

    // ブラウザの音声自動再生ポリシーに対応: 初回タップ/クリック時にBGMを開始
    const startAudioOnFirstInteraction = () => {
      soundSystem.init();
      if (this.currentScene === 'shop_exterior' || this.currentScene === 'shop_interior') {
        soundSystem.startBGM('shop');
      } else if (this.currentScene === 'walk_trail' || this.currentScene === 'walk_park') {
        soundSystem.startBGM('outdoor');
      } else {
        soundSystem.startBGM('living');
      }
      window.removeEventListener('pointerdown', startAudioOnFirstInteraction);
      window.removeEventListener('keydown', startAudioOnFirstInteraction);
    };
    window.addEventListener('pointerdown', startAudioOnFirstInteraction, { once: true });
    window.addEventListener('keydown', startAudioOnFirstInteraction, { once: true });
  }

  // 基本画面レイアウトの描画
  renderLayout() {
    const appEl = document.getElementById('app');
    appEl.innerHTML = `
      <div id="game-viewport">
        <!-- 背景レイヤー -->
        <div id="scene-background"></div>

        <!-- ヘッダーUI (時計・時間帯・設定) -->
        <header id="game-header">
          <div class="header-left">
            <div id="time-badge" class="time-badge hidden">
              <span id="time-icon">🍳</span>
              <span id="time-text">あさごはん の じかん</span>
            </div>
            <div id="day-badge" class="day-badge hidden">1にちめ</div>
          </div>
          <div class="header-right">
            <button id="sound-btn" class="header-btn" title="おとの きりかえ">🔊</button>
            <button id="shop-return-btn" class="header-btn" title="ぺっとしょっぷへ">🏠 ぺっとしょっぷ</button>
            <button id="home-return-btn" class="header-btn home-return-btn hidden" title="おうちへ かえる">🏠 おうちへ かえる</button>
          </div>
        </header>

        <!-- メインステージ (ペット配置エリア) -->
        <main id="game-stage">
          <div id="pet-container"></div>
          <div id="interactive-overlay"></div>
        </main>

        <!-- ガイドメッセージ (吹き出し) -->
        <div id="guide-bubble" class="guide-bubble">
          <span id="guide-text">ぺっとしょっぷへ ようこそ！</span>
        </div>

        <!-- 下部アクションバー (お世話メニュー) -->
        <nav id="action-bar" class="action-bar hidden">
          <button id="act-food" class="act-btn" data-act="food">
            <span class="act-icon">🍽️</span>
            <span class="act-label">ごはん</span>
          </button>
          <button id="act-snack" class="act-btn" data-act="snack">
            <span class="act-icon">🍪</span>
            <span class="act-label">おやつ</span>
          </button>
          <button id="act-ball" class="act-btn" data-act="ball">
            <span class="act-icon">🎾</span>
            <span class="act-label">あそぶ</span>
          </button>
          <button id="act-toilet" class="act-btn" data-act="bathroom">
            <span class="act-icon">🪥</span>
            <span class="act-label">といれ・はみがき</span>
          </button>
          <button id="act-bath" class="act-btn" data-act="bath">
            <span class="act-icon">🛁</span>
            <span class="act-label">おふろ</span>
          </button>
          <button id="act-walk" class="act-btn" data-act="walk">
            <span class="act-icon">🌸</span>
            <span class="act-label">おさんぽ</span>
          </button>
          <button id="act-sleep" class="act-btn" data-act="sleep">
            <span class="act-icon">🛏️</span>
            <span class="act-label">ねんね</span>
          </button>
          <button id="act-next-time" class="act-btn next-btn" data-act="next_time">
            <span class="act-icon">⏩</span>
            <span class="act-label">つぎの じかんへ</span>
          </button>
        </nav>

        <!-- モーダルウィンドウ（名前入力、散歩先選択など） -->
        <div id="modal-layer" class="modal-layer hidden">
          <div id="modal-card" class="modal-card"></div>
        </div>
      </div>
    `;

    this.attachHeaderEvents();
  }

  // ヘッダーボタンイベント
  attachHeaderEvents() {
    const soundBtn = document.getElementById('sound-btn');
    soundBtn.onclick = () => {
      const isMuted = soundSystem.toggleMute();
      soundBtn.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) soundSystem.playClick();
    };

    const shopBtn = document.getElementById('shop-return-btn');
    shopBtn.onclick = () => {
      soundSystem.playClick();
      this.confirmGoToShop();
    };

    const homeBtn = document.getElementById('home-return-btn');
    if (homeBtn) {
      homeBtn.onclick = () => {
        soundSystem.playClick();
        this.changeScene('living');
      };
    }

    // アクションバーのボタンイベント委譲
    const actionBar = document.getElementById('action-bar');
    actionBar.onclick = (e) => {
      const btn = e.target.closest('.act-btn');
      if (!btn) return;
      const act = btn.dataset.act;
      this.handleActionClick(act);
    };
  }

  // 現在の時間情報取得
  getCurrentSchedule() {
    return this.timeSchedule[this.timeIndex];
  }

  // シーンの切り替え
  changeScene(sceneName, params = {}) {
    this.currentScene = sceneName;
    const bgContainer = document.getElementById('scene-background');
    const stage = document.getElementById('game-stage');
    const petContainer = document.getElementById('pet-container');
    const overlay = document.getElementById('interactive-overlay');
    const actionBar = document.getElementById('action-bar');
    const shopBtn = document.getElementById('shop-return-btn');
    const homeBtn = document.getElementById('home-return-btn');
    const timeBadge = document.getElementById('time-badge');
    const dayBadge = document.getElementById('day-badge');

    overlay.innerHTML = ''; // インタラクティブ要素クリア

    // シーンごとの表示制御とペットの位置合わせ
    if (sceneName === 'shop_exterior' || sceneName === 'shop_interior') {
      actionBar.classList.add('hidden');
      shopBtn.classList.add('hidden');
      if (homeBtn) homeBtn.classList.add('hidden');
      if (timeBadge) timeBadge.classList.add('hidden');
      if (dayBadge) dayBadge.classList.add('hidden');
      petContainer.classList.add('hidden');
      petContainer.innerHTML = '';
    } else if (sceneName === 'living') {
      actionBar.classList.remove('hidden');
      shopBtn.classList.remove('hidden');
      if (homeBtn) homeBtn.classList.add('hidden');
      if (timeBadge) timeBadge.classList.remove('hidden');
      if (dayBadge) dayBadge.classList.remove('hidden');
      petContainer.classList.remove('hidden');
      petContainer.style.left = '50%';
      petContainer.style.top = '65%';
      petContainer.style.transform = 'translate(-50%, -50%) scale(1)';
      if (this.pet) {
        this.pet.mount(petContainer);
      }
    } else {
      // リビング以外の部屋・屋外では部屋専用UIに集中させるためアクションバーは隠す
      // 戻るボタンは画面右上の専用ボタンに統一するためヘッダーのhomeBtnはhiddenを維持
      actionBar.classList.add('hidden');
      shopBtn.classList.add('hidden');
      if (homeBtn) homeBtn.classList.add('hidden');
      if (timeBadge) timeBadge.classList.remove('hidden');
      if (dayBadge) dayBadge.classList.remove('hidden');
      petContainer.classList.remove('hidden');

      if (sceneName === 'bath') {
        petContainer.style.left = '64%';
        petContainer.style.top = '72%';
        petContainer.style.transform = 'translate(-50%, -50%) scale(0.85)';
      } else if (sceneName === 'bathroom') {
        petContainer.style.left = '50%';
        petContainer.style.top = '68%';
        petContainer.style.transform = 'translate(-50%, -50%) scale(0.95)';
      } else if (sceneName === 'walk_trail') {
        petContainer.style.left = '50%';
        petContainer.style.top = '68%';
        petContainer.style.transform = 'translate(-50%, -50%) scale(1)';
      } else if (sceneName === 'walk_park') {
        petContainer.style.left = '50%';
        petContainer.style.top = '65%';
        petContainer.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      if (this.pet) {
        this.pet.mount(petContainer);
      }
    }

    const currentSchedule = this.getCurrentSchedule();

    switch (sceneName) {
      case 'shop_exterior':
        bgContainer.innerHTML = SVGAssets.getShopExteriorSVG();
        this.setupShopExteriorScene();
        break;

      case 'shop_interior':
        bgContainer.innerHTML = SVGAssets.getShopInteriorSVG();
        this.setupShopInteriorScene();
        break;

      case 'living':
        bgContainer.innerHTML = SVGAssets.getLivingSVG(currentSchedule.timeOfDay);
        this.setupLivingScene();
        break;

      case 'bathroom':
        bgContainer.innerHTML = SVGAssets.getBathroomSVG();
        this.setupBathroomScene();
        break;

      case 'bath':
        bgContainer.innerHTML = SVGAssets.getBathSVG();
        this.setupBathScene();
        break;

      case 'walk_trail':
        bgContainer.innerHTML = SVGAssets.getWalkTrailSVG(currentSchedule.timeOfDay);
        this.setupWalkTrailScene();
        break;

      case 'walk_park':
        bgContainer.innerHTML = SVGAssets.getWalkParkSVG(currentSchedule.timeOfDay);
        this.setupWalkParkScene();
        break;
    }

    // シーンに合わせた専用BGMの切り替え
    if (sceneName === 'shop_exterior' || sceneName === 'shop_interior') {
      soundSystem.startBGM('shop');
    } else if (sceneName === 'walk_trail' || sceneName === 'walk_park') {
      soundSystem.startBGM('outdoor');
    } else {
      soundSystem.startBGM('living');
    }

    this.updateTimeDisplay();
  }

  // メッセージの更新
  setGuideText(text) {
    const guideEl = document.getElementById('guide-text');
    if (guideEl) {
      guideEl.textContent = text;
    }
  }

  // 時間帯インジケーターとコマンドの更新
  updateTimeDisplay() {
    const sched = this.getCurrentSchedule();
    const timeBadge = document.getElementById('time-badge');
    const iconEl = document.getElementById('time-icon');
    const textEl = document.getElementById('time-text');
    const dayBadge = document.getElementById('day-badge');

    if (iconEl) iconEl.textContent = sched.icon;
    if (textEl) {
      if (sched.phase === 'meal') {
        textEl.textContent = `${sched.name} の じかん`;
      } else if (sched.phase === 'free') {
        textEl.textContent = `${sched.name} （すきなことしよう）`;
      } else {
        textEl.textContent = `${sched.name}`;
      }
    }
    if (dayBadge) {
      dayBadge.textContent = `${this.dayCount} にちめ`;
    }

    // アクションバーのボタン表示・非表示をスケジュールに応じて更新
    this.updateActionBarVisibility();

    // ガイドメッセージの自動更新（ペットを飼っていてリビングにいる時）
    if (!this.pet || this.currentScene !== 'living') {
      return;
    }

    if (sched.phase === 'meal') {
      this.setGuideText(`${sched.name}の じかんだよ！ ごはんを あげてね！`);
    } else if (sched.phase === 'free') {
      this.setGuideText(`じゆうじかんだよ。おさんぽ、あそぶ、おやつ、といれ・はみがき を たのしもう！`);
    } else if (sched.phase === 'night') {
      const allDone = this.nightTasks.toilet && this.nightTasks.teeth && this.nightTasks.bath;
      if (allDone) {
        this.setGuideText(`といれ、はみがき、おふろ がぜんぶ おわったよ！ ねんね しようね！🌙`);
      } else {
        const remaining = [];
        if (!this.nightTasks.toilet) remaining.push('といれ');
        if (!this.nightTasks.teeth) remaining.push('はみがき');
        if (!this.nightTasks.bath) remaining.push('おふろ');
        this.setGuideText(`よるだよ。${remaining.join(' と ')} を すませて ねんね しようね！`);
      }
    }
  }

  // スケジュールに沿ったアクションボタンの表示・非表示およびハイライト制御
  updateActionBarVisibility() {
    const sched = this.getCurrentSchedule();
    const foodBtn = document.getElementById('act-food');
    const snackBtn = document.getElementById('act-snack');
    const ballBtn = document.getElementById('act-ball');
    const toiletBtn = document.getElementById('act-toilet');
    const bathBtn = document.getElementById('act-bath');
    const walkBtn = document.getElementById('act-walk');
    const sleepBtn = document.getElementById('act-sleep');
    const nextBtn = document.getElementById('act-next-time');

    const setVisible = (btn, isVisible) => {
      if (!btn) return;
      if (isVisible) {
        btn.classList.remove('hidden');
      } else {
        btn.classList.add('hidden');
      }
    };

    // クラスのリセット
    [foodBtn, snackBtn, ballBtn, toiletBtn, bathBtn, walkBtn, sleepBtn, nextBtn].forEach(btn => {
      if (btn) {
        btn.classList.remove('act-highlight', 'pulse', 'sleep-ready-pulse');
      }
    });

    if (sched.phase === 'meal') {
      // ごはんの時間:
      // ごはん・つぎのじかんへ は有効、おやつ・おふろ・おさんぽ・ねんね・トイレ・あそぶ は非表示
      setVisible(foodBtn, true);
      setVisible(nextBtn, true);
      setVisible(snackBtn, false);
      setVisible(bathBtn, false);
      setVisible(walkBtn, false);
      setVisible(sleepBtn, false);
      setVisible(toiletBtn, false);
      setVisible(ballBtn, false);

      if (foodBtn) foodBtn.classList.add('act-highlight');
    } else if (sched.phase === 'free') {
      // 自由時間 (午前・午後):
      // トイレと歯磨き・おやつ・あそぶ・おさんぽ・つぎのじかんへ が有効
      // ごはん・おふろ・ねんね は非表示
      setVisible(toiletBtn, true);
      setVisible(snackBtn, true);
      setVisible(ballBtn, true);
      setVisible(walkBtn, true);
      setVisible(nextBtn, true);

      setVisible(foodBtn, false);
      setVisible(bathBtn, false);
      setVisible(sleepBtn, false);

      if (nextBtn) nextBtn.classList.add('pulse');
    } else if (sched.phase === 'night') {
      // 夜のおしたく時間:
      // トイレ・歯磨き と おふろ が有効。
      // ごはん・おやつ・あそぶ・おさんぽ・つぎのじかんへ は非表示
      setVisible(toiletBtn, true);
      setVisible(bathBtn, true);
      setVisible(foodBtn, false);
      setVisible(snackBtn, false);
      setVisible(ballBtn, false);
      setVisible(walkBtn, false);
      setVisible(nextBtn, false);

      // トイレ・歯磨き・お風呂をすべて終わらせると ねんね が有効になる
      const allDone = this.nightTasks.toilet && this.nightTasks.teeth && this.nightTasks.bath;
      if (allDone) {
        setVisible(sleepBtn, true);
        if (sleepBtn) sleepBtn.classList.add('sleep-ready-pulse');
      } else {
        setVisible(sleepBtn, false);
      }
    }
  }

  // 夜のお世話完了チェック
  checkNightTasksCompletion() {
    const sched = this.getCurrentSchedule();
    if (sched.phase === 'night') {
      this.updateActionBarVisibility();
      const allDone = this.nightTasks.toilet && this.nightTasks.teeth && this.nightTasks.bath;
      if (allDone) {
        soundSystem.playJoy();
        if (this.currentScene === 'living') {
          this.setGuideText('といれ、はみがき、おふろ がぜんぶ おわったよ！ ねんね しようね！🌙');
        }
      }
    }
  }

  // ==========================================
  // ① ペットショップ外観シーン
  // ==========================================
  setupShopExteriorScene() {
    this.setGuideText('ぺっとしょっぷに とうちゃく！ ドアを おして なかへ はいろう！');
    const overlay = document.getElementById('interactive-overlay');

    overlay.innerHTML = `
      <div class="shop-enter-btn-wrap">
        <button id="enter-shop-btn" class="big-action-button">
          🚪 なかへ はいる
        </button>
      </div>
    `;

    const enterShop = () => {
      try {
        soundSystem.playDoorbell();
      } catch (e) {
        console.warn('Audio error:', e);
      }
      this.changeScene('shop_interior');
    };

    const enterBtn = document.getElementById('enter-shop-btn');
    if (enterBtn) {
      enterBtn.onclick = (e) => {
        e.stopPropagation();
        enterShop();
      };
      enterBtn.ontouchstart = (e) => {
        e.stopPropagation();
        enterShop();
      };
    }

    // 背景SVGのドアもクリック・タップ可能にする
    const door = document.getElementById('shop-door-rect');
    if (door) {
      door.style.cursor = 'pointer';
      door.onclick = () => enterShop();
    }
  }

  // ==========================================
  // ② ペットショップ店内シーン
  // ==========================================
  setupShopInteriorScene() {
    this.setGuideText('どのこを おうちへ つれてかえる？ タップして えらんでね！');
    const overlay = document.getElementById('interactive-overlay');

    const petTypes = ['rabbit', 'cat', 'dog', 'guinea_pig'];

    let petCardsHTML = petTypes.map(type => `
      <div class="shop-pet-pod" data-type="${type}">
        <div class="shop-pet-svg-wrap">
          ${SVGAssets.getPetSVG(type, 'happy')}
        </div>
        <div class="shop-pet-label">${Pet.getTypeName(type)}</div>
        <button class="select-pet-btn">このこにする！</button>
      </div>
    `).join('');

    overlay.innerHTML = `
      <div class="shop-interior-grid">
        ${petCardsHTML}
      </div>
    `;

    // 各ペットの選択イベント
    overlay.querySelectorAll('.shop-pet-pod').forEach(pod => {
      const type = pod.dataset.type;
      pod.onclick = (e) => {
        soundSystem.playPetVoice(type);
        this.openNameDialog(type);
      };
    });
  }

  // 名前入力ダイアログ (ひらがなソフトウェアキーボードつき)
  openNameDialog(petType) {
    this.selectedPetType = petType;
    const defaultName = Pet.getTypeName(petType);
    this.petNameInput = defaultName;

    const modalLayer = document.getElementById('modal-layer');
    const modalCard = document.getElementById('modal-card');

    // ひらがな50音表 (小さい ゃ ゅ ょ を追加)
    const hiraganaRows = [
      ['あ','い','う','え','お'],
      ['か','き','く','け','こ'],
      ['さ','し','す','せ','そ'],
      ['た','ち','つ','て','と'],
      ['な','に','ぬ','ね','の'],
      ['は','ひ','ふ','へ','ほ'],
      ['ま','み','む','め','も'],
      ['や','ゆ','よ','わ','を'],
      ['ら','り','る','れ','ろ'],
      ['ん','ー','っ','゛','゜'],
      ['ゃ','ゅ','ょ']
    ];

    let keyboardHTML = hiraganaRows.map(row => `
      <div class="keyboard-row">
        ${row.map(char => {
          let extraClass = '';
          if (['ゃ','ゅ','ょ'].includes(char)) extraClass = ' key-small';
          else if (['゛','゜','っ','ー'].includes(char)) extraClass = ' key-symbol';
          return `<button class="key-char${extraClass}" data-char="${char}">${char}</button>`;
        }).join('')}
      </div>
    `).join('');

    modalCard.innerHTML = `
      <div class="name-modal-content">
        <div class="name-modal-pet-preview">
          ${SVGAssets.getPetSVG(petType, 'happy')}
        </div>
        <h2 class="modal-title">おなまえを つけてあげよう！</h2>

        <div class="name-display-box">
          <input type="text" id="pet-name-input-box" class="name-input-field" value="${defaultName}" maxlength="8" readonly />
          <button id="btn-backspace" class="key-action-btn">⌫ けす</button>
        </div>

        <div class="hiragana-keyboard">
          ${keyboardHTML}
        </div>

        <div class="modal-buttons">
          <button id="btn-cancel-select" class="btn-secondary">もどる</button>
          <button id="btn-confirm-name" class="btn-primary">おうちへ いく！ 🎉</button>
        </div>
      </div>
    `;

    modalLayer.classList.remove('hidden');

    const inputEl = document.getElementById('pet-name-input-box');

    // ひらがなキーボード入力
    modalCard.querySelectorAll('.key-char').forEach(btn => {
      btn.onclick = () => {
        soundSystem.playClick();
        const char = btn.dataset.char;
        if (char === '゛') {
          inputEl.value = this.applyDakuten(inputEl.value);
        } else if (char === '゜') {
          inputEl.value = this.applyHandakuten(inputEl.value);
        } else if (['ゃ', 'ゅ', 'ょ'].includes(char)) {
          // 直前の文字が対応する大文字（や・ゆ・よ）なら置き換え、そうでなければ追加
          const lastChar = inputEl.value.slice(-1);
          if ((char === 'ゃ' && lastChar === 'や') ||
              (char === 'ゅ' && lastChar === 'ゆ') ||
              (char === 'ょ' && lastChar === 'よ')) {
            inputEl.value = inputEl.value.slice(0, -1) + char;
          } else if (inputEl.value.length < 8) {
            inputEl.value += char;
          }
        } else {
          if (inputEl.value.length < 8) {
            inputEl.value += char;
          }
        }
      };
    });

    // 1文字消す
    document.getElementById('btn-backspace').onclick = () => {
      soundSystem.playClick();
      inputEl.value = inputEl.value.slice(0, -1);
    };

    // 戻る
    document.getElementById('btn-cancel-select').onclick = () => {
      soundSystem.playClick();
      modalLayer.classList.add('hidden');
    };

    // 決定して家へ連れて帰る
    document.getElementById('btn-confirm-name').onclick = () => {
      const finalName = inputEl.value.trim() || Pet.getTypeName(petType);
      soundSystem.playJoy();
      soundSystem.playPetVoice(petType);

      // ローカルストレージに保存 (遊んでいる間用)
      try {
        localStorage.setItem('pet_current_name', finalName);
        localStorage.setItem('pet_current_type', petType);
      } catch (e) {}

      this.pet = new Pet(petType, finalName);
      modalLayer.classList.add('hidden');

      // リビングへ移動
      this.timeIndex = 0; // あさごはんから
      this.changeScene('living');
      this.setGuideText(`${finalName}が おうちに きたよ！ なでなで してみてね！`);
    };
  }

  // 濁点（゛）変換
  applyDakuten(str) {
    if (!str) return '';
    const lastChar = str.slice(-1);
    const dakuMap = {
      'か':'が','き':'ぎ','く':'ぐ','け':'げ','こ':'ご',
      'さ':'ざ','し':'じ','す':'ず','せ':'ぜ','そ':'ぞ',
      'た':'だ','ち':'ぢ','つ':'づ','て':'で','と':'ど',
      'は':'ば','ひ':'び','ふ':'ぶ','へ':'べ','ほ':'ぼ',
      'う':'ゔ'
    };
    if (dakuMap[lastChar]) {
      return str.slice(0, -1) + dakuMap[lastChar];
    }
    return str;
  }

  // 半濁点（゜）変換
  applyHandakuten(str) {
    if (!str) return '';
    const lastChar = str.slice(-1);
    const handakuMap = {
      'は':'ぱ','ひ':'ぴ','ふ':'ぷ','へ':'ぺ','ほ':'ぽ'
    };
    if (handakuMap[lastChar]) {
      return str.slice(0, -1) + handakuMap[lastChar];
    }
    return str;
  }

  // ペットショップへ戻る確認
  confirmGoToShop() {
    const modalLayer = document.getElementById('modal-layer');
    const modalCard = document.getElementById('modal-card');

    modalCard.innerHTML = `
      <div class="confirm-modal-content">
        <h2 class="modal-title">ぺっとしょっぷへ いく？</h2>
        <p class="modal-desc">べつの ペットを えらびなおす ことができるよ！</p>
        <div class="modal-buttons">
          <button id="btn-stay-home" class="btn-secondary">おうちに いる</button>
          <button id="btn-go-shop" class="btn-primary">しょっぷへ いく</button>
        </div>
      </div>
    `;

    modalLayer.classList.remove('hidden');

    document.getElementById('btn-stay-home').onclick = () => {
      soundSystem.playClick();
      modalLayer.classList.add('hidden');
    };

    document.getElementById('btn-go-shop').onclick = () => {
      soundSystem.playDoorbell();
      modalLayer.classList.add('hidden');
      this.changeScene('shop_interior');
    };
  }

  // ==========================================
  // ③ おうち・リビングシーン
  // ==========================================
  setupLivingScene() {
    const overlay = document.getElementById('interactive-overlay');
    overlay.innerHTML = `
      <!-- お皿トレイ (タップで直接ごはん/おやつを置ける) -->
      <div id="interactive-bowl" class="interactive-bowl" title="おさら"></div>
    `;

    const bowl = document.getElementById('interactive-bowl');
    bowl.onclick = () => {
      const sched = this.getCurrentSchedule();
      if (sched.id.includes('snack')) {
        this.giveSnack();
      } else {
        this.giveFood();
      }
    };
  }

  // アクションバーのボタン処理
  handleActionClick(act) {
    if (!this.pet) return;

    soundSystem.playClick();

    switch (act) {
      case 'food':
        this.giveFood();
        break;
      case 'snack':
        this.giveSnack();
        break;
      case 'ball':
        this.playBallGame();
        break;
      case 'bathroom':
        this.changeScene('bathroom');
        break;
      case 'bath':
        this.changeScene('bath');
        break;
      case 'walk':
        this.openWalkSelectionModal();
        break;
      case 'sleep':
        this.handleSleepAction();
        break;
      case 'next_time':
        this.advanceTimeToNext();
        break;
    }
  }

  // ごはんをあげる
  giveFood() {
    if (this.pet.isEating) return;

    // リビングでなければリビングへ戻る
    if (this.currentScene !== 'living') {
      this.changeScene('living');
    }

    const foodName = Pet.getFoodName(this.pet.type);
    const overlay = document.getElementById('interactive-overlay');

    // ごはんの演出（アニメーションでペットの前に出現）
    const foodEl = document.createElement('div');
    foodEl.className = 'food-fly-item';
    foodEl.innerHTML = SVGAssets.getFoodSVG(this.pet.type);
    overlay.appendChild(foodEl);

    this.setGuideText(`${this.pet.name}に ${foodName}を あげたよ！ もぐもぐ…`);

    // ペットの食べるアクション
    this.pet.eatAction(() => {
      if (foodEl.parentNode) foodEl.parentNode.removeChild(foodEl);
      this.setGuideText(`${foodName}、おいしかったね！ ごちそうさまでした！`);

      // 食事時間であれば自動的に次の自由時間・夜へ進める
      const sched = this.getCurrentSchedule();
      if (sched.phase === 'meal') {
        setTimeout(() => {
          this.advanceTimeToNext();
        }, 1200);
      }
    });
  }

  // おやつをあげる (自由時間の一部としていつでも楽しめる)
  giveSnack() {
    if (this.pet.isEating) return;

    if (this.currentScene !== 'living') {
      this.changeScene('living');
    }

    const snackName = Pet.getSnackName(this.pet.type);
    const overlay = document.getElementById('interactive-overlay');

    const snackEl = document.createElement('div');
    snackEl.className = 'food-fly-item';
    snackEl.innerHTML = SVGAssets.getSnackSVG(this.pet.type);
    overlay.appendChild(snackEl);

    this.setGuideText(`${this.pet.name}に ${snackName}を あげたよ！ パクッ！`);

    this.pet.eatAction(() => {
      if (snackEl.parentNode) snackEl.parentNode.removeChild(snackEl);
      this.setGuideText(`${snackName}、とっても おいしかったね！`);
      // おやつは自由時間内なので自動進行はせず、好きなだけ遊べる
    });
  }

  // ボール遊び (リビングまたは公園)
  playBallGame() {
    if (this.pet.isMoving || this.pet.isEating) return;

    // リビングでも公園でもなければ公園へ移動して遊べる
    if (this.currentScene !== 'living' && this.currentScene !== 'walk_park') {
      this.changeScene('living');
    }

    this.setGuideText('ボールを タップして なげてね！');
    const overlay = document.getElementById('interactive-overlay');

    // すでにボールがあれば位置を戻す、なければ新規追加
    let ball = document.getElementById('play-ball');
    if (!ball) {
      ball = document.createElement('div');
      ball.id = 'play-ball';
      ball.className = 'throwable-ball';
      ball.innerHTML = SVGAssets.getBallSVG();
      overlay.appendChild(ball);
    } else {
      ball.style.display = '';
      ball.style.transition = '';
      ball.style.left = '50%';
      ball.style.top = '72%';
      ball.style.transform = 'translate(-50%, -50%)';
    }

    ball.onclick = (e) => {
      e.stopPropagation();
      this.throwBall();
    };
  }

  // ボールを投げてペットが拾うアクション
  throwBall() {
    if (this.pet.isMoving || this.pet.isEating) return;

    const ball = document.getElementById('play-ball');
    if (!ball) return;

    soundSystem.playBallBounce();

    // ボールがポンと遠くへ飛ぶ
    const targetX = Math.random() > 0.5 ? 75 : 25;
    const targetY = 55;

    ball.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    ball.style.left = `${targetX}%`;
    ball.style.top = `${targetY}%`;
    ball.style.transform = 'scale(0.8) rotate(360deg)';

    this.setGuideText(`${this.pet.name}が ボールを とりにいくよ！`);

    // ペットがダッシュしてボールを拾いに行く
    setTimeout(() => {
      this.pet.fetchBall(targetX, targetY, () => {
        this.setGuideText('ナイスキャッチ！ ボールを もってきてくれたよ！ もういっかい なげてね！');
        // ボールをペットの足元にポンと戻して、何度でも続けて投げられるようにする！
        ball.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        ball.style.left = '50%';
        ball.style.top = '72%';
        ball.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    }, 500);
  }

  // ==========================================
  // ④ せんめんじょ ＆ といれシーン
  // ==========================================
  setupBathroomScene() {
    this.setGuideText('といれ と てあらい・はみがき の おへや だよ！');
    const overlay = document.getElementById('interactive-overlay');

    overlay.innerHTML = `
      <!-- トイレ操作ボタン/エリア -->
      <div id="btn-do-toilet" class="bathroom-hotspot" style="left: 17%; top: 48%; width: 140px; height: 140px;">
        <div class="hotspot-bubble">🚽 といれ</div>
      </div>

      <!-- 手洗い操作ボタン/エリア -->
      <div id="btn-do-wash" class="bathroom-hotspot" style="left: 72%; top: 38%; width: 120px; height: 120px;">
        <div class="hotspot-bubble">🧼 てあらい</div>
      </div>

      <!-- 歯磨き操作ボタン/エリア -->
      <div id="btn-do-brush" class="bathroom-hotspot" style="left: 56%; top: 38%; width: 120px; height: 120px;">
        <div class="hotspot-bubble">🪥 はみがき</div>
      </div>

      <!-- おうちへ戻るボタン -->
      <button id="btn-leave-bathroom" class="leave-room-btn">
        🏠 おへやへ もどる
      </button>
    `;

    document.getElementById('btn-leave-bathroom').onclick = () => {
      soundSystem.playClick();
      this.changeScene('living');
    };

    // トイレをする
    document.getElementById('btn-do-toilet').onclick = () => {
      this.actionToilet();
    };

    // 手洗いをする
    document.getElementById('btn-do-wash').onclick = () => {
      this.actionWashHands();
    };

    // 歯磨きをする
    document.getElementById('btn-do-brush').onclick = () => {
      this.actionBrushTeeth();
    };
  }

  // トイレアクション
  actionToilet() {
    soundSystem.playClick();
    const petContainer = document.getElementById('pet-container');
    if (petContainer) {
      petContainer.style.transition = 'all 0.5s ease-in-out';
      petContainer.style.left = '24%';
      petContainer.style.top = '65%';
      petContainer.style.transform = 'translate(-50%, -50%) scale(0.85)';
    }

    this.pet.setExpression('happy');
    this.setGuideText(`${this.pet.name}が トイレに すわったよ。…すっきり！`);

    // トイレの水を流す
    setTimeout(() => {
      soundSystem.playWater(1.2);
      this.setGuideText('じゃーー！ みずを ながしたよ。つぎは てあらいを しようね！');
      this.pet.spawnEffect('sparkle');
      this.hasUsedToilet = true;
      this.nightTasks.toilet = true;
      this.checkNightTasksCompletion();
    }, 1000);
  }

  // 手洗いアクション
  actionWashHands() {
    soundSystem.playSoap();
    const petContainer = document.getElementById('pet-container');
    if (petContainer) {
      petContainer.style.transition = 'all 0.5s ease-in-out';
      petContainer.style.left = '72%';
      petContainer.style.top = '68%';
      petContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }

    this.setGuideText('せっけんを あわあわ〜！ ごしごし！');

    setTimeout(() => {
      soundSystem.playWater(0.9);
      this.pet.spawnEffect('clean');
      this.pet.spawnEffect('sparkle');
      this.pet.setExpression('happy', 1500);
      soundSystem.playJoy();
      this.setGuideText('みずで ながして、てが ぴっかぴか！ きもちいいね！');
      this.hasWashedHands = true;
    }, 1200);
  }

  // 歯磨きアクション
  actionBrushTeeth() {
    soundSystem.playBrush();
    const petContainer = document.getElementById('pet-container');
    if (petContainer) {
      petContainer.style.transition = 'all 0.5s ease-in-out';
      petContainer.style.left = '64%';
      petContainer.style.top = '68%';
      petContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }

    this.setGuideText('はブラシで しゃかしゃか はみがき！');

    setTimeout(() => {
      soundSystem.playDrink();
      this.setGuideText('ぶくぶく ぺー！ うがいを して ぴっかぴか！');
      this.pet.spawnEffect('sparkle');
      soundSystem.playJoy();
      this.pet.setExpression('happy', 1500);
      this.hasBrushedTeeth = true;
      this.nightTasks.teeth = true;
      this.checkNightTasksCompletion();
    }, 1200);
  }

  // ==========================================
  // ⑤ おふろシーン
  // ==========================================
  setupBathScene() {
    this.setGuideText('おふろば だよ！ シャンプー で あわあわ に して、シャワー で ながそう！');
    const overlay = document.getElementById('interactive-overlay');

    overlay.innerHTML = `
      <div class="bath-controls">
        <button id="btn-bath-shampoo" class="tool-btn">
          ${SVGAssets.getSoapItemSVG()}
          <span>あわあわ</span>
        </button>
        <button id="btn-bath-shower" class="tool-btn">
          ${SVGAssets.getShowerHeadSVG()}
          <span>シャワー</span>
        </button>
        <button id="btn-bath-dryer" class="tool-btn">
          ${SVGAssets.getDryerSVG()}
          <span>ドライヤー</span>
        </button>
      </div>

      <button id="btn-leave-bath" class="leave-room-btn">
        🏠 おへやへ もどる
      </button>
    `;

    document.getElementById('btn-leave-bath').onclick = () => {
      soundSystem.playClick();
      this.changeScene('living');
      this.nightTasks.bath = true;
      this.checkNightTasksCompletion();
    };

    // シャンプー泡立て
    document.getElementById('btn-bath-shampoo').onclick = () => {
      soundSystem.playSoap();
      this.pet.spawnEffect('clean');
      this.setGuideText('もこもこ あわあわ シャンプー！');
      this.nightTasks.bath = true;
      this.checkNightTasksCompletion();
    };

    // シャワーで流す
    document.getElementById('btn-bath-shower').onclick = () => {
      soundSystem.playWater(1.2);
      this.pet.spawnEffect('clean');
      this.pet.setExpression('happy', 1500);
      soundSystem.playJoy();
      this.setGuideText('シャワー で ざーー！ あわが ながれて さっぱり！');
      this.nightTasks.bath = true;
      this.checkNightTasksCompletion();
    };

    // ドライヤーで乾かす
    document.getElementById('btn-bath-dryer').onclick = () => {
      soundSystem.playClick();
      this.pet.spawnEffect('sparkle');
      this.pet.setExpression('happy', 1800);
      soundSystem.playJoy();
      this.setGuideText('ドライヤー で ぶぉーん！ けが ふわふわ に なったよ！');
      this.nightTasks.bath = true;
      this.checkNightTasksCompletion();
    };
  }

  // ==========================================
  // ⑥ お散歩（行き先選択＆散歩道・公園）
  // ==========================================
  openWalkSelectionModal() {
    const modalLayer = document.getElementById('modal-layer');
    const modalCard = document.getElementById('modal-card');

    modalCard.innerHTML = `
      <div class="walk-modal-content">
        <h2 class="modal-title">どこへ おさんぽ に いく？</h2>
        <div class="walk-options-grid">
          <div class="walk-option-card" id="choose-trail">
            <div class="walk-thumb">🌳🌸</div>
            <div class="walk-label">おさんぽ コース</div>
            <p class="walk-desc">おはな や ちょうちょ を みつけにいこう！</p>
          </div>
          <div class="walk-option-card" id="choose-park">
            <div class="walk-thumb">🛝⛲</div>
            <div class="walk-label">こうえん</div>
            <p class="walk-desc">すべりだい や ひろば で あそぼう！</p>
          </div>
        </div>
        <div class="modal-buttons">
          <button id="btn-cancel-walk" class="btn-secondary">やめる</button>
        </div>
      </div>
    `;

    modalLayer.classList.remove('hidden');

    document.getElementById('btn-cancel-walk').onclick = () => {
      soundSystem.playClick();
      modalLayer.classList.add('hidden');
    };

    document.getElementById('choose-trail').onclick = () => {
      soundSystem.playClick();
      modalLayer.classList.add('hidden');
      this.changeScene('walk_trail');
    };

    document.getElementById('choose-park').onclick = () => {
      soundSystem.playClick();
      modalLayer.classList.add('hidden');
      this.changeScene('walk_park');
    };
  }

  // お散歩道シーンのセットアップ (歩行アクション＆発見オブジェクト)
  setupWalkTrailScene() {
    this.setGuideText('おさんぽみち を てくてく あるこう！ なにか みつかるかな？');
    const overlay = document.getElementById('interactive-overlay');

    overlay.innerHTML = `
      <!-- 右上の戻るボタン -->
      <button id="btn-leave-walk" class="leave-room-btn">
        🏠 おうちへ かえる
      </button>

      <!-- 下部のお散歩操作バー -->
      <div class="walk-bottom-nav">
        <button id="btn-walk-step" class="btn-walk-step">
          <span>🐾</span>
          <span>てくてく あるく</span>
        </button>
      </div>

      <!-- 発見オブジェクトのタップ誘導バッジ -->
      <div id="badge-obj-butterfly" class="trail-obj-badge" style="left: 63%; top: 40%;">🦋 ちょうちょ</div>
      <div id="badge-obj-flower" class="trail-obj-badge" style="left: 24%; top: 70%;">🌸 おはな</div>
      <div id="badge-obj-clover" class="trail-obj-badge" style="left: 70%; top: 75%;">🍀 クローバー</div>
      <div id="badge-obj-acorn" class="trail-obj-badge" style="left: 83%; top: 56%;">🌰 どんぐり</div>
      <div id="badge-obj-bird" class="trail-obj-badge" style="left: 10%; top: 25%;">🐦 ことり</div>
    `;

    document.getElementById('btn-leave-walk').onclick = () => {
      soundSystem.playClick();
      this.changeScene('living');
    };

    // 「てくてく あるく」アクション
    const walkBtn = document.getElementById('btn-walk-step');
    if (walkBtn) {
      walkBtn.onclick = () => {
        this.actionWalkStep();
      };
    }

    // 各オブジェクトのクリックイベント登録 (バッジとSVG要素両方に対応)
    this.attachTrailObjectEvents();
  }

  // お散歩でてくてく歩くアクション（道が動き、足音が鳴る）
  actionWalkStep() {
    if (this.pet.isMoving) return;
    this.pet.isMoving = true;

    soundSystem.playStep();
    const petContainer = document.getElementById('pet-container');
    const wrapper = petContainer ? petContainer.querySelector('.pet-wrapper') : null;

    if (wrapper) wrapper.classList.add('pet-running');
    this.pet.setExpression('happy');
    this.setGuideText('てくてく、てくてく… たのしい おさんぽ！');

    // 背景SVGの小道・木々・草花グループをスクロールアニメーション
    const movingWorld = document.getElementById('trail-moving-world');
    if (movingWorld) {
      movingWorld.classList.remove('trail-scroll-anim');
      void movingWorld.offsetWidth; // リフロー
      movingWorld.classList.add('trail-scroll-anim');
    }

    // 2歩目の足音
    setTimeout(() => {
      soundSystem.playStep();
    }, 400);

    // 0.8秒後に歩行停止、発見のワクワク演出
    setTimeout(() => {
      if (wrapper) wrapper.classList.remove('pet-running');
      this.pet.isMoving = false;

      const hints = [
        'ちょうちょ が ひらひら とんでるよ！ タップしてみてね！',
        'きれいな おはな が さいているよ！ タップしてみてね！',
        'よつばの クローバー が あるかも！ さがしてみてね！',
        'ころころ どんぐり が おちているよ！ タップしてみてね！',
        'ちゅんちゅん！ きのうえ に ことり さん が いるよ！'
      ];
      const randomHint = hints[Math.floor(Math.random() * hints.length)];
      this.setGuideText(`てくてく あるいたよ！ ${randomHint}`);
    }, 850);
  }

  // お散歩コースの発見オブジェクトイベント登録
  attachTrailObjectEvents() {
    // 1. ちょうちょ
    const onButterfly = () => {
      soundSystem.playJoy();
      soundSystem.playPetVoice(this.pet.type);
      this.pet.setExpression('happy', 2000);
      this.pet.spawnEffect('heart');
      this.pet.spawnEffect('sparkle');
      const wrapper = document.querySelector('#pet-container .pet-wrapper');
      if (wrapper) {
        wrapper.classList.remove('pet-jump');
        void wrapper.offsetWidth;
        wrapper.classList.add('pet-jump');
      }
      this.setGuideText('ちょうちょ を みつけたね！ ひらひら とんで かわいいね！');
    };
    const bBadge = document.getElementById('badge-obj-butterfly');
    const bSvg = document.getElementById('trail-obj-butterfly');
    if (bBadge) bBadge.onclick = onButterfly;
    if (bSvg) bSvg.onclick = onButterfly;

    // 2. おはな
    const onFlower = () => {
      soundSystem.playClick();
      soundSystem.playPetVoice(this.pet.type);
      this.pet.setExpression('happy', 2000);
      this.pet.spawnEffect('sparkle');
      this.pet.spawnEffect('heart');
      this.setGuideText('きれいな おはな を みつけたよ！ いいにおいが するね！');
    };
    const fBadge = document.getElementById('badge-obj-flower');
    const fSvg = document.getElementById('trail-obj-flower');
    if (fBadge) fBadge.onclick = onFlower;
    if (fSvg) fSvg.onclick = onFlower;

    // 3. クローバー
    const onClover = () => {
      soundSystem.playJoy();
      this.pet.setExpression('happy', 2000);
      this.pet.spawnEffect('sparkle');
      this.pet.spawnEffect('sparkle');
      this.setGuideText('あっ！ よつばの クローバー だ！ いいこと ありそうだね！🍀');
    };
    const cBadge = document.getElementById('badge-obj-clover');
    const cSvg = document.getElementById('trail-obj-clover');
    if (cBadge) cBadge.onclick = onClover;
    if (cSvg) cSvg.onclick = onClover;

    // 4. どんぐり
    const onAcorn = () => {
      soundSystem.playClick();
      this.pet.setExpression('happy', 1500);
      this.pet.spawnEffect('note');
      this.setGuideText('ころころ どんぐり を みつけたよ！ まあるくて かわいいね！🌰');
    };
    const aBadge = document.getElementById('badge-obj-acorn');
    const aSvg = document.getElementById('trail-obj-acorn');
    if (aBadge) aBadge.onclick = onAcorn;
    if (aSvg) aSvg.onclick = onAcorn;

    // 5. ことり
    const onBird = () => {
      soundSystem.playMorningBirds();
      soundSystem.playPetVoice(this.pet.type);
      this.pet.setExpression('happy', 2000);
      this.pet.spawnEffect('note');
      this.pet.spawnEffect('heart');
      this.setGuideText('ちゅんちゅん！ かわいい ことり さんが ごあいさつ してくれたよ！🐦');
    };
    const birdBadge = document.getElementById('badge-obj-bird');
    const birdSvg = document.getElementById('trail-obj-bird');
    if (birdBadge) birdBadge.onclick = onBird;
    if (birdSvg) birdSvg.onclick = onBird;
  }

  // 公園シーンのセットアップ
  setupWalkParkScene() {
    this.setGuideText('こうえん に ついたよ！ ボール や すべりだい で あそぼう！');
    const overlay = document.getElementById('interactive-overlay');

    overlay.innerHTML = `
      <!-- 右上の戻るボタン -->
      <button id="btn-leave-park" class="leave-room-btn">
        🏠 おうちへ かえる
      </button>

      <!-- すべり台タップホットスポット -->
      <div id="slide-hotspot" class="slide-touch-area" title="すべりだい">
        <div class="hotspot-bubble slide-bubble">🛝 すべりだい</div>
      </div>

      <!-- 最初から描画するボール -->
      <div id="play-ball" class="throwable-ball" title="ボール">
        ${SVGAssets.getBallSVG()}
      </div>
    `;

    // ボールをクリックして遊ぶ
    const ball = document.getElementById('play-ball');
    if (ball) {
      ball.onclick = (e) => {
        e.stopPropagation();
        this.throwBall();
      };
    }

    // すべり台ホットスポットをクリックして遊ぶ
    const slideHotspot = document.getElementById('slide-hotspot');
    if (slideHotspot) {
      slideHotspot.onclick = () => {
        this.playSlideGame();
      };
    }

    // 右上の戻るボタンでおうちへ帰る
    document.getElementById('btn-leave-park').onclick = () => {
      soundSystem.playClick();
      this.changeScene('living');
    };
  }

  // すべり台で遊ぶアクション（座標調整済み）
  playSlideGame() {
    if (this.pet.isMoving || this.pet.isEating) return;

    // もしボールが出ていれば一時的に隠す
    const ball = document.getElementById('play-ball');
    if (ball) ball.style.display = 'none';

    this.pet.isMoving = true;
    const petContainer = document.getElementById('pet-container');
    const wrapper = petContainer.querySelector('.pet-wrapper');

    this.setGuideText(`${this.pet.name}が すべりだい を のぼるよ！ トントン…`);
    if (wrapper) wrapper.classList.add('pet-running');

    // 1. 階段のふもとへ移動
    petContainer.style.transition = 'all 0.6s ease-in-out';
    petContainer.style.left = '16%';
    petContainer.style.top = '70%';
    petContainer.style.transform = 'translate(-50%, -50%) scale(0.85)';

    // 2. 階段をトントントンと登る
    setTimeout(() => {
      soundSystem.playStep();
      petContainer.style.transition = 'all 0.4s ease-out';
      petContainer.style.top = '50%';

      setTimeout(() => {
        soundSystem.playStep();
        // てっぺん（高さを少し高く調整: 36% -> 30%）
        petContainer.style.top = '30%';

        // 3. てっぺんで大喜び
        setTimeout(() => {
          if (wrapper) wrapper.classList.remove('pet-running');
          this.pet.setExpression('happy');
          soundSystem.playPetVoice(this.pet.type);
          this.pet.spawnEffect('heart');
          this.setGuideText('てっぺんに とうちゃく！ いくよーー！');

          // 4. スロープをシューーッと滑り降りる
          setTimeout(() => {
            soundSystem.playSlideDown();
            this.setGuideText('しゅーーーーっ！');

            // すべり台のカーブに沿って滑走（着地高さを少し高く調整: 72% -> 62%でレールの上にしっかり乗る）
            petContainer.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            petContainer.style.left = '36%';
            petContainer.style.top = '62%';
            petContainer.style.transform = 'translate(-50%, -50%) scale(1) rotate(10deg)';

            // 5. 着地！
            setTimeout(() => {
              petContainer.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
              soundSystem.playJoy();
              this.pet.setExpression('happy', 2000);
              this.pet.spawnEffect('sparkle');
              this.pet.spawnEffect('note');
              if (wrapper) {
                wrapper.classList.remove('pet-jump');
                void wrapper.offsetWidth;
                wrapper.classList.add('pet-jump');
              }
              this.setGuideText('すべりだい、たのしかったね！ もういっかい すべる？');

              // 6. 芝生の中央に戻る
              setTimeout(() => {
                petContainer.style.transition = 'all 0.6s ease-in-out';
                petContainer.style.left = '50%';
                petContainer.style.top = '65%';
                this.pet.isMoving = false;

                // ボールを再表示（いつでも続けて遊べるように）
                const currentBall = document.getElementById('play-ball');
                if (currentBall) {
                  currentBall.style.display = '';
                  currentBall.style.transition = '';
                  currentBall.style.left = '50%';
                  currentBall.style.top = '72%';
                  currentBall.style.transform = 'translate(-50%, -50%)';
                }
              }, 1000);
            }, 750);
          }, 600);
        }, 450);
      }, 400);
    }, 650);
  }

  // ==========================================
  // ⑦ ねんね（夜のおしたく完了＆就寝）
  // ==========================================
  handleSleepAction() {
    const allDone = this.nightTasks.toilet && this.nightTasks.teeth && this.nightTasks.bath;

    // トイレ、歯磨き、お風呂が未完了の場合は案内
    if (!allDone) {
      const modalLayer = document.getElementById('modal-layer');
      const modalCard = document.getElementById('modal-card');

      const remaining = [];
      if (!this.nightTasks.toilet) remaining.push('🚽 といれ');
      if (!this.nightTasks.teeth) remaining.push('🪥 はみがき');
      if (!this.nightTasks.bath) remaining.push('🛁 おふろ');

      modalCard.innerHTML = `
        <div class="confirm-modal-content">
          <h2 class="modal-title">ねんねの まえの おしたく</h2>
          <p class="modal-desc">まだ ${remaining.join(' と ')} が おわっていないよ！<br>すませてから ねんね しようね！</p>
          <div class="modal-buttons">
            <button id="btn-stay-prep" class="btn-primary">おしたく する！</button>
            <button id="btn-force-sleep" class="btn-secondary">そのまま ねんねする</button>
          </div>
        </div>
      `;

      modalLayer.classList.remove('hidden');

      document.getElementById('btn-stay-prep').onclick = () => {
        soundSystem.playClick();
        modalLayer.classList.add('hidden');
      };

      document.getElementById('btn-force-sleep').onclick = () => {
        soundSystem.playClick();
        modalLayer.classList.add('hidden');
        this.executeSleep();
      };
      return;
    }

    this.executeSleep();
  }

  // 就寝演出と新しい朝へのループ
  executeSleep() {
    if (this.currentScene !== 'living') {
      this.changeScene('living');
    }

    this.setGuideText(`${this.pet.name}が ベッドに はいったよ。おやすみなさい…💤`);
    soundSystem.stopBGM(); // おやすみ中はBGMを停止してオルゴールを際立たせる
    this.pet.sleepAction();
    soundSystem.playLullaby();

    // 画面を暗転（おやすみ演出）
    const viewport = document.getElementById('game-viewport');
    const sleepCover = document.createElement('div');
    sleepCover.className = 'night-dark-cover';
    sleepCover.innerHTML = `
      <div class="sleep-dialog-text">
        <div class="moon-icon">🌙</div>
        <div>すやすや… おやすみなさい</div>
      </div>
    `;
    viewport.appendChild(sleepCover);

    // 3.8秒後に新しい朝がやってくる
    setTimeout(() => {
      this.dayCount++;
      this.timeIndex = 0; // あさごはんへリセット
      this.hasBrushedTeeth = false;
      this.hasWashedHands = false;
      this.hasUsedToilet = false;
      this.nightTasks = { toilet: false, teeth: false, bath: false };

      if (sleepCover.parentNode) {
        sleepCover.parentNode.removeChild(sleepCover);
      }

      this.changeScene('living');
      this.pet.wakeAction();
      this.setGuideText(`あさになったよ！ おはよう！ ${this.dayCount}にちめ の あさごはんだよ！`);
    }, 3800);
  }

  // 時間を次へ進める（定時または自由時間）
  advanceTimeToNext() {
    soundSystem.playClick();

    if (this.timeIndex >= this.timeSchedule.length - 1) {
      // 最後の夜なら就寝処理へ
      this.handleSleepAction();
      return;
    }

    this.timeIndex++;
    // リビングを表示して時間帯とボタンを反映
    this.changeScene('living');
  }
}

// ゲーム起動
window.addEventListener('DOMContentLoaded', () => {
  const game = new GameApp();
  window.gameApp = game;
  game.init();
});
