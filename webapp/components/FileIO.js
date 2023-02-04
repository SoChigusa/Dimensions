import { Button } from "@mui/material";
import { useRouter } from "next/router";

const FileIO = ({
  isOutput = false,
  parameters,
  setParameters,
  alerts,
  setAlerts,
}) => {
  const router = useRouter();

  const handleOnChange = event => {
    const reader = new FileReader();
    reader.onload = e => {
      const json = JSON.parse(e.target.result);
      setParameters([...json.output, ...json.input]);
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
    const jsonString = JSON.stringify({
      "output": [
        parameters[0]
      ],
      "input": parameters.slice(1)
    });
    const blob = new Blob([jsonString], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    link.click();
  };

  if (isOutput) {
    return (
      <Button
        variant='outlined'
        size="small"
        onClick={isOutput ? handleOnClick : () => { }}
      >
        式をファイルへ保存
      </Button>
    );
  } else {
    return (
      <Button
        variant='outlined'
        component='label'
        size="small"
      >
        式をファイルから読み込み
        <input
          type="file"
          hidden
          onChange={handleOnChange}
        />
      </Button>
    );
  }
}

export default FileIO;