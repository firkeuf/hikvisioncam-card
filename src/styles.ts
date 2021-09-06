import { html } from 'lit-element';

export const styles = html`
  <style>
    .warning {
      display: block;
      color: black;
      background-color: #fce588;
      padding: 8px;
    }
    #states {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    #states > * {
      margin-bottom: 8px;
    }
    #states > :last-child {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    #states > :first-child {
      margin-top: 0px;
    }
    ha-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .treadmill-card {
      display: flex;
      flex-grow: 1;
      padding-top: 100%;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml,%3Csvg width='512px' height='512px' viewBox='0 0 512 512' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3Etreadmill%3C/title%3E%3Cdefs%3E%3Cfilter x='-2.7%25' y='-4.2%25' width='105.4%25' height='108.4%25' filterUnits='objectBoundingBox' id='filter-1'%3E%3CfeOffset dx='0' dy='2' in='SourceAlpha' result='shadowOffsetOuter1'%3E%3C/feOffset%3E%3CfeGaussianBlur stdDeviation='2' in='shadowOffsetOuter1' result='shadowBlurOuter1'%3E%3C/feGaussianBlur%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0' type='matrix' in='shadowBlurOuter1' result='shadowMatrixOuter1'%3E%3C/feColorMatrix%3E%3CfeMerge%3E%3CfeMergeNode in='shadowMatrixOuter1'%3E%3C/feMergeNode%3E%3CfeMergeNode in='SourceGraphic'%3E%3C/feMergeNode%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='treadmill' filter='url(%23filter-1)' transform='translate(36.000000, 188.044726)' fill='%234D4D4D'%3E%3Crect id='pelon' transform='translate(372.664392, 140.052898) rotate(4.000000) translate(-372.664392, -140.052898) ' x='362.664392' y='42.0528978' width='20' height='196'%3E%3C/rect%3E%3Cpath d='M312.687521,39.7658331 L417.202274,27.845478 C421.592092,27.3448005 425.556622,30.4975718 426.0573,34.8873898 C426.075698,35.0487026 426.089182,35.2105382 426.097731,35.3726716 L426.78216,48.3519134 C427.014824,52.7640612 423.626683,56.529425 419.214535,56.7620888 C419.040103,56.771287 418.865416,56.7747699 418.690756,56.7725318 L314.585059,55.4385181 C310.787092,55.3898508 307.54692,52.6773176 306.830968,48.9471248 L306.646408,47.9855435 C305.922506,44.2139294 308.393164,40.5695935 312.164778,39.8456915 C312.33795,39.8124538 312.512324,39.7858151 312.687521,39.7658331 Z' id='monitor' transform='translate(366.231972, 41.881979) rotate(-28.000000) translate(-366.231972, -41.881979) '%3E%3C/path%3E%3Cpath d='M23,233.955274 L418,233.955274 C430.702549,233.955274 441,244.252725 441,256.955274 C441,269.657824 430.702549,279.955274 418,279.955274 L23,279.955274 C10.2974508,279.955274 1.55561363e-15,269.657824 0,256.955274 C-1.55561363e-15,244.252725 10.2974508,233.955274 23,233.955274 Z' id='base'%3E%3C/path%3E%3Crect id='leg_right' x='392' y='279.955274' width='10' height='5' rx='1'%3E%3C/rect%3E%3Crect id='leg_left' x='32' y='279.955274' width='10' height='5' rx='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    treadmill-bar {
        display: flex;
        justify-content: space-between;
        width: 80%;
        height: 10%;
        position: absolute;
        bottom: 8%;
        left: 10%;
    }
    treadmill-speed {

        display: flex;
        align-items: center;
        color: white;
        font-weight: bold;
    }
    treadmill-grade {

        display: flex;
        align-items: center;
        color: white;
        font-weight: bold;
    }
    treadmill-status {

        display: flex;
        align-items: center;
        color: white;
        font-weight: bold;
    }
    treadmill-surface {
        height: 0;
        width: 100%;
        position: absolute;
        border-top: 5px solid transparent;
        background: linear-gradient(white, white) padding-box,
        repeating-linear-gradient(-90deg, black 0, black 40%, transparent 0, transparent 60%) 0 / 0.9em 0.9em;
        animation: ants 18s linear infinite reverse;
    }

    @keyframes ants {
        to {
            background-position: 100% 100%;
        }
    }


    current-profile {
      position: absolute;
      right: 12%;
      top: 12%;
        font-weight: bold;
        width: 30%;

    }
    heart-rate {
        position: absolute;
        left: 32%;
        top: 27%;
        z-index: 1;
        justify-content: center;
        display: flex;
        flex-direction: column;
        width: 12.5%;
        align-items: stretch;
    }
    .heart-icon {
      animation: heartbeat 1.5s alternate infinite ease-in;
      color: red;
    }
    @keyframes heartbeat {
      0% {
        transform: scale(0.8);
      }
      100% {
        transform: scale(1.5);
      }
    }
    heart-rate-value {
      background-color: black;
        color: #d2d2d2;
      padding-left: 3px;
      padding-right: 3px;
      border-radius: 10px;
      font-weight: bold;
    }
    
    treadmill-duration {
        position: absolute;
        left: 70%;
        bottom: 62%;
        height: 10%;
        width: 40%;
        display: flex;
        align-items: center;
        font-weight: bold;
    }
    screensaver {
      position: absolute;
      right: 20%;
      top: 35%;
      height: 15%;
      width: 15%;
    }
    
    workout {
      position: absolute;
      right: 31%;
      bottom: 17%;
      height: 5%;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    workout-user {
        position: absolute;
        right: 38%;
        bottom: 21%;
        height: 77%;
        width: 62%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    bar-card-row > div {
      flex-basis: 100%;
    }
    bar-card-row:empty {
      display: none;
    }
    bar-card-card {
      display: flex;
      flex-basis: 100%;
      flex-direction: row;
      margin-right: 8px;
    }
    bar-card-card:last-child {
      margin-right: 0px;
    }
    bar-card-background {
      cursor: pointer;
      flex-grow: 1;
      position: relative;
    }
    athlios-card-iconbar {
      color: var(--icon-color, var(--paper-item-icon-color));
      align-items: center;
      align-self: center;
      display: flex;
      height: 40px;
      justify-content: center;
      position: relative;
      width: 40px;
    }
    bar-card-currentbar,
    bar-card-backgroundbar,
    bar-card-contentbar,
    bar-card-targetbar,
    bar-card-animationbar {
      position: absolute;
      height: 100%;
      width: 100%;
      border-radius: var(--bar-card-border-radius, var(--ha-card-border-radius));
    }
    bar-card-contentbar {
      align-items: center;
      color: var(--primary-text-color);
      display: flex;
      justify-content: flex-start;
    }
    .contentbar-direction-right {
      flex-direction: row;
    }
    .contentbar-direction-up {
      flex-direction: column;
    }
    bar-card-backgroundbar {
      background: var(--bar-color);
      filter: brightness(0.5);
      opacity: 0.25;
    }
    bar-card-currentbar {
      background: linear-gradient(
        to var(--bar-direction),
        var(--bar-color) var(--bar-percent),
        #0000 var(--bar-percent),
        #0000 var(--bar-percent)
      );
    }
    bar-card-targetbar {
      background: linear-gradient(
        to var(--bar-direction),
        #0000 var(--bar-percent),
        var(--bar-color) var(--bar-percent),
        var(--bar-color) var(--bar-target-percent),
        #0000 var(--bar-target-percent)
      );
      display: var(--target-display);
      filter: brightness(0.66);
      opacity: 0.33;
    }
    bar-card-markerbar {
      background: var(--bar-color);
      filter: brightness(0.75);
      opacity: 50%;
      position: absolute;
    }
    bar-card-animationbar {
      background-repeat: no-repeat;
      filter: brightness(0.75);
      opacity: 0%;
    }
    .animationbar-horizontal {
      background: linear-gradient(to var(--animation-direction), var(--bar-color) 0%, var(--bar-color) 1%, #0000 1%);
    }
    .animationbar-vertical {
      background: linear-gradient(to var(--animation-direction), #0000 0%, #0000 1%, var(--bar-color) 1%);
    }
    @keyframes animation-increase {
      0% {
        opacity: 50%;
        background-size: var(--bar-percent) 100%;
      }
      100% {
        opacity: 0%;
        background-size: 10000% 100%;
      }
    }
    @keyframes animation-decrease {
      0% {
        opacity: 0%;
        background-size: 10000%;
      }
      100% {
        opacity: 50%;
        background-size: var(--bar-percent);
      }
    }
    @keyframes animation-increase-vertical {
      0% {
        opacity: 50%;
        background-size: 100% var(--bar-percent);
      }
      100% {
        background-size: 100% 0%;
        opacity: 0%;
      }
    }
    @keyframes animation-decrease-vertical {
      0% {
        background-size: 100% 100%;
        opacity: 0%;
      }
      100% {
        opacity: 50%;
        background-size: 100% var(--bar-percent);
      }
    }
    bar-card-indicator {
      align-self: center;
      color: var(--bar-color);
      filter: brightness(0.75);
      height: 16px;
      width: 16px;
      position: relative;
      text-align: center;
    }
    .indicator-direction-right {
      margin-right: -16px;
      left: -6px;
    }
    .indicator-direction-up {
      margin: 4px;
    }
    bar-card-name {
      align-items: center;
      align-self: center;
      justify-content: center;
      margin: 4px;
      overflow: hidden;
      position: relative;
      text-align: left;
      text-overflow: ellipsis;
    }
    .name-outside {
      margin-left: 16px;
    }
    bar-card-value,
    bar-card-min,
    bar-card-max,
    bar-card-divider {
      align-self: center;
      position: relative;
    }
    bar-card-min,
    bar-card-max,
    bar-card-divider {
      font-size: 10px;
      margin: 2px;
      opacity: 0.5;
    }
    .min-direction-up {
      margin-top: auto;
    }
    .min-direction-right {
      margin-left: auto;
    }
    bar-card-divider {
      margin-left: 0px;
      margin-right: 0px;
    }
    bar-card-value {
      white-space: nowrap;
      margin: 4px;
    }
    .value-direction-right {
      margin-left: auto;
    }
    .value-direction-up {
      margin-top: auto;
    }
  </style>
`;

export default styles;
