import { Checkbox, TextField, Typography } from '@mui/material';

const ParameterFields = ({ name, defaultValue = { name: '', power: '1' }, isOutput = false, defaultChecked = true }) => {
  return (
    <>
      <Checkbox
        aria-label={`${name}-check-box`}
        disabled={isOutput}
        defaultChecked={defaultChecked}
      />
      <TextField
        id={`${name}-parameter`}
        label={isOutput ? "result name" : "parameter"}
        defaultValue={defaultValue.name}
      />
      {isOutput ? (<></>) : (
        <>
          <Typography variant='body1'>
            ^
          </Typography>
          <TextField
            required
            id={`${name}-power`}
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
