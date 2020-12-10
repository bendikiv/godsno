import { Box } from "@chakra-ui/react";

interface DataComponentProps {
  shadowColor: string;
  children: JSX.Element | null;
}

export const DataComponentContainer = ({
  shadowColor,
  children,
}: DataComponentProps) => {
  return (
    <Box
      width="35rem"
      minHeight="20rem"
      boxShadow={`5px 5px 8px ${shadowColor}`}
      mb="2rem"
    >
      {children}
    </Box>
  );
};
