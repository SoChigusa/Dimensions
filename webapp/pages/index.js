import calculate from '@/utils/calculate';
import genKey from "@/utils/genKey";
import importUnitsData from '@/utils/importUnitsData';
import Head from 'next/head';
import Latex from 'react-latex-next'
import { Alert, AppBar, Button, Container, Paper, Stack, Toolbar, Typography } from '@mui/material'
import ParameterControl from '@/components/ParameterControl';
import { useState } from 'react';

export function getStaticProps() {
  const { units, prefixes, all_units } = importUnitsData();

  const defaultLatex = "\$\$B_a \\sim 4\\times 10^{-18}\\,\\mathrm{T}\\,\\left(\\frac{g_{aee}}{10^{-10}}\\right)\\left(\\frac{\\rho_a}{0.3\\,\\mathrm{GeV}/\\mathrm{cm}^3}\\right)^{1/2}\$\$";
  "$$B \\sim \\left(\\frac{g_{aee}}{1e-10\\,\\mathrm{const}^1}\\right)^{1}\\left(\\frac{\\rho_a}{0.3\\,\\mathrm{GeV}^1}\\mathrm{cm}^-3}\\right)^{1/2}$$"
  const defaultParameters = [
    // first parameter treated as output name & unit
    { key: genKey(), display: true, name: 'B', power: '1', value: '1', units: [{ key: genKey(), name: 'T', power: '1' }] },
    { key: genKey(), display: false, name: '2', power: '1/2', value: '2', units: [] },
    { key: genKey(), display: false, name: 'e', power: '-1', value: '1', units: [] },
    { key: genKey(), display: false, name: 'v_a', power: 1, value: '1e-3', units: [{ key: genKey(), name: 'const', power: '1' }] },
    { key: genKey(), display: true, name: 'g_{aee}', power: '1', value: '1e-10', units: [{ key: genKey(), name: 'const', power: '1' }] },
    { key: genKey(), display: true, name: '\\rho_a', power: '1/2', value: '0.3', units: [{ key: genKey(), name: 'GeV', power: '1' }, { key: genKey(), name: 'cm', power: '-3' }] },
  ];

  return { props: { units, prefixes, all_units, defaultLatex, defaultParameters, }, };
}

export default function Home({ units, prefixes, all_units, defaultLatex, defaultParameters, }) {

  // states for alert information
  const [alerts, setAlerts] = useState([]);

  // states for output latex src
  const [latex, setLatex] = useState(defaultLatex);

  // states for input parameter information
  const [parameters, setParameters] = useState(defaultParameters);
  const handleOnChange = event => {
    const { name, value } = event.currentTarget;
    const id = event.currentTarget.id;
    const dist = id.split('-')[0];
    const key = id.split('-').pop();
    let index, subIndex;
    if (dist === 'parameter') {
      index = parameters.findIndex(elem => elem.key === key);
    } else if (dist === 'unit') {
      index = parameters.findIndex(elem => {
        subIndex = elem.units.findIndex(unit => unit.key === key);
        return subIndex != -1;
      });
    }
    const newParameter = parameters[index];
    switch (id) {
      case 'parameter-' + key:
        newParameter.name = value;
        break;
      case 'parameter-power-' + key:
        newParameter.power = value;
        break;
      case 'parameter-value-' + key:
        newParameter.value = value;
        break;
      case 'unit-' + key:
        newParameter.units[subIndex].name = value;
        break;
      case 'unit-power-' + key:
        newParameter.units[subIndex].power = value;
        break;
    }
    setParameters([
      ...parameters.slice(0, index),
      newParameter,
      ...parameters.slice(index + 1)
    ]);
  }

  return (
    <>
      <Head>
        <title>Dimensions WebApp</title>
        <meta name="description" content="Web application of Dimensions" />
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
            {alerts.map((alert, index) => (
              <Alert
                key={`alert-${index}`}
                severity='error'
                onClose={() => {
                  setAlerts(alerts.filter((e, i) => (i !== index)))
                }}
              >
                {alert}
              </Alert>
            ))}
            <Typography variant='h5'>
              出力結果
            </Typography>
            <Paper variant='outlined'>
              <Latex>{latex}</Latex>
            </Paper>
            <Button variant='outlined'>LaTeX ソースをコピー</Button>
          </Stack>
          <Typography variant='h5' gutterBottom>
            入力データ
          </Typography>
          <Stack spacing={1} direction="column">
            <ParameterControl
              parameters={parameters}
              setParameters={setParameters}
              onChange={handleOnChange}
            />
            <Stack spacing={1} direction="row">
              <Button variant='outlined'>リセット</Button>
              <Button
                variant='outlined'
                onClick={() => calculate({ units, prefixes, all_units, parameters, setLatex, alerts, setAlerts })}
              >計算する</Button>
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  )
}
