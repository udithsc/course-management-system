import React from 'react';
import { Box, Typography, Rating, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function Reviews({ recordForEdit }) {
  console.log(recordForEdit);
  return (
    <Box>
      <Typography>
        Overall Rating:
        {recordForEdit.reviews.reduce((p, c) => p.value + c.value, 0) /
          recordForEdit.reviews.length}
      </Typography>
      <Rating
        name="read-only"
        value={
          recordForEdit.reviews.reduce((p, c) => p.value + c.value, 0) /
          recordForEdit.reviews.length
        }
        readOnly
      />
      <Typography sx={{ mt: 2 }}>User Ratings:</Typography>
      <Grid container sx={{ height: 370, mt: 2 }}>
        <DataGrid
          rows={recordForEdit.reviews}
          columns={[
            { field: 'id', headerName: 'ID', width: 100 },
            { field: 'user', headerName: 'user', width: 300 },
            {
              field: 'review',
              headerName: 'review',
              width: 300,
              renderCell: (params) => <Rating readOnly value={params.value} />
            },
            { field: 'comment', headerName: 'comment', width: 300 }
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Grid>
    </Box>
  );
}

export default Reviews;
