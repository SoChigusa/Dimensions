import genKey from "@/utils/genKey";
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
    name: '',
    power: '1',
    value: '1',
    units: []
  }
};

const OutputParameterControl = ({ output, input, setParameters, onChange }) => {
  const removeUnit = i => {
    let newParameter = output;
    newParameter.units.splice(i, 1);
    setParameters([
      newParameter,
      ...input,
    ]);
  };
  const addUnit = (u, i) => {
    let newParameter = output;
    newParameter.units.splice(i + 1, 0, u);
    setParameters([
      newParameter,
      ...input,
    ]);
  };

  return (
    <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
      <ParameterFields
        key={output.key}
        id={output.key}
        isOutput
        defaultValue={{ name: output.name }}
        onChange={onChange}
      />
      <UnitControl
        units={output.units}
        removeUnit={removeUnit}
        addUnit={addUnit}
        onChange={onChange}
      />
    </Stack>
  )
};

const InputParameterControl = ({ output, input, setParameters, onChange }) => {
  // note a difference between indices of parameters and input (= parameters - output)
  const giveParameterFields = (elem, index) => {
    const toggleDisplay = () => {
      let newParameter = input[index];
      newParameter.display = !newParameter.display;
      setParameters([
        output,
        ...input.slice(0, index),
        newParameter,
        ...input.slice(index + 1)
      ]);
    }
    const removeParameter = () => {
      setParameters([
        output,
        ...input.filter((e, i) => (i !== index))
      ]);
    };
    const addConstant = () => {
      setParameters([
        output,
        ...input.slice(0, index + 1),
        genDefaultConstant(),
        ...input.slice(index + 1)
      ]);
    }
    const addParameter = () => {
      setParameters([
        output,
        ...input.slice(0, index + 1),
        genDefaultParameter(),
        ...input.slice(index + 1)
      ]);
    };
    const removeUnit = i => {
      let newParameter = input[index];
      newParameter.units.splice(i, 1);
      setParameters([
        output,
        ...input.slice(0, index),
        newParameter,
        ...input.slice(index + 1)
      ]);
    };
    const addUnit = (u, i) => {
      let newParameter = input[index];
      newParameter.units.splice(i + 1, 0, u);
      setParameters([
        output,
        ...input.slice(0, index),
        newParameter,
        ...input.slice(index + 1)
      ]);
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
              />
              <UnitControl
                units={elem.units}
                removeUnit={removeUnit}
                addUnit={addUnit}
                onChange={onChange}
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

const ParameterControl = ({ parameters, setParameters, onChange }) => {
  const output = parameters[0];
  const input = parameters.slice(1);
  return (
    <>
      {OutputParameterControl({ output, input, setParameters, onChange })}
      {InputParameterControl({ output, input, setParameters, onChange })}
    </>
  );
};

export default ParameterControl;