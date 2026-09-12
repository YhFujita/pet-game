/**
 * ペットしいくゲーム - ペット管理クラス (Pet)
 * ペットの表示、表情変更、鳴き声、リアクション、アニメーション制御を担当
 */

class Pet {
  constructor(type = 'dog', name = 'ぽち') {
    this.type = type; // 'rabbit' | 'cat' | 'dog' | 'guinea_pig'
    this.name = name;
    this.expression = 'normal'; // 'normal' | 'happy' | 'eat' | 'sleep'
    this.container = null;
    this.isEating = false;
    this.isSleeping = false;
    this.isMoving = false;
    this.posX = 50; // パーセント
    this.posY = 65; // パーセント
  }

  // ペットのタイプ別ひらがな名称
  static getTypeName(type) {
    switch (type) {
      case 'rabbit': return 'うさぎ';
      case 'cat': return 'ねこ';
      case 'dog': return 'いぬ';
      case 'guinea_pig': return 'もるもっと';
      default: return 'ペット';
    }
  }

  // ペットのタイプ別ごはん名
  static getFoodName(type) {
    switch (type) {
      case 'rabbit': return 'にんじん';
      case 'cat': return 'さかな';
      case 'guinea_pig': return 'れたす';
      case 'dog': default: return 'ほね';
    }
  }

  // ペットのタイプ別おやつ名
  static getSnackName(type) {
    switch (type) {
      case 'rabbit': return 'ニンジンクッキー';
      case 'cat': return 'ネコようクッキー';
      case 'guinea_pig': return 'タネ';
      case 'dog': default: return 'イヌようクッキー';
    }
  }

  // DOMコンテナにペットをマウント
  mount(containerElement) {
    this.container = containerElement;
    this.render();
    this.attachEvents();
  }

  // 再描画
  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="pet-wrapper ${this.expression}" style="transform: scale(1);">
        ${SVGAssets.getPetSVG(this.type, this.expression)}
        <div class="pet-nametag">${this.name || Pet.getTypeName(this.type)}</div>
        <div class="pet-effects-layer"></div>
      </div>
    `;
  }

  // クリック・タップイベント（なでなで）
  attachEvents() {
    if (!this.container) return;
    this.container.onclick = (e) => {
      e.stopPropagation();
      this.petTouchReaction();
    };
  }

  // なでなでされたときのリアクション
  petTouchReaction() {
    if (this.isSleeping) {
      this.spawnEffect('zzz');
      return;
    }

    soundSystem.playClick();
    soundSystem.playPetVoice(this.type);
    this.setExpression('happy', 1400);
    this.spawnEffect('heart');

    // ぴょこんとジャンプするアニメーション
    const wrapper = this.container.querySelector('.pet-wrapper');
    if (wrapper) {
      wrapper.classList.remove('pet-jump');
      void wrapper.offsetWidth; // リフロー
      wrapper.classList.add('pet-jump');
    }
  }

  // 表情を変更（durationMs 指定で一定時間後 normal に戻る）
  setExpression(expr, durationMs = 0) {
    this.expression = expr;
    this.render();
    if (durationMs > 0) {
      setTimeout(() => {
        if (this.expression === expr && !this.isSleeping) {
          this.expression = 'normal';
          this.render();
        }
      }, durationMs);
    }
  }

  // ごはんをもぐもぐ食べるアクション
  eatAction(onComplete) {
    this.isEating = true;
    this.setExpression('eat');
    soundSystem.playEat();

    // 2秒後によろこびリアクション
    setTimeout(() => {
      this.setExpression('happy', 2000);
      soundSystem.playJoy();
      soundSystem.playPetVoice(this.type);
      this.spawnEffect('heart');
      this.spawnEffect('sparkle');
      this.isEating = false;
      if (onComplete) onComplete();
    }, 1800);
  }

  // おねんねアクション
  sleepAction() {
    this.isSleeping = true;
    this.setExpression('sleep');
    this.spawnEffect('zzz');
  }

  // おめざめアクション
  wakeAction() {
    this.isSleeping = false;
    this.setExpression('happy', 1500);
    soundSystem.playMorningBirds();
    soundSystem.playPetVoice(this.type);
    this.spawnEffect('sun');
  }

  // リアクションエフェクト（ハート、音符、キラキラ、zzzなど）
  spawnEffect(type = 'heart') {
    if (!this.container) return;
    const effectsLayer = this.container.querySelector('.pet-effects-layer');
    if (!effectsLayer) return;

    const effect = document.createElement('div');
    effect.className = `floating-effect effect-${type}`;

    if (type === 'heart') {
      effect.innerHTML = '❤️';
    } else if (type === 'note') {
      effect.innerHTML = '🎵';
    } else if (type === 'sparkle') {
      effect.innerHTML = '✨';
    } else if (type === 'zzz') {
      effect.innerHTML = '💤';
    } else if (type === 'sun') {
      effect.innerHTML = '☀️';
    } else if (type === 'clean') {
      effect.innerHTML = '🫧';
    }

    // ランダムな位置オフセット
    const randomOffset = (Math.random() - 0.5) * 60;
    effect.style.left = `calc(50% + ${randomOffset}px)`;
    effect.style.top = '10px';

    effectsLayer.appendChild(effect);
    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 1200);
  }

  // ボールを取りに走るアニメーション
  fetchBall(targetX, targetY, onComplete) {
    if (!this.container) return;
    const wrapper = this.container.querySelector('.pet-wrapper');
    if (!wrapper) return;

    this.isMoving = true;
    wrapper.classList.add('pet-running');
    soundSystem.playPetVoice(this.type);

    // 元の位置を保持
    const originalTransform = this.container.style.transform;

    // ボールの場所へ移動
    this.container.style.transition = 'all 0.8s ease-in-out';
    this.container.style.left = `${targetX}%`;
    this.container.style.top = `${targetY}%`;

    // 到着後、ボールをくわえて喜ぶ
    setTimeout(() => {
      this.setExpression('happy');
      soundSystem.playJoy();
      this.spawnEffect('note');

      // 元の位置に戻る
      setTimeout(() => {
        this.container.style.left = '50%';
        this.container.style.top = '65%';

        setTimeout(() => {
          this.container.style.transition = '';
          wrapper.classList.remove('pet-running');
          this.isMoving = false;
          this.setExpression('happy', 1200);
          if (onComplete) onComplete();
        }, 800);
      }, 500);
    }, 800);
  }
}

window.Pet = Pet;
