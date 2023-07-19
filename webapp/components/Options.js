import { useRecoilState } from "recoil";
import { optionsState } from "@/src/atom";
import { Checkbox, Dialog, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import useLocale from "@/utils/useLocale";

const Options = ({ open, setOpen, onBlur }) => {
  const { locale, t } = useLocale();
  const [options, setOptions] = useRecoilState(optionsState);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        onBlur();
      }}
    >
      <DialogTitle>{t.SETTINGS}</DialogTitle>
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
            {t.LIVE_PREVIEW}
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
            {t.STRING_INPUT}
          </Typography>
          <TextField
            id="digits"
            size="small"
            sx={{ width: 120 }}
            type="number"
            label={t.DIGITS}
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