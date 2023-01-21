import { useState } from "react";
import genKey from "@/utils/genKey";
import { Typography, Stack } from "@mui/material"
import UnitFields from "./UnitFields"

const UnitControl = ({ defaultValue = [{ unit: 'const', power: '1' }] }) => {
  const [units, setUnits] = useState(defaultValue);
  const [keys, setKeys] = useState(genKey({ size: defaultValue.length }));
  const giveUnitFields = (elem, index) => {
    const removeUnit = () => {
      setUnits(units.filter((e, i) => (i !== index)));
      setKeys(keys.filter((e, i) => (i !== index)));
    };
    const addUnit = () => {
      setUnits([...units.slice(0, index + 1),
      { unit: 'const', power: '1' },
      ...units.slice(index + 1)
      ]);
      setKeys([...keys.slice(0, index + 1),
      genKey({ asList: false }),
      ...keys.slice(index + 1)
      ]);
    };

    return (
      <UnitFields
        isFirstUnit={index == 0}
        key={keys[index]}
        id={keys[index]}
        defaultValue={elem}
        removeUnit={removeUnit}
        addUnit={addUnit}
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