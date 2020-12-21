import React, { useState } from "react";
import "./App.css";
import { Box, Heading, Input, IconButton, Flex } from "@chakra-ui/react";

import { getCoordinatesFromAddress, GoogleMapsCoordinates } from "./data/api";
import { SearchIcon } from "@chakra-ui/icons";
import { VarsomComponent } from "./features/Varsom";
import { YrComponent } from "./features/Yr";
import { Instagram } from "./features/Instagram";
import { SeNorge } from "./features/SeNorge/SeNorge";

function App() {
  const [addressQuery, setAddressQuery] = useState("");
  const [
    addressCoordinates,
    setAddressCoordinates,
  ] = useState<GoogleMapsCoordinates | null>(null);

  const onSearch = (query: string) => {
    getCoordinatesFromAddress(query).then((c) => setAddressCoordinates(c));
  };

  return (
    <div className="App">
      <Box>
        <AppHeader />
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
      <Flex>
        <Box mr="5rem">
          <Box
            width="35rem"
            minHeight="20rem"
            boxShadow={"5px 5px 8px #f4a261"}
            mb="2rem"
          >
            <VarsomComponent coordinates={addressCoordinates} />
          </Box>
        </Box>
        <Flex
          justifyContent="flex-start"
          flexWrap="wrap"
          alignContent="flex-start"
        >
          <Box
            width="35rem"
            height="20rem"
            mr="5rem"
            mb="5rem"
            boxShadow={"5px 5px 8px #90e0ef"}
          >
            <YrComponent coordinates={addressCoordinates} />
          </Box>
          <Box
            width="35rem"
            height="20rem"
            mr="5rem"
            mb="5rem"
            boxShadow={"5px 5px 8px #833AB4"}
          >
            <Instagram />
          </Box>
          <Box
            width="35rem"
            height="20rem"
            mr="5rem"
            mb="5rem"
            boxShadow={"5px 5px 8px #1B1AEA"}
          >
            <SeNorge coordinates={addressCoordinates} />
          </Box>
        </Flex>
      </Flex>
    </div>
  );
}

const AppHeader = () => {
  return (
    <Box mb="2rem" pt="1rem" pb="1rem">
      <Heading size="4xl">Hvor er det god snø nå?</Heading>
    </Box>
  );
};

export default App;
