import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import { Link } from 'react-router-dom';
import Title from './Title';
import { loadCategories, selectCategories } from '../../store/categories';
import { loadAuthors, selectAuthors } from '../../store/authors';
import { loadUsers, selectUsers } from '../../store/users';
import { loadCourses, selectCourses } from '../../store/courses';
import Controls from '../controls/Controls';

function Home() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const authors = useSelector(selectAuthors);
  const users = useSelector(selectUsers);
  const courses = useSelector(selectCourses);

  useEffect(() => {
    dispatch(loadAuthors());
    dispatch(loadCategories());
    dispatch(loadUsers());
    dispatch(loadCourses());
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex'
          }}
        >
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
            <Title>Users</Title>
            <Typography component="p" variant="h3" color="secondary">
              {users.length}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Controls.ActionButton color="primary.main" onClick={() => {}}>
              <GroupIcon sx={{ fontSize: 50, p: 0.5 }} />
            </Controls.ActionButton>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex'
          }}
        >
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
            <Title>Courses</Title>
            <Typography component="p" variant="h3" color="secondary">
              {courses.length}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Controls.ActionButton color="primary.main" onClick={() => {}}>
              <SchoolIcon sx={{ fontSize: 50, p: 0.5 }} />
            </Controls.ActionButton>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex'
          }}
        >
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
            <Title>Categories</Title>
            <Typography component="p" variant="h3" color="secondary">
              {categories.length}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Controls.ActionButton color="primary.main" onClick={() => {}}>
              <CategoryIcon sx={{ fontSize: 50, p: 0.5 }} />
            </Controls.ActionButton>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex'
          }}
        >
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', mr: 3 }}>
            <Title>Authors</Title>
            <Typography component="p" variant="h3" color="secondary">
              {authors.length}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Controls.ActionButton color="primary.main" onClick={() => {}}>
              <PersonIcon sx={{ fontSize: 50, p: 0.5 }} />
            </Controls.ActionButton>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <>
            <Title>Welcome</Title>
            <Typography component="p" sx={{ flex: 1, mb: 2 }}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat esse, ullam
              nesciunt dolore beatae iure velit inventore qui eos enim quisquam ducimus, maxime a
              minima illo hic excepturi et modi.
            </Typography>
            <div>
              <Link color="primary" to="/users" style={{ color: 'green' }}>
                Setup Users
              </Link>
            </div>
          </>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8} lg={8}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam ea ex saepe temporibus
            laborum esse adipisci officiis eum. Nesciunt soluta nihil ipsam fuga, possimus
            laudantium cupiditate vero eum culpa quaerat?
          </p>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Home;
