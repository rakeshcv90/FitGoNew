import {DeviceWidth} from '../../Component/Config';

// iPhone 11/12/13-class width used as the design baseline.
const BASE_WIDTH = 375;
const rawFactor = DeviceWidth / BASE_WIDTH;
// Clamp so tiny phones don't shrink too far and tablets don't blow up text/icons.
const factor = Math.min(Math.max(rawFactor, 0.85), 1.3);

export const scale = (size: number) => Math.round(size * factor);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const navButtonSize = () => clamp(DeviceWidth * 0.1, 42, 60);

export const navButtonRadius = () => navButtonSize() / 2 + 8;
