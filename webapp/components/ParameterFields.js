import { Checkbox, TextField, Typography } from '@mui/material';

const ParameterFields = ({
  id,
  defaultValue = { name: '', power: '1' },
  defaultChecked = true,
  isOutput = false,
  isConst = false,
  onChange,
}) => {
  return (
    <>
      <Checkbox
        key={`check-box-${id}`}
        disabled={isOutput}
        defaultChecked={defaultChecked}
      />
      <TextField
        id={`parameter-${id}`}
        key={`parameter-${id}`}
        label={isOutput ? "result name" : (isConst ? "constant" : "parameter")}
        defaultValue={defaultValue.name}
        onChange={onChange}
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
            label="power"
            defaultValue={defaultValue.power}
            onChange={onChange}
          />
        </>
      )
      }
    </>
  )
};

export default ParameterFields;
