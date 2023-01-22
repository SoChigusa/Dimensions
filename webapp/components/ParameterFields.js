import { Checkbox, TextField, Typography } from '@mui/material';

const ParameterFields = ({
  id,
  defaultValue = { name: '', power: '1' },
  defaultChecked = true,
  isOutput = false,
  isConst = false,
}) => {
  return (
    <>
      <Checkbox
        key={`check-box-${id}`}
        disabled={isOutput}
        defaultChecked={defaultChecked}
      />
      <TextField
        key={`parameter-${id}`}
        label={isOutput ? "result name" : (isConst ? "constant" : "parameter")}
        defaultValue={defaultValue.name}
      />
      {isOutput ? (<></>) : (
        <>
          <Typography variant='body1'>
            ^
          </Typography>
          <TextField
            required
            key={`parameter-power-${id}`}
            label="power"
            defaultValue={defaultValue.power}
          />
        </>
      )
      }
    </>
  )
};

export default ParameterFields;
