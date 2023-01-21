import { TextField, Typography, IconButton, Stack, Box } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const UnitFields = ({
  isFirstUnit = false,
  id,
  defaultValue = { unit: 'const', power: '1' },
  removeUnit,
  addUnit,
} = {}) => {
  return (
    <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
      <TextField
        required
        key={`unit-${id}`}
        label="unit"
        defaultValue={defaultValue.unit}
      />
      <Typography variant='body1'>
        ^
      </Typography>
      <TextField
        required
        key={`unit-power-${id}`}
        label="unit power"
        defaultValue={defaultValue.power}
      />
      <Box sx={{ display: 'inline' }}>
        <IconButton aria-label='delete' disabled={isFirstUnit} onClick={removeUnit}>
          <RemoveCircleOutlineIcon />
        </IconButton>
        <IconButton aria-label='add' onClick={addUnit}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
    </Stack>
  )
}

export default UnitFields;