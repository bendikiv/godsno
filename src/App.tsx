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
  Icon,
} from "@chakra-ui/react";
import {
  BsArrowUp,
  BsArrowUpRight,
  BsArrowRight,
  BsArrowDownRight,
  BsArrowDown,
  BsArrowDownLeft,
  BsArrowLeft,
  BsArrowUpLeft,
} from "react-icons/bs";
import {
  getVarselFromVarsomSimple,
  getCoordinatesFromAddress,
  GoogleMapsCoordinates,
  IDagsVarsel,
  getWeatherFromYr,
  IAvyAdvice,
  IAvyProblem,
} from "./api";
import { SearchIcon } from "@chakra-ui/icons";
import { YrWeatherData } from "./data/contracts";

function App() {
  const [addressQuery, setAddressQuery] = useState("");
  const [
    addressCoordinates,
    setAddressCoordinates,
  ] = useState<GoogleMapsCoordinates | null>(null);
  const [varsomVarsel, setVarsomVarsel] = useState<IDagsVarsel[] | null>(null);
  const [weather, setWeather] = useState<YrWeatherData | null>(null);

  useEffect(() => {
    getVarselFromVarsomSimple(addressCoordinates).then((v) =>
      setVarsomVarsel(v)
    );
    getWeatherFromYr(addressCoordinates).then((w) => setWeather(w));
  }, [addressCoordinates]);

  const onSearch = (query: string) => {
    getCoordinatesFromAddress(query).then((c) => setAddressCoordinates(c));
  };

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
            <Flex justifyContent="space-evenly">
              <Box>
                <Heading size="md">Neste 6 timer:</Heading>
                <Box mb="1rem">
                  <Image
                    boxSize="100px"
                    margin="auto"
                    src={
                      window.location.origin +
                      `/images/weathericons/png/${weather.next6Hours.weatherSymbol}.png`
                    }
                    alt="weather icon"
                  />
                  <Text>{weather.next6Hours.precAmount} mm</Text>
                </Box>
                <Flex justifyContent="space-between">
                  <Box m="0 1rem 0 1rem">
                    <Heading size="xs">Vind:</Heading>
                    <Flex>
                      <Text>Min: </Text>
                      <Box>
                        <WindArrow
                          windDirection={
                            weather.next6Hours.windData.windMinDirection
                          }
                        />
                      </Box>
                      <Text>{weather.next6Hours.windData.windMin} m/s</Text>
                    </Flex>
                    <Flex>
                      <Text>Max: </Text>
                      <Box>
                        <WindArrow
                          windDirection={
                            weather.next6Hours.windData.windMaxDirection
                          }
                        />
                      </Box>
                      <Text>{weather.next6Hours.windData.windMax} m/s</Text>
                    </Flex>
                  </Box>
                  <Box m="0 1rem 0 1rem">
                    <Heading size="xs">Temperatur</Heading>
                    <Text>Min: {weather.next6Hours.tempData.tempMin} </Text>
                    <Text>Max: {weather.next6Hours.tempData.tempMax}</Text>
                  </Box>
                </Flex>
              </Box>
              <Box>
                <Heading size="md">Neste 3 døgn:</Heading>
                <Box mb="1rem">
                  <Image
                    boxSize="100px"
                    margin="auto"
                    src={
                      window.location.origin +
                      `/images/weathericons/png/${weather.next3Days.weatherSymbol}.png`
                    }
                    alt="weather icon"
                  />
                  <Text>{weather.next3Days.precAmount} mm</Text>
                </Box>
                <Flex justifyContent="space-between">
                  <Box m="0 1rem 0 1rem">
                    <Heading size="xs">Vind:</Heading>
                    <Flex>
                      <Text>Min: </Text>
                      <Box>
                        <WindArrow
                          windDirection={
                            weather.next3Days.windData.windMinDirection
                          }
                        />
                      </Box>
                      <Text>{weather.next3Days.windData.windMin} m/s</Text>
                    </Flex>
                    <Flex>
                      <Text>Max: </Text>
                      <Box>
                        <WindArrow
                          windDirection={
                            weather.next3Days.windData.windMaxDirection
                          }
                        />
                      </Box>
                      <Text>{weather.next3Days.windData.windMax} m/s</Text>
                    </Flex>
                  </Box>
                  <Box m="0 1rem 0 1rem">
                    <Heading size="xs">Temperatur</Heading>
                    <Text>Min: {weather.next3Days.tempData.tempMin} </Text>
                    <Text>Max: {weather.next3Days.tempData.tempMax}</Text>
                  </Box>
                </Flex>
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

interface WindArrowProps {
  windDirection: number;
}

const WindArrow = ({ windDirection }: WindArrowProps) => {
  if (windDirection >= 315) return <Icon as={BsArrowDownRight} />;
  else if (windDirection >= 270) return <Icon as={BsArrowRight} />;
  else if (windDirection >= 270) return <Icon as={BsArrowRight} />;
  else if (windDirection >= 225) return <Icon as={BsArrowUpRight} />;
  else if (windDirection >= 180) return <Icon as={BsArrowUp} />;
  else if (windDirection >= 135) return <Icon as={BsArrowUpLeft} />;
  else if (windDirection >= 90) return <Icon as={BsArrowLeft} />;
  else if (windDirection >= 45) return <Icon as={BsArrowDownLeft} />;
  else if (windDirection >= 0) return <Icon as={BsArrowDown} />;
  else return <div />;
};

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
