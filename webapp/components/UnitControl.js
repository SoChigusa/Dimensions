import { Typography, Stack } from "@mui/material"
import UnitFields from "./UnitFields"

const UnitControl = ({ name, defaultValue = [{ unit: 'const', power: '1' }] }) => {
  const giveUnitFields = (elem, index) => {
    return (
      <UnitFields
        isFirstUnit={index == 0}
        key={`${name}-${index}`}
        defaultValue={elem}
      />
    )
  };

  return (
    <>
      <Typography variant='body1'>
        in unit of
      </Typography>
      <Stack spacing={1} direction='column'>
        {defaultValue.map(giveUnitFields)}
      </Stack>
    </>
  )
};

export default UnitControl;