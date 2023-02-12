import DataTable from "@/components/DataTable";
import { val2exp } from "@/utils/genLatexSrc";
import importUnitsData from "@/utils/importUnitsData";
import { AppBar, Container, Stack, Toolbar, Typography } from "@mui/material";
import Head from "next/head";

export function getStaticProps() {
  const { units, prefixes, all_units, constants } = importUnitsData();
  return { props: { units, prefixes, all_units, constants, }, };
}

export default function Home({ units, prefixes, all_units, constants, }) {
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
              value={constant => val2exp({ value: eval(constant.value), digits: 3 })}
            />
            <DataTable
              title="Prefixes"
              data={prefixes}
              input={prefix => prefix.name}
              latex={prefix => 'latex' in prefix ? prefix.latex : prefix.name}
              value={prefix => val2exp({ value: eval(prefix.value), digits: 1 })}
            />
            <DataTable
              title="Units"
              data={units}
              input={unit => unit.name}
              latex={unit => 'latex' in unit ? unit.latex : unit.name}
              value={unit => {
                const value = val2exp({ value: eval(unit.value), digits: 2 });
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