import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { alertsState, genDefaultInput, genDefaultOutput, inputState, optionsState, outputState, resultState, unitsDataState } from '@/src/atom';
import calculate from '@/utils/calculate';
import genLatexSrc from '@/utils/genLatexSrc';
import importUnitsData from '@/utils/importUnitsData';
import Head from 'next/head';
import Latex from 'react-latex-next'
import { Alert, AppBar, Button, Container, IconButton, Paper, Stack, TextField, Toolbar, Tooltip, Typography } from '@mui/material'
import ParameterControl from '@/components/ParameterControl';
import FileIO from '@/components/FileIO';
import { Calculate, CalculateRounded, Clear, ContentCopy, Settings } from '@mui/icons-material';
import Options from '@/components/Options';

export function getStaticProps() {
  const { units, prefixes, all_units, constants } = importUnitsData();
  return { props: { units, prefixes, all_units, constants, }, };
}

export default function Home({ units, prefixes, all_units, constants, }) {

  // set all units information
  const [unitsData, setUnitsData] = useRecoilState(unitsDataState);
  useEffect(() => {
    setUnitsData(all_units);
  }, []);

  // states for options, alerts, significant digits information
  const options = useRecoilValue(optionsState);
  const [openOptions, setOpenOptions] = useState(false);
  const [alerts, setAlerts] = useRecoilState(alertsState);

  // states for input parameter information
  const [output, setOutput] = useRecoilState(outputState);
  const [input, setInput] = useRecoilState(inputState);
  const handleOnChange = (event, setId = null, setValue = null, onBlur = false) => {
    let value, id;
    if (setId == null) {
      id = event.currentTarget.id;
    } else {
      id = setId;
    }
    if (setValue == null) {
      value = event.currentTarget.value;
    } else {
      value = setValue;
    }
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
    let newParameter = JSON.parse(JSON.stringify(parameters[index])); // copy object instead of use reference
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
      if (onBlur)
        handleOnBlur({ newOutput: newParameter });
    } else { // modify input
      const newInput = [
        ...parameters.slice(1, index),
        newParameter,
        ...parameters.slice(index + 1)
      ];
      setInput(newInput);
      if (onBlur)
        handleOnBlur({ newInput: newInput });
    }
  }

  // states for calculation result
  const [result, setResult] = useRecoilState(resultState);
  const copyToClipboard = async () => {
    const latexRaw = result.latex.substring(2, result.latex.length - 2);
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
    setOutput(genDefaultOutput());
    setInput(genDefaultInput());
    setResult({
      value: 1,
      latex: genLatexSrc({ output: genDefaultOutput(), input: genDefaultInput(), digits: options.digits, value: 1 })
    });
  };

  // calculation request
  const calculationRequest = ({ livePreview, newOutput = null, newInput = null, } = {}) => {
    if (newInput != null)
      calculate({ units, prefixes, all_units, constants, output, input: newInput, options, setResult, setAlerts, livePreview });
    else if (newOutput != null)
      calculate({ units, prefixes, all_units, constants, output: newOutput, input, options, setResult, setAlerts, livePreview });
    else
      calculate({ units, prefixes, all_units, constants, output, input, options, setResult, setAlerts, livePreview });
  };
  const handleOnBlur = ({ newOutput = null, newInput = null } = {}) => {
    if (options.livePreview) {
      calculationRequest({ livePreview: true, newOutput, newInput });
    }
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
              <Latex>{result.latex}</Latex>
            </Paper>
            <Stack spacing={1} direction="row">
              <FileIO />
              <FileIO isOutput />
              <Tooltip title="LaTeX ソースをコピー" arrow>
                <IconButton
                  aria-label='settings'
                  color='primary'
                  onClick={copyToClipboard}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip title="設定" arrow>
                <IconButton
                  aria-label='settings'
                  onClick={() => { setOpenOptions(true); }}
                >
                  <Settings />
                </IconButton>
              </Tooltip>
              <Options open={openOptions} setOpen={setOpenOptions} onBlur={handleOnBlur} />
            </Stack>
          </Stack>
          <Typography variant='h5' gutterBottom>
            入力データ
          </Typography>
          <Stack spacing={1} direction="column">
            <ParameterControl
              onChange={handleOnChange}
              onBlur={handleOnBlur}
            />
            <Stack spacing={1} direction="row">
              {/* <Tooltip title="計算実行" arrow>
                <IconButton
                  aria-label='calculate'
                  color='primary'
                  onClick={() => calculate({ units, prefixes, all_units, constants, output, input, digits, setResult, alerts, setAlerts })}
                >
                  <Calculate />
                </IconButton>
              </Tooltip>
              <Tooltip title="リセット" arrow>
                <IconButton
                  aria-label='reset'
                  color='primary'
                  onClick={reset}
                >
                  <Clear />
                </IconButton>
              </Tooltip> */}
              <Button
                variant='outlined'
                size='small'
                onClick={() => calculationRequest({ livePreview: false })}
              >計算する</Button>
              <Button
                variant='outlined'
                size='small'
                onClick={reset}
              >リセット</Button>
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  )
}
