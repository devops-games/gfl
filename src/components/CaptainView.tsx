import React from 'react';
import { Box, Text } from 'ink';

interface CaptainViewProps {
  options: any;
}

const CaptainView: React.FC<CaptainViewProps> = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>Captain Management</Text>
      
      <Box marginTop={1}>
        <Text color="green">Current Captain: Haaland (C)</Text>
        <Text color="blue">Vice Captain: Salah (V)</Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default CaptainView;