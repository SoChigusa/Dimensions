import fs from 'fs'

const importUnitsData = () => {
  const units_json = fs.readFileSync('data/units.json');
  const units = JSON.parse(units_json);
  const prefixes_json = fs.readFileSync('data/prefixes.json');
  const prefixes = JSON.parse(prefixes_json);
  const constants_json = fs.readFileSync('data/constants.json');
  const constants = JSON.parse(constants_json);

  // list of available unit names and their decompositions
  const no_pre_index = prefixes.findIndex(p => p.name === "");
  let all_units = prefixes.map((pre_elem, pre_index) => {
    return units.map((unit_elem, unit_index) => {
      if (unit_elem.dimension != 0) {
        return {
          name: pre_elem.name + unit_elem.name,
          prefix_id: pre_index,
          unit_id: unit_index,
        };
      } else { // no prefix for constants
        return {
          name: unit_elem.name,
          prefix_id: no_pre_index,
          unit_id: unit_index,
        };
      }
    });
  }).flat();
  all_units = Array.from( // delete duplicate
    new Map(all_units.map(u => [u.name, u])).values()
  );

  return { units, prefixes, all_units, constants };
};

export default importUnitsData;