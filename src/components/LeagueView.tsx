import React from 'react';
import { Box, Text } from 'ink';

interface LeagueViewProps {
  options: any;
}

const LeagueView: React.FC<LeagueViewProps> = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>League Standings</Text>
      
      <Box marginTop={1}>
        <Text>1. DevOps United - 578 pts</Text>
        <Text color="yellow">2. Code Warriors FC - 523 pts (You)</Text>
        <Text>3. Git Pushers - 512 pts</Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default LeagueView;