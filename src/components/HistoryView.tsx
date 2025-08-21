import React from 'react';
import { Box, Text } from 'ink';

interface HistoryViewProps {
  options: any;
}

const HistoryView: React.FC<HistoryViewProps> = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>Team History</Text>
      
      <Box marginTop={1}>
        <Text>GW11: 67 pts (rank: 1,247)</Text>
        <Text>GW10: 52 pts (rank: 1,458)</Text>
        <Text>GW9: 78 pts (rank: 1,123)</Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default HistoryView;