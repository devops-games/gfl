import React from 'react';
import { Box, Text } from 'ink';

interface SyncViewProps {
  options: any;
}

const SyncView: React.FC<SyncViewProps> = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>GitHub Sync</Text>
      
      <Box marginTop={1}>
        <Text color="green">✅ Team synced with GitHub</Text>
        <Text>Last sync: 2 hours ago</Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default SyncView;