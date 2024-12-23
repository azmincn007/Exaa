import React, { useState } from 'react';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Select,
  VStack,
  Text,
  useToast
} from '@chakra-ui/react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';

// Centralized report reasons for easier maintenance
const REPORT_REASONS = [
  { value: 'Inappropriate content' , label: 'Inappropriate content' },
  { value: 'Copyright issue' , label: 'Copyright issue' },
  { value: 'Repetitive' , label: 'Repetitive' },
];

// Create a mutation function for submitting the report
const submitImageReport = async (reportData) => {
  const response = await axios.post(`${BASE_URL}/api/create-image-gallery-image-report`, reportData);
  return response.data;
};

export default function ReportModal({ 
  isOpen, 
  onClose, 
  imageId,  // Added to specify which image is being reported
  imageGallerySubCategory
}) {
  const [reportReason, setReportReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const toast = useToast();

  // Use React Query mutation
  const { mutate, isLoading } = useMutation(submitImageReport, {
    onSuccess: () => {
      toast({
        title: 'Report Submitted',
        description: 'Thank you for helping us improve the platform',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      resetModal();
    },
    onError: (error) => {
      toast({
        title: 'Report Submission Failed',
        description: error.message || 'Unable to submit report. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const handleReportSubmit = () => {
    // Validate report submission
    if (!reportReason) {
      toast({
        title: 'Validation Error',
        description: 'Please select a report reason',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Prepare report data
    const reportData = {
      imageId: imageId,
      imageGallerySubCategoryId: imageGallerySubCategory,
      reason: reportReason,
      details: reportReason === 'other' ? additionalDetails : ''
    };

    // Submit the report using mutation
    mutate(reportData);
  };

  const resetModal = () => {
    setReportReason('');
    setAdditionalDetails('');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={resetModal}
      size="md"
      isCentered
    >
      <ModalOverlay 
        bg='blackAlpha.300'
        backdropFilter='blur(10px)'
      />
      <ModalContent>
        <ModalHeader 
          textAlign="center" 
          fontWeight="bold" 
          color="blue.500"
        >
          Report Image
        </ModalHeader>
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Select 
              placeholder="Select Report Reason" 
              value={reportReason} 
              onChange={(e) => setReportReason(e.target.value)}
              variant="filled"
              isRequired
            >
              {REPORT_REASONS.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </Select>

            {reportReason === 'other' && (
              <Text 
                as="textarea"
                placeholder="Please provide additional details"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                borderWidth={1}
                borderRadius="md"
                p={2}
                minHeight="100px"
              />
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button 
            variant="ghost" 
            mr={3} 
            onClick={resetModal}
          >
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleReportSubmit}
            isLoading={isLoading}
            loadingText="Submitting"
          >
            Submit Report
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}