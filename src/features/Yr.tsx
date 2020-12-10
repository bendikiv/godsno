import React, { useEffect, useState } from "react";
import { getWeatherFromYr, GoogleMapsCoordinates } from "../api";
import { YrWeatherData } from "../data/contracts";
import { Box, Flex, Heading, Icon, Image, Text } from "@chakra-ui/react";
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

interface YrComponentProps {
  coordinates: GoogleMapsCoordinates | null;
}

export const YrComponent = ({ coordinates }: YrComponentProps) => {
  const [weather, setWeather] = useState<YrWeatherData | null>(null);

  useEffect(() => {
    getWeatherFromYr(coordinates).then((w) => setWeather(w));
  }, [coordinates]);

  return (
    <>
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
    </>
  );
};

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
