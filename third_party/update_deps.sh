#!/usr/bin/env sh
set -eux

# Check wget is available
command -v wget

wget -N --trust-server-name https://unpkg.com/three/build/three.module.js
#wget -N --trust-server-name https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/renderers/CSS3DRenderer.js
#wget -N --trust-server-name https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/controls/OrbitControls.js

wget -N --trust-server-name https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/libs/stats.module.js

#wget -N --trust-server-name https://unpkg.com/dat.gui/build/dat.gui.module
#wget -N --trust-server-name https://unpkg.com/dat.gui/build/dat.gui.module.js.map

#wget -N --trust-server-name https://unpkg.com/gsap/dist/all.js
#wget -N --trust-server-name https://unpkg.com/gsap/dist/gsap.js

wget -N --trust-server-name https://unpkg.com/es6-tween/bundled/Tween.js

wget -N --trust-server-name https://unpkg.com/rot-js/dist/rot.js
