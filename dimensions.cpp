/**
 * @file: dimensions.cpp
 * @brief: perform a physics calculation with units
 * @author: So Chigusa
 * @date: 2019/9/29
 */

#include "uniteV.h"
#include <fstream>
#include <unistd.h>

// generate transformation table
void generateTable(std::map<std::string, UnitEV> &arg_tab) {
  std::vector<std::string> units{"const", "pi",     "e", "deg", "eV", "g",
                                 "t",     "Msolar", "s", "min", "h",  "d",
                                 "yr",    "Hz",     "m", "A",   "au", "pc",
                                 "K",     "G",      "T", "Wb",  "emu"};
  std::vector<double> vals{
      1., 3.14159e0, 3.02822e-01,           // dimesnionless constant
                                            // [const,pi,e]
      M_PI / 180.,                          // angle unit [deg]
      1.,                                   // eV unit [eV]
      5.60959e+32, 5.60959e+38, 1.1158e+66, // mass unit [g,t,Msolar]
      1.51927e+15, 9.11562e+16, 5.46937e+18, 1.31265e+20, 4.79117e+22,
      6.58212e-16, // time unit [s,min,h,d,yr,Hz]
      5.06773e+6, 5.06773e-4, 7.58122e+17,
      1.56374e+23,                         // length unit [m,A,au,pc]
      8.61733e-5,                          // temperature unit [K]
      6.70883e-57,                         // gravitational unit [G]
      1.95353e+2, 5.01703e+15, 3.19499e+13 // magnetic unit [T,Wb,emu]
  };
  std::vector<double> ps{0.,  0.,  0., // dimensionless constant [const,pi,e]
                         0.,           // angle unit [deg]
                         1.,           // eV unit [ev]
                         1.,  1.,  1., // mass unit [g,t, Msolar]
                         -1., -1., -1., -1.,
                         -1., 1.,            // time unit [s,min,h,d,yr,Hz]
                         -1., -1., -1., -1., // length unit [m,A,au,pc]
                         1.,                 // temperature unit [K]
                         -2.,                // gravitational unit [G]
                         2.,  0.,  -1.};     // magnetic unit [T,Wb,emu]
  std::vector<std::string> pres{"T", "G",  "M", "k", "", "c",
                                "m", "mu", "n", "p", "f"};
  std::vector<double> prevals{1.e+12, 1.e+9, 1.e+6, 1.e+3,  1.,    1.e-2,
                              1.e-3,  1.e-6, 1.e-9, 1.e-12, 1.e-15};
  for (int i = 0; i < pres.size(); ++i) {
    for (int j = 0; j < units.size(); ++j) {
      arg_tab[pres[i] + units[j]] =
          UnitEV(prevals[i] * vals[j], ps[j], pres[i] + units[j]);
    }
  }
}

int main(int argc, char *argv[]) {

  // option analysis
  int opt;
  std::string ofname;
  opterr = 0;
  while ((opt = getopt(argc, argv, "o:")) != -1) {
    switch (opt) {
    case 'o':
      ofname += optarg;
      break;
    default:
      std::cout << "Usage: ./dimensions.out [-o latex output file] (input file)"
                << std::endl;
      return -1;
    }
  }

  // prepare conversion table
  std::map<std::string, UnitEV> table;
  generateTable(table);

  // calculation
  std::string buf;
  std::ifstream ifs(argv[optind]);
  UnitEV res;
  while (getline(ifs, buf)) {
    if (buf != "") {
      UnitEV val(table, buf);
      res.prod(val);
      if (res.displayVal() == 0) { // Format error (or simply zero)
        break;
      }
    }
  }
  std::cout << res.displayVal() << "\t" << res.displayP() << std::endl;

  // latex output
  if (ofname != "") {
    std::ofstream ofs(ofname);
    std::vector<std::string> expr;
    res.displayExpr(expr);
    ofs << "\\documentclass[12pt,notitlepage]{article}\n"
           "\\usepackage[dvipdfmx]{graphicx}\n"
           "\\usepackage{amsmath}\n"
           "\\begin{document}\n"
           "\\begin{align*}\n";
    ofs << std::setprecision(0) << "  " << res.displayVal();
    for (auto it = expr.begin(); it != expr.end(); ++it) {
      ofs << "  " << *it << std::endl;
    }
    ofs << "\\end{align*}\n"
           "\\end{document}\n";
  }
  return 0;
}
