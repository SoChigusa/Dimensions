import { useRecoilValue } from 'recoil';
import { unitsDataState } from '@/src/atom';
import { TextField, Typography, IconButton, Stack, Box, Autocomplete } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from 'react';

const UnitFields = ({
  disableToRemove = false,
  id,
  defaultValue = { name: 'const', power: '1' },
  removeUnit,
  addUnit,
  onChange,
} = {}) => {
  const unitsData = useRecoilValue(unitsDataState);
  const unitsList = unitsData.map(u => u.name);
  const [name, setName] = useState(defaultValue.name);
  const [inputName, setInputName] = useState(defaultValue.name);

  return (
    <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
      <Autocomplete
        clearOnEscape
        disablePortal
        selectOnFocus
        id={`unit-${id}`}
        key={`unit-${id}`}
        size="small"
        sx={{ width: 160 }}
        options={unitsList}
        value={name}
        onChange={(event, newName) => {
          setName(newName);
          onChange(event, `unit-${id}`, newName);
        }}
        inputValue={inputName}
        onInputChange={(event, newName) => {
          setInputName(newName);
        }}
        renderInput={params => <TextField
          {...params}
          required
          color="secondary"
          label="unit"
          onChange={(event) => {
            setInputName(event.currentTarget.value);
            setName(event.currentTarget.value);
          }}
          onBlur={(event) => {
            onChange(event);
          }}
        />}
      />
      <Typography variant='body1'>
        ^
      </Typography>
      <TextField
        required
        id={`unit-power-${id}`}
        key={`unit-power-${id}`}
        size="small"
        sx={{ width: 100 }}
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