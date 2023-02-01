import { useState } from "react";
import genKey from "@/utils/genKey";
import { Typography, Stack } from "@mui/material"
import UnitFields from "./UnitFields"

const UnitControl = ({ units, removeUnit, addUnit, onChange }) => {
  const giveUnitFields = (elem, index) => {
    return (
      <UnitFields
        disableToRemove={units.length == 1 && index == 0}
        key={units[index].key}
        id={units[index].key}
        defaultValue={elem}
        removeUnit={() => removeUnit(index)}
        addUnit={() => addUnit({ key: genKey(), name: 'const', power: '1' }, index)}
        onChange={onChange}
      />
    )
  };

  return (
    <>
      <Typography variant='body1'>
        in unit of
      </Typography>
      <Stack spacing={1} direction='column'>
        {units.map(giveUnitFields)}
      </Stack>
    </>
  )
};

export default UnitControl;