import React from "react";
import { Box, Image, Text, IconButton, Flex, Button } from "@chakra-ui/react";
import { FaPencilAlt, FaTrash, FaUserPlus, FaEllipsisH, FaEye } from "react-icons/fa";
import { BASE_URL } from "../../../config/config";
import axios from "axios";
import { useAuth } from "../../../Hooks/AuthContext";
import { useQueryClient } from 'react-query';
import DeleteConfirmationDialog from "../../modals/othermodals/DeleteConfirmation";
import AddOperatorModal from "../../modals/othermodals/OperatorModal";
import { useCustomToast } from "../../../Hooks/ToastHook";

const ShowroomContentCard = ({ showroom, isSelected, onClick, onEdit, onDeleteSuccess }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isAddOperatorModalOpen, setIsAddOperatorModalOpen] = React.useState(false);
  const [selectedOperator, setSelectedOperator] = React.useState(null);
  const [isDeleteOperatorDialogOpen, setIsDeleteOperatorDialogOpen] = React.useState(false);
  const showToast = useCustomToast();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [showAllOperators, setShowAllOperators] = React.useState(false);

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(showroom);
  };
  const handlePreview = (e) => {
    e.stopPropagation();
    // Navigate to the showroom preview page
    window.open(`/showroom/${showroom.id}`, '_blank');
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const previousShowrooms = queryClient.getQueryData(["showrooms"]);
      queryClient.setQueryData(["showrooms"], (old) => 
        old?.filter((s) => s.id !== showroom.id)
      );

      const response = await axios.delete(
        `${BASE_URL}/api/ad-showrooms/${showroom.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        if (onDeleteSuccess) onDeleteSuccess(showroom.id);
        await queryClient.invalidateQueries(["showrooms"]);
        showToast({
          title: "Showroom deleted",
          description: "The showroom has been successfully deleted.",
        });
      }
    } catch (error) {
      queryClient.setQueryData(["showrooms"], previousShowrooms);
      showToast({
        title: "Error deleting showroom",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteOperator = async () => {
    if (!selectedOperator) return;

    setIsDeleting(true);
    try {
      const previousShowrooms = queryClient.getQueryData(["showrooms"]);
      
      queryClient.setQueryData(["showrooms"], (old) => 
        old?.map((s) => ({
          ...s,
          adShowroomOperators: s.id === showroom.id 
            ? s.adShowroomOperators.filter(op => op.id !== selectedOperator.id)
            : s.adShowroomOperators
        }))
      );

      const response = await axios.delete(
        `${BASE_URL}/api/delete-ad-showroom-operator/${selectedOperator.id}/${showroom.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        await queryClient.invalidateQueries(["showrooms"]);
        showToast({
          title: "Operator removed",
          description: "The operator has been successfully removed.",
        });
        // Trigger the onDeleteSuccess callback if provided
        if (onDeleteSuccess) onDeleteSuccess(selectedOperator.id);
      }
    } catch (error) {
      queryClient.setQueryData(["showrooms"], previousShowrooms);
      showToast({
        title: "Error removing operator",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteOperatorDialogOpen(false);
      setSelectedOperator(null);
    }
  };

  const handleAddOperator = (newOperator) => {
    queryClient.setQueryData(["showrooms"], (old) => 
      old?.map((s) => 
        s.id === showroom.id 
          ? { 
              ...s, 
              adShowroomOperators: [...s.adShowroomOperators, newOperator] 
            }
          : s
      )
    );
  };

  const renderOperators = () => {
    const operators = showroom.adShowroomOperators || [];
    const displayedOperators = showAllOperators ? operators : operators.slice(0, 2);

    return (
      <Box mt={2} border="1px" borderColor="whiteAlpha.300" borderRadius="md" p={2}>
        {displayedOperators.map((op, index) => (
          <Flex key={op.id} alignItems="center" gap={2} mb={index !== displayedOperators.length - 1 ? 2 : 0}>
            <Box flex="1">
              <Text fontSize="sm">Operator: {op.operator.name}</Text>
              <Text fontSize="sm">Phone: {op.operator.phone}</Text>
            </Box>
            <IconButton 
              icon={<FaTrash />} 
              aria-label="Remove operator" 
              size="sm" 
              bg="red.500" 
              color="white" 
              _hover={{ bg: "red.600" }} 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOperator(op);
                setIsDeleteOperatorDialogOpen(true);
              }} 
              isLoading={isDeleting && selectedOperator?.id === op.id} 
            />
          </Flex>
        ))}
        {operators.length > 2 && (
          <Button 
            size="sm" 
            variant="link" 
            color="blue.300" 
            onClick={(e) => {
              e.stopPropagation();
              setShowAllOperators(!showAllOperators);
            }}
            mt={2}
          >
            {showAllOperators ? "Show Less" : `Show ${operators.length - 2} More`}
          </Button>
        )}
      </Box>
    );
  };

  return (
    <>
      <Box
        borderRadius="xl"
        overflow="hidden"
        bg={isSelected ? "green.400" : "#23496C"}
        color="white"
        className="p-4"
        height="100%"
        cursor="pointer"
        onClick={() => onClick(showroom)}
        transition="all 0.2s"
        _hover={{ transform: "scale(1.02)" }}
        position="relative"
      >
       <Flex position="absolute" top={6} right={6} gap={2} zIndex={2}>
  <IconButton 
    icon={<FaEye />} 
    aria-label="Preview showroom" 
    size="sm" 
    colorScheme="green" 
    bg="#38A169" 
    _hover={{ bg: "#2F855A" }} 
    onClick={handlePreview} 
    borderRadius="full" 
    className="opacity-90 hover:opacity-100" 
  />
  <IconButton 
    icon={<FaPencilAlt />} 
    aria-label="Edit showroom" 
    size="sm" 
    colorScheme="blue" 
    bg="#4F7598" 
    _hover={{ bg: "#3182CE" }} 
    onClick={handleEdit} 
    borderRadius="full" 
    className="opacity-90 hover:opacity-100" 
  />
  <IconButton 
    icon={<FaTrash />} 
    aria-label="Delete showroom" 
    size="sm" 
    colorScheme="red" 
    bg="red.500" 
    _hover={{ bg: "red.600" }} 
    onClick={handleDeleteClick} 
    borderRadius="full" 
    className="opacity-90 hover:opacity-100" 
  />
</Flex>

        <Box position="relative">
          <Image 
            src={`${BASE_URL}${showroom.images?.url}`} 
            alt={showroom.name} 
            objectFit="cover" 
            height="100px" 
            width="100%" 
            bg="black" 
            className="rounded-xl" 
          />
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            right={0} 
            height="100px" 
            background="linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)" 
            className="rounded-xl" 
          />
        </Box>

        <Box p={2}>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            {showroom.name}
          </Text>
          <Flex gap={2} fontSize="sm">
            <Text>Category: {showroom.adCategory?.name}</Text>
            {showroom.adSubCategory && (
              <>
                <Text>•</Text>
                <Text>Subcategory: {showroom.adSubCategory.name}</Text>
              </>
            )}
          </Flex>

          {showroom.adShowroomOperators && showroom.adShowroomOperators.length > 0 ? (
            renderOperators()
          ) : (
            <Button 
              leftIcon={<FaUserPlus />} 
              size="sm" 
              bg="#4F7598" 
              color="white" 
              _hover={{ bg: "#3182CE" }} 
              mt={2} 
              onClick={(e) => {
                e.stopPropagation();
                setIsAddOperatorModalOpen(true);
              }} 
              width="full"
              isDisabled={showroom.adShowroomOperators?.length >= 5}
            >
              Add Operator
            </Button>
          )}

          {showroom.adShowroomOperators && showroom.adShowroomOperators.length > 0 && showroom.adShowroomOperators.length < 5 && (
            <Button 
              leftIcon={<FaUserPlus />} 
              size="sm" 
              bg="#4F7598" 
              color="white" 
              _hover={{ bg: "#3182CE" }} 
              mt={2} 
              onClick={(e) => {
                e.stopPropagation();
                setIsAddOperatorModalOpen(true);
              }} 
              width="full"
            >
              Add Another Operator
            </Button>
          )}
        </Box>
      </Box>

      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        itemName="Showroom" 
        isLoading={isDeleting} 
      />

      <DeleteConfirmationDialog 
        isOpen={isDeleteOperatorDialogOpen} 
        onClose={() => {
          setIsDeleteOperatorDialogOpen(false);
          setSelectedOperator(null);
        }} 
        onConfirm={handleDeleteOperator} 
        itemName="Operator" 
        isLoading={isDeleting} 
      />

      <AddOperatorModal
        isOpen={isAddOperatorModalOpen}
        onClose={() => setIsAddOperatorModalOpen(false)}
        showroomId={showroom.id}
        onOperatorAdded={handleAddOperator}
        maxOperators={5}
        currentOperatorsCount={showroom.adShowroomOperators?.length || 0}
      />
    </>
  );
};

export default ShowroomContentCard;
