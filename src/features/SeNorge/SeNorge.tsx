import React, { useEffect, useState } from "react";
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { NveSnowDepthData } from "../../data/contracts";
import { getSnowDepth } from "./data";
import { GoogleMapsCoordinates } from "../../data/api";

interface SeNorgeProps {
  coordinates: GoogleMapsCoordinates | null;
}

export const SeNorge = ({ coordinates }: SeNorgeProps) => {
  const [snowDepth, setSnowDepth] = useState<NveSnowDepthData | null>(null);

  useEffect(() => {
    getSnowDepth(coordinates).then((sd) => setSnowDepth(sd));
  }, [coordinates]);

  const iframe = {
    __html:
      '<iframe src="http://www.senorge.no/index.html?p=senorgeny&st=snow" width="100%" height="900"></iframe>',
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    snowDepth && (
      <>
        <Box>
          <Heading mb="1rem">SeNorge</Heading>
          <Box mb="2rem">
            <Stat>
              <StatLabel>Snødybde</StatLabel>
              <StatNumber>
                {snowDepth.snowdepth}
                {snowDepth.unit}
              </StatNumber>
              <StatHelpText>Høyde: {snowDepth.altitude}</StatHelpText>
            </Stat>
          </Box>
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
    )
  );
};
