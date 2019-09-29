
CXX := g++
CXXFLAGS := -g -Wall -std=c++11 -O2

all:		dimensions.out

clean:
		$(RM) *.out

%.out: 	%.cpp
		$(CXX) $(CXXFLAGS) $(NUMERICALFLAGS) -o $@ $^ $(ROOTLIBS) $(ROOTFLAGS)
