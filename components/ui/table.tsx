import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


interface Props {
    metadata: any;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

interface Data {
  [key: string]: {
    [key: string]: string;
  };
}

type Result = {
  headArray: string[];
  bodyArray: Array<{ [key: string]: any }>;
};

function convertData(data: Data): Result {
  const bodyArray: Array<{ [key: string]: any }> = [];
  const headArray: string[] = [];

  // Extract the keys (e.g., "Sales", "Expenses")
  const keys = Object.keys(data);

  // Extract the subkeys (e.g., "Mar 2020", "Jun 2020", "Sep 2020")
  const subkeys = Object.keys(data[keys[0]]);

  // Iterate over the subkeys
  for (const subkey of subkeys) {
    const entry: { [key: string]: any } = {};

    if(Object.keys(headArray).length<subkeys.length){
      headArray.push(subkey);
    }

    // Add the key (e.g., "Sales", "Expenses") to the entry
    entry[keys[0]] = subkey;

    // Iterate over the keys (e.g., "Sales", "Expenses")
    for (const key of keys) {
      // Parse the value and remove the commas
      const value = parseInt(data[key][subkey].replace(/,/g, ''), 10);
      // Add the parsed value to the entry
      entry[key] = value;

    }

    // Add the entry to the bodyArray array
    bodyArray.push(entry);
  }

  return {headArray, bodyArray};
}


const TableComponent : React.FC<Props> = (props: Props)=> {

  const data = JSON.parse(props.metadata.data);
  const {headArray,bodyArray} = convertData(data);
  console.log('convertedData', bodyArray)
  const globalTableStyles = {
    color: 'white',
    border:'none',  
    whiteSpace: 'nowrap',
    padding: '0.6rem',
  }

  return (
    <div className='mt-2'>
      <TableContainer sx={{
                    backgroundColor: '#0f172a',
                    color: 'white',
                }} component={Paper}>
        <Table sx={{ minWidth: 650, color:'white' }} aria-label="simple table">
          <TableHead>
            <TableRow >
            <TableCell sx={{...globalTableStyles}}></TableCell>
              {headArray.map((head, index) => (
                <TableCell sx={{...globalTableStyles}} key={index}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(data).map((key, rowIndex) => {
              const style = rowIndex % 2 ? { backgroundColor: '#0f172a' } : {backgroundColor: '#16213d'};
              return (<TableRow 
                key={rowIndex}
                sx={{ '&:last-child td, &:last-child th': { border: 0 },...style }}
              >
                <TableCell sx={{...globalTableStyles}} component="th" scope="row">
                  {key}
                </TableCell>
                {Object.keys(data[key]).map((subkey, index) => (
                  <TableCell sx={{...globalTableStyles, ...style}} key={index}>{data[key][subkey]}</TableCell>
                ))}
                </TableRow>)})}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}



TableComponent.displayName = 'Table';

export default TableComponent