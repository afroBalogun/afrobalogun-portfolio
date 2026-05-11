import React from 'react';

const Neko = () => {
  return (
    <div className="relative flex items-center justify-center overflow-hidden selection:bg-transparent">
      {/* SVG Grain Overlay - Consistent with your high-end minimalist preference */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%22180%22_height=%22180%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.85%22_numOctaves=%224%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22180%22_height=%22180%22_filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      <div className="group flex flex-col items-center cursor-pointer">
        {/* Cat Wrapper with Floating Animation */}
        <div className="animate-float origin-bottom">
          <svg 
            width="215" height="309" viewBox="0 0 215 309" 
            className="drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="fur" x="-3%" y="-3%" width="106%" height="106%">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="7" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
              <filter id="ds" x="-8%" y="-8%" width="116%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.14)"/>
              </filter>
              <clipPath id="c-tail"><rect x="0" y="182" width="92" height="127"/></clipPath>
              <clipPath id="c-body"><rect x="0" y="78" width="215" height="158"/></clipPath>
              <clipPath id="c-head"><rect x="25" y="0" width="165" height="108"/></clipPath>
              <clipPath id="c-earl"><rect x="25" y="0" width="72" height="66"/></clipPath>
              <clipPath id="c-earr"><rect x="116" y="0" width="74" height="66"/></clipPath>
            </defs>

            {/* TAIL - Changes animation on group hover */}
            <g id="layer-tail" filter="url(#fur)" className="origin-[68px_202px] animate-tailSway group-hover:animate-tailWag">
              <g clipPath="url(#c-tail)">
                <g transform="translate(0,309) scale(0.1,-0.1)" fill="#1c1c1c">
                  <path d="M1146 2145 c-36 -31 -65 -46 -103 -55 l-54 -12 -40 42 c-45 47 -66 44 -84 -11 -9 -25 -8 -45 4 -87 10 -38 12 -59 5 -70 -6 -10 -9 -46 -7 -82 5 -80 -14 -195 -38 -235 -31 -53 -62 -202 -61 -300 0 -95 9 -155 23 -155 5 0 6 -6 3 -14 -13 -34 90 -167 139 -180 21 -5 21 -4 -3 14 -14 11 -20 20 -15 20 6 0 -1 6 -15 13 -18 9 -25 21 -25 40 1 15 -3 27 -7 27 -4 0 -8 -5 -8 -11 0 -8 -5 -7 -15 1 -9 7 -14 19 -11 27 3 7 1 13 -5 13 -6 0 -7 5 -4 10 4 6 2 16 -3 23 -14 17 -22 138 -10 160 5 9 5 17 1 16 -21 -4 -33 2 -33 16 0 8 3 15 8 15 4 0 8 12 9 28 6 113 12 145 27 160 12 13 19 14 24 5 5 -8 13 -9 22 -3 11 7 12 10 2 10 -7 0 -20 7 -28 15 -9 8 -11 15 -5 15 6 0 7 7 4 17 -5 12 -3 14 7 8 8 -5 11 -4 7 2 -8 13 17 36 28 25 5 -4 5 -1 1 6 -4 7 -12 9 -18 6 -7 -4 -8 2 -3 17 10 31 24 49 38 46 6 -1 12 6 13 16 1 10 0 12 -3 3 -2 -8 -10 -13 -17 -10 -16 6 -9 54 8 54 7 0 7 3 -1 8 -14 9 -17 52 -10 181 2 51 1 88 -3 81 -6 -9 -9 -9 -16 1 -4 7 -3 14 4 17 6 2 8 10 5 19 -5 12 -3 14 7 8 10 -6 12 -4 7 8 -3 9 -1 19 5 23 6 4 8 3 5 -3 -4 -6 0 -16 8 -23 13 -11 15 -10 9 6 -5 17 -4 17 7 -1 7 -11 16 -23 21 -26 6 -3 10 -10 11 -15 1 -5 5 -8 10 -7 12 5 8 -15 -5 -20 -8 -4 -9 -6 -2 -6 6 -1 17 6 24 14 11 13 14 13 27 -2 8 -10 12 -12 8 -5 -11 22 6 35 21 15 13 -16 14 -16 8 0 -3 9 -2 17 4 17 6 0 12 -5 14 -10 2 -6 13 -2 26 10 12 11 22 17 22 13 0 -4 5 -1 11 7 7 10 12 11 15 4 3 -6 17 -9 32 -7 21 4 24 2 12 -6 -9 -6 -10 -11 -3 -11 7 0 10 -13 8 -34 -1 -18 1 -39 6 -47 4 -8 3 -19 -3 -26 -8 -10 -7 -12 4 -8 18 7 18 -26 0 -47 -6 -8 -7 -19 -2 -28 5 -8 4 -22 -3 -34 -14 -27 -16 -57 -4 -49 6 4 8 -1 4 -11 -4 -9 -3 -14 2 -11 5 3 12 1 16 -5 3 -5 0 -10 -7 -10 -8 -1 -6 -6 6 -15 11 -8 16 -15 10 -15 -5 0 -2 -5 6 -10 9 -6 11 -10 3 -10 -7 0 -10 -7 -6 -16 3 -9 0 -20 -8 -24 -7 -5 -10 -12 -6 -16 4 -4 14 1 22 12 14 18 15 18 12 -8 -2 -15 -6 -30 -10 -34 -8 -8 1 -24 13 -24 5 0 7 7 4 15 -4 8 -2 15 4 15 14 0 25 -38 34 -112 2 -13 5 -14 16 -5 12 9 14 8 10 -8 -2 -12 -11 -20 -22 -20 -11 0 -21 -6 -22 -13 -1 -7 0 -8 2 -3 3 6 11 8 19 5 7 -3 16 0 20 6 11 18 47 -61 49 -107 0 -22 4 -39 9 -36 4 2 7 -1 7 -6 0 -6 -5 -11 -12 -11 -9 0 -9 -3 0 -12 13 -13 5 -90 -13 -128 -7 -14 -15 -47 -18 -73 -6 -60 -17 -74 -14 -19 1 22 -1 38 -5 36 -5 -3 -8 -16 -8 -29 0 -13 -5 -27 -11 -30 -6 -4 -8 -13 -5 -20 5 -14 -45 -55 -67 -55 -7 0 -19 -6 -25 -12 -10 -10 -17 -10 -32 0 -11 7 -20 8 -20 3 0 -33 80 -30 132 4 43 29 64 64 79 135 6 27 14 48 17 46 17 -10 19 203 2 245 -25 64 -64 154 -70 159 -5 5 -36 81 -60 150 -7 19 -19 49 -26 67 -12 26 -12 41 -3 80 7 26 16 55 20 64 5 10 2 24 -7 37 -10 14 -16 51 -17 107 -2 47 -7 89 -13 94 -5 6 -28 -7 -58 -34z"/>
                </g>
              </g>
            </g>

            {/* BODY */}
            <g id="layer-body" filter="url(#ds)" className="origin-[107px_170px] animate-breathe">
              <g clipPath="url(#c-body)">
                <g transform="translate(0,309) scale(0.1,-0.1)" fill="#1c1c1c">
                  <path d="M1146 2145 c-36 -31 -65 -46 -103 -55 l-54 -12 -40 42 c-45 47 -66 44 -84 -11 -9 -25 -8 -45 4 -87 10 -38 12 -59 5 -70 -6 -10 -9 -46 -7 -82 5 -80 -14 -195 -38 -235 -31 -53 -62 -202 -61 -300 0 -95 9 -155 23 -155 5 0 6 -6 3 -14 -13 -34 90 -167 139 -180 21 -5 21 -4 -3 14 -14 11 -20 20 -15 20 6 0 -1 6 -15 13 -18 9 -25 21 -25 40 1 15 -3 27 -7 27 -4 0 -8 -5 -8 -11 0 -8 -5 -7 -15 1 -9 7 -14 19 -11 27 3 7 1 13 -5 13 -6 0 -7 5 -4 10 4 6 2 16 -3 23 -14 17 -22 138 -10 160 5 9 5 17 1 16 -21 -4 -33 2 -33 16 0 8 3 15 8 15 4 0 8 12 9 28 6 113 12 145 27 160 12 13 19 14 24 5 5 -8 13 -9 22 -3 11 7 12 10 2 10 -7 0 -20 7 -28 15 -9 8 -11 15 -5 15 6 0 7 7 4 17 -5 12 -3 14 7 8 8 -5 11 -4 7 2 -8 13 17 36 28 25 5 -4 5 -1 1 6 -4 7 -12 9 -18 6 -7 -4 -8 2 -3 17 10 31 24 49 38 46 6 -1 12 6 13 16 1 10 0 12 -3 3 -2 -8 -10 -13 -17 -10 -16 6 -9 54 8 54 7 0 7 3 -1 8 -14 9 -17 52 -10 181 2 51 1 88 -3 81 -6 -9 -9 -9 -16 1 -4 7 -3 14 4 17 6 2 8 10 5 19 -5 12 -3 14 7 8 10 -6 12 -4 7 8 -3 9 -1 19 5 23 6 4 8 3 5 -3 -4 -6 0 -16 8 -23 13 -11 15 -10 9 6 -5 17 -4 17 7 -1 7 -11 16 -23 21 -26 6 -3 10 -10 11 -15 1 -5 5 -8 10 -7 12 5 8 -15 -5 -20 -8 -4 -9 -6 -2 -6 6 -1 17 6 24 14 11 13 14 13 27 -2 8 -10 12 -12 8 -5 -11 22 6 35 21 15 13 -16 14 -16 8 0 -3 9 -2 17 4 17 6 0 12 -5 14 -10 2 -6 13 -2 26 10 12 11 22 17 22 13 0 -4 5 -1 11 7 7 10 12 11 15 4 3 -6 17 -9 32 -7 21 4 24 2 12 -6 -9 -6 -10 -11 -3 -11 7 0 10 -13 8 -34 -1 -18 1 -39 6 -47 4 -8 3 -19 -3 -26 -8 -10 -7 -12 4 -8 18 7 18 -26 0 -47 -6 -8 -7 -19 -2 -28 5 -8 4 -22 -3 -34 -14 -27 -16 -57 -4 -49 6 4 8 -1 4 -11 -4 -9 -3 -14 2 -11 5 3 12 1 16 -5 3 -5 0 -10 -7 -10 -8 -1 -6 -6 6 -15 11 -8 16 -15 10 -15 -5 0 -2 -5 6 -10 9 -6 11 -10 3 -10 -7 0 -10 -7 -6 -16 3 -9 0 -20 -8 -24 -7 -5 -10 -12 -6 -16 4 -4 14 1 22 12 14 18 15 18 12 -8 -2 -15 -6 -30 -10 -34 -8 -8 1 -24 13 -24 5 0 7 7 4 15 -4 8 -2 15 4 15 14 0 25 -38 34 -112 2 -13 5 -14 16 -5 12 9 14 8 10 -8 -2 -12 -11 -20 -22 -20 -11 0 -21 -6 -22 -13 -1 -7 0 -8 2 -3 3 6 11 8 19 5 7 -3 16 0 20 6 11 18 47 -61 49 -107 0 -22 4 -39 9 -36 4 2 7 -1 7 -6 0 -6 -5 -11 -12 -11 -9 0 -9 -3 0 -12 13 -13 5 -90 -13 -128 -7 -14 -15 -47 -18 -73 -6 -60 -17 -74 -14 -19 1 22 -1 38 -5 36 -5 -3 -8 -16 -8 -29 0 -13 -5 -27 -11 -30 -6 -4 -8 -13 -5 -20 5 -14 -45 -55 -67 -55 -7 0 -19 -6 -25 -12 -10 -10 -17 -10 -32 0 -11 7 -20 8 -20 3 0 -33 80 -30 132 4 43 29 64 64 79 135 6 27 14 48 17 46 17 -10 19 203 2 245 -25 64 -64 154 -70 159 -5 5 -36 81 -60 150 -7 19 -19 49 -26 67 -12 26 -12 41 -3 80 7 26 16 55 20 64 5 10 2 24 -7 37 -10 14 -16 51 -17 107 -2 47 -7 89 -13 94 -5 6 -28 -7 -58 -34z"/>
                </g>
              </g>
            </g>

            {/* EARS - Interactive animations */}
            <g id="ear-l" className="origin-[68px_42px] animate-earL group-hover:animate-earPerkL">
              <g clipPath="url(#c-earl)">
                <g transform="translate(0,309) scale(0.1,-0.1)" fill="#1c1c1c">
                  <path d="M1146 2145 c-36 -31 -65 -46 -103 -55 l-54 -12 -40 42 c-45 47 -66 44 -84 -11 -9 -25 -8 -45 4 -87 10 -38 12 -59 5 -70 -6 -10 -9 -46 -7 -82 5 -80 -14 -195 -38 -235 -31 -53 -62 -202 -61 -300 0 -95 9 -155 23 -155 5 0 6 -6 3 -14 -13 -34 90 -167 139 -180 21 -5 21 -4 -3 14 -14 11 -20 20 -15 20 6 0 -1 6 -15 13 -18 9 -25 21 -25 40 1 15 -3 27 -7 27 -4 0 -8 -5 -8 -11 0 -8 -5 -7 -15 1 -9 7 -14 19 -11 27 3 7 1 13 -5 13 -6 0 -7 5 -4 10 4 6 2 16 -3 23 -14 17 -22 138 -10 160 5 9 5 17 1 16 -21 -4 -33 2 -33 16 0 8 3 15 8 15 4 0 8 12 9 28 6 113 12 145 27 160 12 13 19 14 24 5 5 -8 13 -9 22 -3 11 7 12 10 2 10 -7 0 -20 7 -28 15 -9 8 -11 15 -5 15 6 0 7 7 4 17 -5 12 -3 14 7 8 8 -5 11 -4 7 2 -8 13 17 36 28 25 5 -4 5 -1 1 6 -4 7 -12 9 -18 6 -7 -4 -8 2 -3 17 10 31 24 49 38 46 6 -1 12 6 13 16 1 10 0 12 -3 3 -2 -8 -10 -13 -17 -10 -16 6 -9 54 8 54 7 0 7 3 -1 8 -14 9 -17 52 -10 181 2 51 1 88 -3 81 -6 -9 -9 -9 -16 1 -4 7 -3 14 4 17 6 2 8 10 5 19 -5 12 -3 14 7 8 10 -6 12 -4 7 8 -3 9 -1 19 5 23 6 4 8 3 5 -3 -4 -6 0 -16 8 -23 13 -11 15 -10 9 6 -5 17 -4 17 7 -1 7 -11 16 -23 21 -26 6 -3 10 -10 11 -15 1 -5 5 -8 10 -7 12 5 8 -15 -5 -20 -8 -4 -9 -6 -2 -6 6 -1 17 6 24 14 11 13 14 13 27 -2 8 -10 12 -12 8 -5 -11 22 6 35 21 15 13 -16 14 -16 8 0 -3 9 -2 17 4 17 6 0 12 -5 14 -10 2 -6 13 -2 26 10 12 11 22 17 22 13 0 -4 5 -1 11 7 7 10 12 11 15 4 3 -6 17 -9 32 -7 21 4 24 2 12 -6 -9 -6 -10 -11 -3 -11 7 0 10 -13 8 -34 -1 -18 1 -39 6 -47 4 -8 3 -19 -3 -26 -8 -10 -7 -12 4 -8 18 7 18 -26 0 -47 -6 -8 -7 -19 -2 -28 5 -8 4 -22 -3 -34 -14 -27 -16 -57 -4 -49 6 4 8 -1 4 -11 -4 -9 -3 -14 2 -11 5 3 12 1 16 -5 3 -5 0 -10 -7 -10 -8 -1 -6 -6 6 -15 11 -8 16 -15 10 -15 -5 0 -2 -5 6 -10 9 -6 11 -10 3 -10 -7 0 -10 -7 -6 -16 3 -9 0 -20 -8 -24 -7 -5 -10 -12 -6 -16 4 -4 14 1 22 12 14 18 15 18 12 -8 -2 -15 -6 -30 -10 -34 -8 -8 1 -24 13 -24 5 0 7 7 4 15 -4 8 -2 15 4 15 14 0 25 -38 34 -112 2 -13 5 -14 16 -5 12 9 14 8 10 -8 -2 -12 -11 -20 -22 -20 -11 0 -21 -6 -22 -13 -1 -7 0 -8 2 -3 3 6 11 8 19 5 7 -3 16 0 20 6 11 18 47 -61 49 -107 0 -22 4 -39 9 -36 4 2 7 -1 7 -6 0 -6 -5 -11 -12 -11 -9 0 -9 -3 0 -12 13 -13 5 -90 -13 -128 -7 -14 -15 -47 -18 -73 -6 -60 -17 -74 -14 -19 1 22 -1 38 -5 36 -5 -3 -8 -16 -8 -29 0 -13 -5 -27 -11 -30 -6 -4 -8 -13 -5 -20 5 -14 -45 -55 -67 -55 -7 0 -19 -6 -25 -12 -10 -10 -17 -10 -32 0 -11 7 -20 8 -20 3 0 -33 80 -30 132 4 43 29 64 64 79 135 6 27 14 48 17 46 17 -10 19 203 2 245 -25 64 -64 154 -70 159 -5 5 -36 81 -60 150 -7 19 -19 49 -26 67 -12 26 -12 41 -3 80 7 26 16 55 20 64 5 10 2 24 -7 37 -10 14 -16 51 -17 107 -2 47 -7 89 -13 94 -5 6 -28 -7 -58 -34z"/>
                </g>
              </g>
            </g>

            <g id="ear-r" className="origin-[148px_42px] animate-earR group-hover:animate-earPerkR">
              <g clipPath="url(#c-earr)">
                {/* SVG path content remains the same */}
              </g>
            </g>

            {/* HEAD - topmost */}
            <g id="layer-head" className="origin-[107px_55px] animate-headSway group-hover:animate-headLook">
              <g clipPath="url(#c-head)">
                {/* SVG path content remains the same */}
              </g>
            </g>
          </svg>
        </div>

        {/* Pulsing Shadow */}
        <div className="w-20 h-[10px] bg-[radial-gradient(ellipse,rgba(0,0,0,0.18)_0%,transparent_70%)] rounded-full -mt-2 animate-shadowPulse" />

        {/* Hint text with Georgia Serif font */}
      </div>

      {/* Tailwind Custom Keyframes - usually placed in tailwind.config.js */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shadowPulse {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50% { transform: scaleX(0.82); opacity: 0.6; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes tailSway {
          0%, 50%, 100% { transform: rotate(0deg); }
          22% { transform: rotate(7deg) skewY(2deg); }
          72% { transform: rotate(-8deg) skewY(-2deg); }
        }
        @keyframes tailWag {
          0%, 100% { transform: rotate(-18deg) skewY(-4deg); }
          50% { transform: rotate(18deg) skewY(4deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.016) translateY(-1px); }
        }
        @keyframes headSway {
          0%, 100% { transform: rotate(0deg); }
          28% { transform: rotate(-1.8deg); }
          62% { transform: rotate(1.4deg); }
        }
        @keyframes headLook {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(-9deg); }
          70% { transform: rotate(9deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes earL {
          0%, 78%, 100% { transform: rotate(0deg); }
          80% { transform: rotate(-7deg) translateY(-3px); }
          88% { transform: rotate(3deg); }
          94% { transform: rotate(0deg); }
        }
        @keyframes earR {
          0%, 55%, 100% { transform: rotate(0deg); }
          57% { transform: rotate(7deg) translateY(-3px); }
          65% { transform: rotate(-3deg); }
          72% { transform: rotate(0deg); }
        }
        .animate-shadowPulse { animation: shadowPulse 4s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-tailSway { animation: tailSway 2.6s cubic-bezier(.45,.05,.55,.95) infinite; }
        .animate-tailWag { animation: tailWag 0.38s ease-in-out infinite; }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
        .animate-headSway { animation: headSway 6s ease-in-out infinite; }
        .animate-headLook { animation: headLook 1.6s ease-in-out 1 forwards; }
        .animate-earL { animation: earL 9s ease-in-out infinite; }
        .animate-earR { animation: earR 12s ease-in-out infinite; }
        .animate-earPerkL { animation: earPerkL 0.3s ease-out 1 forwards; }
        .animate-earPerkR { animation: earPerkR 0.3s ease-out 1 forwards; }
        @keyframes earPerkL { to { transform: rotate(-5deg) translateY(-3px); } }
        @keyframes earPerkR { to { transform: rotate(5deg) translateY(-3px); } }
        .animate-fadeIn { animation: fadeIn 0.8s 2s forwards; }
        @keyframes fadeIn { to { opacity: 1; } }
      `}} />
    </div>
  );
};

export default Neko;