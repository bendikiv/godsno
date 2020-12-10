import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  getVarselFromVarsomSimple,
  GoogleMapsCoordinates,
  IAvyProblem,
  IDagsVarsel,
} from "../api";
import {
  mapFromAvalancheProblemTypeIdToImage,
  IAvalancheProblemType,
} from "../utilities/varsomUtilities";

interface VarsomProps {
  coordinates: GoogleMapsCoordinates | null;
}

export const VarsomComponent = ({ coordinates }: VarsomProps) => {
  const [varsomVarsel, setVarsomVarsel] = useState<IDagsVarsel[] | null>(null);

  useEffect(() => {
    getVarselFromVarsomSimple(coordinates).then((v) => setVarsomVarsel(v));
  }, [coordinates]);

  return (
    <>
      <Heading mb="1rem">Varsom</Heading>
      {varsomVarsel && (
        <>
          <Text fontWeight="bold">
            Region: {varsomVarsel && varsomVarsel[0].regionName}
          </Text>
          <>
            {varsomVarsel.map((dagsVarsel, i) => (
              <VarsomDagsVarsel key={i} dagsVarsel={dagsVarsel} />
            ))}
          </>
        </>
      )}
    </>
  );
};

interface DagsVarselProps {
  dagsVarsel: IDagsVarsel;
}

const VarsomDagsVarsel = ({ dagsVarsel }: DagsVarselProps) => {
  const avyProblemTypes = dagsVarsel.avyProblems.map((a: IAvyProblem) =>
    mapFromAvalancheProblemTypeIdToImage(a.avyProblemTypeId)
  );

  return (
    <Flex borderTop="1px" p="0.5rem" justifyContent="space-between">
      <Box>
        <Text>{dagsVarsel.validFrom.toLocaleString().substr(0, 10)}</Text>
        <Heading size="lg" mb="2rem">
          Faregrad: {dagsVarsel.dangerLevel}
        </Heading>
        <Box mb="1rem">
          <Text>{dagsVarsel.mainText}</Text>
        </Box>
        <Box>
          {avyProblemTypes.map(
            (avyProblemType: IAvalancheProblemType, i: number) => (
              <Box key={i} mb="1rem">
                <Image
                  boxSize="4rem"
                  margin="auto"
                  src={
                    window.location.origin +
                    `/images/varsom/skredproblemer/${avyProblemType.imageName}.jpg`
                  }
                  alt="avalanche problem"
                  title={avyProblemType.description}
                />
              </Box>
            )
          )}
        </Box>
        <Box textAlign="left">
          {dagsVarsel.avyProblems.map((avyProb: IAvyProblem, i: number) => {
            return (
              <Box key={i} p="0 2rem">
                <Box key={i} mb="1rem">
                  <Text mb="0.5rem">Skredproblem</Text>
                  <Box ml="1rem">
                    <Heading size="sm">{avyProb.name}</Heading>
                    <Text fontSize="xs">{avyProb.description}</Text>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Flex>
  );
};
