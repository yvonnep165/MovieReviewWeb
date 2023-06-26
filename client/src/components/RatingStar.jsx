import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import "../style/movieDetail.css";


export default function HalfRating({value}) {
  return (
    <Stack spacing={1}>
      <Rating className="stars" name="half-rating-read" defaultValue={value} precision={0.5} readOnly sx={{
          color: '#FFC107'
        }}/>
    </Stack>
  );
}