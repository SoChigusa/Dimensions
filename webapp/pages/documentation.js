import { val2exp } from "@/utils/genLatexSrc";
import importUnitsData from "@/utils/importUnitsData";
import Head from "next/head";
import { AppBar, Container, Stack, Toolbar, Typography } from "@mui/material";
import DataTable from "@/components/DataTable";

export function getStaticProps() {
  const { units, prefixes, constants } = importUnitsData();
  return { props: { units, prefixes, constants, }, };
}

export default function Home({ units, prefixes, constants, }) {
  const optionsConstant = {
    stringInput: false,
    digits: 3,
  };
  const optionsPrefix = {
    stringInput: false,
    digits: 1,
  };
  const optionsUnit = {
    stringInput: false,
    digits: 2,
  };

  return (
    <>
      <Head>
        <title>Dimensions documentation</title>
        <meta name="description" content="Documentation of Dimensions WebApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AppBar position="static" sx={{ mb: 2 }}>
          <Container maxWidth='lg'>
            <Toolbar disableGutters>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                Dimensions
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth='lg'>
          <Stack
            spacing={1}
            direction='column'
            sx={{ display: 'flex', mb: 2 }}
          >
            <DataTable
              title="Constants"
              data={constants}
              input={constant => constant.name}
              latex={constant => 'latex' in constant ? constant.latex : constant.name}
              value={constant => val2exp({ valStr: constant.value.toString(10), options: optionsConstant, })}
            />
            <DataTable
              title="Prefixes"
              data={prefixes}
              input={prefix => prefix.name}
              latex={prefix => 'latex' in prefix ? prefix.latex : prefix.name}
              value={prefix => val2exp({ valStr: prefix.value.toString(10), options: optionsPrefix, })}
            />
            <DataTable
              title="Units"
              data={units}
              input={unit => unit.name}
              latex={unit => 'latex' in unit ? unit.latex : unit.name}
              value={unit => {
                const value = val2exp({ valStr: unit.value.toString(10), options: optionsUnit, });
                let eVs = '';
                if (unit.dimension == 1) {
                  eVs = '\\,\\mathrm{eV}';
                } else if (unit.dimension != 0) {
                  eVs = '\\,\\mathrm{eV}^{' + String(unit.dimension) + '}';
                }
                return value + eVs;
              }}
            />
          </Stack>
        </Container>
      </main>
    </>
  );
};