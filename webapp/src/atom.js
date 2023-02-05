import { atom } from "recoil";

// alert information
export const alertsState = atom({
  key: 'alerts',
  default: [],
});

// input/output information
export const defaultOutput = {
  key: 'output',
  display: true,
  name: 'R',
  power: '1',
  value: '1',
  units: [{ key: 'unit-1', name: 'const', power: '1' }],
};

export const defaultInput = [{
  key: 'input-1',
  display: false,
  name: '',
  power: '1',
  value: '1',
  units: [{ key: 'unit-1', name: 'const', power: '1' }]
}];

export const outputState = atom({
  key: 'output',
  default: defaultOutput,
});

export const inputState = atom({
  key: 'input',
  default: defaultInput,
});