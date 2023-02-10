import { Checkbox, TextField, Typography } from '@mui/material';

const ParameterFields = ({
  id,
  defaultValue = { name: '', power: '1' },
  checked = true,
  isOutput = false,
  isConst = false,
  onCheck,
  onChange,
  onBlur,
}) => {
  return (
    <>
      <Checkbox
        key={`check-box-${id}`}
        disabled={isOutput || isConst}
        checked={checked}
        onChange={onCheck}
      />
      <TextField
        id={`parameter-${id}`}
        key={`parameter-${id}`}
        size="small"
        label={isOutput ? "result name" : (isConst ? "constant" : "parameter")}
        defaultValue={defaultValue.name}
        onChange={onChange}
        onBlur={onBlur}
      />
      {isOutput ? (<></>) : (
        <>
          <Typography variant='body1'>
            ^
          </Typography>
          <TextField
            required
            id={`parameter-power-${id}`}
            key={`parameter-power-${id}`}
            size="small"
            sx={{ width: 100 }}
            label="power"
            defaultValue={defaultValue.power}
            onChange={onChange}
            onBlur={onBlur}
          />
        </>
      )
      }
    </>
  )
};

export default ParameterFields;
