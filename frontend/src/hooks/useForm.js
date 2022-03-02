import React, { useState } from 'react';
import Joi from 'joi';
import PropTypes from 'prop-types';

export function useForm(initialFormValues, schema) {
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const jschema = Joi.object().keys(schema).unknown(true);
    const { error } = jschema.validate(values);
    if (!error) return null;

    const validationErrors = {};
    error.details.forEach((item) => {
      validationErrors[item.path[0]] = item.message;
    });
    setErrors(validationErrors);

    return validationErrors;
  };

  const validateProperty = ({ name, value }) => {
    let validationError = null;
    if (name in schema) {
      const obj = { [name]: value };
      const fieldSchema = { [name]: schema[name] };
      const { error } = Joi.object(fieldSchema).validate(obj);
      validationError = error ? error.details[0].message : null;
    }
    return validationError;
  };

  const handleInputChange = ({ target: input }) => {
    const { name, value } = input;
    const inputErrors = { ...errors };
    const errorMessage = validateProperty(input);

    if (errorMessage) inputErrors[name] = errorMessage;
    else delete inputErrors[name];

    setValues({
      ...values,
      [name]: value
    });
    setErrors({ ...inputErrors });
  };

  const resetForm = () => {
    setValues(initialFormValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    validate
  };
}

export function Form(props) {
  const { children, ...other } = props;
  return (
    <form autoComplete="off" {...other}>
      {children}
    </form>
  );
}

Form.propTypes = {
  children: PropTypes.element.isRequired
};
