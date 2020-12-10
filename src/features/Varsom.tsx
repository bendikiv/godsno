import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  getVarselFromVarsomSimple,
  GoogleMapsCoordinates,
  IAvyProblem,
  IDagsVarsel,
} from "../api";

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
  return (
    <Flex borderTop="1px" p="0.5rem" justifyContent="space-between">
      <Box>
        <Text>{dagsVarsel.validFrom.toLocaleString().substr(0, 10)}</Text>
        <Heading size="lg" mb="2rem">
          Faregrad: {dagsVarsel.dangerLevel}
        </Heading>
        <Box textAlign="left">
          {dagsVarsel.avyProblems.map((avyProb: IAvyProblem, i: number) => {
            return (
              <Box key={i} p="0 2rem">
                <Box mb="1rem">
                  <Text>{dagsVarsel.mainText}</Text>
                </Box>
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
