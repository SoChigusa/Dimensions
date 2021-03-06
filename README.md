
# Dimensions

## Description

Perform a physics calculation with units.
You can input several values with dimensions and take a product of them.
The result can be outputted in a given unit.

## How to use

Prepare an input file `$(INPUTFILE)` in the following format.

```
[unit]   1         (unit0)  (power0)
(label1) (value1)  (unit1)  (power1)
(label2) (value2)  (unit2)  (power2)
...
```

Each value should be divided by a tab.
For each line, the input value means

$$
\left[ \text{(label)} \right]^{\text{(power)}},
$$

with

$$
\text{(label)} = \text{(value)} \text{(unit)}
$$

and the result is a product of all lines.
The first line represents the unit in which you want to obtain your result.
Note that `(power0)` should be *minus* the power of your result so that the final number is dimensionless.
You can execute the calculation through

```
./dimensions.out [-o $(LATEXOUTPUT)] $(INPUTFILE)
```

## Summary of transformation laws

### constants

You can use numerical constant without a dimension by using the unit `const`.
Other constant units are the `pi` and the angle unit `deg`.

### Physics constants

- Electromagnetic coupling constant `e`.

### Energy units

You should use the unit `eV` for values with a unit of energy.

### Mass units

Basically we use

$$
6\times 10^{23} \,\mathrm{GeV} \simeq 1\,\mathrm{g}
$$

to transform into (eV) units. Followings are transformations frequently used.

| units | in gram | in eV |
|---|---|---|
| g | $1\,\mathrm{g}$ | $5.6\times 10^{23}\,\mathrm{GeV}$  |
| t | $10^6\,\mathrm{g}$ | $5.6\times 10^{29}\,\mathrm{GeV}$ |
| Msolar | $2.0 \times 10^{33}\,\mathrm{g}$ | $1.1 \times 10^{57}\,\mathrm{GeV}$ |

g, t are equipped.

From astrophysics, Msolar is also equipped.

### Time units

Basically we use

``` math
\hbar \simeq 6.6 \times 10^{-22} \,\mathrm{MeV}\,\mathrm{s}
```

to transform into (eV) units.
Followings are transformations frequently used.

| unit  |  in second  | in eV |
|--|--|--|
| s | $1\,\mathrm{s}$ | $1.5\times 10^{24}\,\mathrm{GeV}^{-1}$ |
| yr | $3.2\times 10^7 \mathrm{s}$ | $4.8\times 10^{31}\,\mathrm{GeV}^{-1}$ |
| GHz | $10^9\,\mathrm{s}^{-1}$ | $0.66\,\mathrm{\mu eV}$ |

s, min, h, d, yr, Hz are equipped.

### Length units

Basically we use

``` math
\hbar c \simeq 200\,\mathrm{MeV}\,\mathrm{fm}
```
to transform into (eV) units.
Followings are transformations frequently used.

| unit | in meter | in eV |
|--|---|--|
| m | $1\,\mathrm{m}$ | $5.1\times 10^{15}\,\mathrm{GeV}^{-1}$ |
| A | $10^{-10}\,\mathrm{m}$ | $0.51\,\mathrm{keV}^{-1}$ |
| au | $1.5\times 10^{11}\,\mathrm{m}$ | $7.6\times 10^{26}\,\mathrm{GeV}^{-1}$ |
| pc | $3.1\times 10^{16}\,\mathrm{m}$ | $1.6\times 10^{32}\,\mathrm{GeV}^{-1}$ |

m, A, au, pc are equipped.

### Temperature units

Basically we use

$$
k_B \simeq 10^{-4}\,\mathrm{eV}\,\mathrm{K}^{-1}
$$

| unit | in $\mathrm{K}$ | in eV |
|--|---|--|
| K | $1\,\mathrm{K}$ | $8.6\times 10^{-5}\,\mathrm{eV}$ |

K is equipped.

### Gravity units

Basically we use

$$
G = 6.7 \times 10^{-39} GeV^{-2}
$$

G is equipped.

### Magnetic units

T, Wb, emu are equipped.
