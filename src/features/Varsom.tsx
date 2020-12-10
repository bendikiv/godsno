import { Box, Divider, Flex, Heading, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  getVarselFromVarsomSimple,
  GoogleMapsCoordinates,
  IAvyAdvice,
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
              <Box key={i} mb="1rem">
                <Heading size="sm">Skredproblem {i + 1}:</Heading>
                <Text>{avyProb.name}</Text>
                <Text>{avyProb.description}</Text>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box width="50%">
        {dagsVarsel.advices.map((a: IAvyAdvice, i: number) => {
          return (
            <Box key={i}>
              <Heading size="sm">Ferdselsråd:</Heading>
              <Flex>
                <Image src={a.imgUrl} width="40%" height="40$" />
                <Text pl="0.5rem" textAlign="left">
                  {a.text}
                </Text>
              </Flex>
              {i !== 0 && <Divider orientation="horizontal" />}
            </Box>
          );
        })}
      </Box>
    </Flex>
  );
};
