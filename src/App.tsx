import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Box,
  Heading,
  Input,
  IconButton,
  Flex,
  Text,
  Image,
  Divider,
} from "@chakra-ui/react";
import {
  getVarselFromVarsomSimple,
  getCoordinatesFromAddress,
  GoogleMapsCoordinates,
  IDagsVarsel,
  IDayWeatherForecast,
  getWeatherFromYr,
  IAvyAdvice,
  IAvyProblem,
} from "./api";
import { SearchIcon } from "@chakra-ui/icons";

function App() {
  const [addressQuery, setAddressQuery] = useState("");
  const [
    addressCoordinates,
    setAddressCoordinates,
  ] = useState<GoogleMapsCoordinates | null>(null);
  const [varsomVarsel, setVarsomVarsel] = useState<IDagsVarsel[] | null>(null);
  const [weather, setWeather] = useState<IDayWeatherForecast | null>(null);

  useEffect(() => {
    getVarselFromVarsomSimple(addressCoordinates).then((v) =>
      setVarsomVarsel(v)
    );
    getWeatherFromYr(addressCoordinates).then((w) => setWeather(w));
  }, [addressCoordinates]);

  const onSearch = (query: string) => {
    getCoordinatesFromAddress(query).then((c) => setAddressCoordinates(c));
  };

  console.log(`/src/images/weathericons/png/${weather?.next6hoursSymbol}.png`);

  return (
    <div className="App">
      <Box>
        <Box mb="2rem" pt="1rem" pb="1rem">
          <Heading size="4xl">Hvor er det god snø nå?</Heading>
        </Box>
        <Box>
          <Input
            width="40%"
            mb="1rem"
            placeholder="Hvor vil du på ski?"
            onChange={(event) => setAddressQuery(event.target.value)}
          ></Input>
          <IconButton
            aria-label="Search place"
            icon={<SearchIcon />}
            onClick={() => onSearch(addressQuery)}
          />
        </Box>
        <Box>
          <Heading mb="1rem">
            {addressQuery === "" ? "Hvor?" : addressQuery}
          </Heading>
        </Box>
      </Box>
      <Flex justifyContent="space-around" flexWrap="wrap">
        <Box width="35rem" boxShadow="5px 5px 8px #f4a261" mb="2rem">
          <Heading>Varsom</Heading>
          {varsomVarsel && <Varsom varsomVarsel={varsomVarsel} />}
        </Box>
        <Box
          width="35rem"
          height="20rem"
          boxShadow="5px 5px 8px #90e0ef"
          mb="2rem"
        >
          <Heading mb="1rem">Yr</Heading>
          {weather && (
            <Flex justifyContent="space-between">
              <Box>
                <Heading size="md">Siste 3 døgn:</Heading>
                {/* <Image
                  boxSize="100px"
                  src={
                    window.location.origin +
                    `/images/weathericons/png/${weather.next6hoursSymbol}.png`
                  }
                  alt="weather icon"
                />
                <Text>{weather.next6hoursPrecAmount}mm</Text> */}
              </Box>
              <Box>
                <Heading size="md">Neste 6 timer:</Heading>
                <Image
                  boxSize="100px"
                  src={
                    window.location.origin +
                    `/images/weathericons/png/${weather.next6hoursSymbol}.png`
                  }
                  alt="weather icon"
                />
                <Text>{weather.next6hoursPrecAmount}mm</Text>
              </Box>
              <Box>
                <Heading size="md">Neste 3 døgn:</Heading>
                <Image
                  boxSize="100px"
                  src={
                    window.location.origin +
                    `/images/weathericons/png/${weather.next3DaysSymbol}.png`
                  }
                  alt="weather icon"
                />
                <Text>{weather.next3DaysPrecAmount}mm</Text>
              </Box>
            </Flex>
          )}
        </Box>
        <Box
          width="35rem"
          height="20rem"
          boxShadow="5px 5px 8px #833AB4"
          mb="2rem"
        >
          <Heading>Instagram</Heading>
        </Box>
      </Flex>
    </div>
  );
}

interface VarsomProps {
  varsomVarsel: IDagsVarsel[];
}

const Varsom = ({ varsomVarsel }: VarsomProps) => {
  return (
    <>
      <Text fontWeight="bold">
        Region: {varsomVarsel && varsomVarsel[0].regionName}
      </Text>
      {varsomVarsel.map((dagsVarsel, i) => {
        return (
          <Flex
            borderTop="1px"
            key={i}
            p="0.5rem"
            justifyContent="space-between"
          >
            <Box>
              <Text>{dagsVarsel.validFrom.toLocaleString().substr(0, 10)}</Text>
              <Heading size="lg" mb="2rem">
                Faregrad: {dagsVarsel.dangerLevel}
              </Heading>
              <Box textAlign="left">
                {dagsVarsel.avyProblems.map(
                  (avyProb: IAvyProblem, i: number) => {
                    return (
                      <Box key={i} mb="1rem">
                        <Heading size="sm">Skredproblem {i + 1}:</Heading>
                        <Text>{avyProb.name}</Text>
                        <Text>{avyProb.description}</Text>
                      </Box>
                    );
                  }
                )}
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
      })}
    </>
  );
};

export default App;
