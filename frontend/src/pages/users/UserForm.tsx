/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Controls from '../../components/controls/Controls';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const initialFormValues = {
  id: 0,
  username: '',
  firstName: '',
  lastName: '',
  mobile: 0,
  email: '',
};

const schema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  username: z.string().min(1, 'Username is required'),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  mobile: z.union([z.string().min(1, 'Mobile is required'), z.number()]),
  email: z.string().email('Valid email is required').min(1, 'Email is required'),
});

export default function UserForm({ recordForEdit, addOrEdit }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: recordForEdit || initialFormValues,
  });

  const onSubmit = (data) => {
    addOrEdit(data, reset);
  };

  useEffect(() => {
    if (recordForEdit) {
      reset(recordForEdit);
    } else {
      reset(initialFormValues);
    }
  }, [recordForEdit, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={0}>
        <Grid sx={{ pr: { sm: 1 } }} size={{ xs: 12, sm: 6 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Controls.Input
                {...field}
                label="First Name"
                error={errors.firstName?.message}
                InputProps={{
                  startAdornment: (
                    <PersonOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid sx={{ pl: { sm: 1 } }} size={{ xs: 12, sm: 6 }}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Controls.Input {...field} label="Last Name" error={errors.lastName?.message} />
            )}
          />
        </Grid>
      </Grid>

      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <Controls.Input
            {...field}
            label="Username"
            error={errors.username?.message}
            InputProps={{
              startAdornment: (
                <BadgeOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
              ),
            }}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Controls.Input
            {...field}
            label="Email Address"
            error={errors.email?.message}
            InputProps={{
              startAdornment: (
                <EmailOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
              ),
            }}
          />
        )}
      />
      <Controller
        name="mobile"
        control={control}
        render={({ field }) => (
          <Controls.Input
            {...field}
            label="Mobile Number"
            error={errors.mobile?.message}
            InputProps={{
              startAdornment: (
                <PhoneOutlinedIcon sx={{ mr: 1, fontSize: 18, color: 'text.disabled' }} />
              ),
            }}
          />
        )}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
          mt: 1,
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Controls.Button
          text="Reset"
          onClick={() => reset(initialFormValues)}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            fontWeight: 700,
            px: 3,
            borderColor: 'divider',
            color: 'text.secondary',
          }}
        />
        <Controls.Button
          type="submit"
          text={recordForEdit?.id ? 'Save Changes' : 'Add User'}
          sx={{
            borderRadius: '10px',
            fontWeight: 700,
            px: 3,
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            '&:hover': { boxShadow: '0 6px 20px rgba(99,102,241,0.5)' },
          }}
        />
      </Box>
    </form>
  );
}

UserForm.propTypes = {
  addOrEdit: PropTypes.func.isRequired,
  recordForEdit: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
};

UserForm.defaultProps = { recordForEdit: initialFormValues };
