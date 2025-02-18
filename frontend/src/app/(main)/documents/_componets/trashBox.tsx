// import { useEffect, useRef, useState } from 'react';
// import {
//   Box,
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   PopoverArrow,
//   PopoverCloseButton,
//   PopoverHeader,
//   PopoverBody,
//   Text,
//   Button,
//   Icon,
//   Portal,
// } from '@chakra-ui/react';
// import { FaTrash } from 'react-icons/fa';
// import { DocumentType } from '@/app/type';
// import { getArchive } from '@/app/api';
// import { useQuery } from 'react-query';
// import { ArchiveDocument } from './archiveDocumet';

// const TrashBox = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const openButtonRef = useRef(null);

//   const { data: documents } = useQuery<DocumentType[] | undefined>(
//     'archive',
//     getArchive
//   );

//   const handleClick = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleOnOpen = async () => {
//     setIsOpen(true);
//   };

//   useEffect(() => {
//     const updatePlacement = () => {
//       const rect = buttonRef.current.getBoundingClientRect();
//       if (window.innerHeight - rect.bottom < 200) {
//         // 200px is an arbitrary number to adjust visibility
//         setPlacement('top-start');
//       } else {
//         setPlacement('bottom-start');
//       }
//     };

//     window.addEventListener('scroll', updatePlacement, { passive: true });
//     window.addEventListener('resize', updatePlacement, { passive: true });

//     return () => {
//       window.removeEventListener('scroll', updatePlacement);
//       window.removeEventListener('resize', updatePlacement);
//     };
//   }, []);

//   return (
//     <Box>
//       <Popover
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         initialFocusRef={openButtonRef}
//         placement='right-start'
//         modifiers={[
//           {
//             name: 'offset',
//             options: {
//               offset: [10, 0], // オフセットを調整してトリガーからの距離を設定
//             },
//           },
//         ]}
//       >
//         <PopoverTrigger>
//           <Button
//             ref={openButtonRef}
//             leftIcon={<Icon as={FaTrash} color='gray.600' />}
//             p='1'
//             fontSize='md'
//             fontWeight='medium'
//             w='100%'
//             justifyContent='flex-start'
//             onClick={handleClick}
//           >
//             Trash
//           </Button>
//         </PopoverTrigger>
//         <Portal>
//           <PopoverContent
//             p='5'
//             width='sm'
//             overflowY='auto'
//             maxHeight='400px'
//             zIndex='tooltip' // Chakra UIのzIndex値を使用
//           >
//             <PopoverArrow />
//             <PopoverCloseButton />
//             <PopoverHeader>Trash</PopoverHeader>
//             <PopoverBody>
//               {documents && documents.length > 0 ? (
//                 documents.map((document) => (
//                   <ArchiveDocument
//                     key={document.id}
//                     document={document}
//                     setIsPopoverOpen={setIsOpen}
//                   />
//                 ))
//               ) : (
//                 <Text>No documents in the trash</Text>
//               )}
//             </PopoverBody>
//           </PopoverContent>
//         </Portal>
//       </Popover>
//     </Box>
//   );
// };

// export default TrashBox;
