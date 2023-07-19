import { val2exp } from "@/utils/genLatexSrc";
import importUnitsData from "@/utils/importUnitsData";
import Head from "next/head";
import { Container, Stack } from "@mui/material";
import DataTable from "@/components/DataTable";
import Header from "@/components/Header";
import useLocale from "@/utils/useLocale";

export function getStaticProps() {
  const { units, prefixes, constants } = importUnitsData();
  return { props: { units, prefixes, constants, }, };
}

export default function Home({ units, prefixes, constants, }) {
  const { locale, t } = useLocale();
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
        <Header />
        <Container maxWidth='lg'>
          <Stack
            spacing={1}
            direction='column'
            sx={{ display: 'flex', mb: 2 }}
          >
            <DataTable
              title={t.CONSTANTS}
              data={constants}
              input={constant => constant.name}
              latex={constant => 'latex' in constant ? constant.latex : constant.name}
              value={constant => val2exp({ valStr: constant.value.toString(10), options: optionsConstant, })}
            />
            <DataTable
              title={t.SI_PREFIXES}
              data={prefixes}
              input={prefix => prefix.name}
              latex={prefix => 'latex' in prefix ? prefix.latex : prefix.name}
              value={prefix => val2exp({ valStr: prefix.value.toString(10), options: optionsPrefix, })}
            />
            <DataTable
              title={t.UNITS}
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