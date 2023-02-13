import { alertsState, inputState, outputState, resultState } from "@/src/atom";
import { useRecoilState } from "recoil";
import genKey from "@/utils/genKey";
import { IconButton, Tooltip } from "@mui/material";
import { FileOpen, SaveAlt } from "@mui/icons-material";

const FileIO = ({
  isOutput = false,
}) => {
  const [alerts, setAlerts] = useRecoilState(alertsState);
  const [output, setOutput] = useRecoilState(outputState);
  const [input, setInput] = useRecoilState(inputState);
  const [result, setResult] = useRecoilState(resultState);

  const handleOnChange = event => {
    const reader = new FileReader();
    reader.onload = e => {
      let json = JSON.parse(e.target.result);

      // generate key information
      json.output.key = genKey();
      json.output.units.map(u => {
        u.key = genKey();
      });
      json.input.map(p => {
        p.key = genKey();
        p.units.map(u => {
          u.key = genKey();
        });
      });
      setOutput(json.output);
      setInput(json.input);
      setResult(json.result);
    };
    const file = event.target.files[0];
    if (file.type !== 'application/json') {
      setAlerts([...alerts,
      {
        severity: 'warning',
        content: '対応しているデータ形式はJSONのみです'
      }]);
    } else {
      reader.readAsText(file);
    }
    event.target.value = ''; // reset value to activate the next onchange event
  };

  const handleOnClick = () => {
    // delete all key information
    const outputInfo = JSON.parse(JSON.stringify(output));
    const inputInfo = JSON.parse(JSON.stringify(input));
    delete outputInfo.key;
    outputInfo.units.map(u => {
      delete u.key;
    });
    inputInfo.map(p => {
      delete p.key;
      p.units.map(u => {
        delete u.key;
      });
    });

    const jsonString = JSON.stringify({
      "output": outputInfo,
      "input": inputInfo,
      "result": result,
    });
    const blob = new Blob([jsonString], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    link.click();
  };

  if (isOutput) {
    return (
      <Tooltip title="式をファイルへ保存" arrow>
        <IconButton
          aria-label='save'
          color="primary"
          onClick={isOutput ? handleOnClick : () => { }}
        >
          <SaveAlt />
        </IconButton>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="式をファイルから読み込み" arrow>
        <IconButton
          aria-label='file-open'
          color="primary"
          component='label'
        >
          <FileOpen />
          <input
            type="file"
            hidden
            onChange={handleOnChange}
          />
        </IconButton>
      </Tooltip>
    );
  }
}

export default FileIO;