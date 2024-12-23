import { Bell } from 'lucide-react'
import {
  Box,
  Flex,
  Text,
  Divider,
  Circle,
  VStack,
  Spinner,
} from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { useQuery } from 'react-query'
import axios from 'axios'
import { BASE_URL } from '../../../config/config'

// Fetch function for notifications
const fetchNotifications = async () => {
  const token = localStorage.getItem('UserToken');
  const { data } = await axios.get(`${BASE_URL}/api/find-user-notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export default function NotificationsPanel() {

  // Using React Query to fetch notifications
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  })

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="lg" color="blue.500" />
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Text color="red.500">Error loading notifications</Text>
      </Flex>
    )
  }

  return (
    <div className='w-full h-full font-Inter'>
      <div className='mx-auto w-full md:w-[90%] bg-[#0071BC1A] mt-4 p-0 md:p-4 md:min-h-screen'>
        <div className=' bg-white'>
          <div className='p-4'>
            <Flex align="center" gap={2}>
              <Bell color="blue" size={20} />
              <Text fontSize="lg" fontWeight="semibold">
                Notifications
              </Text>
            </Flex>
          </div>
          <Divider w="98%" mx="auto" borderColor="#D7DEF0" borderWidth="2px" />
          <div>
            <Box maxH="300px" overflowY="auto">
              <VStack spacing={0} align="stretch">
                {notifications?.data?.map((notification, index) => (
                  <Box key={notification._id || notification.id}>
                    <Flex p={4} gap={3} align="flex-start">
                      <Circle size={8} bg="blue.500" color="white">
                        <Bell size={16} />
                      </Circle>
                      <Flex direction="column" gap={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {notification.title}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </Text>
                      </Flex>
                    </Flex>
                    {index < notifications?.data?.length - 1 && (
                      <Divider w="98%" mx="auto" borderColor="#D7DEF0" borderWidth="2px" />
                    )}
                  </Box>
                ))}
              </VStack>
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}