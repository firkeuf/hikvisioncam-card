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
@customElement('hikvisioncam-card')
export class HikvisioncamCard extends LitElement {
  private _entityName!: string;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('hikvisioncam-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): object {
    return {};
  }

  @property() public hass?: HomeAssistant;
  @property() private _config!: BarCardConfig;
  @property() private _configArray: BarCardConfig[] = [];
  private _stateArray: any[] = [];
  private _animationState: any[] = [];
  private eventsList!: any[] | [];
  private _rowAmount = 1;
  private _EventNumMax = 0;
  private _EventNumMin = 0;
  private _currentEventNum = this._EventNumMax;

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntitiesChanged(this, changedProps, false);
  }


  async fetchRecent(entityId, start, end, skipInitialState, withAttributes): Promise<object> {
    let url = 'history/period';
    if (start) url += `/${start.toISOString()}`;
    url += `?filter_entity_id=${entityId.entity}`;
    if (end) url += `&end_time=${end.toISOString()}`;
    if (skipInitialState) url += '&skip_initial_state';
    if (!withAttributes) url += '&minimal_response';
    if (withAttributes) url += '&significant_changes_only=0';
    // @ts-ignore
    return this.hass.callApi('GET', url);
  }

  private async getHistoryData(enityId, start, end): Promise<object> {
    const response = await this.fetchRecent(enityId, start, end, true, true);
    const hist = response[0]
      .filter(function(o) {
        if (!o.attributes.box) {
          return false;
        } else {
          return o;
        }
      })
      .map(function(o) {
        return o.attributes;
      });

    console.warn('get min max', response);
    this.eventsList = hist;
    this._EventNumMax = hist.length - 1;
    this._currentEventNum = this._EventNumMax;
    console.error('Hist length', hist.length, this._EventNumMax);

    await this.requestUpdate();
    return response;
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
    this._entityName = config.entities[0].entity;

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
          class="hikvisioncam-card"
          style="${this._config.entity_row ? 'padding: 0px;' : ''} ${this._config.direction == 'up'
            ? ''
            : 'flex-grow: 0;'}"
        >
          ${this._createHikvisionArray()}
        </div>
      </ha-card>
    `;
  }

  private _shortTime(timeStr): TemplateResult {
    const time = new Date(timeStr);
    return html`
      <date>${time.toLocaleDateString('en-US')}</date>
      <time>${time.toLocaleTimeString('en-US')}</time>
    `;
  }
  private _getNavBar(list): TemplateResult {
    return html`
      ${list.map((item, i) => {
        return html`
          <item id="hikvisioncam__item_${i}" @click="${(): void => this._setCurrentEventNum(i)}"
            >${this._shortTime(item.last_tripped_time)}</item
          >
        `;
      })}
    `;
  }

  private _createHikvisionArray(): TemplateResult[] {
    const perRowArray: object[] = [];
    const rowArray: TemplateResult[] = [];
    const sensorStatus = this._configArray.find(obj => {
      return obj.entity.includes(this._entityName);
    });

    const end = new Date();
    const start = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
    if (!this.eventsList) {
      this.getHistoryData(sensorStatus, start, end);
    }
    const currentEventData = this.eventsList[this._currentEventNum];
    rowArray.push(html`
      <hikvision-main>
        <nav-bar>
          ${this._getNavBar(this.eventsList)}
        </nav-bar>
        <hikvision-content>
          <div class="hikvisioncam__data">
            <div class="hikvisioncam__name">
              ${currentEventData.friendly_name}
            </div>
            <div class="hikvisioncam__date">
              ${this._shortTime(currentEventData.last_tripped_time)}
            </div>
            <div class="hikvisioncam__box">
              Box [${currentEventData.box.join(', ')}]
            </div>
          </div>

          <div class="hikvisioncam__img">
            <img src="${this._imgUrl(currentEventData.file_path)}" alt="No Image" />
          </div>

          <div class="hikvisioncm__control">
            ${this._currentEventNum}
            <previous-event title="Previous event." @click="${this._previous}">
              <hikvision-card-iconbar>
                <ha-icon style="color: #7d7d7d" icon="mdi:arrow-left-bold-circle-outline"></ha-icon>
              </hikvision-card-iconbar>
            </previous-event>
            <next-event title="Next event." @click="${(): void => this._next(sensorStatus, start, end)}">
              <hikvision-card-iconbar>
                <ha-icon style="color: #7d7d7d" icon="mdi:arrow-right-bold-circle-outline"></ha-icon>
              </hikvision-card-iconbar>
            </next-event>
            <latest-event title="Latest event." @click="${(): void => this._latest(sensorStatus, start, end)}">
              <hikvision-card-iconbar>
                <ha-icon style="color: #7d7d7d" icon="mdi:lastpass"></ha-icon>
              </hikvision-card-iconbar>
            </latest-event>
          </div>
        </hikvision-content>
      </hikvision-main>
    `);

    return rowArray;
  }

  _imgUrl(file_path): string {
    const path = '/local/hikvision/';
    const file = file_path.split('/').slice(-1) + '.orig.jpg';
    return path + encodeURIComponent(file);
  }

  _setCurrentEventNum(i): void {
    if (i <= this._EventNumMax && i >= this._EventNumMin) {
      this._currentEventNum = i;
      this.requestUpdate();
    }
  }

  _previous(): void {
    if (this._currentEventNum > this._EventNumMin) {
      this._currentEventNum -= 1;
      this.requestUpdate();
    }
  }

  _next(sensorStatus, start, end): void {
    if (this._currentEventNum < this._EventNumMax) {
      this._currentEventNum += 1;
      this.requestUpdate();
    } else {
      this.getHistoryData(sensorStatus, start, end);
    }
  }

  _latest(sensorStatus, start, end): void {
    this.getHistoryData(sensorStatus, start, end);
  }

  getCardSize(): number {
    return 1;
  }
}
