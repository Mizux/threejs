#!/usr/bin/env sh
set -ex

# Check wget is available
command -v wget

wget -N --trust-server-name https://unpkg.com/three/build/three
wget -N --trust-server-name https://unpkg.com/three/build/three.module

wget -N --trust-server-name https://unpkg.com/dat.gui/build/dat.gui

wget -N --trust-server-name https://raw.githubusercontent.com/jonobr1/two.js/master/build/two.js

#wget -N --trust-server-name https://unpkg.com/dat.gui/build/dat.gui.module

#wget -N --trust-server-name https://unpkg.com/chevrotain/lib/chevrotain
