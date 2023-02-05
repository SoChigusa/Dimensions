import genKey from "@/utils/genKey";
import genLatexSrc from "@/utils/genLatexSrc";
import { atom } from "recoil";

// alert information
export const alertsState = atom({
  key: 'alerts',
  default: [],
});

// input/output information
export const genDefaultOutput = ({ defaultKeys = false } = {}) => {
  return {
    key: defaultKeys ? 'output' : genKey(),
    display: true,
    name: 'R',
    power: '1',
    value: '1',
    units: [{ key: defaultKeys ? 'unitO1' : genKey(), name: 'const', power: '1' }],
  }
};

export const genDefaultInput = ({ defaultKeys = false } = {}) => {
  return [{
    key: defaultKeys ? 'input1' : genKey(),
    display: false,
    name: '',
    power: '1',
    value: '1',
    units: [{ key: defaultKeys ? 'unitI1' : genKey(), name: 'const', power: '1' }]
  }]
};

export const outputState = atom({
  key: 'output',
  default: genDefaultOutput({ defaultKeys: true }),
});

export const inputState = atom({
  key: 'input',
  default: genDefaultInput({ defaultKeys: true }),
});

// results
export const resultState = atom({
  key: 'result',
  default: {
    value: 1,
    latex: genLatexSrc({
      output: genDefaultOutput({ defaultKeys: true }),
      input: genDefaultInput({ defaultKeys: true }),
      value: 1,
    }),
  },
});