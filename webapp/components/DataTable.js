import { val2exp } from "@/utils/genLatexSrc";
import useLocale from "@/utils/useLocale";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Latex from "react-latex-next";

const DataTable = ({ title, data, input, latex, value }) => {
  const { locale, t } = useLocale();
  return (
    <>
      <Typography variant='h5'>{title}</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} size="small" aria-label="prefixes">
          <TableHead>
            <TableRow>
              <TableCell>{t.INPUT_VALUE}</TableCell>
              <TableCell align="right">{t.LATEX_EXPRESSION}</TableCell>
              <TableCell align="right">{t.VALUE}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(elem => (
              <TableRow
                key={input(elem)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{input(elem)}</TableCell>
                <TableCell align="right">
                  <Latex>{`$\\mathrm{${latex(elem)}}$`}</Latex>
                </TableCell>
                <TableCell align="right">
                  <Latex>{`$${value(elem)}$`}</Latex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default DataTable;