import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ParameterFields from "./ParameterFields";
import UnitControl from "./UnitControl";
import { useState } from "react";
import genKey from "@/utils/genKey";

const defaultParameter = [{
  display: true,
  name: '',
  power: '1',
  value: '1',
  units: [{ name: 'const', power: '1' }]
}];

const ParameterControl = ({ defaultValue = defaultParameter }) => {
  const [parameters, setParameters] = useState(defaultValue);
  const [keys, setKeys] = useState(genKey({ size: defaultValue.length }));
  const giveParameterFields = (elem, index) => {
    const removeParameter = () => {
      setParameters(parameters.filter((e, i) => (i !== index)));
      setKeys(keys.filter((e, i) => (i !== index)));
    };
    const addParameter = () => {
      setParameters([
        ...parameters.slice(0, index + 1),
        defaultParameter[0],
        ...parameters.slice(index + 1)
      ]);
      setKeys([...keys.slice(0, index + 1),
      genKey({ asList: false }),
      ...keys.slice(index + 1)
      ]);
    }

    return (
      <Stack key={keys[index]} spacing={1} direction="row" sx={{ alignItems: 'center' }}>
        <Stack spacing={1} direction="column">
          <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
            <ParameterFields
              key={keys[index]}
              id={keys[index]}
              defaultChecked={elem.display}
              defaultValue={{ name: elem.name, power: elem.power }}
              isConst={elem.units.length == 0}
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
                key={`parameter-value-${keys[index]}`}
                label="value"
                defaultValue={elem.value}
              />
              <UnitControl
                defaultValue={elem.units}
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

export default ParameterControl;