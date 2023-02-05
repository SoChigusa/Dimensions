import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { alertsState, defaultInput, defaultOutput, inputState, outputState } from '@/src/atom';
import calculate from '@/utils/calculate';
import genLatexSrc from '@/utils/genLatexSrc';
import importUnitsData from '@/utils/importUnitsData';
import Head from 'next/head';
import Latex from 'react-latex-next'
import { Alert, AppBar, Button, Container, Paper, Stack, Toolbar, Typography } from '@mui/material'
import ParameterControl from '@/components/ParameterControl';
import FileIO from '@/components/FileIO';

export function getStaticProps() {
  const { units, prefixes, all_units, constants } = importUnitsData();
  return { props: { units, prefixes, all_units, constants, }, };
}

export default function Home({ units, prefixes, all_units, constants, }) {

  // states for alert information
  const [alerts, setAlerts] = useRecoilState(alertsState);

  // states for input parameter information
  const [output, setOutput] = useRecoilState(outputState);
  const [input, setInput] = useRecoilState(inputState);
  const handleOnChange = event => {
    const { value } = event.currentTarget;
    const id = event.currentTarget.id;
    const dist = id.split('-')[0];
    const key = id.split('-').pop();
    const parameters = [output, ...input];
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
    if (index == 0) { // modify output
      setOutput(newParameter);
    } else { // modify input
      setInput([
        ...parameters.slice(1, index),
        newParameter,
        ...parameters.slice(index + 1)
      ]);
    }
  }

  // states for output latex src
  const [latex, setLatex] = useState(genLatexSrc({ output: output, input: input, value: 1 }));
  const copyToClipboard = async () => {
    const latexRaw = latex.substring(2, latex.length - 2);
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(latexRaw);
      setAlerts([
        ...alerts,
        {
          severity: 'success',
          content: 'Successfully copied to the clipboard!'
        }
      ]);
    } else {
      setAlerts([
        ...alerts,
        {
          severity: 'warning',
          content: 'Your browser does not support copy to clipboard!',
        }
      ]);
    }
  };

  // reset function
  const reset = () => {
    setOutput(defaultOutput);
    setInput(defaultInput);
    setLatex(genLatexSrc({ output: defaultOutput, input: defaultInput, value: 1 }))
  };

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
                severity={alert.severity}
                onClose={() => {
                  setAlerts(alerts.filter((e, i) => (i !== index)))
                }}
              >
                {alert.content}
              </Alert>
            ))}
            <Typography variant='h5'>
              出力結果
            </Typography>
            <Paper variant='outlined'>
              <Latex>{latex}</Latex>
            </Paper>
            <Stack spacing={1} direction="row">
              <FileIO />
              <FileIO isOutput />
              <Button
                variant='outlined'
                size="small"
                onClick={copyToClipboard}
              >LaTeX ソースをコピー</Button>
            </Stack>
          </Stack>
          <Typography variant='h5' gutterBottom>
            入力データ
          </Typography>
          <Stack spacing={1} direction="column">
            <ParameterControl
              onChange={handleOnChange}
            />
            <Stack spacing={1} direction="row">
              <Button
                variant='outlined'
                size='small'
                onClick={reset}
              >リセット</Button>
              <Button
                variant='outlined'
                size='small'
                onClick={() => calculate({ units, prefixes, all_units, constants, output, input, setLatex, alerts, setAlerts })}
              >計算する</Button>
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  )
}
