import React from 'react';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalBody, 
  Text, 
  Select, 
  Button, 
  FormControl, 
  FormLabel 
} from '@chakra-ui/react';

const SubcategoryModal = ({ isOpenm, onClose }) => {
  return (
    <Modal isOpen={isOpenm} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Text textAlign="center" p={6}>
            Please select a subcategory before proceeding.
          </Text>
          
          <FormControl>
            <FormLabel htmlFor="subcategory">Subcategory</FormLabel>
            <Select id="subcategory" placeholder="Select subcategory">
              <option value="option1">Electronics</option>
              <option value="option2">Clothing</option>
              <option value="option3">Home Goods</option>
            </Select>
          </FormControl>
          
          <Button 
            onClick={onClose} 
            width="full" 
            mt={3}
            colorScheme="blue"
          >
            Close
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SubcategoryModal;