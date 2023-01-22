import { TextField, Typography, IconButton, Stack, Box } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const UnitFields = ({
  isFirstUnit = false,
  id,
  defaultValue = { name: 'const', power: '1' },
  removeUnit,
  addUnit,
} = {}) => {
  return (
    <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
      <TextField
        required
        key={`unit-${id}`}
        color="secondary"
        label="unit"
        defaultValue={defaultValue.name}
      />
      <Typography variant='body1'>
        ^
      </Typography>
      <TextField
        required
        key={`unit-power-${id}`}
        color="secondary"
        label="unit power"
        defaultValue={defaultValue.power}
      />
      <Box sx={{ display: 'inline' }}>
        <IconButton aria-label='delete' disabled={isFirstUnit} color="secondary" onClick={removeUnit}>
          <RemoveCircleOutlineIcon />
        </IconButton>
        <IconButton aria-label='add' color="secondary" onClick={addUnit}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
    </Stack>
  )
}

export default UnitFields;