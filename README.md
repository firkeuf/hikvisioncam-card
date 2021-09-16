
# athlios-card

## [Examples](#examples-1)

![Stopped](https://github.com/firkeuf/athlios-card/blob/master/images/stopped.png?raw=true)

![Running](https://github.com/firkeuf/athlios-card/blob/master/images/running.png?raw=true)

## Installation

Prefered method of installation is [Home Assistant Community Store](https://github.com/hacs/integration).

It's **required** to load this card as `module`.

```yaml
- url: /hacsfiles/athlios-card/athlios-card.js
  type: module
```

## Example

```yaml
type: custom:athlios-card
entities:
  - entity: binary_sensor.athlios_home_screensaver
  - entity: binary_sensor.athlios_home_treadmill_status
  - entity: sensor.athlios_home_current_profile
  - entity: sensor.athlios_home_heart_rate
  - entity: sensor.athlios_home_workout
  - entity: sensor.athlios_home_phase
  - entity: sensor.athlios_home_speed
  - entity: sensor.athlios_home_grade
  - entity: sensor.athlios_home_duration
```


## Credits

Inspired by [Bar Card](https://github.com/custom-cards/bar-card).

