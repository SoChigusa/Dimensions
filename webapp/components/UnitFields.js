import { TextField, Typography, IconButton, Stack, Box } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const UnitFields = ({
  disableToRemove = false,
  id,
  defaultValue = { name: 'const', power: '1' },
  removeUnit,
  addUnit,
  onChange,
} = {}) => {
  return (
    <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
      <TextField
        required
        id={`unit-${id}`}
        key={`unit-${id}`}
        size="small"
        color="secondary"
        label="unit"
        defaultValue={defaultValue.name}
        onChange={onChange}
      />
      <Typography variant='body1'>
        ^
      </Typography>
      <TextField
        required
        id={`unit-power-${id}`}
        key={`unit-power-${id}`}
        size="small"
        color="secondary"
        label="unit power"
        defaultValue={defaultValue.power}
        onChange={onChange}
      />
      <Box sx={{ display: 'inline' }}>
        <IconButton aria-label='delete' disabled={disableToRemove} color="secondary" onClick={removeUnit}>
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