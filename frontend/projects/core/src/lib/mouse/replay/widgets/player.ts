import {css, html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {Replay} from '../replay';


@customElement('gd-player')
export class Player extends LitElement {

  static styles = css`
    .player {
      position: fixed;
      width: 500px;
      height: 100px;
      bottom: 50px;
      left: calc(50% - 250px);
      border: 1px solid lightgray;
      background: white;
      padding: 10px;

      --main-color: #1890ff;
    }

    .video-controls {
      right: 0;
      left: 0;
      padding: 10px;
      position: absolute;
      bottom: 0;
      transition: all 0.2s ease;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
    }

    .video-controls.hide {
      opacity: 0;
      pointer-events: none;
    }

    .video-progress {
      position: relative;
      height: 8.4px;
      margin-bottom: 10px;
    }

    progress {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border-radius: 2px;
      width: 100%;
      height: 8.4px;
      pointer-events: none;
      position: absolute;
      top: 0;
    }

    progress::-webkit-progress-bar {
      background-color: #474545;
      border-radius: 2px;
    }

    progress::-webkit-progress-value {
      background: var(--main-color);
      border-radius: 2px;
    }

    progress::-moz-progress-bar {
      border: 1px solid var(--main-color);
      background: var(--main-color);
    }

    .seek {
      position: absolute;
      top: 0;
      width: 100%;
      cursor: pointer;
      margin: 0;
    }

    .seek:hover + .seek-tooltip {
      display: block;
    }

    .seek-tooltip {
      display: none;
      position: absolute;
      top: -50px;
      margin-left: -20px;
      font-size: 12px;
      padding: 3px;
      content: attr(data-title);
      font-weight: bold;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .bottom-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .left-controls {
      display: flex;
      align-items: center;
      color: #fff;
    }

    .time {
      color: black;
    }

    button {
      cursor: pointer;
      position: relative;
      margin-right: 7px;
      font-size: 12px;
      padding: 3px;
      border: none;
      outline: none;
      background-color: transparent;
    }

    button * {
      pointer-events: none;
    }

    button::before {
      content: attr(data-title);
      position: absolute;
      display: none;
      right: 0;
      top: -50px;
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-weight: bold;
      padding: 4px 6px;
      word-break: keep-all;
      white-space: pre;
    }

    button:hover::before {
      display: inline-block;
    }

    .pip-button svg {
      width: 26px;
      height: 26px;
    }

    .playback-animation {
      pointer-events: none;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -40px;
      margin-top: -40px;
      width: 80px;
      height: 80px;
      border-radius: 80px;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
    }

    input[type=range] {
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 8.4px;
      background: transparent;
      cursor: pointer;
    }

    input[type=range]:focus {
      outline: none;
    }

    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      cursor: pointer;
      border-radius: 1.3px;
      -webkit-appearance: none;
      transition: all 0.4s ease;
    }

    input[type=range]::-webkit-slider-thumb {
      height: 16px;
      width: 16px;
      border-radius: 16px;
      background: var(--main-color);
      cursor: pointer;
      -webkit-appearance: none;
      margin-left: -1px;
    }

    input[type=range]:focus::-webkit-slider-runnable-track {
      background: transparent;
    }

    input[type=range]::-moz-range-track {
      width: 100%;
      height: 8.4px;
      cursor: pointer;
      border: 1px solid transparent;
      background: transparent;
      border-radius: 1.3px;
    }

    input[type=range]::-moz-range-thumb {
      height: 14px;
      width: 14px;
      border-radius: 50px;
      border: 1px solid var(--main-color);
      background: var(--main-color);
      cursor: pointer;
      margin-top: 5px;
    }

    input[type=range]:focus::-moz-range-track {
      outline: none;
    }

    .hidden {
      display: none;
    }

    svg {
      width: 28px;
      height: 28px;
      fill: black;
      stroke: #fff;
      cursor: pointer;
    }
  `;

  constructor(replay: Replay) {
    super();
    this.replay = replay;
  }

  private readonly replay: Replay;

  private playing = true;

  render() {
    return html`
      <div class="player">
        <div class="video-progress">
          <progress id="progress-bar" value="0" min="0"></progress>
          <input class="seek" id="seek" value="0" min="0" type="range" step="1">
          <div class="seek-tooltip" id="seek-tooltip">00:00</div>
        </div>

        <div class="bottom-controls">
          <div class="left-controls">
            <button data-title="${this.playing ? 'Play' : 'Pause'}" @click=${this.togglePlay}>
              <svg class="playback-icons">
                <use href="#play-icon"></use>
                <use class="hidden" href="#pause"></use>
              </svg>
            </button>

            <div class="time">
              <time id="time-elapsed">00:00</time>
              <span> / </span>
              <time id="duration">${this.maxPlayTime()}</time>
            </div>
          </div>
        </div>
      </div>

      <svg style="display: none">
        <defs>
          <symbol id="pause" viewBox="0 0 24 24">
            <path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
          </symbol>

          <symbol id="play-icon" viewBox="0 0 24 24">
            <path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
          </symbol>

          <symbol id="pip" viewBox="0 0 24 24">
            <path
              d="M21 19.031v-14.063h-18v14.063h18zM23.016 18.984q0 0.797-0.609 1.406t-1.406 0.609h-18q-0.797 0-1.406-0.609t-0.609-1.406v-14.016q0-0.797 0.609-1.383t1.406-0.586h18q0.797 0 1.406 0.586t0.609 1.383v14.016zM18.984 11.016v6h-7.969v-6h7.969z"></path>
          </symbol>
        </defs>
      </svg>
    `;
  }

  createPlayer() {
    // const video = document.getElementById('video');
    // const videoControls = document.getElementById('video-controls');
    // const playbackIcons = document.querySelectorAll('.playback-icons use');
    // const timeElapsed = document.getElementById('time-elapsed');
    // const duration = document.getElementById('duration');
    // const progressBar = document.getElementById('progress-bar');
    // const seek = document.getElementById('seek');
    // const seekTooltip = document.getElementById('seek-tooltip');
    // const playbackAnimation = document.getElementById('playback-animation');
    // const pipButton = document.getElementById('pip-button');
    // videoControls.addEventListener('mouseenter', showControls);
    // videoControls.addEventListener('mouseleave', hideControls);
    // seek.addEventListener('mousemove', updateSeekTooltip);
    // seek.addEventListener('input', skipAhead);
    // pipButton.addEventListener('click', togglePip);
  }

  togglePlay() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {

  }

  pause() {

  }

  skipToTimestamp() {

  }

  private formatTime(timeInMs: number) {
    const result = new Date(timeInMs).toISOString().substr(11, 8);

    return {
      minutes: result.substr(3, 2),
      seconds: result.substr(6, 2)
    };
  }

  private maxPlayTime(): string {
    const time = this.formatTime(this.replay.events.playTime);
    return `${time.minutes}:${time.seconds}`;
  }

}





