/**
 * ペットしいくゲーム - メインゲームコントローラー (GameApp)
 * シーン管理、タイムサイクル、お世話インタラクション、ローカルストレージを制御
 */

class GameApp {
  constructor() {
    this.currentScene = 'shop_exterior'; // 'shop_exterior' | 'shop_interior' | 'living' | 'bathroom' | 'bath' | 'walk_trail' | 'walk_park'
    this.pet = null;

    // 時間帯サイクル (非リアルタイム・イベント進行)
    // 0: あさごはん, 1: じゆうじかん(あさ), 2: おやつ(あさ), 3: じゆうじかん(ひるまえ),
    // 4: ひるごはん, 5: じゆうじかん(ひる), 6: おやつ(ひる), 7: じゆうじかん(ゆうがた),
    // 8: ゆうごはん, 9: じゆうじかん(よる), 10: ねんね
    this.timeSchedule = [
      { id: 'breakfast', name: 'あさごはん', type: 'scheduled', timeOfDay: 'morning', icon: '🍳' },
      { id: 'free_morning', name: 'じゆうじかん', type: 'free', timeOfDay: 'morning', icon: '🎈' },
      { id: 'snack_morning', name: 'おやつ', type: 'scheduled', timeOfDay: 'morning', icon: '🍪' },
      { id: 'free_before_noon', name: 'じゆうじかん', type: 'free', timeOfDay: 'noon', icon: '🎈' },
      { id: 'lunch', name: 'ひるごはん', type: 'scheduled', timeOfDay: 'noon', icon: '🍱' },
      { id: 'free_noon', name: 'じゆうじかん', type: 'free', timeOfDay: 'noon', icon: '🎈' },
      { id: 'snack_afternoon', name: 'おやつ', type: 'scheduled', timeOfDay: 'noon', icon: '🍪' },
      { id: 'free_evening', name: 'じゆうじかん', type: 'free', timeOfDay: 'evening', icon: '🎈' },
      { id: 'dinner', name: 'ゆうごはん', type: 'scheduled', timeOfDay: 'evening', icon: '🍲' },
      { id: 'free_night', name: 'じゆうじかん', type: 'free', timeOfDay: 'night', icon: '🎈' },
      { id: 'sleep', name: 'ねんね', type: 'scheduled', timeOfDay: 'night', icon: '🌙' }
    ];

    this.timeIndex = 0; // あさごはんから開始
    this.dayCount = 1;

    // お世話ステート
    this.hasBrushedTeeth = false;
    this.hasWashedHands = false;
    this.hasUsedToilet = false;
    this.bathStep = 0; // 0: なし, 1: あわあわ, 2: シャワー, 3: ふわふわかんせい

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
            <div id="time-badge" class="time-badge">
              <span id="time-icon">🍳</span>
              <span id="time-text">あさごはん の じかん</span>
            </div>
            <div id="day-badge" class="day-badge">1にちめ</div>
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

    overlay.innerHTML = ''; // インタラクティブ要素クリア

    // シーンごとの表示制御とペットの位置合わせ
    if (sceneName === 'shop_exterior' || sceneName === 'shop_interior') {
      actionBar.classList.add('hidden');
      shopBtn.classList.add('hidden');
      if (homeBtn) homeBtn.classList.add('hidden');
      petContainer.classList.add('hidden');
      petContainer.innerHTML = '';
    } else if (sceneName === 'living') {
      actionBar.classList.remove('hidden');
      shopBtn.classList.remove('hidden');
      if (homeBtn) homeBtn.classList.add('hidden');
      petContainer.classList.remove('hidden');
      petContainer.style.left = '50%';
      petContainer.style.top = '65%';
      petContainer.style.transform = 'translate(-50%, -50%) scale(1)';
      if (this.pet) {
        this.pet.mount(petContainer);
      }
    } else {
      // リビング以外の部屋では部屋専用UIに集中させるためアクションバーは隠し、おうちへかえるボタンを表示
      actionBar.classList.add('hidden');
      shopBtn.classList.add('hidden');
      if (homeBtn) homeBtn.classList.remove('hidden');
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
        bgContainer.innerHTML = SVGAssets.getWalkTrailSVG();
        this.setupWalkTrailScene();
        break;

      case 'walk_park':
        bgContainer.innerHTML = SVGAssets.getWalkParkSVG();
        this.setupWalkParkScene();
        break;
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

  // 時間帯インジケーターの更新
  updateTimeDisplay() {
    const sched = this.getCurrentSchedule();
    const timeBadge = document.getElementById('time-badge');
    const iconEl = document.getElementById('time-icon');
    const textEl = document.getElementById('time-text');
    const dayBadge = document.getElementById('day-badge');

    if (iconEl) iconEl.textContent = sched.icon;
    if (textEl) {
      if (sched.type === 'scheduled') {
        textEl.textContent = `${sched.name} の じかん`;
      } else {
        textEl.textContent = `${sched.name} （すきなことしよう）`;
      }
    }
    if (dayBadge) {
      dayBadge.textContent = `${this.dayCount} にちめ`;
    }

    // 「つぎの じかんへ」ボタンの強調
    const nextBtn = document.getElementById('act-next-time');
    if (nextBtn) {
      if (sched.type === 'free') {
        nextBtn.classList.add('pulse');
      } else {
        nextBtn.classList.remove('pulse');
      }
    }

    // ボタンのハイライト（いま定時イベントならそのボタンを強調）
    this.updateActionButtonsHighlight();
  }

  // 定時イベントに対応するアクションボタンのハイライト
  updateActionButtonsHighlight() {
    const sched = this.getCurrentSchedule();
    const foodBtn = document.getElementById('act-food');
    const snackBtn = document.getElementById('act-snack');
    const sleepBtn = document.getElementById('act-sleep');

    [foodBtn, snackBtn, sleepBtn].forEach(btn => btn && btn.classList.remove('act-highlight'));

    if (sched.id === 'breakfast' || sched.id === 'lunch' || sched.id === 'dinner') {
      if (foodBtn) foodBtn.classList.add('act-highlight');
      this.setGuideText(`${sched.name}の じかんだよ！ ごはんを あげてね！`);
    } else if (sched.id === 'snack_morning' || sched.id === 'snack_afternoon') {
      if (snackBtn) snackBtn.classList.add('act-highlight');
      this.setGuideText(`おやつの じかんだよ！ おいしい おやつを あげてね！`);
    } else if (sched.id === 'sleep') {
      if (sleepBtn) sleepBtn.classList.add('act-highlight');
      this.setGuideText(`よるだよ。はみがきをして、ねんね しようね！`);
    } else {
      this.setGuideText(`じゆうじかんだよ。おさんぽ や ボールあそび を しよう！`);
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

      // もし現在が「あさごはん」「ひるごはん」「ゆうごはん」の定時イベントなら次へ進める
      const sched = this.getCurrentSchedule();
      if (sched.id === 'breakfast' || sched.id === 'lunch' || sched.id === 'dinner') {
        setTimeout(() => {
          this.advanceTimeToNext();
        }, 1200);
      }
    });
  }

  // おやつをあげる
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

      const sched = this.getCurrentSchedule();
      if (sched.id === 'snack_morning' || sched.id === 'snack_afternoon') {
        setTimeout(() => {
          this.advanceTimeToNext();
        }, 1200);
      }
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
      ball.style.transition = '';
      ball.style.left = '50%';
      ball.style.top = '72%';
      ball.style.transform = 'translate(-50%, -50%)';
    }

