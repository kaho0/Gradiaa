// AssignmentsStyles.js
import styled from 'styled-components';

export const AssignmentsContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
`;

export const Content = styled.div`
  flex: 1;
  padding: 2rem;
`;

export const AssignmentsContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const AssignmentsHeader = styled.h2`
  color: #1a237e;
  margin: 0;
  font-size: 1.8rem;
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #2196f3;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1976d2;
    transform: translateY(-1px);
  }
`;

export const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

export const RequiredStar = styled.span`
  color: #f44336;
  margin-left: 4px;
`;

export const AddAssignmentForm = styled.form`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
`;

export const AddAssignmentInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2196f3;
    outline: none;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`;

export const AddAssignmentTextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2196f3;
    outline: none;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`;

export const AddAssignmentButton = styled.button`
  background-color: #2196f3;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #1976d2;
    transform: translateY(-1px);
  }
`;

export const AssignmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AssignmentItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const DropdownButton = styled.button`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const AssignmentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
  color: #333;
`;

export const GradeTag = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.9rem;
`;

export const AssignmentDetails = styled.div`
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
`;

export const AssignmentDescription = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

export const DateText = styled.div`
  color: #9e9e9e;
  font-size: 0.9rem;
`;

export const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SidebarContainer = styled.div