/**
 * @file uniteV.h
 * @brief manage physical variables in eV unit
 * @author So Chigusa
 * @date 2019/9/29
 */

#ifndef _UNITEV_H
#define _UNITEV_H

#include <sstream>
#include <string>
#include <vector>

class UnitEV {
private:
  double val;
  double pow;

public:
  UnitEV(double, double);
  UnitEV(const std::string &);
};

/**
 * Fundamental constructer with input values
 * @param v input value in the unit (eV)^p
 * @param p power of the unit
 */
UnitEV::UnitEV(double v, double p) : val(v), pow(p) {}

/**
 * Constructer with input information string in a line
 * @param arg_line input string
 * @details
 * The input string should contain the information of
 * the value, unit without power, and power of unit
 * in this order divided by tabs.
 */
UnitEV::UnitEV(const std::string &arg_line) {
  // split string and extract information
  std::vector<std::string> v(0);
  std::stringstream ss(buffer);
  std::string buf;
  while (getline(ss, buf, '\t')) {
    if (buf != "")
      v.push_back(buf);
  }

  // error processing
  if (v.size() != 3) {
    std::cout << "Invalid format of input data" << std::endl;
    return;
  }

  // unit transformation

  // result
  val = stod(v[0]);
  pow = stod(v[2]);
}

#endif
