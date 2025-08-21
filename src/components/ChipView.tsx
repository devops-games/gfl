import React from 'react';
import { Box, Text } from 'ink';

interface ChipViewProps {
  options: any;
}

const ChipView: React.FC<ChipViewProps> = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>Chip Management</Text>
      
      <Box marginTop={1}>
        <Text color="green">Available Chips:</Text>
        <Text>• Triple Captain</Text>
        <Text>• Free Hit</Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default ChipView;