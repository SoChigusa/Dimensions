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
  arg_tab["eV"] = UnitEV(1., 1.);
  arg_tab["GeV"] = UnitEV(1.e9, 1.);
}

int main() {
  std::map<std::string, UnitEV> table;
  generateTable(table);

  std::string buf;
  std::ifstream ifs("input.dat");
  while (getline(ifs, buf)) {
    UnitEV val(table, buf);
    std::cout << val.displayVal() << "\t" << val.displayP() << std::endl;
  }
  return 0;
}