    ball.onclick = (e) => {
      e.stopPropagation();
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
          this.setGuideText('ナイスキャッチ！ ボールを もってきてくれたよ！');
          if (ball.parentNode) ball.parentNode.removeChild(ball);
        });
      }, 500);
    };
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
    };

    // シャンプー泡立て
    document.getElementById('btn-bath-shampoo').onclick = () => {
      soundSystem.playSoap();
      this.pet.spawnEffect('clean');
      this.setGuideText('もこもこ あわあわ シャンプー！');
    };

    // シャワーで流す
    document.getElementById('btn-bath-shower').onclick = () => {
      soundSystem.playWater(1.2);
      this.pet.spawnEffect('clean');
      this.pet.setExpression('happy', 1500);
      soundSystem.playJoy();
      this.setGuideText('シャワー で ざーー！ あわが ながれて さっぱり！');
    };

    // ドライヤーで乾かす
    document.getElementById('btn-bath-dryer').onclick = () => {
      soundSystem.playClick();
      this.pet.spawnEffect('sparkle');
      this.pet.setExpression('happy', 1800);
      soundSystem.playJoy();
      this.setGuideText('ドライヤー で ぶぉーん！ けが ふわふわ に なったよ！');
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

  // お散歩道シーンのセットアップ
  setupWalkTrailScene() {
    this.setGuideText('おさんぽみち を てくてく あるこう！ なでなで も できるよ！');
    const overlay = document.getElementById('interactive-overlay');

    overlay.innerHTML = `
      <!-- 右上の戻るボタン -->
      <button id="btn-leave-walk" class="leave-room-btn">
        🏠 おうちへ かえる
      </button>

      <!-- 下部のおうちへかえるボタン -->
      <div class="walk-bottom-nav">
        <button id="btn-leave-walk-bottom" class="big-action-button btn-go-home">
          🏠 おうちへ かえる
        </button>
      </div>
    `;

    const goHome = () => {
      soundSystem.playClick();
      this.changeScene('living');
    };

    document.getElementById('btn-leave-walk').onclick = goHome;
    document.getElementById('btn-leave-walk-bottom').onclick = goHome;
  }

  // 公園シーンのセットアップ
  setupWalkParkScene() {
    this.setGuideText('こうえん に ついたよ！ ボールあそび や すべりだい を たのしもう！');
    const overlay = document.getElementById('interactive-overlay');

    overlay.innerHTML = `
      <!-- 右上の戻るボタン -->
      <button id="btn-leave-park" class="leave-room-btn">
        🏠 おうちへ かえる
      </button>

      <!-- 下部のアクションボタンバー -->
      <div class="walk-bottom-nav">
        <button id="btn-park-ball" class="big-action-button">
          🎾 ボールで あそぶ！
        </button>
        <button id="btn-leave-park-bottom" class="big-action-button btn-go-home">
          🏠 おうちへ かえる
        </button>
      </div>
    `;

    document.getElementById('btn-park-ball').onclick = () => {
      this.playBallGame();
    };

    const goHome = () => {
      soundSystem.playClick();
      this.changeScene('living');
    };

    document.getElementById('btn-leave-park').onclick = goHome;
    document.getElementById('btn-leave-park-bottom').onclick = goHome;
  }

  // ==========================================
  // ⑦ ねんね（はみがき＆就寝）
  // ==========================================
  handleSleepAction() {
    const sched = this.getCurrentSchedule();

    // 歯磨きをしていない場合はまず歯磨きを促す
    if (!this.hasBrushedTeeth) {
      const modalLayer = document.getElementById('modal-layer');
      const modalCard = document.getElementById('modal-card');

      modalCard.innerHTML = `
        <div class="confirm-modal-content">
          <h2 class="modal-title">はみがき は もう した？</h2>
          <p class="modal-desc">ねんねの まえに、せんめんじょ で はみがき を して ぴかぴか に しよう！</p>
          <div class="modal-buttons">
            <button id="btn-go-brush-now" class="btn-primary">🪥 はみがき しにいく</button>
            <button id="btn-skip-brush" class="btn-secondary">そのまま ねんねする</button>
          </div>
        </div>
      `;

      modalLayer.classList.remove('hidden');

      document.getElementById('btn-go-brush-now').onclick = () => {
        soundSystem.playClick();
        modalLayer.classList.add('hidden');
        this.changeScene('bathroom');
      };

      document.getElementById('btn-skip-brush').onclick = () => {
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

    // 3.5秒後に朝がやってくる
    setTimeout(() => {
      this.dayCount++;
      this.timeIndex = 0; // あさごはんへリセット
      this.hasBrushedTeeth = false;
      this.hasWashedHands = false;
      this.hasUsedToilet = false;

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
      // 最後のねんねなら就寝処理へ
      this.handleSleepAction();
      return;
    }

    this.timeIndex++;
    const nextSched = this.getCurrentSchedule();

    // もし次が「ねんね」なら
    if (nextSched.id === 'sleep') {
      this.changeScene('living');
      this.handleSleepAction();
      return;
    }

    // リビングを表示して時間帯を反映
    if (this.currentScene === 'living') {
      this.changeScene('living');
    } else {
      this.updateTimeDisplay();
    }
  }
}

// ゲーム起動
window.addEventListener('DOMContentLoaded', () => {
  const game = new GameApp();
  window.gameApp = game;
  game.init();
});
