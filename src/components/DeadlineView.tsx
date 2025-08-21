import React from 'react';
import { Box, Text } from 'ink';

interface DeadlineViewProps {
  options: any;
}

const DeadlineView: React.FC<DeadlineViewProps> = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>Upcoming Deadlines</Text>
      
      <Box marginTop={1} borderStyle="single" borderColor="yellow" padding={1}>
        <Box flexDirection="column">
          <Text color="yellow">Gameweek 12</Text>
          <Text>Deadline: Sat 2 Dec, 11:30</Text>
          <Text color="gray">2 days, 14 hours remaining</Text>
        </Box>
      </Box>
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default DeadlineView;