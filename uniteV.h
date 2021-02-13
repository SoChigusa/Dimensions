/**
 * @file uniteV.h
 * @brief manage physical variables in eV unit
 * @author So Chigusa
 * @date 2019/9/29
 */

#ifndef _UNITEV_H
#define _UNITEV_H

#include <cmath>
#include <iomanip>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
#include <vector>

class UnitEV {
private:
  double val;                    // value in (eV)^p
  double p;                      // power in eV
  std::string tag;               // unit tag
  std::vector<std::string> expr; // latex expression

public:
  UnitEV();
  UnitEV(double, double, std::string);
  UnitEV(const UnitEV &);
  UnitEV(const std::map<std::string, UnitEV> &, const std::string &);
  double displayVal() const { return val; }
  double displayP() const { return p; }
  std::string displayTag() const { return tag; }
  void displayExpr(std::vector<std::string> &e) const { e = expr; }
  void set_expr(const std::string &, const std::string &, double);
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
 * @param t tag for the unit
 */
UnitEV::UnitEV(double v, double p, std::string t) : val(v), p(p), tag(t) {}

/**
 * Copy constructer
 * @param arg_uev original object
 */
UnitEV::UnitEV(const UnitEV &arg_uev)
    : val(arg_uev.displayVal()), p(arg_uev.displayP()),
      tag(arg_uev.displayTag()) {
  arg_uev.displayExpr(expr);
}

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
  if (v.size() != 4) {
    std::cout << "Invalid format of input data" << std::endl;
    return;
  } else if (arg_tab.count(v[2]) == 0) {
    std::cout << "Invalid unit in input data" << std::endl;
    return;
  }

  // unit transformation
  UnitEV res(arg_tab.at(v[2]));
  double arg_p = stod(v[3]);
  res.pow(arg_p);                        // power of unit
  res.prod(std::pow(stod(v[1]), arg_p)); // power of numerical value
  res.set_expr(v[0], v[1], arg_p);
  (*this) = res;
}

/**
 * Construct latex expression for element
 * @param v name of variable
 * @param v2 value in original unit
 * @param p power
 */
void UnitEV::set_expr(const std::string &v, const std::string &v2,
                      double power) {
  std::string e;
  std::stringstream ss;
  if (p == 0.) // no need for latex expression for constant
    return;
  if (v == "[unit]") { // unit of final results
    e = "\\,\\mathrm{" + tag + "}";
    if (-power != 1.) {
      ss << std::setprecision(1) << -power;
      e += "^{" + ss.str() + "}";
    }
  } else { // "\left( \frac{[name]}{[val],\mathrm{[unit]}} \right)^[power]"
    ss << std::setprecision(1) << abs(power);
    if (power > 0) {
      e = "\\left( \\frac{" + v + "}{" + v2 + "\\,\\mathrm{" + tag +
          "}} \\right)";
    } else {
      e = "\\left( \\frac{" + v2 + "\\,\\mathrm{" + tag + "}}{" + v +
          "} \\right)";
    }
    if (abs(power) != 1.) {
      e += "^{" + ss.str() + "}";
    }
  }
  expr.emplace_back(e);
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

  std::vector<std::string> e;
  arg_uev.displayExpr(e);
  std::copy(e.begin(), e.end(), std::back_inserter(expr));
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
