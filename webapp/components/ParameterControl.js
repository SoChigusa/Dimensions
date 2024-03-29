import { useRecoilState } from "recoil";
import genKey from "@/utils/genKey";
import { inputState, outputState } from "@/src/atom";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { PlusOne } from "@mui/icons-material";
import ParameterFields from "./ParameterFields";
import UnitControl from "./UnitControl";

// minimal input parameters used as default
const genDefaultParameter = () => {
  return {
    key: genKey(),
    display: true,
    name: '',
    power: '1',
    value: '1',
    units: [{ key: genKey(), name: 'const', power: '1' }]
  }
};

// minimal input constants used as default
const genDefaultConstant = () => {
  return {
    key: genKey(),
    display: false,
    name: '1',
    power: '1',
    value: '1',
    units: []
  }
};

const OutputParameterControl = ({ onChange, onBlur }) => {
  const [output, setOutput] = useRecoilState(outputState);
  const removeUnit = i => {
    let newParameter = JSON.parse(JSON.stringify(output));
    newParameter.units.splice(i, 1);
    setOutput(newParameter);
    onBlur({ newOutput: newParameter });
  };
  const addUnit = (u, i) => {
    let newParameter = JSON.parse(JSON.stringify(output));
    newParameter.units.splice(i + 1, 0, u);
    setOutput(newParameter);
    onBlur({ newOutput: newParameter });
  };

  return (
    <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
      <ParameterFields
        key={output.key}
        id={output.key}
        isOutput
        defaultValue={{ name: output.name }}
        onChange={onChange}
        onBlur={onBlur}
      />
      <UnitControl
        units={output.units}
        removeUnit={removeUnit}
        addUnit={addUnit}
        onChange={onChange}
        onBlur={onBlur}
      />
    </Stack>
  )
};

const InputParameterControl = ({ onChange, onBlur }) => {
  const [input, setInput] = useRecoilState(inputState);
  const giveParameterFields = (elem, index) => {
    const toggleDisplay = () => {
      let newParameter = JSON.parse(JSON.stringify(input[index])); // copy object instead of use reference
      newParameter.display = !newParameter.display;
      const newInput = [
        ...input.slice(0, index),
        newParameter,
        ...input.slice(index + 1)
      ];
      setInput(newInput);
      onBlur({ newInput: newInput });
    };
    const removeParameter = () => {
      const newInput = input.filter((e, i) => (i !== index));
      setInput(newInput);
      onBlur({ newInput: newInput });
    };
    const addConstant = () => {
      const newInput = [
        ...input.slice(0, index + 1),
        genDefaultConstant(),
        ...input.slice(index + 1)
      ];
      setInput(newInput);
      onBlur({ newInput: newInput });
    };
    const addParameter = () => {
      const newInput = [
        ...input.slice(0, index + 1),
        genDefaultParameter(),
        ...input.slice(index + 1)
      ];
      setInput(newInput);
      onBlur({ newInput: newInput });
    };
    const removeUnit = i => {
      let newParameter = JSON.parse(JSON.stringify(input[index]));
      newParameter.units.splice(i, 1);
      const newInput = [
        ...input.slice(0, index),
        newParameter,
        ...input.slice(index + 1)
      ];
      setInput(newInput);
      onBlur({ newInput: newInput });
    };
    const addUnit = (u, i) => {
      let newParameter = JSON.parse(JSON.stringify(input[index]));
      newParameter.units.splice(i + 1, 0, u);
      const newInput = [
        ...input.slice(0, index),
        newParameter,
        ...input.slice(index + 1)
      ];
      setInput(newInput);
      onBlur({ newInput: newInput });
    };

    return (
      <Stack key={input[index].key} spacing={1} direction="row" sx={{ alignItems: 'center' }}>
        <Stack spacing={1} direction="column">
          <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
            <ParameterFields
              key={input[index].key}
              id={input[index].key}
              checked={elem.display}
              defaultValue={{ name: elem.name, power: elem.power }}
              isConst={elem.units.length == 0}
              onCheck={toggleDisplay}
              onChange={onChange}
              onBlur={onBlur}
            />
            <Box sx={{ display: 'inline' }}>
              <IconButton aria-label='delete' disabled={input.length == 1 && index == 0} color="primary" onClick={removeParameter}>
                <RemoveCircleOutlineIcon />
              </IconButton>
              <IconButton aria-label='add-constant' color="primary" onClick={addConstant}>
                <PlusOne />
              </IconButton>
              <IconButton aria-label='add' color="primary" onClick={addParameter}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
          </Stack>
          {elem.units.length > 0 ? (
            <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
              <Typography variant='body1' ml={6}>
                =
              </Typography>
              <TextField
                required
                id={`parameter-value-${input[index].key}`}
                key={`parameter-value-${input[index].key}`}
                size="small"
                label="value"
                defaultValue={elem.value}
                onChange={onChange}
                onBlur={onBlur}
              />
              <UnitControl
                units={elem.units}
                removeUnit={removeUnit}
                addUnit={addUnit}
                onChange={onChange}
                onBlur={onBlur}
              />
            </Stack>
          ) : (<></>)}
        </Stack>
      </Stack>
    )
  };

  return (
    <Stack spacing={1} direction="column">
      {input.map(giveParameterFields)}
    </Stack>
  )
};

const ParameterControl = ({ onChange, onBlur }) => {
  return (
    <>
      {OutputParameterControl({ onChange, onBlur })}
      {InputParameterControl({ onChange, onBlur })}
    </>
  );
};

export default ParameterControl;