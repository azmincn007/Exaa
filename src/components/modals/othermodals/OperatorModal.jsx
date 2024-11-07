import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../../../Hooks/AuthContext";
import { useCustomToast } from "../../../Hooks/ToastHook";
import { BASE_URL } from "../../../config/config";
import { useQueryClient } from 'react-query';

const AddOperatorModal = ({ 
  isOpen, 
  onClose,
  showroomId,
  onOperatorAdded // New prop for callback
}) => {
  const [phone, setPhone] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const showToast = useCustomToast();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async () => {
    if (!validatePhone(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/ad-showroo-operatos`,
        {
          phone: `+91${phone}`,
          showroomId: showroomId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Call the onOperatorAdded callback to update the parent state
        onOperatorAdded(response.data); // Assuming response.data contains the new operator info
        await queryClient.invalidateQueries(["showrooms"]);
        showToast({
          title: "Success",
          description: "Operator added successfully",
          status: "success"
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error adding operator:", error);
      const errorMessage = error.response?.data?.message || "Failed to add operator";
      setError(errorMessage);
      showToast({
        title: "Error",
        description: errorMessage,
        status: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPhone("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Operator</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!error}>
            <InputGroup>
              <InputLeftAddon children="+91" />
              <Input
                placeholder="Enter 10 digit phone number"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(value);
                  setError(""); 
                }}
                maxLength={10}
              />
            </InputGroup>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            bg="#4F7598"
            color="white"
            _hover={{ bg: "#3182CE" }}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!phone || phone.length !== 10}
          >
            Add Operator
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddOperatorModal;
