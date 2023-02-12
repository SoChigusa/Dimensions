import { val2exp } from "@/utils/genLatexSrc";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Latex from "react-latex-next";

const DataTable = ({ title, data, input, latex, value }) => (
  <>
    <Typography variant='h5'>{title}</Typography>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="prefixes">
        <TableHead>
          <TableRow>
            <TableCell>入力</TableCell>
            <TableCell align="right">LaTeX表記</TableCell>
            <TableCell align="right">値</TableCell>
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

export default DataTable;