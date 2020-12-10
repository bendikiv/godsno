import React from "react";
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalOverlay,
  ModalFooter,
} from "@chakra-ui/react";

export const SeNorge = () => {
  const iframe = {
    __html:
      '<iframe src="http://www.senorge.no/index.html?p=senorgeny&st=snow" width="100%" height="900"></iframe>',
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box>
        <Heading mb="5rem">SeNorge</Heading>
        <Button onClick={onOpen}>Åpne snøkart</Button>

        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>http://www.senorge.no</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div dangerouslySetInnerHTML={iframe} />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Lukk
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
