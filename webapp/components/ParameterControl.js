import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ParameterFields from "./ParameterFields";
import UnitControl from "./UnitControl";

const giveParameterFields = (elem, index) => (
  <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
    <Stack spacing={1} direction="column">
      <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
        <ParameterFields
          name={`input-${index}`}
          defaultValue={{ name: elem.name, power: elem.power }}
          defaultChecked={elem.display}
        />
        <Box sx={{ display: 'inline' }}>
          <IconButton aria-label='delete' disabled={index == 0}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <IconButton aria-label='add'>
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
            id={`input-${index}-parameter-value`}
            label="value"
            defaultValue={elem.value}
          />
          <UnitControl
            name={`input-${index}`}
            defaultValue={elem.units}
          />
        </Stack>
      ) : (<></>)}
    </Stack>
  </Stack>
);

const ParameterControl = ({ defaultValue = [{ display: true, name: '', power: '1', value: '1', units: [{ unit: 'const', power: '1' }] }] }) => {
  return (
    <Stack spacing={1} direction="column">
      {defaultValue.map(giveParameterFields)}
    </Stack>
  )
};

export default ParameterControl;