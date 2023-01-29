import { useState } from "react";
import genKey from "@/utils/genKey";
import { Typography, Stack } from "@mui/material"
import UnitFields from "./UnitFields"

const UnitControl = ({ defaultValue, removeUnit, addUnit, onChange }) => {
  const [units, setUnits] = useState(defaultValue);
  const giveUnitFields = (elem, index) => {
    // const removeUnit = () => {
    //   setUnits(units.filter((e, i) => (i !== index)));
    // };
    // const addUnit = () => {
    //   setUnits([...units.slice(0, index + 1),
    //   { key: genKey(), name: 'const', power: '1' },
    //   ...units.slice(index + 1)
    //   ]);
    //   console.log(units);
    // };

    return (
      <UnitFields
        isFirstUnit={index == 0}
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