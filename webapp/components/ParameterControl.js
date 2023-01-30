import genKey from "@/utils/genKey";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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

const OutputParameterControl = ({ output, setParameters, onChange }) => {
  const removeUnit = i => {
    let newParameter = output;
    newParameter.units.splice(i, 1);
    setParameters([newParameter]);
  };
  const addUnit = (u, i) => {
    let newParameter = output;
    newParameter.units.splice(i + 1, 0, u);
    setParameters([newParameter]);
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
        defaultValue={output.units}
        removeUnit={removeUnit}
        addUnit={addUnit}
        onChange={onChange}
      />
    </Stack>
  )
};

const InputParameterControl = ({ parameters, setParameters, onChange }) => {
  const giveParameterFields = (elem, index) => {
    const removeParameter = () => {
      setParameters(parameters.filter((e, i) => (i !== index)));
    };
    const addParameter = () => {
      setParameters([
        ...parameters.slice(0, index + 1),
        genDefaultParameter(),
        ...parameters.slice(index + 1)
      ]);
    };
    const removeUnit = i => {
      let newParameter = parameters[index];
      newParameter.units.splice(i, 1);
      setParameters([
        ...parameters.slice(0, index),
        newParameter,
        ...parameters.slice(index + 1)
      ]);
    };
    const addUnit = (u, i) => {
      let newParameter = parameters[index];
      newParameter.units.splice(i + 1, 0, u);
      setParameters([
        ...parameters.slice(0, index),
        newParameter,
        ...parameters.slice(index + 1)
      ]);
    };

    return (
      <Stack key={parameters[index].key} spacing={1} direction="row" sx={{ alignItems: 'center' }}>
        <Stack spacing={1} direction="column">
          <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
            <ParameterFields
              key={parameters[index].key}
              id={parameters[index].key}
              defaultChecked={elem.display}
              defaultValue={{ name: elem.name, power: elem.power }}
              isConst={elem.units.length == 0}
              onChange={onChange}
            />
            <Box sx={{ display: 'inline' }}>
              <IconButton aria-label='delete' disabled={index == 0} color="primary" onClick={removeParameter}>
                <RemoveCircleOutlineIcon />
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
                id={`parameter-value-${parameters[index].key}`}
                key={`parameter-value-${parameters[index].key}`}
                label="value"
                defaultValue={elem.value}
                onChange={onChange}
              />
              <UnitControl
                defaultValue={elem.units}
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
      {parameters.map(giveParameterFields)}
    </Stack>
  )
};

const ParameterControl = ({ parameters, setParameters, onChange }) => {
  const output = parameters[0];
  const input = parameters.slice(1);
  return (
    <>
      {OutputParameterControl({ output, setParameters, onChange })}
      {InputParameterControl({ parameters: input, setParameters, onChange })}
    </>
  );
};

export default ParameterControl;