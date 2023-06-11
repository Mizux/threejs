// @ts-check
class Stats {
  mode = 0;
  dom;
  #beginTime;
  #prevTime;
  #frames;
  #fpsPanel;
  #msPanel;
  #memPanel;

  constructor() {
    this.dom = document.createElement('div');
    this.dom.style.cssText =
      'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
    this.dom.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        this.showPanel(++this.mode % this.dom.children.length);
      },
      false
    );

    this.#beginTime = (performance || Date).now();
    this.#prevTime = this.#beginTime;
    this.#frames = 0;

    this.#fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
    this.#msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));

    if (self.performance?.memory) {
      this.#memPanel = this.addPanel(new Panel('MB', '#f08', '#201'));
    }
    this.showPanel(0);
  }

  /** @param panel {Panel} */
  addPanel(panel) {
    this.dom.appendChild(panel.canvas);
    return panel;
  }

  /** @param id {number} */
  showPanel(id) {
    for (var i = 0; i < this.dom.children.length; i++) {
      this.dom.children[i].style.display = i === id ? 'block' : 'none';
    }
    this.mode = id;
  }

  begin() {
    this.#beginTime = (performance || Date).now();
  }

  end() {
    this.#frames++;
    const time = (performance || Date).now();
    this.#msPanel.update(time - this.#beginTime, 200);
    if (time >= this.#prevTime + 1000) {
      this.#fpsPanel.update(
        (this.#frames * 1000) / (time - this.#prevTime),
        100
      );
      this.#prevTime = time;
      this.#frames = 0;

      if (this.#memPanel) {
        const memory = performance.memory;
        this.#memPanel.update(
          memory.usedJSHeapSize / 1048576,
          memory.jsHeapSizeLimit / 1048576
        );
      }
    }
    return time;
  }

  update() {
    this.#beginTime = this.end();
  }
}

class Panel {
  static PR = Math.round(window.devicePixelRatio || 1);
  static WIDTH = 80 * Panel.PR;
  static HEIGHT = 48 * Panel.PR;
  static TEXT_X = 3 * Panel.PR;
  static TEXT_Y = 2 * Panel.PR;
  static GRAPH_X = 3 * Panel.PR;
  static GRAPH_Y = 15 * Panel.PR;
  static GRAPH_WIDTH = 74 * Panel.PR;
  static GRAPH_HEIGHT = 30 * Panel.PR;

  #min = Infinity;
  #max = 0;

  /**
   * @param name {string}
   * @param fg {string}
   * @param bg {string} */
  constructor(name, fg, bg) {
    this.name = name;
    this.fg = fg;
    this.bg = bg;

    this.canvas = document.createElement('canvas');
    this.canvas.width = Panel.WIDTH;
    this.canvas.height = Panel.HEIGHT;
    this.canvas.style.cssText = 'width:80px;height:48px';

    this.context = this.canvas.getContext('2d');
    if (this.context === null) {
      console.error('Can\'t build context 2d!');
      return;
    }
    this.context.font =
      'bold ' + 9 * Panel.PR + 'px Helvetica,Arial,sans-serif';
    this.context.textBaseline = 'top';

    this.context.fillStyle = this.bg;
    this.context.fillRect(0, 0, Panel.WIDTH, Panel.HEIGHT);

    this.context.fillStyle = this.fg;
    this.context.fillText(this.name, Panel.TEXT_X, Panel.TEXT_Y);
    this.context.fillRect(
      Panel.GRAPH_X,
      Panel.GRAPH_Y,
      Panel.GRAPH_WIDTH,
      Panel.GRAPH_HEIGHT
    );

    this.context.fillStyle = this.bg;
    this.context.globalAlpha = 0.9;
    this.context.fillRect(
      Panel.GRAPH_X,
      Panel.GRAPH_Y,
      Panel.GRAPH_WIDTH,
      Panel.GRAPH_HEIGHT
    );
  }

  /**
   * @param value {number}
   * @param maxValue {number}
   */
  update(value, maxValue) {
    this.#min = Math.min(this.#min, value);
    this.#max = Math.max(this.#max, value);

    if (this.context === null) return;
    this.context.fillStyle = this.bg;
    this.context.globalAlpha = 1;
    this.context.fillRect(0, 0, Panel.WIDTH, Panel.GRAPH_Y);
    this.context.fillStyle = this.fg;
    this.context.fillText(
      Math.round(value) +
        ' ' +
        this.name +
        ' (' +
        Math.round(this.#min) +
        '-' +
        Math.round(this.#max) +
        ')',
      Panel.TEXT_X,
      Panel.TEXT_Y
    );

    this.context.drawImage(
      this.canvas,
      Panel.GRAPH_X + Panel.PR,
      Panel.GRAPH_Y,
      Panel.GRAPH_WIDTH - Panel.PR,
      Panel.GRAPH_HEIGHT,
      Panel.GRAPH_X,
      Panel.GRAPH_Y,
      Panel.GRAPH_WIDTH - Panel.PR,
      Panel.GRAPH_HEIGHT
    );

    this.context.fillRect(
      Panel.GRAPH_X + Panel.GRAPH_WIDTH - Panel.PR,
      Panel.GRAPH_Y,
      Panel.PR,
      Panel.GRAPH_HEIGHT
    );

    this.context.fillStyle = this.bg;
    this.context.globalAlpha = 0.9;
    this.context.fillRect(
      Panel.GRAPH_X + Panel.GRAPH_WIDTH - Panel.PR,
      Panel.GRAPH_Y,
      Panel.PR,
      Math.round((1 - value / maxValue) * Panel.GRAPH_HEIGHT)
    );
  }
}

export default Stats;
export {Stats, Panel};