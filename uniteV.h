/**
 * @file uniteV.h
 * @brief manage physical variables in eV unit
 * @author So Chigusa
 * @date 2019/9/29
 */

#ifndef _UNITEV_H
#define _UNITEV_H

#include <cmath>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
#include <vector>

class UnitEV {
private:
  double val;
  double p;

public:
  UnitEV();
  UnitEV(double, double);
  UnitEV(const UnitEV &);
  UnitEV(const std::map<std::string, UnitEV> &, const std::string &);
  double displayVal() const { return val; }
  double displayP() const { return p; }
  void prod(double);
  void prod(const UnitEV &);
  void pow(double);
};

/**
 * Empty eV class
 */
UnitEV::UnitEV() : val(1.), p(0.) {}

/**
 * Fundamental constructer with input values
 * @param v input value in the unit (eV)^p
 * @param p power of the unit
 */
UnitEV::UnitEV(double v, double p) : val(v), p(p) {}

/**
 * Copy constructer
 * @param arg_uev original object
 */
UnitEV::UnitEV(const UnitEV &arg_uev)
    : val(arg_uev.displayVal()), p(arg_uev.displayP()) {}

/**
 * Constructer with input information string in a line
 * @param arg_tab  unit transformation table
 * @param arg_line input string
 * @details
 * The input string should contain the information of
 * the value, unit without power, and power of unit
 * in this order divided by tabs.
 */
UnitEV::UnitEV(const std::map<std::string, UnitEV> &arg_tab,
               const std::string &arg_line) {
  std::vector<std::string> v(0);
  std::stringstream ss(arg_line);
  std::string buf;
  while (getline(ss, buf, '\t')) {
    if (buf != "")
      v.push_back(buf);
  }

  // error processing
  if (v.size() != 3) {
    std::cout << "Invalid format of input data" << std::endl;
    return;
  } else if (arg_tab.count(v[1]) == 0) {
    std::cout << "Invalid unit in input data" << std::endl;
    return;
  }

  // unit transformation
  UnitEV res(arg_tab.at(v[1]));
  double arg_p = stod(v[2]);
  res.pow(arg_p);
  res.prod(std::pow(stod(v[0]), stod(v[2])));
  (*this) = res;
}

/**
 * Take a product with dimensionless constant
 * @param arg_c coefficient
 */
void UnitEV::prod(double arg_c) { val *= arg_c; }

/**
 * Take a product with another dimensionful object
 * @param arg_uev object
 */
void UnitEV::prod(const UnitEV &arg_uev) {
  val *= arg_uev.displayVal();
  p += arg_uev.displayP();
}

/**
 * Take a power of this object
 * @param arg_p exponent
 */
void UnitEV::pow(double arg_p) {
  val = std::pow(val, arg_p);
  p *= arg_p;
}

#endif
