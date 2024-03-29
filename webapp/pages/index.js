import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { alertsState, genDefaultInput, genDefaultOutput, inputState, optionsState, outputState, resultState, unitsDataState } from '@/src/atom';
import calculate from '@/utils/calculate';
import { genLatexSrc } from '@/utils/genLatexSrc';
import importUnitsData from '@/utils/importUnitsData';
import Head from 'next/head';
import Latex from 'react-latex-next'
import { Alert, Button, Container, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import ParameterControl from '@/components/ParameterControl';
import FileIO from '@/components/FileIO';
import { ContentCopy, Settings } from '@mui/icons-material';
import Options from '@/components/Options';
import Header from '@/components/Header';
import useLocale from '@/utils/useLocale';

export function getStaticProps() {
  const { units, prefixes, all_units, constants } = importUnitsData();
  return { props: { units, prefixes, all_units, constants, }, };
}

export default function Home({ units, prefixes, all_units, constants, }) {
  const { locale, t } = useLocale();

  // set all units information
  const [unitsData, setUnitsData] = useRecoilState(unitsDataState);
  useEffect(() => {
    setUnitsData(all_units);
  }, []);

  // units information function
  const extractConstantInfo = input => {
    let isAbsent = false, value;
    const constant = constants.find(c => {
      return c.name == input
    });
    if (typeof constant === "undefined") {
      if (isNaN(input)) {
        isAbsent = true;
      } else {
        value = eval(input);
      }
    } else {
      value = constant.value;
    }
    return { isAbsent, value };
  };
  const extractUnitInfo = input => {
    let isAbsent = false, prefix, unit;
    const unit_info = all_units.find(elem => {
      return elem.name == input.name;
    });
    if (typeof unit_info === "undefined") {
      isAbsent = true;
    } else {
      prefix = prefixes[unit_info.prefix_id];
      unit = units[unit_info.unit_id];
    }
    return { isAbsent, prefix, unit };
  };

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
      result: 1,
      latex: genLatexSrc({ extractUnitInfo, output: genDefaultOutput(), input: genDefaultInput(), options: options, result: 1 }),
    });
    setAlerts([]);
  };

  // calculation request
  const calculationRequest = ({ livePreview, newOutput = null, newInput = null, } = {}) => {
    if (newInput != null)
      calculate({ extractConstantInfo, extractUnitInfo, output, input: newInput, options, setResult, setAlerts, livePreview });
    else if (newOutput != null)
      calculate({ extractConstantInfo, extractUnitInfo, output: newOutput, input, options, setResult, setAlerts, livePreview });
    else
      calculate({ extractConstantInfo, extractUnitInfo, output, input, options, setResult, setAlerts, livePreview });
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
        <Header />
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
              {t.OUTPUT}
            </Typography>
            <Paper variant='outlined'>
              <Latex>{result.latex}</Latex>
            </Paper>
            <Stack spacing={1} direction="row">
              <FileIO />
              <FileIO isOutput />
              <Tooltip title={t.COPY} arrow>
                <IconButton
                  aria-label='settings'
                  color='primary'
                  onClick={copyToClipboard}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip title={t.SETTINGS} arrow>
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
            {t.INPUT}
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
                  onClick={() => calculate({ extractConstantInfo, extractUnitInfo, output, input, digits, setResult, alerts, setAlerts })}
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
              >{t.CALC}</Button>
              <Button
                variant='outlined'
                size='small'
                onClick={reset}
              >{t.CLEAR}</Button>
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  )
}
