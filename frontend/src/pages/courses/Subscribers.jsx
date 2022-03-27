import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Grid } from '@mui/material';

function Subscribers({ recordForEdit }) {
  return (
    <Grid container xs={12} md={6} sx={{ height: 370 }}>
      <DataGrid
        rows={recordForEdit.tokens}
        columns={[
          { field: 'id', headerName: 'ID', width: 100 },
          { field: 'token', headerName: 'Token', width: 200 },
          { field: 'user', headerName: 'User', width: 200 }
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Grid>
  );
}

export default Subscribers;
