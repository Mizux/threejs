var SVG = function() {
  const pattern = {name: 'paper'};

  const size = {
    width: 512,
    height: 512,
  };

  const colors = {
    fg: '#f1f1f1',
    bg: '#101010'
  };

  const filters = {
    paper: {
      seed: 0,
      numOctaves: 4,
      baseFrequency: 0.064,
      blendMode: "multiply",
    },
    wood: {
      seed: 0,
      numOctaves: 4,
      baseFrequency: 0.064,
      blendMode: "multiply",
    },
    noise_one: {
      seed: 0,
      numOctaves: 1,
      baseFrequency: 0.3,
      blendMode: "normal",
      k1: 2.44,
      k2: 0.5,
      k3: 0.5,
      k4: -0.15,
    },
    noise_two: {
      seed: 0,
      numOctaves: 1,
      baseFrequency: 0.3,
      blendMode: "normal",
      k1: 8.0,
      k2: 0.0,
      k3: 2.0,
      k4: 0.0,
    },
  };


  function getPatternList() {
    return [
      "paper",
      "wood",
      "noise_one",
      "noise_two",
    ];
  }

  function getBlendModeList() {
    return [
      "color",
      "color-burn",
      "color-doge",
      "darken",
      "difference",
      "exclusion",
      "hard-light",
      "hue",
      "lighten",
      "luminosity",
      "multiply",
      "normal",
      "overlay",
      "saturation",
      "screen",
      "soft-light"
    ];
  }

  function svgHeader() {
    return `
<svg
  viewBox="0 0 ${size.width} ${size.height}"
  width="${size.width}" height="${size.height}"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">`;
  }

  function svgFooter() {
    return `</svg>`;
  }

  function printPaperFilter() {
    return `
<filter id="paper" x="0%" y="0%" width="100%" height="100%">
  <feTurbulence
    type="fractalNoise"
    seed="${filters.paper.seed}"
    numOctaves="${filters.paper.numOctaves}"
    baseFrequency="${filters.paper.baseFrequency}"
    stitchTiles="stitch"
    result="noise"
  />
  <feDiffuseLighting
    surfaceScale="2"
    lighting-color=" ${colors.light} "
    in="noise"
    result="diffLight">
    <feDistantLight elevation="33" azimuth="45"/>
  </feDiffuseLighting>
  <feComposite
    operator="in"
    in2="SourceGraphic" result="mask"
  />
  <feBlend
    mode="${filters.paper.blendMode}"
    in="mask" in2="SourceGraphic" result="result"
  />
</filter>
`;
  }

  function printWoodFilter() {
    return `
<filter id="wood" x="0%" y="0%" width="100%" height="100%">
  <feTurbulence
    type="fractalNoise"
    seed="${filters.wood.seed}"
    numOctaves="${filters.wood.numOctaves}"
    baseFrequency="${filters.wood.baseFrequency}"
    stitchTiles="stitch"
    result="noise"
  />
  <feDiffuseLighting
    surfaceScale="2"
    lighting-color=" ${colors.light} "
    in="noise"
    result="diffLight">
    <feDistantLight elevation="33" azimuth="45"/>
  </feDiffuseLighting>
  <feComposite
    operator="in"
    in2="SourceGraphic" result="mask"
  />
  <feBlend
    mode="${filters.wood.blendMode}"
    in="mask" in2="SourceGraphic" result="result"
  />
</filter>
`;
  }

  function printNoise1Filter() {
    return `
<filter id="noise_one" x="0%" y="0%" width="100%" height="100%"
  style="color-interpolation-filters:sRGB;">
  <feTurbulence
     type="turbulence"
     seed="${filters.noise_one.seed}"
     numOctaves="${filters.noise_one.numOctaves}"
     baseFrequency="${filters.noise_one.baseFrequency}"
     stitchTiles="stitch"
     result="noise"
  />
  <feColorMatrix
     type="saturate"
     values="0"
     result="colorMatrix"
  />
  <feComposite
     operator="arithmetic"
     k1="${filters.noise_one.k1}"
     k2="${filters.noise_one.k2}"
     k3="${filters.noise_one.k3}"
     k4="${filters.noise_one.k4}"
     in="SourceGraphic" in2="ColorMatrix" result="mask"
  />
  <feBlend
     mode="${filters.noise_one.blendMode}"
     in="mask" in2="SourceGraphic" result="blend"
  />
  <feComposite
     operator="in"
     in="blend"
     in2="SourceGraphic"
     result="result"
  />
</filter>
`;
  }

  function printNoise2Filter() {
    return `
<filter id="noise_two" x="0%" y="0%" width="100%" height="100%"
  style="color-interpolation-filters:sRGB;">
  <feTurbulence
     type="turbulence"
     seed="${filters.noise_two.seed}"
     numOctaves="${filters.noise_two.numOctaves}"
     baseFrequency="${filters.noise_two.baseFrequency}"
     stitchTiles="stitch"
     result="noise"
  />
  <feColorMatrix
     type="saturate"
     values="0"
     result="colorMatrix"
  />
  <feComposite
     operator="arithmetic"
     k1="${filters.noise_two.k1}"
     k2="${filters.noise_two.k2}"
     k3="${filters.noise_two.k3}"
     k4="${filters.noise_two.k4}"
     in="SourceGraphic" in2="ColorMatrix" result="mask"
  />
  <feBlend
     mode="${filters.noise_two.blendMode}"
     in="mask" in2="SourceGraphic" result="blend"
  />
  <feComposite
     operator="in"
     in="blend"
     in2="SourceGraphic"
     result="result"
  />
</filter>
`;
  }


  function drawPattern() {
    return `
<rect
  x="0" y="0" width="100%" height="100%"
  fill=" ${colors.fg} "
  filter="url(#${pattern.name})"
/>
`;
  }

  function print() {
    let res = svgHeader();
    res += `<defs>`;
    switch(pattern.name) {
      case 'paper':
        res += printPaperFilter();
        break;
      case 'wood':
        res += printWoodFilter();
        break;
      case 'noise_one':
        res += printNoise1Filter();
        break;
      case 'noise_two':
        res += printNoise2Filter();
        break;
      default:
        console.log('Sorry, pattern \"' + pattern.name + '\" unknown.');
    }
    res += `</defs>`;
    res += drawPattern();
    res += svgFooter();
    return res;
  }

  // SVG Module
  return {
    // Public Members
    pattern: pattern,
    size: size,
    colors: colors,
    filters: filters,
    // Public Methods
    print: print,
    getBlendModeList: getBlendModeList,
    getPatternList: getPatternList,
  };
}
