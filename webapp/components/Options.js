import { Dialog, DialogTitle } from "@mui/material";

const Options = ({ open, setOpen }) => {
  return (
    <Dialog
      open={open}
      onClose={() => { setOpen(false); }}
    >
      <DialogTitle>Settings</DialogTitle>
    </Dialog>
  )
};

export default Options;