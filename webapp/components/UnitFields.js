import { TextField, Typography, IconButton, Stack, Box } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const UnitFields = ({ name, defaultValue = { unit: 'const', power: '1' }, isFirstUnit = false }) => {
  return (
    <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
      <TextField
        required
        id={`unit-${name}`}
        label="unit"
        defaultValue={defaultValue.unit}
      />
      <Typography variant='body1'>
        ^
      </Typography>
      <TextField
        required
        id={`unit-${name}-power`}
        label="unit power"
        defaultValue={defaultValue.power}
      />
      <Box sx={{ display: 'inline' }}>
        <IconButton aria-label='delete' disabled={isFirstUnit}>
          <RemoveCircleOutlineIcon />
        </IconButton>
        <IconButton aria-label='add'>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
    </Stack>
  )
}

export default UnitFields;