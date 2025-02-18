// import { deleteArchive } from '@/app/api';
// import { DocumentType } from '@/app/type';
// import {
//   AlertDialog,
//   AlertDialogBody,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogContent,
//   AlertDialogOverlay,
//   Button,
// } from '@chakra-ui/react';

// import { ChevronLeftIcon, DeleteIcon } from '@chakra-ui/icons';
// import { Box, Flex, Icon, Text, useToast } from '@chakra-ui/react';
// import { useRouter } from 'next/navigation';
// import { useMutation, useQueryClient } from 'react-query';
// import { useRef, useState } from 'react';

// interface ArchiveDocumentProps {
//   document: DocumentType;
//   // onDialogToggle: (shouldOpen: boolean) => void;
//   setIsPopoverOpen: (isOpen: boolean) => void;
// }

// export const ArchiveDocument = ({
//   document,
//   setIsPopoverOpen,
// }: ArchiveDocumentProps) => {
//   const router = useRouter();
//   const toast = useToast();
//   const queryClient = useQueryClient();

//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const cancelRef = useRef(null);

//   const { mutate: deleteDocument } = useMutation(
//     () => deleteArchive(document.id),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('archive');
//         toast({
//           title: 'Document deleted.',
//           status: 'success',
//           duration: 2000,
//           isClosable: true,
//         });
//       },
//       onError: (error: unknown) => {
//         let errorMessage = 'An unexpected error occurred';
//         if (error instanceof Error) {
//           errorMessage = error.message;
//         } else if (error && typeof error === 'object' && 'message' in error) {
//           errorMessage = (error as { message: string }).message;
//         }

//         toast({
//           title: 'Failed to delete document.',
//           description: errorMessage,
//           status: 'error',
//           duration: 2000,
//           isClosable: true,
//         });
//       },
//     }
//   );

//   const { mutate: restoreDocument } = useMutation(
// 			() => restoreArchive(document.id),
// 			{
// 				onSuccess: () => {
// 					queryClient.invalidateQueries("archive");
// 					toast({
// 						title: "Document restored.",
// 						status: "success",
// 						duration: 2000,
// 						isClosable: true,
// 					});
// 				},
// 				onError: (error: unknown) => {
// 					let errorMessage = "An unexpected error occurred";
// 					if (error instanceof Error) {
// 						errorMessage = error.message;
// 					} else if (error && typeof error === "object" && "message" in error) {
// 						errorMessage = (error as { message: string }).message;
// 					}
// 					toast({
// 						title: "Failed to restore document.",
// 						description: errorMessage,
// 						status: "error",
// 						duration: 2000,
// 						isClosable: true,
// 					});
// 				},
// 			},
// 		);

//   const handleOnClick = () => {
//     router.push(`/documents/${document.id}`);
//   };

//   const handleDeleteIconClick = (e: React.MouseEvent<SVGElement>) => {
//     e.stopPropagation();
//     setIsConfirmOpen(true);
//   };

//   const handleDelete = () => {
//     deleteDocument();
//     setIsConfirmOpen(false);
//     setIsPopoverOpen(false);
//   };

//   const handleRestoreIconClick = () => {
//     restoreDocumemt();
//   };
//   const handleAlertDialogClose = () => {
//     setIsConfirmOpen(false);
//   };
//   return (
//     <Box
//       margin='1'
//       width='100%'
//       height='30px'
//       onClick={handleOnClick}
//       _hover={{ cursor: 'pointer', bg: 'gray.200' }}
//     >
//       <Flex justifyContent='space-between' alignItems='center' width='100%'>
//         <Flex alignItems='center'>
//           <Text marginLeft='2' fontWeight='500'>
//             {document.title}
//           </Text>
//         </Flex>
//         <Flex justifyContent='flex-end'>
//           <ChevronLeftIcon onClick={handleRestoreIconClick} />
//           <DeleteIcon marginLeft='2' onClick={handleDeleteIconClick} />
//         </Flex>
//       </Flex>

//       <AlertDialog
//         isOpen={isConfirmOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={handleAlertDialogClose}
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent>
//             <AlertDialogHeader fontSize='lg' fontWeight='bold'>
//               Delete Document
//             </AlertDialogHeader>
//             <AlertDialogBody>
//               Are you sure you want to delete this document? This action cannot
//               be undone.
//             </AlertDialogBody>
//             <AlertDialogFooter>
//               <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
//                 Cancel
//               </Button>
//               <Button colorScheme='red' onClick={handleDelete} ml={3}>
//                 Delete
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </Box>
//   );
// };
