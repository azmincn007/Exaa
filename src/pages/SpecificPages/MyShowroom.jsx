import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  useBreakpointValue,
  Text,
  Image,
  VStack,
} from "@chakra-ui/react";
import { MdAddCircleOutline } from "react-icons/md";
import graphic from '../../assets/Graphic.png';
import ShowroomCreateModal from "../../components/modals/othermodals/ShowroomCreateModal";

const MyShowroom = () => {
  const [isOpen, setIsOpen] = useState(false);

  const textSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const titleSize = useBreakpointValue({ base: 'md', md: 'lg', lg: 'xl' });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <Box maxWidth="container" margin="auto" padding={8} className="font-Inter">
      <Grid templateColumns={{ base: "repeat(12, 1fr)", md: "repeat(6, 1fr)", lg: "repeat(12, 1fr)" }} gap={6}>
        <GridItem colSpan={{ base: 12, md: 6, lg: 4 }} bg="blue.100" minHeight="300px" p={4}>
          <VStack spacing={4} align="stretch">
            <Box borderRadius="xl" overflow="hidden" bg="#23496C" color="white" className="p-4 ">
              <Image
                src={graphic}
                alt="Speedometer"
                objectFit="cover"
                height="100px"
                width="100%"
                bg="black"
                className="rounded-xl"
              />
              <Box p={2}>
                <Text fontSize="xl" fontWeight="bold" mb={2}>Drive with Eliana</Text>
                <Text fontSize="sm">Category: Car</Text>
                <Text fontSize="sm">Created On: 16 AUG 2024</Text>
              </Box>
            </Box>
            
            <Button
              leftIcon={<MdAddCircleOutline />}
              colorScheme="blue"
              size="lg"
              borderRadius="xl"
              bg="#4F7598"
              _hover={{ bg: "#3182CE" }}
              onClick={handleOpen}
            >
              Create New Showroom
            </Button>
          </VStack>
        </GridItem>
        
        <GridItem colSpan={{ base: 12, md: 6, lg: 8 }} bg="green.100" minHeight="300px">
          {/* This grid item is intentionally left empty */}
        </GridItem>
      </Grid>

      <ShowroomCreateModal isOpen={isOpen} onClose={handleClose} />
    </Box>
  );
};

export default MyShowroom;