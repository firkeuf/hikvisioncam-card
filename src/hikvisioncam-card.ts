import { LitElement, html, customElement, property, TemplateResult, PropertyValues } from 'lit-element';
import {
  HomeAssistant,
  hasAction,
  handleAction,
  LovelaceCardEditor,
  domainIcon,
  computeDomain,
} from 'custom-card-helpers';

import './editor';

import { BarCardConfig } from './types';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';
import { mergeDeep, hasConfigOrEntitiesChanged, createConfigArray } from './helpers';
import { styles } from './styles';

/* eslint no-console: 0 */
console.info(
  `%c  HikvisionCam-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: white; font-weight: bold; background: blue',
  'color: white; font-weight: bold; background: dimgray',
);

// TODO Name your custom element
@customElement('athlios-card')
export class HikvisioncamCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('athlios-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): object {
    return {};
  }

  @property() public hass?: HomeAssistant;
  @property() private _config!: BarCardConfig;
  @property() private _configArray: BarCardConfig[] = [];
  private _stateArray: any[] = [];
  private _animationState: any[] = [];
  private _rowAmount = 1;

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntitiesChanged(this, changedProps, false);
  }

  public setConfig(config: BarCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    this._config = mergeDeep(
      {
        animation: {
          state: 'off',
          speed: 5,
        },
        color: 'var(--bar-card-color, var(--primary-color))',
        columns: 1,
        direction: 'right',
        //max: 100,
        //min: 0,
        positions: {
          icon: 'outside',
          indicator: 'outside',
          name: 'inside',
          minmax: 'off',
          value: 'inside',
        },
      },
      config,
    );

    if (this._config.stack == 'horizontal') this._config.columns = this._config.entities.length;
    this._configArray = createConfigArray(this._config);
    this._rowAmount = this._configArray.length / this._config.columns;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    return html`
      <ha-card
        .header=${this._config.title ? this._config.title : null}
        style="${this._config.entity_row ? 'background: #0000; box-shadow: none;' : ''}"
      >
        ${styles}

        <div
          class="treadmill-card"
          style="${this._config.entity_row ? 'padding: 0px;' : ''} ${this._config.direction == 'up'
            ? ''
            : 'flex-grow: 0;'}"
        >
          ${this._createTreadmillArray()}
        </div>
      </ha-card>
    `;
  }

  private _statusTreadmill(config): TemplateResult {
    const state = this.hass!.states[config.entity].state;
    if (state == 'off') {
      return html`
        <treadmill-status>
          <athlios-card-iconbar>
            <ha-icon style="color: red" icon="mdi:power-off"></ha-icon>
          </athlios-card-iconbar>
          Stopped
        </treadmill-status>
      `;
    } else {
      return html`
        <treadmill-status>
          <athlios-card-iconbar>
            <ha-icon style="color: #3aea0f" icon="mdi:power"></ha-icon>
          </athlios-card-iconbar>
          Running
        </treadmill-status>
      `;
    }
  }
  private _humanTreadmill(StatusConfig, SpeedConfig, InactiveTimeConfig, ScreenSaverConfig): TemplateResult {
    const status = this.hass!.states[StatusConfig.entity].state;
    const speed = this.hass!.states[SpeedConfig.entity].state;
    const inactiveTime = this.hass!.states[InactiveTimeConfig.entity].state;
    const screenSaver = this.hass!.states[ScreenSaverConfig.entity].state;
    let icon = 'mdi:human-male';
    let shift = 3;
    if (speed != 'unknown' && parseFloat(speed) != 0) {
      icon = 'mdi:run';
      shift = 0;
    }
    if (status != 'off' || (parseInt(inactiveTime, 10) <= 60 && screenSaver == 'off')) {
      return html`
        <workout-user>
          <athlios-card-iconbar style="height: 100%; width: 100%; right: ${shift}%;">
            <ha-icon style="color: #8c8c8c; --mdc-icon-size: 130%;" icon="${icon}"></ha-icon>
          </athlios-card-iconbar>
        </workout-user>
      `;
    }
    return html``;
  }
  private _speedTreadmill(config): TemplateResult {
    const state = this.hass!.states[config.entity].state;
    const units = this.hass!.states[config.entity].attributes.unit_of_measurement;
    const value = parseFloat(state);
    if (state != 'unknown' && value != 0) {
      return html`
        <treadmill-surface></treadmill-surface>
        <treadmill-speed>
          <athlios-card-iconbar>
            <ha-icon style="color: #c1bfff" icon="mdi:speedometer"></ha-icon>
          </athlios-card-iconbar>
          ${value.toFixed(1)} ${units}
        </treadmill-speed>
      `;
    } else {
      return html`
        <treadmill-speed></treadmill-speed>
      `;
    }
  }

  private _gradeTreadmill(config): TemplateResult {
    const state = this.hass!.states[config.entity].state;
    const units = this.hass!.states[config.entity].attributes.unit_of_measurement;
    const value = parseFloat(state);
    if (state != 'unknown' && value != 0) {
      return html`
        <treadmill-grade>
          <athlios-card-iconbar>
            <ha-icon style="color: #c1bfff" icon="mdi:angle-acute"></ha-icon>
          </athlios-card-iconbar>
          ${value.toFixed(1)} ${units}
        </treadmill-grade>
      `;
    } else {
      return html`
        <treadmill-grade> </treadmill-grade>
      `;
    }
  }

  private _createTreadmillArray(): TemplateResult[] {
    const perRowArray: object[] = [];
    const rowArray: TemplateResult[] = [];
    const sensorStatus = this._configArray.find(obj => {
      return obj.entity.includes('_treadmill_status');
    });
    const sensorSpeed = this._configArray.find(obj => {
      return obj.entity.includes('_speed');
    });
    const sensorGrade = this._configArray.find(obj => {
      return obj.entity.includes('_grade');
    });
    const sensorInactiveTime = this._configArray.find(obj => {
      return obj.entity.includes('_inactive_time');
    });
    const sensorScreenSaver = this._configArray.find(obj => {
      return obj.entity.includes('_screensaver');
    });

    rowArray.push(html`
      ${this._humanTreadmill(sensorStatus, sensorSpeed, sensorInactiveTime, sensorScreenSaver)}
      <treadmill-bar>
        ${this._statusTreadmill(sensorStatus)} ${this._gradeTreadmill(sensorGrade)} ${this._speedTreadmill(sensorSpeed)}
      </treadmill-bar>
    `);
    for (const config of this._configArray) {
      const state = this.hass!.states[config.entity].state;
      const units = this.hass!.states[config.entity].attributes.unit_of_measurement;

      if (config.entity.includes('_current_profile')) {
        if (state != 'empty') {
          rowArray.push(html`
            <current-profile>${state}</current-profile>
          `);
        }
      }

      if (config.entity.includes('_heart_rate')) {
        const value = parseFloat(state);
        if (state != 'unknown' && value > 40) {
          rowArray.push(html`
            <heart-rate>
              <athlios-card-iconbar>
                <ha-icon class="heart-icon" icon="mdi:heart-pulse"></ha-icon>
              </athlios-card-iconbar>
              <heart-rate-value>${value.toFixed()} ${units}</heart-rate-value>
            </heart-rate>
          `);
        }
      }

      if (config.entity.includes('_duration')) {
        if (state != 'unknown') {
          rowArray.push(html`
            <treadmill-duration>
              <athlios-card-iconbar>
                <ha-icon icon="mdi:clock-start"></ha-icon>
              </athlios-card-iconbar>
              ${state}
            </treadmill-duration>
          `);
        }
      }
      if (config.entity.includes('_screensaver')) {
        if (state != 'off') {
          rowArray.push(html`
            <screensaver>
              <svg viewBox="0 0 49 39">
                <defs>
                  <path
                    d="M31,14 L25,14 L25,12 L28.39,8 L25,8 L25,6 L31,6 L31,8 L27.62,12 L31,12 L31,14 M23,18 L17,18 L17,16 L20.39,12 L17,12 L17,10 L23,10 L23,12 L19.62,16 L23,16 L23,18 M15,22 L9,22 L9,20 L12.39,16 L9,16 L9,14 L15,14 L15,16 L11.62,20 L15,20 L15,22 Z"
                    id="path-1"
                  ></path>
                  <filter
                    x="-31.8%"
                    y="-31.2%"
                    width="163.6%"
                    height="187.5%"
                    filterUnits="objectBoundingBox"
                    id="filter-2"
                  >
                    <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix
                      values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0"
                      type="matrix"
                      in="shadowBlurOuter1"
                    ></feColorMatrix>
                  </filter>
                  <path
                    d="M19.5,27 C23.9613795,27 32.3666036,26.0785167 35.6269439,28.4788316 C35.2959585,23.3608754 39,17.8671968 39,13.5 C39,6.04415588 30.2695526,0 19.5,0 C8.73044738,0 0,6.04415588 0,13.5 C0,20.9558441 8.73044738,27 19.5,27 Z"
                    id="path-3"
                  ></path>
                  <filter
                    x="-19.2%"
                    y="-19.3%"
                    width="138.5%"
                    height="154.6%"
                    filterUnits="objectBoundingBox"
                    id="filter-4"
                  >
                    <feMorphology
                      radius="0.5"
                      operator="dilate"
                      in="SourceAlpha"
                      result="shadowSpreadOuter1"
                    ></feMorphology>
                    <feOffset dx="0" dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
                    <feMorphology radius="1" operator="erode" in="SourceAlpha" result="shadowInner"></feMorphology>
                    <feOffset dx="0" dy="2" in="shadowInner" result="shadowInner"></feOffset>
                    <feComposite
                      in="shadowOffsetOuter1"
                      in2="shadowInner"
                      operator="out"
                      result="shadowOffsetOuter1"
                    ></feComposite>
                    <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix
                      values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0"
                      type="matrix"
                      in="shadowBlurOuter1"
                    ></feColorMatrix>
                  </filter>
                </defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="sleep" transform="translate(5.000000, 3.000000)" fill-rule="nonzero">
                    <g id="Shape">
                      <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                      <use fill="#4D4D4D" xlink:href="#path-1"></use>
                    </g>
                    <g id="Oval">
                      <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
                      <use stroke="#4D4D4D" stroke-width="1" xlink:href="#path-3"></use>
                    </g>
                  </g>
                </g>
              </svg>
            </screensaver>
          `);
        }
      }

      if (config.entity.includes('_workout')) {
        if (state != 'unknown') {
          rowArray.push(html`
            <workout> Workout: ${state}</workout>
          `);
        }
      }

      if (config.entity.includes('_phase')) {
        if (state != 'unknown') {
          rowArray.push(html`
            <workout-phase> Current Phase: ${state}</workout-phase>
          `);
        }
      }
    }
    return rowArray;
  }

  getCardSize(): number {
    return 1;
  }
}
