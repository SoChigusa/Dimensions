import calculate from '@/utils/calculate';
import importUnitsData from '@/utils/importUnitsData';
import Head from 'next/head';
import Latex from 'react-latex-next'
import { Alert, AppBar, Button, Container, Paper, Stack, Toolbar, Typography } from '@mui/material'
import ParameterFields from '@/components/ParameterFields';
import UnitControl from '@/components/UnitControl';
import ParameterControl from '@/components/ParameterControl';
import { useState } from 'react';

export function getStaticProps() {
  const { units, prefixes, all_units } = importUnitsData();
  return { props: { units, prefixes, all_units }, };
}

export default function Home({ units, prefixes, all_units }) {
  const [alerts, setAlerts] = useState([]);

  const latex_src = "\$\$B_a \\sim 4\\times 10^{-18}\\,\\mathrm{T}\\,\\left(\\frac{g_{aee}}{10^{-10}}\\right)\\left(\\frac{\\rho_a}{0.3\\,\\mathrm{GeV}/\\mathrm{cm}^3}\\right)^{1/2}\$\$";
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
              <Latex>{latex_src}</Latex>
            </Paper>
            <Button variant='outlined'>LaTeX ソースをコピー</Button>
          </Stack>
          <Typography variant='h5' gutterBottom>
            入力データ
          </Typography>
          <Stack spacing={1} direction="column">
            <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
              <ParameterFields id='output' defaultValue={{ name: 'B_a' }} isOutput />
              <UnitControl
                name="output"
                defaultValue={[{ name: 'T', power: '1' }]}
              />
            </Stack>
            <ParameterControl
              defaultValue={[
                { display: false, name: '2', power: '1/2', value: '2', units: [] },
                { display: false, name: 'e', power: '-1', value: '1', units: [] },
                { display: false, name: 'v_a', power: 1, value: '1e-3', units: [{ name: 'const', power: '1' }] },
                { display: true, name: 'g_{aee}', power: '1', value: '1e-10', units: [{ name: 'const', power: '1' }] },
                { display: true, name: '\\rho_a', power: '1/2', value: '0.3', units: [{ name: 'GeV', power: '1' }, { name: 'cm', power: '-3' }] },
              ]}
            />
            <Stack spacing={1} direction="row">
              <Button variant='outlined'>リセット</Button>
              <Button
                variant='outlined'
                onClick={() => calculate({ units, prefixes, all_units, alerts, setAlerts })}
              >計算する</Button>
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  )
}
