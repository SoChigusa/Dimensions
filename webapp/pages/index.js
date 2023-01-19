import Head from 'next/head'
import Latex from 'react-latex-next'
import { AppBar, Button, Container, Paper, Stack, Toolbar, Typography } from '@mui/material'
import ParameterFields from '@/components/ParameterFields';
import UnitControl from '@/components/UnitControl';
import ParameterControl from '@/components/ParameterControl';

export default function Home() {
  const latex_src = "\$\$B_a \\sim 4\\times 10^{-18}\\,\\mathrm{T}\\,\\left(\\frac{g_{aee}}{10^{-10}}\\right)\\left(\\frac{\\rho_a}{0.3\\,\\mathrm{GeV}/\\mathrm{cm}^3}\\right)^{1/2}\$\$";
  return (
    <>
      <Head>
        <title>Dimensions WebApp</title>
        <meta name="description" content="Web application of Dimensions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0" crossorigin="anonymous"></link>
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
              <ParameterFields name='output' defaultValue={{ name: 'B_a' }} isOutput />
              <UnitControl
                name="output"
                defaultValue={[{ unit: 'T', power: '1' }]}
              />
            </Stack>
            <ParameterControl
              defaultValue={[
                { display: false, name: 'e', power: '-1', value: '1', units: [] },
                { display: true, name: 'g_{aee}', power: '1', value: '1e-10', units: [{ unit: 'const', power: '1' }] },
                { display: true, name: '\\rho_a', power: '1/2', value: '0.3', units: [{ unit: 'GeV', power: '1' }, { unit: 'cm', power: '-3' }] },
              ]}
            />
          </Stack>
        </Container>
      </main>
    </>
  )
}
