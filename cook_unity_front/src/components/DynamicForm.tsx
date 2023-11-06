import React, { FC, ReactNode, useState } from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 36px; // Adjust as per your design
`;

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FieldContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: 28px;
`;

const FieldLabel = styled.label`
  font-weight: bold;
  display: block;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 15px; // Increased padding for a larger input field
  margin-top: 5px;
  border: 1px solid #ffc107; // Example border color, adjust as needed
  border-radius: 30px; // Rounded corners
  font-size: 16px; // Adjust font size as needed

  &:focus {
    outline: none; // Remove focus outline
    border-color: #ffc107; // Adjust to a suitable color on focus
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  bottom: -18px;
  left: 5px;
  color: #f44336; // Example error color, adjust as needed
  font-size: 14px; // Adjust font size as needed
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  background-color: #ffc107; // Adjust to match your design color
  color: #000000; // Text color, assuming it's black
  border: none; // No border for a flat design
  border-radius: 30px; // Rounded corners
  display: block;
  margin-top: 20px;
  padding: 15px 40px; // Adjust padding to increase button size
  font-size: 18px; // Adjust font size as needed
  cursor: pointer;
  transition: background-color 0.3s; // Smooth transition for hover effect

  &:hover {
    background-color: #ffa000; // Darker shade when hovered
  }
`;

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block; // Needed to position the spinner correctly
`;

const Spinner = styled(CircularProgress)`
  position: absolute;
  top: 70%;
  right: 10%;
  margin-top: -12px; // Half of the spinner height
  margin-left: -12px; // Half of the spinner width
  color: #000; // Spinner color
`;

const Description = styled.p`
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  color: #666; // Adjust the color as needed for your design
  font-size: 18px; // Adjust the font size as needed
`;

interface FieldProps {
  label: string;
  key?: string;
  type?: string;
  required?: boolean;
  validate?: (value: string) => Promise<string | null>;
}

interface FormProps {
  title?: string;
  description?: string | ReactNode; // Optional description prop
  fields: FieldProps[];
  onSubmit: (data: any) => void;
}

const DynamicForm: FC<FormProps> = ({
  title,
  description,
  fields,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle loading

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Disable form elements
    let hasError = false;
    let newErrors: Record<string, string | null> = {};
    let submitData: Record<string, any> = {}; // Object to hold data to submit

    for (let field of fields) {
      // Determine the key to use (fall back to label if key is not present)
      const key = field.key || field.label;

      // Validate required fields
      if (field.required && !formData[field.label]) {
        newErrors[field.label] = "This field is required";
        hasError = true;
      }
      // Validate using custom validation function if provided
      else if (field.validate) {
        const error = await field.validate(formData[field.label]);
        if (error) {
          newErrors[field.label] = error;
          hasError = true;
        }
      }

      // Add the data to the submitData object, using the appropriate key
      if (!hasError) {
        submitData[key] = formData[field.label];
      }
    }

    setErrors(newErrors);

    // Only call onSubmit if there are no errors
    if (!hasError) {
      await onSubmit(submitData);
    }

    setIsSubmitting(false); // Re-enable form elements
  };

  return (
    <FormContainer>
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      {fields.map((field) => (
        <FieldContainer key={field.label}>
          <FieldLabel>{field.label}</FieldLabel>
          <TextInput
            type={field.type || "text"}
            required={field.required}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            disabled={isSubmitting} // Disable input when submitting
          />
          {errors[field.label] && (
            <ErrorMessage>{errors[field.label]}</ErrorMessage>
          )}
        </FieldContainer>
      ))}
      <ButtonContainer>
        <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
          <span>Submit</span>
          {isSubmitting ? <Spinner size={12} /> : <></>}
        </SubmitButton>
      </ButtonContainer>
    </FormContainer>
  );
};

export default DynamicForm;
