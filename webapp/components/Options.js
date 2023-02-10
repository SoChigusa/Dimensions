import { useRecoilState } from "recoil";
import { optionsState } from "@/src/atom";
import { Checkbox, Dialog, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";

const Options = ({ open, setOpen, onBlur }) => {
  const [options, setOptions] = useRecoilState(optionsState);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        onBlur();
      }}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography>
            <Checkbox
              key='live-preview'
              checked={options.livePreview}
              onChange={() => {
                let newOptions = Object.assign({}, options);
                newOptions.livePreview = !newOptions.livePreview;
                setOptions(newOptions);
              }}
            />
            ライブプレビュー
          </Typography>
          <Typography>
            <Checkbox
              key='string-input'
              checked={options.stringInput}
              onChange={() => {
                let newOptions = Object.assign({}, options);
                newOptions.stringInput = !newOptions.stringInput;
                setOptions(newOptions);
              }}
            />
            入力式を文字列として扱って出力
          </Typography>
          <TextField
            id="digits"
            size="small"
            sx={{ width: 120 }}
            type="number"
            label="significant digits"
            defaultValue={options.digits}
            InputProps={{ inputProps: { min: 1, max: 5 } }}
            onChange={e => {
              let newOptions = Object.assign({}, options);
              newOptions.digits = eval(e.currentTarget.value);
              setOptions(newOptions);
            }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
};

export default Options;