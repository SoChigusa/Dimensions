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
  std::vector<std::string> units{"const", "deg", "eV", "g",  "t",  "Msolar",
                                 "s",     "min", "h",  "d",  "yr", "Hz",
                                 "m",     "A",   "au", "pc", "K",  "G"};
  std::vector<double> vals{
      1.,                                   // dimesnionless constant [const]
      M_PI / 180.,                          // angle unit [deg]
      1.,                                   // eV unit [eV]
      5.60959e+32, 5.60959e+38, 1.1158e+57, // mass unit [g,t,Msolar]
      1.51927e+15, 9.11562e+16, 5.46937e+18,
      1.31265e+20, 4.79117e+22, 6.58212e-16, // time unit [s,min,h,d,yr,Hz]
      5.06773e+6,  5.06773e-4,  7.58122e+17,
      1.56374e+23, // length unit [m,A,au,pc]
      8.61733e-5,  // temperature unit [K]
      6.70883e-57, // gravitational unit [G]
  };
  std::vector<double> ps{0.,           // dimensionless constant [const]
                         0.,           // angle unit [deg]
                         1.,           // eV unit [ev]
                         1.,  1.,  1., // mass unit [g,t, Msolar]
                         -1., -1., -1., -1.,
                         -1., 1.,            // time unit [s,min,h,d,yr,Hz]
                         -1., -1., -1., -1., // length unit [m,A,au,pc]
                         1.,                 // temperature unit [K]
                         -2.};               // gravitational unit [G]
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

int main(int argc, char *argv[]) {
  if (argc != 2) {
    std::cout << "Usage: ./dimensions.out (input file name)" << std::endl;
    return -1;
  }

  std::map<std::string, UnitEV> table;
  generateTable(table);

  std::string buf;
  std::ifstream ifs(argv[1]);
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
