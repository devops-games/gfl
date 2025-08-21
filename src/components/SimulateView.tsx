import React from 'react';
import { Box, Text } from 'ink';

interface SimulateViewProps {
  options: any;
}

const SimulateView: React.FC<SimulateViewProps> = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>Simulation Results</Text>
      
      <Box marginTop={1}>
        <Text>Expected Points: 67</Text>
        <Text>Best Captain: Haaland (14.2 expected)</Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default SimulateView;