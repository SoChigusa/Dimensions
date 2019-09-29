/**
 * @file: dimensions.cpp
 * @brief: perform a physics calculation with units
 * @author: So Chigusa
 * @date: 2019/9/29
 */

#include "uniteV.h"
#include <fstream>

// generate transformation table
void generateTable(std::map<std::string, UnitEV> &arg_tab) {
  std::vector<std::string> units{"eV", "g", "t", "s", "yr", "Hz", "m", "A"};
  std::vector<double> vals{1.,          5.60959e+32, 5.60959e+38, 1.51927e+15,
                           4.79177e+22, 6.58212e-16, 5.06773e+6,  5.06773e-4};
  std::vector<double> ps{1., 1., 1., -1., -1., 1., -1., -1.};
  std::vector<std::string> pres{"T", "G",  "M", "k", "", "c",
                                "m", "mu", "n", "p", "f"};
  std::vector<double> prevals{1.e+12, 1.e+9, 1.e+6, 1.e+3,  1.,    1.e-2,
                              1.e-3,  1.e-6, 1.e-9, 1.e-12, 1.e-15};
  for (int i = 0; i < pres.size(); ++i) {
    for (int j = 0; j < units.size(); ++j) {
      arg_tab[pres[i] + units[j]] = UnitEV(prevals[i] * vals[j], ps[j]);
    }
  }
  // arg_tab["eV"] = UnitEV(1., 1.);
  // arg_tab["s"] = UnitEV(1.51927e+15, -1.);
  // arg_tab["yr"] = UnitEV(4.79177e+22, -1.);
  // arg_tab["Hz"] = UnitEV(6.58212e-16, 1.);
  // arg_tab["m"] = UnitEV(5.06773e+6, -1.);
  // arg_tab["A"] = UnitEV(5.06773e-4, -1.);
}

int main() {
  std::map<std::string, UnitEV> table;
  generateTable(table);

  std::string buf;
  std::ifstream ifs("input.dat");
  UnitEV res;
  while (getline(ifs, buf)) {
    if (buf != "") {
      UnitEV val(table, buf);
      res.prod(val);
    }
  }
  std::cout << res.displayVal() << "\t" << res.displayP() << std::endl;
  return 0;
}

// 5.4e-34	g	1.
// 4.95e0	g	-1.
// 2.00507e-4	eV	0.
// 1.e+9	GeV	-2.
// 5.e-13	eV	0.
// 7.e0	MeV	2.
// 1.11111e-1	eV	0.
// 1.e0	kg	1.
// 1.e0	s	1.
