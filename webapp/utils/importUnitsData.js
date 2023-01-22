import fs from 'fs'

const importUnitsData = () => {
  const units_json = fs.readFileSync('data/units.json');
  const units = JSON.parse(units_json);
  const prefixes_json = fs.readFileSync('data/prefixes.json');
  const prefixes = JSON.parse(prefixes_json);

  // list of available unit names and their decompositions
  const no_prefix_index = prefixes.findIndex((elem) => {
    return elem.name == "";
  });
  const all_units = prefixes.map((pre_elem, pre_index) => {
    return units.map((unit_elem, unit_index) => {
      if (unit_elem.dimension != 0) {
        return {
          name: pre_elem.name + unit_elem.name,
          prefix_id: pre_index,
          unit_id: unit_index,
        };
      } else {
        return {
          name: unit_elem.name,
          prefix_id: no_prefix_index,
          unit_id: unit_index,
        };
      }
    });
  }).flat();

  return { units, prefixes, all_units };
};

export default importUnitsData;