/**
 * ペットしいくゲーム - SVGアセット定義
 * 高品質なベクターグラフィックス（ペット4種、表情差分、背景6種、フード・アイテム各種）
 */

const SVGAssets = {
  // ==========================================
  // ペットのSVG生成 (ウサギ, ネコ, イヌ, モルモット)
  // ==========================================
  getPetSVG(type, expression = 'normal', options = {}) {
    switch (type) {
      case 'rabbit':
        return this.getRabbitSVG(expression, options);
      case 'cat':
        return this.getCatSVG(expression, options);
      case 'dog':
        return this.getDogSVG(expression, options);
      case 'guinea_pig':
        return this.getGuineaPigSVG(expression, options);
      default:
        return this.getDogSVG(expression, options);
    }
  },

  // --- ウサギ (rabbit) ---
  getRabbitSVG(expression = 'normal', { earWiggle = false, bounce = false } = {}) {
    let eyes = `
      <ellipse cx="82" cy="118" rx="8" ry="10" fill="#2d3748" />
      <ellipse cx="118" cy="118" rx="8" ry="10" fill="#2d3748" />
      <circle cx="85" cy="115" r="3.5" fill="#ffffff" />
      <circle cx="121" cy="115" r="3.5" fill="#ffffff" />
      <circle cx="80" cy="121" r="1.5" fill="#ffffff" />
      <circle cx="116" cy="121" r="1.5" fill="#ffffff" />
    `;
    let mouth = `
      <path d="M 95 130 Q 100 133 100 128 Q 100 133 105 130" fill="none" stroke="#e57373" stroke-width="3" stroke-linecap="round" />
    `;
    let blush = `
      <ellipse cx="72" cy="126" rx="9" ry="6" fill="#ffb6c1" opacity="0.75" />
      <ellipse cx="128" cy="126" rx="9" ry="6" fill="#ffb6c1" opacity="0.75" />
    `;

    if (expression === 'happy') {
      eyes = `
        <path d="M 74 120 Q 82 110 90 120" fill="none" stroke="#2d3748" stroke-width="4.5" stroke-linecap="round" />
        <path d="M 110 120 Q 118 110 126 120" fill="none" stroke="#2d3748" stroke-width="4.5" stroke-linecap="round" />
      `;
      mouth = `
        <path d="M 94 128 Q 100 138 106 128 Z" fill="#ff6b81" stroke="#e57373" stroke-width="2" />
      `;
      blush = `
        <ellipse cx="70" cy="124" rx="10" ry="7" fill="#ff9aa2" opacity="0.9" />
        <ellipse cx="130" cy="124" rx="10" ry="7" fill="#ff9aa2" opacity="0.9" />
      `;
    } else if (expression === 'eat') {
      mouth = `
        <ellipse cx="100" cy="130" rx="7" ry="5" fill="#ff6b81" stroke="#e57373" stroke-width="2">
          <animate attributeName="ry" values="2;6;2" dur="0.25s" repeatCount="indefinite" />
        </ellipse>
      `;
    } else if (expression === 'sleep') {
      eyes = `
        <path d="M 75 119 Q 82 125 89 119" fill="none" stroke="#4a5568" stroke-width="4" stroke-linecap="round" />
        <path d="M 111 119 Q 118 125 125 119" fill="none" stroke="#4a5568" stroke-width="4" stroke-linecap="round" />
      `;
      mouth = `
        <ellipse cx="100" cy="128" rx="3" ry="2" fill="#ffb6c1" />
      `;
    }

    return `
      <svg viewBox="0 0 200 200" class="pet-svg rabbit-svg">
        <defs>
          <radialGradient id="rabbitGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="85%" stop-color="#fff5f5" />
            <stop offset="100%" stop-color="#f8e1e7" />
          </radialGradient>
          <radialGradient id="rabbitEarPink" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#ffccd5" />
            <stop offset="100%" stop-color="#ffb3c1" />
          </radialGradient>
        </defs>

        <!-- 体 (胴体) -->
        <ellipse cx="100" cy="152" rx="46" ry="38" fill="url(#rabbitGrad)" stroke="#eed5db" stroke-width="2.5" />
        <circle cx="146" cy="165" r="14" fill="#ffffff" stroke="#eed5db" stroke-width="2" />

        <!-- 耳 (左・右) -->
        <g class="pet-ears ${earWiggle ? 'wiggle' : ''}">
          <path d="M 76 95 C 60 40 68 15 82 15 C 94 15 92 45 88 95 Z" fill="url(#rabbitGrad)" stroke="#eed5db" stroke-width="2.5" />
          <path d="M 78 88 C 69 45 74 25 82 25 C 89 25 88 48 85 88 Z" fill="url(#rabbitEarPink)" />

          <path d="M 112 95 C 108 45 106 15 118 15 C 132 15 140 40 124 95 Z" fill="url(#rabbitGrad)" stroke="#eed5db" stroke-width="2.5" />
          <path d="M 115 88 C 112 48 111 25 118 25 C 126 25 131 45 122 88 Z" fill="url(#rabbitEarPink)" />
        </g>

        <!-- 頭 -->
        <ellipse cx="100" cy="116" rx="45" ry="38" fill="url(#rabbitGrad)" stroke="#eed5db" stroke-width="2.5" />

        <!-- ほっぺ -->
        ${blush}

        <!-- 鼻 -->
        <polygon points="97,122 103,122 100,126" fill="#ff8fa3" />

        <!-- 口 -->
        ${mouth}

        <!-- 目 -->
        ${eyes}

        <!-- 前足 -->
        <ellipse cx="85" cy="178" rx="14" ry="9" fill="#ffffff" stroke="#eed5db" stroke-width="2" />
        <ellipse cx="115" cy="178" rx="14" ry="9" fill="#ffffff" stroke="#eed5db" stroke-width="2" />
      </svg>
    `;
  },

  // --- ネコ (cat) ---
  getCatSVG(expression = 'normal', { earWiggle = false } = {}) {
    let eyes = `
      <ellipse cx="80" cy="116" rx="9" ry="11" fill="#2d3748" />
      <ellipse cx="120" cy="116" rx="9" ry="11" fill="#2d3748" />
      <circle cx="83" cy="113" r="4" fill="#ffffff" />
      <circle cx="123" cy="113" r="4" fill="#ffffff" />
      <circle cx="78" cy="120" r="1.8" fill="#ffffff" />
      <circle cx="118" cy="120" r="1.8" fill="#ffffff" />
    `;
    let mouth = `
      <path d="M 94 128 Q 100 132 100 126 Q 100 132 106 128" fill="none" stroke="#e57373" stroke-width="3" stroke-linecap="round" />
    `;
    let blush = `
      <ellipse cx="68" cy="124" rx="9" ry="6" fill="#ffb6c1" opacity="0.8" />
      <ellipse cx="132" cy="124" rx="9" ry="6" fill="#ffb6c1" opacity="0.8" />
    `;

    if (expression === 'happy') {
      eyes = `
        <path d="M 72 118 Q 80 108 88 118" fill="none" stroke="#2d3748" stroke-width="4.5" stroke-linecap="round" />
        <path d="M 112 118 Q 120 108 128 118" fill="none" stroke="#2d3748" stroke-width="4.5" stroke-linecap="round" />
      `;
      mouth = `
        <path d="M 93 126 Q 100 136 107 126 Z" fill="#ff6b81" stroke="#e57373" stroke-width="2" />
      `;
    } else if (expression === 'eat') {
      mouth = `
        <ellipse cx="100" cy="128" rx="7" ry="5" fill="#ff6b81" stroke="#e57373" stroke-width="2">
          <animate attributeName="ry" values="2;6;2" dur="0.25s" repeatCount="indefinite" />
        </ellipse>
      `;
    } else if (expression === 'sleep') {
      eyes = `
        <path d="M 72 117 Q 80 123 88 117" fill="none" stroke="#4a5568" stroke-width="4" stroke-linecap="round" />
        <path d="M 112 117 Q 120 123 128 117" fill="none" stroke="#4a5568" stroke-width="4" stroke-linecap="round" />
      `;
    }

    return `
      <svg viewBox="0 0 200 200" class="pet-svg cat-svg">
        <defs>
          <radialGradient id="catGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#fff8f0" />
            <stop offset="85%" stop-color="#ffe8d6" />
            <stop offset="100%" stop-color="#fcd5b5" />
          </radialGradient>
          <radialGradient id="catPatch" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fca311" />
            <stop offset="100%" stop-color="#e85d04" />
          </radialGradient>
        </defs>

        <!-- しっぽ (ゆらゆら) -->
        <path d="M 140 160 Q 175 165 170 135 Q 165 115 178 110" fill="none" stroke="#fca311" stroke-width="12" stroke-linecap="round" class="cat-tail" />

        <!-- 体 -->
        <ellipse cx="100" cy="152" rx="44" ry="36" fill="url(#catGrad)" stroke="#f0c29c" stroke-width="2.5" />
        <!-- おなかの白毛 -->
        <ellipse cx="100" cy="155" rx="26" ry="24" fill="#ffffff" />

        <!-- 首輪＆鈴 -->
        <path d="M 78 138 Q 100 148 122 138" fill="none" stroke="#e63946" stroke-width="6" stroke-linecap="round" />
        <circle cx="100" cy="144" r="5" fill="#ffb703" stroke="#d48b00" stroke-width="1.5" />

        <!-- 耳 -->
        <g class="pet-ears ${earWiggle ? 'wiggle' : ''}">
          <polygon points="62,94 72,48 95,85" fill="url(#catPatch)" stroke="#f0c29c" stroke-width="2.5" />
          <polygon points="68,90 75,58 90,83" fill="#ffccd5" />

          <polygon points="138,94 128,48 105,85" fill="url(#catGrad)" stroke="#f0c29c" stroke-width="2.5" />
          <polygon points="132,90 125,58 110,83" fill="#ffccd5" />
        </g>

        <!-- 頭 -->
        <ellipse cx="100" cy="114" rx="46" ry="38" fill="url(#catGrad)" stroke="#f0c29c" stroke-width="2.5" />

        <!-- ぶち模様 (左目周り) -->
        <path d="M 60 90 Q 75 80 85 95 Q 70 125 58 105 Z" fill="url(#catPatch)" opacity="0.85" />

        <!-- ひげ -->
        <line x1="50" y1="120" x2="68" y2="122" stroke="#d4a373" stroke-width="2" stroke-linecap="round" />
        <line x1="48" y1="128" x2="68" y2="127" stroke="#d4a373" stroke-width="2" stroke-linecap="round" />
        <line x1="150" y1="120" x2="132" y2="122" stroke="#d4a373" stroke-width="2" stroke-linecap="round" />
        <line x1="152" y1="128" x2="132" y2="127" stroke="#d4a373" stroke-width="2" stroke-linecap="round" />

        <!-- ほっぺ -->
        ${blush}

        <!-- 鼻 -->
        <polygon points="97,122 103,122 100,126" fill="#ff8fa3" />

        <!-- 口 -->
        ${mouth}

        <!-- 目 -->
        ${eyes}

        <!-- 前足 -->
        <ellipse cx="85" cy="178" rx="13" ry="9" fill="#ffffff" stroke="#f0c29c" stroke-width="2" />
        <ellipse cx="115" cy="178" rx="13" ry="9" fill="#ffffff" stroke="#f0c29c" stroke-width="2" />
      </svg>
    `;
  },

  // --- イヌ (dog) ---
  getDogSVG(expression = 'normal', { earWiggle = false } = {}) {
    let eyes = `
      <ellipse cx="80" cy="116" rx="9" ry="11" fill="#2d3748" />
      <ellipse cx="120" cy="116" rx="9" ry="11" fill="#2d3748" />
      <circle cx="83" cy="113" r="4" fill="#ffffff" />
      <circle cx="123" cy="113" r="4" fill="#ffffff" />
      <circle cx="77" cy="120" r="2" fill="#ffffff" />
      <circle cx="117" cy="120" r="2" fill="#ffffff" />
    `;
    let mouth = `
      <path d="M 94 129 Q 100 134 100 127 Q 100 134 106 129" fill="none" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" />
    `;
    let blush = `
      <ellipse cx="68" cy="125" rx="9" ry="6" fill="#ffb6c1" opacity="0.8" />
      <ellipse cx="132" cy="125" rx="9" ry="6" fill="#ffb6c1" opacity="0.8" />
    `;

    if (expression === 'happy') {
      eyes = `
        <path d="M 72 118 Q 80 108 88 118" fill="none" stroke="#2d3748" stroke-width="4.5" stroke-linecap="round" />
        <path d="M 112 118 Q 120 108 128 118" fill="none" stroke="#2d3748" stroke-width="4.5" stroke-linecap="round" />
      `;
      mouth = `
        <!-- 楽しそうに舌を出している -->
        <path d="M 93 127 Q 100 135 107 127 Z" fill="#2d3748" />
        <path d="M 97 131 C 97 142 103 142 103 131 Z" fill="#ff758f" stroke="#e57373" stroke-width="1.5" />
      `;
    } else if (expression === 'eat') {
      mouth = `
        <ellipse cx="100" cy="129" rx="8" ry="6" fill="#ff6b81" stroke="#2d3748" stroke-width="2">
          <animate attributeName="ry" values="3;7;3" dur="0.25s" repeatCount="indefinite" />
        </ellipse>
      `;
    } else if (expression === 'sleep') {
      eyes = `
        <path d="M 72 117 Q 80 123 88 117" fill="none" stroke="#4a5568" stroke-width="4" stroke-linecap="round" />
        <path d="M 112 117 Q 120 123 128 117" fill="none" stroke="#4a5568" stroke-width="4" stroke-linecap="round" />
      `;
    }

    return `
      <svg viewBox="0 0 200 200" class="pet-svg dog-svg">
        <defs>
          <radialGradient id="dogGrad" cx="45%" cy="38%" r="65%">
            <stop offset="0%" stop-color="#faedcd" />
            <stop offset="70%" stop-color="#e9d8a6" />
            <stop offset="100%" stop-color="#d4a373" />
          </radialGradient>
          <radialGradient id="dogEarGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#d4a373" />
            <stop offset="100%" stop-color="#bc6c25" />
          </radialGradient>
        </defs>

        <!-- しっぽ (ピコピコ振る) -->
        <path d="M 142 152 Q 170 148 165 125" fill="none" stroke="#d4a373" stroke-width="13" stroke-linecap="round" class="dog-tail" />

        <!-- 体 -->
        <ellipse cx="100" cy="153" rx="46" ry="37" fill="url(#dogGrad)" stroke="#c58f5e" stroke-width="2.5" />
        <ellipse cx="100" cy="156" rx="28" ry="25" fill="#fefae0" />

        <!-- バンダナ -->
        <polygon points="76,140 100,158 124,140" fill="#48cae4" stroke="#0077b6" stroke-width="2" />
        <circle cx="100" cy="144" r="3.5" fill="#ffffff" />

        <!-- 耳 (たれ耳) -->
        <g class="pet-ears ${earWiggle ? 'wiggle' : ''}">
          <path d="M 68 96 C 45 95 42 135 62 142 C 75 145 78 120 72 96 Z" fill="url(#dogEarGrad)" stroke="#a35d1f" stroke-width="2" />
          <path d="M 132 96 C 155 95 158 135 138 142 C 125 145 122 120 128 96 Z" fill="url(#dogEarGrad)" stroke="#a35d1f" stroke-width="2" />
        </g>

        <!-- 頭 -->
        <ellipse cx="100" cy="115" rx="46" ry="38" fill="url(#dogGrad)" stroke="#c58f5e" stroke-width="2.5" />

        <!-- マズル (鼻まわりの白部分) -->
        <ellipse cx="100" cy="126" rx="20" ry="14" fill="#fefae0" />

        <!-- ほっぺ -->
        ${blush}

        <!-- 鼻 -->
        <ellipse cx="100" cy="120" rx="6.5" ry="5" fill="#2d3748" />
        <circle cx="98" cy="119" r="1.5" fill="#ffffff" />

        <!-- 口 -->
        ${mouth}

        <!-- 目 -->
        ${eyes}

        <!-- 前足 -->
        <ellipse cx="84" cy="178" rx="14" ry="9" fill="#fefae0" stroke="#c58f5e" stroke-width="2" />
        <ellipse cx="116" cy="178" rx="14" ry="9" fill="#fefae0" stroke="#c58f5e" stroke-width="2" />
      </svg>
    `;
  },

  // --- モルモット (guinea_pig) ---
  getGuineaPigSVG(expression = 'normal', { earWiggle = false } = {}) {
    let eyes = `
      <circle cx="78" cy="118" r="8" fill="#2d3748" />
      <circle cx="122" cy="118" r="8" fill="#2d3748" />
      <circle cx="81" cy="115" r="3.2" fill="#ffffff" />
      <circle cx="125" cy="115" r="3.2" fill="#ffffff" />
      <circle cx="76" cy="121" r="1.5" fill="#ffffff" />
      <circle cx="120" cy="121" r="1.5" fill="#ffffff" />
    `;
    let mouth = `
      <path d="M 94 130 Q 100 133 100 127 Q 100 133 106 130" fill="none" stroke="#e57373" stroke-width="2.5" stroke-linecap="round" />
    `;
    let blush = `
      <ellipse cx="68" cy="126" rx="9" ry="6" fill="#ffb6c1" opacity="0.8" />
      <ellipse cx="132" cy="126" rx="9" ry="6" fill="#ffb6c1" opacity="0.8" />
    `;

    if (expression === 'happy') {
      eyes = `
        <path d="M 71 119 Q 78 111 85 119" fill="none" stroke="#2d3748" stroke-width="4.5" stroke-linecap="round" />
        <path d="M 115 119 Q 122 111 129 119" fill="none" stroke="#2d3748" stroke-width="4.5" stroke-linecap="round" />
      `;
      mouth = `
        <path d="M 94 128 Q 100 136 106 128 Z" fill="#ff6b81" stroke="#e57373" stroke-width="2" />
      `;
    } else if (expression === 'eat') {
      mouth = `
        <ellipse cx="100" cy="130" rx="7" ry="5" fill="#ff6b81" stroke="#e57373" stroke-width="2">
          <animate attributeName="ry" values="2;6;2" dur="0.25s" repeatCount="indefinite" />
        </ellipse>
      `;
    } else if (expression === 'sleep') {
      eyes = `
        <path d="M 71 118 Q 78 124 85 118" fill="none" stroke="#4a5568" stroke-width="4" stroke-linecap="round" />
        <path d="M 115 118 Q 122 124 129 118" fill="none" stroke="#4a5568" stroke-width="4" stroke-linecap="round" />
      `;
    }

    return `
      <svg viewBox="0 0 200 200" class="pet-svg guinea-svg">
        <defs>
          <radialGradient id="gpGradWhite" cx="45%" cy="38%" r="65%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="85%" stop-color="#fff8f0" />
            <stop offset="100%" stop-color="#f5ebe0" />
          </radialGradient>
          <radialGradient id="gpGradBrown" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#e07a5f" />
            <stop offset="100%" stop-color="#c15c3d" />
          </radialGradient>
        </defs>

        <!-- 体 (ぽってり丸い) -->
        <ellipse cx="100" cy="148" rx="55" ry="42" fill="url(#gpGradWhite)" stroke="#d5bdaf" stroke-width="2.5" />

        <!-- 左右の茶色い模様 -->
        <path d="M 45 145 Q 55 115 75 125 Q 70 180 50 170 Z" fill="url(#gpGradBrown)" opacity="0.9" />
        <path d="M 155 145 Q 145 115 125 125 Q 130 180 150 170 Z" fill="url(#gpGradBrown)" opacity="0.9" />

        <!-- 小さな丸耳 -->
        <g class="pet-ears ${earWiggle ? 'wiggle' : ''}">
          <circle cx="58" cy="98" r="13" fill="url(#gpGradBrown)" stroke="#c15c3d" stroke-width="2" />
          <circle cx="58" cy="98" r="7" fill="#ffccd5" />

          <circle cx="142" cy="98" r="13" fill="url(#gpGradBrown)" stroke="#c15c3d" stroke-width="2" />
          <circle cx="142" cy="98" r="7" fill="#ffccd5" />
        </g>

        <!-- 頭 -->
        <ellipse cx="100" cy="120" rx="46" ry="36" fill="url(#gpGradWhite)" stroke="#d5bdaf" stroke-width="2.5" />

        <!-- 鼻筋の白と両側の茶色 -->
        <path d="M 54 110 Q 75 96 75 130 Q 56 135 54 110 Z" fill="url(#gpGradBrown)" opacity="0.85" />
        <path d="M 146 110 Q 125 96 125 130 Q 144 135 146 110 Z" fill="url(#gpGradBrown)" opacity="0.85" />

        <!-- ほっぺ -->
        ${blush}

        <!-- 鼻 -->
        <polygon points="97,123 103,123 100,127" fill="#ff8fa3" />

        <!-- 口 -->
        ${mouth}

        <!-- 目 -->
        ${eyes}

        <!-- 小さな手足 -->
        <ellipse cx="80" cy="182" rx="10" ry="7" fill="#ffccd5" stroke="#d5bdaf" stroke-width="2" />
        <ellipse cx="120" cy="182" rx="10" ry="7" fill="#ffccd5" stroke="#d5bdaf" stroke-width="2" />
      </svg>
    `;
  },

  // ==========================================
  // 背景シーンのSVG生成
  // ==========================================

  // 1. ペットショップ外観 (shop-exterior)
  getShopExteriorSVG() {
    return `
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" class="bg-svg">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#bde0fe" />
            <stop offset="100%" stop-color="#e0f7fa" />
          </linearGradient>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#95d5b2" />
            <stop offset="100%" stop-color="#74c69d" />
          </linearGradient>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff1e6" />
            <stop offset="100%" stop-color="#eddcd2" />
          </linearGradient>
        </defs>

        <!-- 青空 -->
        <rect width="1000" height="420" fill="url(#skyGrad)" />
        <!-- 雲 -->
        <ellipse cx="180" cy="90" rx="60" ry="30" fill="#ffffff" opacity="0.85" />
        <ellipse cx="230" cy="80" rx="50" ry="35" fill="#ffffff" opacity="0.85" />
        <ellipse cx="800" cy="120" rx="70" ry="35" fill="#ffffff" opacity="0.85" />
        <ellipse cx="850" cy="110" rx="55" ry="30" fill="#ffffff" opacity="0.85" />

        <!-- 芝生地面 -->
        <rect y="420" width="1000" height="180" fill="url(#grassGrad)" />
        <!-- 小道 -->
        <path d="M 400 600 L 450 480 L 550 480 L 600 600 Z" fill="#ddb892" opacity="0.9" />

        <!-- ショップの建物 -->
        <rect x="250" y="160" width="500" height="320" rx="16" fill="url(#wallGrad)" stroke="#cbb29b" stroke-width="4" />

        <!-- オーニング屋根 (赤と白のストライプ) -->
        <path d="M 230 160 Q 500 130 770 160 L 780 200 Q 500 170 220 200 Z" fill="#ff70a6" />
        <g>
          <polygon points="230,160 270,160 265,200 220,200" fill="#ff70a6" />
          <polygon points="270,160 310,160 305,200 265,200" fill="#ffffff" />
          <polygon points="310,160 350,160 345,200 305,200" fill="#ff70a6" />
          <polygon points="350,160 390,160 385,200 345,200" fill="#ffffff" />
          <polygon points="390,160 430,160 425,200 385,200" fill="#ff70a6" />
          <polygon points="430,160 470,160 465,200 425,200" fill="#ffffff" />
          <polygon points="470,160 510,160 505,200 465,200" fill="#ff70a6" />
          <polygon points="510,160 550,160 545,200 505,200" fill="#ffffff" />
          <polygon points="550,160 590,160 585,200 545,200" fill="#ff70a6" />
          <polygon points="590,160 630,160 625,200 585,200" fill="#ffffff" />
          <polygon points="630,160 670,160 665,200 625,200" fill="#ff70a6" />
          <polygon points="670,160 710,160 705,200 665,200" fill="#ffffff" />
          <polygon points="710,160 750,160 745,200 705,200" fill="#ff70a6" />
          <polygon points="750,160 770,160 780,200 745,200" fill="#ffffff" />
        </g>

        <!-- 看板 (ぺっとしょっぷ) -->
        <rect x="360" y="80" width="280" height="65" rx="20" fill="#ffb703" stroke="#fb8500" stroke-width="4" />
        <!-- 肉球マーク -->
        <ellipse cx="400" cy="115" rx="14" ry="11" fill="#ffffff" />
        <circle cx="390" cy="98" r="5" fill="#ffffff" />
        <circle cx="400" cy="94" r="5" fill="#ffffff" />
        <circle cx="410" cy="98" r="5" fill="#ffffff" />
        <text x="520" y="122" font-family="'M PLUS Rounded 1c', 'Kosugi Maru', sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">ぺっとしょっぷ</text>

        <!-- ドア -->
        <rect x="440" y="270" width="120" height="210" rx="8" fill="#cbf3f0" stroke="#ff9f1c" stroke-width="4" id="shop-door-rect" />
        <circle cx="535" cy="380" r="8" fill="#ffd166" stroke="#fb8500" stroke-width="2" />
        <text x="500" y="320" font-family="'M PLUS Rounded 1c', 'Kosugi Maru', sans-serif" font-size="18" font-weight="bold" fill="#2ec4b6" text-anchor="middle">はいってね</text>

        <!-- 左のショーウィンドウ -->
        <rect x="280" y="260" width="130" height="140" rx="10" fill="#e0fbfc" stroke="#90e0ef" stroke-width="4" />
        <line x1="345" y1="260" x2="345" y2="400" stroke="#90e0ef" stroke-width="2" />
        <line x1="280" y1="330" x2="410" y2="330" stroke="#90e0ef" stroke-width="2" />

        <!-- 右のショーウィンドウ -->
        <rect x="590" y="260" width="130" height="140" rx="10" fill="#e0fbfc" stroke="#90e0ef" stroke-width="4" />
        <line x1="655" y1="260" x2="655" y2="400" stroke="#90e0ef" stroke-width="2" />
        <line x1="590" y1="330" x2="720" y2="330" stroke="#90e0ef" stroke-width="2" />

        <!-- お店の前のお花 -->
        <circle cx="200" cy="460" r="14" fill="#ff70a6" />
        <circle cx="200" cy="460" r="5" fill="#ffd166" />
        <circle cx="230" cy="470" r="12" fill="#ffd166" />
        <circle cx="230" cy="470" r="4" fill="#ff70a6" />
        <circle cx="780" cy="465" r="14" fill="#ffd166" />
        <circle cx="810" cy="460" r="13" fill="#ff70a6" />
      </svg>
    `;
  },

  // 2. ペットショップ店内 (shop-interior)
  getShopInteriorSVG() {
    return `
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" class="bg-svg">
        <defs>
          <linearGradient id="shopWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff8f0" />
            <stop offset="100%" stop-color="#faedcd" />
          </linearGradient>
          <linearGradient id="shopFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e9d8a6" />
            <stop offset="100%" stop-color="#d4a373" />
          </linearGradient>
        </defs>

        <!-- 壁 -->
        <rect width="1000" height="420" fill="url(#shopWall)" />
        <!-- ガーランド三角旗の飾り -->
        <polygon points="50,40 100,100 150,40" fill="#ff70a6" />
        <polygon points="150,40 200,100 250,40" fill="#ffd166" />
        <polygon points="250,40 300,100 350,40" fill="#06d6a0" />
        <polygon points="350,40 400,100 450,40" fill="#118ab2" />
        <polygon points="450,40 500,100 550,40" fill="#ff70a6" />
        <polygon points="550,40 600,100 650,40" fill="#ffd166" />
        <polygon points="650,40 700,100 750,40" fill="#06d6a0" />
        <polygon points="750,40 800,100 850,40" fill="#118ab2" />
        <polygon points="850,40 900,100 950,40" fill="#ff70a6" />
        <path d="M 0 40 Q 500 50 1000 40" stroke="#7f4f24" stroke-width="2" fill="none" />

        <!-- 看板：どのこを おうちにつれてかえる？ -->
        <rect x="250" y="60" width="500" height="55" rx="16" fill="#ffb703" stroke="#fb8500" stroke-width="3" />
        <text x="500" y="97" font-family="'M PLUS Rounded 1c', 'Kosugi Maru', sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">すきな ペットを えらんでね！</text>

        <!-- 床 -->
        <rect y="420" width="1000" height="180" fill="url(#shopFloor)" />
        <!-- 木目ライン -->
        <line x1="0" y1="480" x2="1000" y2="480" stroke="#c58f5e" stroke-width="2" />
        <line x1="0" y1="540" x2="1000" y2="540" stroke="#c58f5e" stroke-width="2" />

        <!-- 4つのふかふか台座 (ウサギ, ネコ, イヌ, モルモット) -->
        <ellipse cx="160" cy="410" rx="100" ry="32" fill="#ffccd5" stroke="#ff758f" stroke-width="4" />
        <ellipse cx="380" cy="410" rx="100" ry="32" fill="#ffe5b4" stroke="#ffb703" stroke-width="4" />
        <ellipse cx="620" cy="410" rx="100" ry="32" fill="#cbf3f0" stroke="#2ec4b6" stroke-width="4" />
        <ellipse cx="840" cy="410" rx="100" ry="32" fill="#e2ece9" stroke="#b7b7a4" stroke-width="4" />
      </svg>
    `;
  },

  // 3. おうち・リビング (living) - 時間帯(timeOfDay: 'morning' | 'noon' | 'evening' | 'night')で変化
  getLivingSVG(timeOfDay = 'morning') {
    let windowSky = '#bde0fe';
    let sunOrMoon = '<circle cx="160" cy="140" r="30" fill="#ffb703" />';
    let roomTint = 'rgba(255, 255, 255, 0)';

    if (timeOfDay === 'morning') {
      windowSky = '#bde0fe';
      sunOrMoon = `
        <circle cx="150" cy="140" r="28" fill="#ffd166" />
        <ellipse cx="190" cy="160" rx="35" ry="16" fill="#ffffff" opacity="0.8" />
      `;
    } else if (timeOfDay === 'noon') {
      windowSky = '#a0c4ff';
      sunOrMoon = `
        <circle cx="160" cy="120" r="32" fill="#ffb703" />
        <ellipse cx="130" cy="160" rx="30" ry="14" fill="#ffffff" opacity="0.8" />
      `;
    } else if (timeOfDay === 'evening') {
      windowSky = '#ffb5a7';
      sunOrMoon = `
        <circle cx="180" cy="180" r="34" fill="#f26419" />
        <ellipse cx="140" cy="160" rx="40" ry="16" fill="#fec5bb" opacity="0.6" />
      `;
      roomTint = 'rgba(255, 180, 140, 0.15)';
    } else if (timeOfDay === 'night') {
      windowSky = '#1d3557';
      sunOrMoon = `
        <path d="M 170 120 A 24 24 0 1 1 150 155 A 28 28 0 0 0 170 120 Z" fill="#ffd166" />
        <polygon points="120,110 123,117 130,118 125,123 126,130 120,126 114,130 115,123 110,118 117,117" fill="#ffffff" />
        <polygon points="190,140 192,145 197,146 193,150 194,155 190,152 186,155 187,150 183,146 188,145" fill="#ffffff" />
      `;
      roomTint = 'rgba(20, 30, 70, 0.35)';
    }

    return `
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" class="bg-svg">
        <defs>
          <linearGradient id="livingWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff1e6" />
            <stop offset="100%" stop-color="#eddcd2" />
          </linearGradient>
          <linearGradient id="livingFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f8edeb" />
            <stop offset="100%" stop-color="#e8e8e4" />
          </linearGradient>
        </defs>

        <!-- 壁 -->
        <rect width="1000" height="420" fill="url(#livingWall)" />

        <!-- 窓 -->
        <rect x="80" y="80" width="160" height="180" rx="8" fill="${windowSky}" stroke="#d8e2dc" stroke-width="10" />
        ${sunOrMoon}
        <!-- 窓枠の十字 -->
        <line x1="160" y1="80" x2="160" y2="260" stroke="#d8e2dc" stroke-width="6" />
        <line x1="80" y1="170" x2="240" y2="170" stroke="#d8e2dc" stroke-width="6" />
        <!-- カーテン -->
        <path d="M 70 70 Q 110 160 85 270 L 70 270 Z" fill="#ffe5d9" />
        <path d="M 250 70 Q 210 160 235 270 L 250 270 Z" fill="#ffe5d9" />

        <!-- ドア (他のへやへいく) -->
        <rect x="820" y="160" width="120" height="260" rx="8" fill="#d4a373" stroke="#bc6c25" stroke-width="4" />
        <circle cx="840" cy="290" r="7" fill="#ffd166" />

        <!-- 壁のポスター・絵画 -->
        <rect x="420" y="100" width="160" height="110" rx="8" fill="#ffffff" stroke="#e9c46a" stroke-width="6" />
        <!-- 絵の中のかわいいハートと虹 -->
        <path d="M 440 180 Q 500 120 560 180" fill="none" stroke="#ff758f" stroke-width="6" />
        <path d="M 440 190 Q 500 135 560 190" fill="none" stroke="#ffd166" stroke-width="6" />
        <path d="M 440 200 Q 500 150 560 200" fill="none" stroke="#06d6a0" stroke-width="6" />

        <!-- 床 -->
        <rect y="420" width="1000" height="180" fill="url(#livingFloor)" />

        <!-- ふかふかラグマット (円形) -->
        <ellipse cx="500" cy="490" rx="280" ry="85" fill="#fde2e4" stroke="#ffcad4" stroke-width="6" />
        <ellipse cx="500" cy="490" rx="240" ry="70" fill="#ffffff" opacity="0.6" />

        <!-- ペット用ベッド (左側) -->
        <ellipse cx="260" cy="490" rx="90" ry="40" fill="#b5e2fa" stroke="#90e0ef" stroke-width="4" />
        <ellipse cx="260" cy="485" rx="70" ry="30" fill="#edede9" />

        <!-- お皿のトレイ (右側) -->
        <ellipse cx="740" cy="490" rx="70" ry="26" fill="#e9d8a6" stroke="#c58f5e" stroke-width="3" />
        <ellipse cx="740" cy="486" rx="40" ry="15" fill="#ffffff" stroke="#ddb892" stroke-width="2" id="food-bowl-bg" />

        <!-- 部屋のライティング色調（時間帯別オーバーレイ） -->
        <rect width="1000" height="600" fill="${roomTint}" pointer-events="none" />
      </svg>
    `;
  },

  // 4. せんめんじょ ＆ といれ (bathroom)
  getBathroomSVG() {
    return `
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" class="bg-svg">
        <defs>
          <linearGradient id="bathWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e0fbfc" />
            <stop offset="100%" stop-color="#c2dfe3" />
          </linearGradient>
          <linearGradient id="tileFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e9ecef" />
            <stop offset="100%" stop-color="#dee2e6" />
          </linearGradient>
        </defs>

        <!-- 壁 (パステルタイル調) -->
        <rect width="1000" height="420" fill="url(#bathWall)" />
        <!-- タイル目地 -->
        <g stroke="#b8e0d2" stroke-width="1.5" opacity="0.6">
          <line x1="0" y1="70" x2="1000" y2="70" />
          <line x1="0" y1="140" x2="1000" y2="140" />
          <line x1="0" y1="210" x2="1000" y2="210" />
          <line x1="0" y1="280" x2="1000" y2="280" />
          <line x1="0" y1="350" x2="1000" y2="350" />
        </g>

        <!-- 床 -->
        <rect y="420" width="1000" height="180" fill="url(#tileFloor)" />

        <!-- 左側：といれ (かわいいペット・子ども用便座) -->
        <g id="toilet-area">
          <!-- 便器タンク -->
          <rect x="180" y="240" width="110" height="140" rx="12" fill="#ffffff" stroke="#ced4da" stroke-width="4" />
          <!-- レバー -->
          <circle cx="205" cy="265" r="8" fill="#adb5bd" id="toilet-flush-handle" />
          <rect x="200" y="260" width="30" height="8" rx="4" fill="#adb5bd" />
          <!-- 便座本体 -->
          <ellipse cx="235" cy="420" rx="75" ry="35" fill="#ffffff" stroke="#ced4da" stroke-width="4" />
          <ellipse cx="235" cy="415" rx="55" ry="24" fill="#64dfdf" opacity="0.6" />
          <!-- トイレットペーパー -->
          <rect x="110" y="280" width="45" height="55" rx="8" fill="#ffffff" stroke="#dee2e6" stroke-width="3" />
          <line x1="110" y1="335" x2="145" y2="355" stroke="#ced4da" stroke-width="2" />
        </g>

        <!-- 中央の仕切り・マット -->
        <ellipse cx="235" cy="470" rx="95" ry="35" fill="#ffd166" opacity="0.7" />
        <text x="235" y="475" font-family="'M PLUS Rounded 1c', sans-serif" font-size="16" font-weight="bold" fill="#7f4f24" text-anchor="middle">といれ</text>

        <!-- 右側：洗面台 (鏡、蛇口、シンク、歯磨きコップ、石鹸) -->
        <g id="sink-area">
          <!-- 鏡 -->
          <rect x="620" y="80" width="200" height="170" rx="18" fill="#ffffff" stroke="#a2d2ff" stroke-width="6" />
          <rect x="630" y="90" width="180" height="150" rx="12" fill="#d7e3fc" opacity="0.7" />
          <!-- 鏡のキラリ -->
          <line x1="650" y1="110" x2="690" y2="150" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.8" />

          <!-- 洗面キャビネット台 -->
          <rect x="580" y="280" width="280" height="170" rx="10" fill="#ffffff" stroke="#ced4da" stroke-width="4" />
          <!-- 洗面シンクボウル -->
          <ellipse cx="720" cy="310" rx="85" ry="35" fill="#e0fbfc" stroke="#90e0ef" stroke-width="4" />

          <!-- 蛇口 -->
          <path d="M 720 250 L 720 280" stroke="#adb5bd" stroke-width="12" stroke-linecap="round" />
          <path d="M 720 250 Q 720 235 705 240 L 695 245" stroke="#adb5bd" stroke-width="10" stroke-linecap="round" />
          <circle cx="740" cy="270" r="10" fill="#48cae4" />

          <!-- 歯磨きコップとはぶらし -->
          <rect x="610" y="275" width="30" height="35" rx="6" fill="#ff70a6" />
          <line x1="625" y1="250" x2="625" y2="280" stroke="#ffd166" stroke-width="6" stroke-linecap="round" />
          <rect x="620" y="240" width="10" height="12" rx="3" fill="#ffffff" />

          <!-- せっけん置き＆石鹸 -->
          <ellipse cx="810" cy="295" rx="25" ry="12" fill="#e9ecef" />
          <rect x="795" y="285" width="30" height="15" rx="6" fill="#b9fbc0" stroke="#70e000" stroke-width="1.5" />

          <!-- 洗面台前マット -->
          <ellipse cx="720" cy="480" rx="110" ry="40" fill="#bde0fe" opacity="0.8" />
          <text x="720" y="486" font-family="'M PLUS Rounded 1c', sans-serif" font-size="16" font-weight="bold" fill="#0077b6" text-anchor="middle">てあらい ・ はみがき</text>
        </g>
      </svg>
    `;
  },

  // 5. おふろば (bath)
  getBathSVG() {
    return `
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" class="bg-svg">
        <defs>
          <linearGradient id="bathRoomWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d8f3dc" />
            <stop offset="100%" stop-color="#b7e4c7" />
          </linearGradient>
          <linearGradient id="bathFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#edf2f4" />
            <stop offset="100%" stop-color="#8d99ae" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#90e0ef" />
            <stop offset="100%" stop-color="#00b4d8" />
          </linearGradient>
        </defs>

        <!-- 壁 -->
        <rect width="1000" height="420" fill="url(#bathRoomWall)" />

        <!-- 窓（すりガラス風） -->
        <rect x="120" y="80" width="150" height="120" rx="10" fill="#ffffff" opacity="0.6" stroke="#52b788" stroke-width="6" />

        <!-- シャワーフックとシャワーヘッド -->
        <g id="shower-fixture">
          <circle cx="280" cy="220" r="10" fill="#ced4da" />
          <path d="M 280 230 C 270 300 240 380 220 440" stroke="#adb5bd" stroke-width="8" fill="none" stroke-linecap="round" />
          <path d="M 260 200 L 290 220" stroke="#6c757d" stroke-width="12" stroke-linecap="round" />
          <ellipse cx="255" cy="195" rx="16" ry="8" fill="#495057" />
        </g>

        <!-- 壁のボトル棚（シャンプー、リンス） -->
        <rect x="180" y="270" width="110" height="14" rx="4" fill="#ffffff" stroke="#ced4da" stroke-width="2" />
        <!-- シャンプーボトル (ピンク) -->
        <rect x="195" y="225" width="30" height="45" rx="6" fill="#ff70a6" />
        <rect x="205" y="215" width="10" height="10" fill="#ced4da" />
        <text x="210" y="252" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">あわ</text>
        <!-- ベビーソープ (水色) -->
        <rect x="235" y="220" width="34" height="50" rx="6" fill="#48cae4" />
        <rect x="247" y="210" width="10" height="10" fill="#ced4da" />

        <!-- 床 -->
        <rect y="420" width="1000" height="180" fill="url(#bathFloor)" />

        <!-- バスタブ (中央右寄り) -->
        <ellipse cx="640" cy="460" rx="260" ry="110" fill="#ffffff" stroke="#a2d2ff" stroke-width="8" />
        <!-- バスタブのお湯 -->
        <ellipse cx="640" cy="460" rx="225" ry="85" fill="url(#waterGrad)" opacity="0.8" id="bath-tub-water" />

        <!-- お風呂のアヒルちゃん -->
        <g transform="translate(740, 420) scale(0.9)">
          <ellipse cx="20" cy="20" rx="18" ry="14" fill="#ffd166" stroke="#fb8500" stroke-width="2" />
          <circle cx="30" cy="10" r="10" fill="#ffd166" stroke="#fb8500" stroke-width="2" />
          <polygon points="38,10 46,12 38,15" fill="#f77f00" />
          <circle cx="33" cy="8" r="2" fill="#000000" />
        </g>

        <!-- あわあわ泡のデコレーション -->
        <circle cx="500" cy="440" r="18" fill="#ffffff" opacity="0.75" />
        <circle cx="525" cy="435" r="12" fill="#ffffff" opacity="0.75" />
        <circle cx="515" cy="455" r="15" fill="#ffffff" opacity="0.75" />
        <circle cx="770" cy="460" r="14" fill="#ffffff" opacity="0.75" />
        <circle cx="790" cy="450" r="20" fill="#ffffff" opacity="0.75" />
      </svg>
    `;
  },

  // 6. お散歩コース (walk-trail) - 朝・昼・夕・夜の時間帯対応と動く景色・発見オブジェクト
  getWalkTrailSVG(timeOfDay = 'morning') {
    let skyGrad = '';
    let celestial = '';
    let clouds = '';
    let hills = '';
    let grassGrad = '';
    let pathColor = '';
    let pathStroke = '';
    let treeLeaves1 = '';
    let treeLeaves2 = '';
    let tint = 'rgba(0, 0, 0, 0)';

    if (timeOfDay === 'morning') {
      skyGrad = `
        <stop offset="0%" stop-color="#90e0ef" />
        <stop offset="60%" stop-color="#bde0fe" />
        <stop offset="100%" stop-color="#e0f7fa" />
      `;
      celestial = `
        <circle cx="140" cy="80" r="36" fill="#ffd166" opacity="0.95" filter="drop-shadow(0 0 12px #ffe6a7)" />
      `;
      clouds = `
        <ellipse cx="320" cy="100" rx="65" ry="28" fill="#ffffff" opacity="0.85" />
        <ellipse cx="365" cy="88" rx="55" ry="32" fill="#ffffff" opacity="0.85" />
        <ellipse cx="780" cy="75" rx="75" ry="30" fill="#ffffff" opacity="0.85" />
      `;
      hills = `
        <ellipse cx="250" cy="370" rx="320" ry="90" fill="#95d5b2" />
        <ellipse cx="750" cy="370" rx="380" ry="100" fill="#74c69d" />
      `;
      grassGrad = `
        <stop offset="0%" stop-color="#74c69d" />
        <stop offset="100%" stop-color="#52b788" />
      `;
      pathColor = '#eddcd2';
      pathStroke = '#ddb892';
      treeLeaves1 = '#52b788';
      treeLeaves2 = '#74c69d';
    } else if (timeOfDay === 'noon') {
      skyGrad = `
        <stop offset="0%" stop-color="#0096c7" />
        <stop offset="50%" stop-color="#48cae4" />
        <stop offset="100%" stop-color="#ade8f4" />
      `;
      celestial = `
        <circle cx="200" cy="70" r="42" fill="#ffb703" filter="drop-shadow(0 0 16px #ffd166)" />
      `;
      clouds = `
        <ellipse cx="400" cy="90" rx="80" ry="36" fill="#ffffff" opacity="0.9" />
        <ellipse cx="450" cy="75" rx="70" ry="40" fill="#ffffff" opacity="0.9" />
        <ellipse cx="820" cy="95" rx="90" ry="38" fill="#ffffff" opacity="0.9" />
      `;
      hills = `
        <ellipse cx="250" cy="370" rx="320" ry="90" fill="#74c69d" />
        <ellipse cx="750" cy="370" rx="380" ry="100" fill="#52b788" />
      `;
      grassGrad = `
        <stop offset="0%" stop-color="#52b788" />
        <stop offset="100%" stop-color="#40916c" />
      `;
      pathColor = '#f0e6df';
      pathStroke = '#cbb29b';
      treeLeaves1 = '#40916c';
      treeLeaves2 = '#52b788';
    } else if (timeOfDay === 'evening') {
      skyGrad = `
        <stop offset="0%" stop-color="#9d4edd" />
        <stop offset="35%" stop-color="#f72585" />
        <stop offset="70%" stop-color="#f77f00" />
        <stop offset="100%" stop-color="#ffb703" />
      `;
      celestial = `
        <circle cx="180" cy="130" r="48" fill="#f72585" filter="drop-shadow(0 0 20px #f77f00)" />
      `;
      clouds = `
        <ellipse cx="320" cy="110" rx="70" ry="26" fill="#ffd166" opacity="0.6" />
        <ellipse cx="370" cy="98" rx="60" ry="28" fill="#ff758f" opacity="0.6" />
        <ellipse cx="780" cy="120" rx="85" ry="30" fill="#e7c6ff" opacity="0.5" />
      `;
      hills = `
        <ellipse cx="250" cy="370" rx="320" ry="90" fill="#b08968" />
        <ellipse cx="750" cy="370" rx="380" ry="100" fill="#7f5539" />
      `;
      grassGrad = `
        <stop offset="0%" stop-color="#b08968" />
        <stop offset="100%" stop-color="#7f5539" />
      `;
      pathColor = '#ddb892';
      pathStroke = '#9c6644';
      treeLeaves1 = '#7f5539';
      treeLeaves2 = '#9c6644';
      tint = 'rgba(240, 90, 20, 0.16)';
    } else if (timeOfDay === 'night') {
      skyGrad = `
        <stop offset="0%" stop-color="#0b132b" />
        <stop offset="60%" stop-color="#1c2541" />
        <stop offset="100%" stop-color="#3a0ca3" />
      `;
      celestial = `
        <!-- 三日月 -->
        <path d="M 180 60 A 30 30 0 1 1 150 110 A 38 38 0 0 0 180 60 Z" fill="#ffd166" filter="drop-shadow(0 0 12px #ffe66d)" />
        <!-- 星々 -->
        <polygon points="280,60 282,65 287,66 283,70 284,75 280,72 276,75 277,70 273,66 278,65" fill="#ffffff" />
        <polygon points="450,45 452,50 457,51 453,55 454,60 450,57 446,60 447,55 443,51 448,50" fill="#ffffff" opacity="0.9" />
        <polygon points="620,80 622,85 627,86 623,90 624,95 620,92 616,95 617,90 613,86 618,85" fill="#ffffff" />
        <polygon points="760,50 762,54 767,55 763,58 764,63 760,60 756,63 757,58 753,55 758,54" fill="#ffffff" opacity="0.85" />
        <polygon points="880,85 882,90 887,91 883,95 884,100 880,97 876,100 877,95 873,91 878,90" fill="#ffffff" />
        <!-- ほたるのような光粒 -->
        <circle cx="260" cy="460" r="4" fill="#d8f3dc" opacity="0.8" filter="drop-shadow(0 0 6px #74c69d)" />
        <circle cx="680" cy="440" r="5" fill="#d8f3dc" opacity="0.85" filter="drop-shadow(0 0 6px #74c69d)" />
      `;
      clouds = '';
      hills = `
        <ellipse cx="250" cy="370" rx="320" ry="90" fill="#1b263b" />
        <ellipse cx="750" cy="370" rx="380" ry="100" fill="#0d1b2a" />
      `;
      grassGrad = `
        <stop offset="0%" stop-color="#1b4332" />
        <stop offset="100%" stop-color="#081c15" />
      `;
      pathColor = '#3a506b';
      pathStroke = '#1c2541';
      treeLeaves1 = '#081c15';
      treeLeaves2 = '#1b4332';
      tint = 'rgba(11, 19, 43, 0.35)';
    }

    return `
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" class="bg-svg" id="walk-trail-svg-root">
        <defs>
          <linearGradient id="trailSky" x1="0" y1="0" x2="0" y2="1">
            ${skyGrad}
          </linearGradient>
          <linearGradient id="trailGrass" x1="0" y1="0" x2="0" y2="1">
            ${grassGrad}
          </linearGradient>
        </defs>

        <!-- 空レイヤー -->
        <rect width="1000" height="360" fill="url(#trailSky)" />

        <!-- 太陽・月・星 -->
        ${celestial}

        <!-- 雲 -->
        <g id="trail-sky-clouds">
          ${clouds}
        </g>

        <!-- 遠くの山・丘 -->
        <g id="trail-distant-hills">
          ${hills}
        </g>

        <!-- 草原ベース -->
        <rect y="360" width="1000" height="240" fill="url(#trailGrass)" />

        <!-- 動くお散歩ワールド (スクロール対象グループ) -->
        <g id="trail-moving-world" class="trail-moving-group">
          <!-- 並木道 (木々) -->
          <g id="trail-trees">
            <!-- 左の木 -->
            <rect x="75" y="240" width="30" height="150" fill="#6f4e37" rx="4" />
            <ellipse cx="90" cy="210" rx="65" ry="75" fill="${treeLeaves1}" />
            <ellipse cx="90" cy="190" rx="55" ry="60" fill="${treeLeaves2}" />

            <!-- 木にとまる小鳥 (発見オブジェクト) -->
            <g id="trail-obj-bird" class="trail-interactive-obj" style="cursor: pointer;">
              <ellipse cx="120" cy="180" rx="14" ry="10" fill="#48cae4" />
              <circle cx="130" cy="174" r="7" fill="#48cae4" />
              <polygon points="137,173 144,175 137,178" fill="#ffb703" />
              <circle cx="132" cy="173" r="1.5" fill="#000000" />
              <!-- 羽 -->
              <ellipse cx="118" cy="181" rx="8" ry="5" fill="#0077b6" />
            </g>

            <!-- 右の木 -->
            <rect x="875" y="220" width="35" height="170" fill="#6f4e37" rx="4" />
            <ellipse cx="890" cy="190" rx="75" ry="85" fill="${treeLeaves1}" />
            <ellipse cx="890" cy="170" rx="60" ry="65" fill="${treeLeaves2}" />

            <!-- 木のふもとのどんぐり (発見オブジェクト) -->
            <g id="trail-obj-acorn" class="trail-interactive-obj" style="cursor: pointer;">
              <ellipse cx="855" cy="385" rx="10" ry="12" fill="#9c6644" />
              <path d="M 845 380 Q 855 372 865 380 Z" fill="#6f4e37" />
              <line x1="855" y1="372" x2="855" y2="366" stroke="#4a3525" stroke-width="2" />
            </g>
          </g>

          <!-- お散歩の小道 (パースペクティブ) -->
          <path id="trail-path-strip" d="M 450 360 Q 420 450 150 600 L 750 600 Q 560 460 520 360 Z" fill="${pathColor}" stroke="${pathStroke}" stroke-width="4" />
          <!-- 小道の足跡・飛び石 -->
          <ellipse cx="440" cy="460" rx="16" ry="7" fill="${pathStroke}" opacity="0.4" />
          <ellipse cx="490" cy="510" rx="20" ry="8" fill="${pathStroke}" opacity="0.4" />
          <ellipse cx="430" cy="560" rx="24" ry="10" fill="${pathStroke}" opacity="0.4" />

          <!-- 道端の発見オブジェクト群 -->
          <!-- 1. きれいなお花 (左手前) -->
          <g id="trail-obj-flower" class="trail-interactive-obj" style="cursor: pointer;">
            <!-- 茎 -->
            <path d="M 280 470 Q 282 490 285 505" stroke="#2d6a4f" stroke-width="3" fill="none" />
            <!-- 花びら -->
            <circle cx="280" cy="470" r="14" fill="#ff70a6" />
            <circle cx="280" cy="470" r="5" fill="#ffd166" />
            <circle cx="264" cy="468" r="8" fill="#ff9aa2" opacity="0.8" />
            <circle cx="296" cy="468" r="8" fill="#ff9aa2" opacity="0.8" />
            <circle cx="280" cy="454" r="8" fill="#ff9aa2" opacity="0.8" />
          </g>

          <!-- 2. 四つ葉のクローバー (右手前) -->
          <g id="trail-obj-clover" class="trail-interactive-obj" style="cursor: pointer;">
            <!-- 茎 -->
            <path d="M 720 495 Q 718 510 722 525" stroke="#1b4332" stroke-width="2.5" fill="none" />
            <!-- 4枚のハート葉っぱ -->
            <g transform="translate(720, 495)">
              <circle cx="-6" cy="-6" r="6" fill="#52b788" />
              <circle cx="6" cy="-6" r="6" fill="#74c69d" />
              <circle cx="-6" cy="6" r="6" fill="#74c69d" />
              <circle cx="6" cy="6" r="6" fill="#52b788" />
              <circle cx="0" cy="0" r="3" fill="#ffd166" />
            </g>
          </g>

          <!-- 3. ひらひら飛ぶ蝶々 (空中) -->
          <g id="trail-obj-butterfly" class="trail-interactive-obj" style="cursor: pointer;">
            <path d="M 640 280 Q 648 266 658 276 Q 648 288 640 280 Z" fill="#ffd166" stroke="#f77f00" stroke-width="1.5" />
            <path d="M 660 280 Q 668 266 678 276 Q 668 288 660 280 Z" fill="#ffd166" stroke="#f77f00" stroke-width="1.5" />
            <ellipse cx="659" cy="280" rx="3" ry="8" fill="#4a5568" />
          </g>

          <!-- カラフルなお花たち (背景デコレーション) -->
          <circle cx="315" cy="490" r="10" fill="#ffd166" />
          <circle cx="315" cy="490" r="3" fill="#ff70a6" />
          <circle cx="675" cy="470" r="12" fill="#ffb703" />
          <circle cx="675" cy="470" r="4" fill="#ffffff" />
          <circle cx="745" cy="510" r="11" fill="#f72585" />
          <circle cx="745" cy="510" r="3.5" fill="#ffd166" />
        </g>

        <!-- 時間帯オーバーレイ -->
        <rect width="1000" height="600" fill="${tint}" pointer-events="none" />
      </svg>
    `;
  },

  // 7. こうえん (walk-park) - 朝・昼・夕・夜の時間帯対応
  getWalkParkSVG(timeOfDay = 'morning') {
    let skyGrad = '';
    let celestial = '';
    let clouds = '';
    let grassGrad = '';
    let tint = 'rgba(0, 0, 0, 0)';

    if (timeOfDay === 'morning') {
      skyGrad = `
        <stop offset="0%" stop-color="#90e0ef" />
        <stop offset="100%" stop-color="#bde0fe" />
      `;
      celestial = `
        <circle cx="850" cy="90" r="38" fill="#ffd166" opacity="0.95" filter="drop-shadow(0 0 14px #ffe6a7)" />
      `;
      clouds = `
        <ellipse cx="200" cy="90" rx="70" ry="30" fill="#ffffff" opacity="0.85" />
        <ellipse cx="500" cy="110" rx="80" ry="35" fill="#ffffff" opacity="0.85" />
      `;
      grassGrad = `
        <stop offset="0%" stop-color="#80ed99" />
        <stop offset="100%" stop-color="#57cc99" />
      `;
    } else if (timeOfDay === 'noon') {
      skyGrad = `
        <stop offset="0%" stop-color="#00b4d8" />
        <stop offset="100%" stop-color="#90e0ef" />
      `;
      celestial = `
        <circle cx="820" cy="80" r="42" fill="#ffb703" filter="drop-shadow(0 0 18px #ffd166)" />
      `;
      clouds = `
        <ellipse cx="220" cy="80" rx="75" ry="34" fill="#ffffff" opacity="0.9" />
        <ellipse cx="520" cy="100" rx="90" ry="40" fill="#ffffff" opacity="0.9" />
      `;
      grassGrad = `
        <stop offset="0%" stop-color="#57cc99" />
        <stop offset="100%" stop-color="#38a3a5" />
      `;
    } else if (timeOfDay === 'evening') {
      skyGrad = `
        <stop offset="0%" stop-color="#9d4edd" />
        <stop offset="35%" stop-color="#f72585" />
        <stop offset="75%" stop-color="#f77f00" />
        <stop offset="100%" stop-color="#ffb703" />
      `;
      celestial = `
        <circle cx="800" cy="140" r="48" fill="#f72585" filter="drop-shadow(0 0 20px #f77f00)" />
      `;
      clouds = `
        <ellipse cx="200" cy="100" rx="70" ry="26" fill="#ffd166" opacity="0.6" />
        <ellipse cx="500" cy="120" rx="80" ry="30" fill="#ff758f" opacity="0.6" />
      `;
      grassGrad = `
        <stop offset="0%" stop-color="#b08968" />
        <stop offset="100%" stop-color="#7f5539" />
      `;
      tint = 'rgba(240, 90, 20, 0.18)';
    } else if (timeOfDay === 'night') {
      skyGrad = `
        <stop offset="0%" stop-color="#03071e" />
        <stop offset="50%" stop-color="#10002b" />
        <stop offset="100%" stop-color="#240046" />
      `;
      celestial = `
        <!-- 金色の月 -->
        <circle cx="840" cy="80" r="32" fill="#ffd166" filter="drop-shadow(0 0 16px #ffe66d)" />
        <circle cx="850" cy="74" r="26" fill="#10002b" />
        <!-- 星々 -->
        <polygon points="150,70 152,75 157,76 153,80 154,85 150,82 146,85 147,80 143,76 148,75" fill="#ffffff" />
        <polygon points="350,50 352,55 357,56 353,60 354,65 350,62 346,65 347,60 343,56 348,55" fill="#ffffff" opacity="0.9" />
        <polygon points="680,90 682,95 687,96 683,100 684,105 680,102 676,105 677,100 673,96 678,95" fill="#ffffff" />
        <!-- 公園の街灯あかり -->
        <circle cx="780" cy="350" r="40" fill="#ffd166" opacity="0.25" />
      `;
      clouds = '';
      grassGrad = `
        <stop offset="0%" stop-color="#1b4332" />
        <stop offset="100%" stop-color="#081c15" />
      `;
      tint = 'rgba(10, 15, 40, 0.38)';
    }

    return `
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" class="bg-svg">
        <defs>
          <linearGradient id="parkSky" x1="0" y1="0" x2="0" y2="1">
            ${skyGrad}
          </linearGradient>
          <linearGradient id="parkGrass" x1="0" y1="0" x2="0" y2="1">
            ${grassGrad}
          </linearGradient>
        </defs>

        <!-- 空 -->
        <rect width="1000" height="340" fill="url(#parkSky)" />
        ${celestial}
        ${clouds}

        <!-- 芝生 -->
        <rect y="340" width="1000" height="260" fill="url(#parkGrass)" />

        <!-- すべり台 (左側) -->
        <g id="slide-playground">
          <!-- 階段・柱 -->
          <line x1="140" y1="220" x2="140" y2="440" stroke="#f72585" stroke-width="8" />
          <line x1="180" y1="220" x2="180" y2="440" stroke="#f72585" stroke-width="8" />
          <rect x="130" y="210" width="60" height="15" fill="#4cc9f0" rx="4" />
          <!-- 段差ステップ -->
          <line x1="140" y1="260" x2="180" y2="260" stroke="#ffd166" stroke-width="5" />
          <line x1="140" y1="300" x2="180" y2="300" stroke="#ffd166" stroke-width="5" />
          <line x1="140" y1="340" x2="180" y2="340" stroke="#ffd166" stroke-width="5" />
          <line x1="140" y1="380" x2="180" y2="380" stroke="#ffd166" stroke-width="5" />
          <!-- スロープすべり台本体 -->
          <path d="M 180 220 Q 230 260 360 440" stroke="#ffd166" stroke-width="26" fill="none" stroke-linecap="round" />
          <path d="M 180 215 Q 230 255 360 435" stroke="#f72585" stroke-width="6" fill="none" />
        </g>

        <!-- 噴水またはモニュメント (中央奥) -->
        <ellipse cx="600" cy="360" rx="90" ry="30" fill="#e0fbfc" stroke="#90e0ef" stroke-width="5" />
        <path d="M 600 350 Q 585 300 580 270 Q 600 250 620 270 Q 615 300 600 350" fill="#48cae4" opacity="0.8" />
        <!-- 水しぶき -->
        <circle cx="580" cy="265" r="4" fill="#caf0f8" />
        <circle cx="620" cy="265" r="4" fill="#caf0f8" />

        <!-- ベンチ (右側) -->
        <g>
          <rect x="780" y="380" width="130" height="14" rx="4" fill="#d4a373" stroke="#8d5b4c" stroke-width="2" />
          <rect x="780" y="405" width="130" height="16" rx="4" fill="#d4a373" stroke="#8d5b4c" stroke-width="2" />
          <!-- 脚 -->
          <line x1="800" y1="420" x2="795" y2="460" stroke="#495057" stroke-width="6" />
          <line x1="890" y1="420" x2="895" y2="460" stroke="#495057" stroke-width="6" />
        </g>

        <!-- 広場スペース（ボール遊びができる中央エリア） -->
        <ellipse cx="500" cy="490" rx="260" ry="80" fill="#95d5b2" opacity="0.5" />

        <!-- 時間帯オーバーレイ -->
        <rect width="1000" height="600" fill="${tint}" pointer-events="none" />
      </svg>
    `;
  },

  // ==========================================
  // アイテム・フードのSVG定義
  // ==========================================

  // ごはん（動物別）
  // ウサギ: にんじん
  // ネコ: さかな
  // モルモット: れたす
  // イヌ: ほね
  getFoodSVG(petType) {
    switch (petType) {
      case 'rabbit':
        // にんじん
        return `
          <svg viewBox="0 0 100 100" class="food-svg item-carrot">
            <!-- 葉っぱ -->
            <path d="M 50 30 C 40 12 30 18 42 32 Z" fill="#52b788" stroke="#2d6a4f" stroke-width="1.5" />
            <path d="M 50 30 C 50 8 58 10 52 30 Z" fill="#74c69d" stroke="#2d6a4f" stroke-width="1.5" />
            <path d="M 50 30 C 60 12 70 18 58 32 Z" fill="#52b788" stroke="#2d6a4f" stroke-width="1.5" />
            <!-- にんじん本体 -->
            <path d="M 40 32 Q 50 30 60 32 L 53 85 Q 50 90 47 85 Z" fill="#f77f00" stroke="#d62828" stroke-width="2" />
            <!-- 横すじ -->
            <line x1="44" y1="45" x2="56" y2="45" stroke="#fcbf49" stroke-width="2" stroke-linecap="round" />
            <line x1="46" y1="58" x2="54" y2="58" stroke="#fcbf49" stroke-width="2" stroke-linecap="round" />
            <line x1="47" y1="70" x2="53" y2="70" stroke="#fcbf49" stroke-width="2" stroke-linecap="round" />
          </svg>
        `;
      case 'cat':
        // さかな
        return `
          <svg viewBox="0 0 100 100" class="food-svg item-fish">
            <!-- しっぽ -->
            <polygon points="20,50 10,36 10,64" fill="#48cae4" stroke="#0077b6" stroke-width="2" />
            <!-- 体 -->
            <ellipse cx="50" cy="50" rx="32" ry="20" fill="#90e0ef" stroke="#0077b6" stroke-width="2.5" />
            <!-- おなか -->
            <path d="M 30 50 Q 50 68 70 50" fill="#ffffff" opacity="0.8" />
            <!-- エラ・うろこ -->
            <path d="M 64 40 Q 60 50 64 60" fill="none" stroke="#0077b6" stroke-width="2" stroke-linecap="round" />
            <path d="M 48 42 Q 44 50 48 58" fill="none" stroke="#0096c7" stroke-width="2" stroke-linecap="round" />
            <!-- 目 -->
            <circle cx="72" cy="46" r="3.5" fill="#2d3748" />
            <circle cx="73" cy="45" r="1.2" fill="#ffffff" />
          </svg>
        `;
      case 'guinea_pig':
        // れたす
        return `
          <svg viewBox="0 0 100 100" class="food-svg item-lettuce">
            <!-- 外葉 -->
            <path d="M 25 55 C 20 30 45 20 50 35 C 55 20 80 30 75 55 C 80 75 60 85 50 78 C 40 85 20 75 25 55 Z" fill="#74c69d" stroke="#2d6a4f" stroke-width="2.5" />
            <!-- 内葉 -->
            <path d="M 32 52 C 30 38 45 32 50 42 C 55 32 70 38 68 52 C 70 66 58 72 50 68 C 42 72 30 66 32 52 Z" fill="#95d5b2" stroke="#40916c" stroke-width="2" />
            <!-- 葉脈 -->
            <path d="M 50 72 L 50 46 M 50 60 L 40 52 M 50 54 L 60 48" fill="none" stroke="#d8f3dc" stroke-width="3" stroke-linecap="round" />
          </svg>
        `;
      case 'dog':
      default:
        // ほね
        return `
          <svg viewBox="0 0 100 100" class="food-svg item-bone">
            <!-- 左の丸2つ -->
            <circle cx="32" cy="42" r="12" fill="#f8f9fa" stroke="#ced4da" stroke-width="2.5" />
            <circle cx="32" cy="58" r="12" fill="#f8f9fa" stroke="#ced4da" stroke-width="2.5" />
            <!-- 右の丸2つ -->
            <circle cx="68" cy="42" r="12" fill="#f8f9fa" stroke="#ced4da" stroke-width="2.5" />
            <circle cx="68" cy="58" r="12" fill="#f8f9fa" stroke="#ced4da" stroke-width="2.5" />
            <!-- 中央の棒 -->
            <rect x="30" y="44" width="40" height="12" rx="4" fill="#f8f9fa" stroke="#ced4da" stroke-width="2.5" />
          </svg>
        `;
    }
  },

  // おやつ（動物別）
  // イヌ: イヌようクッキー（骨型クッキー）
  // ネコ: ネコようクッキー（魚型クッキー）
  // モルモット: タネ（ひまわりのタネ）
  // ウサギ: ニンジンクッキー
  getSnackSVG(petType) {
    switch (petType) {
      case 'rabbit':
        // ニンジンクッキー (人参が描かれた丸い焼きクッキー)
        return `
          <svg viewBox="0 0 100 100" class="snack-svg item-carrot-cookie">
            <circle cx="50" cy="50" r="36" fill="#f3c68f" stroke="#d4a373" stroke-width="3" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#e09f67" stroke-width="1.5" stroke-dasharray="4,4" />
            <!-- 小さな人参アイコン印 -->
            <path d="M 45 42 Q 50 40 55 42 L 51 64 Q 50 66 49 64 Z" fill="#f77f00" />
            <path d="M 48 40 L 46 35 M 52 40 L 54 35" stroke="#52b788" stroke-width="2" stroke-linecap="round" />
          </svg>
        `;
      case 'cat':
        // ネコようクッキー (魚型の香ばしいクッキー)
        return `
          <svg viewBox="0 0 100 100" class="snack-svg item-cat-cookie">
            <polygon points="24,50 15,38 15,62" fill="#e9c46a" stroke="#c58f5e" stroke-width="2.5" />
            <ellipse cx="52" cy="50" rx="30" ry="18" fill="#f4a261" stroke="#c58f5e" stroke-width="3" />
            <circle cx="68" cy="46" r="3" fill="#8d5b4c" />
            <!-- クッキーの焼きポツポツ -->
            <circle cx="45" cy="46" r="1.5" fill="#8d5b4c" />
            <circle cx="54" cy="52" r="1.5" fill="#8d5b4c" />
            <circle cx="40" cy="54" r="1.5" fill="#8d5b4c" />
          </svg>
        `;
      case 'guinea_pig':
        // タネ (ひまわりのタネ)
        return `
          <svg viewBox="0 0 100 100" class="snack-svg item-seed">
            <path d="M 50 20 C 35 45 35 68 45 80 C 50 85 55 80 65 68 C 65 45 50 20 50 20 Z" fill="#495057" stroke="#212529" stroke-width="2.5" />
            <!-- タネの縦縞ストライプ -->
            <path d="M 46 32 Q 40 55 45 74" fill="none" stroke="#f8f9fa" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 54 32 Q 60 55 55 74" fill="none" stroke="#f8f9fa" stroke-width="2.5" stroke-linecap="round" />
          </svg>
        `;
      case 'dog':
      default:
        // イヌようクッキー (骨型ビスケット)
        return `
          <svg viewBox="0 0 100 100" class="snack-svg item-dog-cookie">
            <circle cx="34" cy="43" r="11" fill="#e9c46a" stroke="#c58f5e" stroke-width="2.5" />
            <circle cx="34" cy="57" r="11" fill="#e9c46a" stroke="#c58f5e" stroke-width="2.5" />
            <circle cx="66" cy="43" r="11" fill="#e9c46a" stroke="#c58f5e" stroke-width="2.5" />
            <circle cx="66" cy="57" r="11" fill="#e9c46a" stroke="#c58f5e" stroke-width="2.5" />
            <rect x="32" y="44" width="36" height="12" rx="4" fill="#e9c46a" stroke="#c58f5e" stroke-width="2.5" />
            <!-- クッキーの穴 -->
            <circle cx="44" cy="50" r="1.5" fill="#8d5b4c" />
            <circle cx="56" cy="50" r="1.5" fill="#8d5b4c" />
          </svg>
        `;
    }
  },

  // ボール (ボール遊び用)
  getBallSVG() {
    return `
      <svg viewBox="0 0 100 100" class="item-ball-svg">
        <circle cx="50" cy="50" r="42" fill="#e63946" stroke="#d90429" stroke-width="3" />
        <!-- ボールの帯ストライプ -->
        <path d="M 12 50 Q 50 15 88 50 Q 50 85 12 50 Z" fill="#ffd166" stroke="#fb8500" stroke-width="2" />
        <!-- 白い星マーク -->
        <polygon points="50,38 53,46 62,46 55,51 57,59 50,54 43,59 45,51 38,46 47,46" fill="#ffffff" />
      </svg>
    `;
  },

  // 歯ブラシ (はみがき用)
  getToothbrushSVG() {
    return `
      <svg viewBox="0 0 100 100" class="tool-svg">
        <!-- 持ち手 -->
        <path d="M 75 80 L 40 38" stroke="#48cae4" stroke-width="12" stroke-linecap="round" />
        <!-- ヘッド -->
        <rect x="25" y="20" width="22" height="15" rx="5" fill="#48cae4" transform="rotate(-40 36 27)" />
        <!-- 毛 -->
        <rect x="23" y="12" width="20" height="10" rx="2" fill="#ffffff" stroke="#ced4da" stroke-width="1" transform="rotate(-40 33 17)" />
        <!-- 歯磨き粉 -->
        <ellipse cx="28" cy="12" rx="7" ry="4" fill="#ff70a6" transform="rotate(-40 28 12)" />
      </svg>
    `;
  },

  // せっけん (手洗い用)
  getSoapItemSVG() {
    return `
      <svg viewBox="0 0 100 100" class="tool-svg">
        <rect x="20" y="30" width="60" height="40" rx="18" fill="#b9fbc0" stroke="#70e000" stroke-width="3" />
        <!-- 石鹸のツヤ -->
        <ellipse cx="42" cy="44" rx="14" ry="5" fill="#ffffff" opacity="0.6" transform="rotate(-10 42 44)" />
        <!-- 泡 -->
        <circle cx="68" cy="32" r="10" fill="#ffffff" opacity="0.8" stroke="#a2d2ff" stroke-width="1" />
        <circle cx="78" cy="42" r="7" fill="#ffffff" opacity="0.8" stroke="#a2d2ff" stroke-width="1" />
      </svg>
    `;
  },

  // シャワーヘッド (お風呂用)
  getShowerHeadSVG() {
    return `
      <svg viewBox="0 0 100 100" class="tool-svg">
        <path d="M 70 80 L 45 45" stroke="#adb5bd" stroke-width="10" stroke-linecap="round" />
        <path d="M 45 45 L 35 30" stroke="#ced4da" stroke-width="12" stroke-linecap="round" />
        <ellipse cx="30" cy="25" rx="18" ry="8" fill="#495057" stroke="#343a40" stroke-width="2" transform="rotate(-30 30 25)" />
        <!-- シャワーのお湯 -->
        <line x1="20" y1="35" x2="10" y2="70" stroke="#90e0ef" stroke-width="3" stroke-dasharray="6,4" />
        <line x1="27" y1="35" x2="22" y2="72" stroke="#90e0ef" stroke-width="3" stroke-dasharray="6,4" />
        <line x1="35" y1="35" x2="35" y2="72" stroke="#90e0ef" stroke-width="3" stroke-dasharray="6,4" />
      </svg>
    `;
  },

  // ドライヤー (お風呂あがり用)
  getDryerSVG() {
    return `
      <svg viewBox="0 0 100 100" class="tool-svg">
        <!-- 持ち手 -->
        <rect x="52" y="48" width="14" height="34" rx="6" fill="#ff70a6" transform="rotate(15 59 65)" />
        <!-- 本体筒 -->
        <rect x="25" y="30" width="46" height="24" rx="8" fill="#ff99c8" stroke="#f72585" stroke-width="2" />
        <rect x="20" y="32" width="8" height="20" rx="3" fill="#495057" />
        <!-- 風のエフェクト -->
        <path d="M 16 36 Q 5 38 2 40" stroke="#ffd166" stroke-width="3" stroke-linecap="round" fill="none" />
        <path d="M 16 42 Q 4 42 1 44" stroke="#ffd166" stroke-width="3" stroke-linecap="round" fill="none" />
        <path d="M 16 48 Q 5 46 2 48" stroke="#ffd166" stroke-width="3" stroke-linecap="round" fill="none" />
      </svg>
    `;
  }
};

window.SVGAssets = SVGAssets;
