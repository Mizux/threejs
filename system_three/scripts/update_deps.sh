#!/usr/bin/env sh
set -eux

# Check wget is available
command -v wget

#wget -N --trust-server-name https://unpkg.com/three/build/three.js
wget -N --trust-server-name https://unpkg.com/three/build/three.module.js

# wget -N --trust-server-name https://unpkg.com/stats-js/build/stats.js
wget -N --trust-server-name https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/libs/stats.module.js

#wget -N --trust-server-name https://unpkg.com/dat.gui/build/dat.gui
wget -N --trust-server-name https://unpkg.com/dat.gui/build/dat.gui.module
wget -N --trust-server-name https://unpkg.com/dat.gui/build/dat.gui.module.js.map
