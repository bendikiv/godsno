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
} from "@chakra-ui/react";
import {
  getVarselFromVarsomSimple,
  getCoordinatesFromAddress,
  GoogleMapsCoordinates,
  IDagsVarsel,
  IDayWeatherForecast,
  getWeatherFromYr,
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
    getWeatherFromYr().then((w) => setWeather(w));
  }, [addressCoordinates]);

  const onSearch = (query: string) => {
    console.log(query);
    getCoordinatesFromAddress(query).then((c) => setAddressCoordinates(c));
  };

  console.log("varsomVarsel: ", varsomVarsel);

  return (
    <div className="App">
      <Box>
        <Box backgroundColor="#caf0f8" mb="2rem" pt="1rem" pb="1rem">
          <Heading size="4xl">Hvor er det god snø nå?</Heading>
        </Box>
        <Box>
          <Heading size="m" mb="1rem">
            Hvor vil du på ski?
          </Heading>
          <Input
            width="40%"
            mb="1rem"
            onChange={(event) => setAddressQuery(event.target.value)}
          ></Input>
          <IconButton
            aria-label="Search place"
            icon={<SearchIcon />}
            onClick={() => onSearch(addressQuery)}
          />
        </Box>
        <Box>
          <Heading>{addressQuery === "" ? "Velg sted" : addressQuery}</Heading>
        </Box>
      </Box>
      <Flex justifyContent="space-between">
        <Box width="33%" backgroundColor="#f4a261">
          <Heading>Varsom</Heading>
          {varsomVarsel && <Varsom varsomVarsel={varsomVarsel} />}
        </Box>
        <Box width="33%" height="20rem" backgroundColor="#90e0ef">
          <Heading>Yr</Heading>
          {weather && (
            <Box>
              <Text>{weather.next6hoursSymbol}</Text>
              <Text>{weather.next6hoursPrecAmount}</Text>
            </Box>
          )}
        </Box>
        <Box width="33%" height="20rem" backgroundColor="#833AB4">
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
              <Text fontWeight="bold" fontSize="1.5rem">
                Faregrad: {dagsVarsel.dangerLevel}
              </Text>
            </Box>
            <Box width="50%">
              <Text fontWeight="bold">Ferdselsråd:</Text>
              <Flex>
                <Image
                  src={dagsVarsel.advices[0]?.imgUrl}
                  width="40%"
                  height="40$"
                />
                <Text pl="0.5rem" textAlign="left">
                  {dagsVarsel.advices[0]?.text}
                </Text>
              </Flex>
            </Box>
          </Flex>
        );
      })}
    </>
  );
};

export default App;
