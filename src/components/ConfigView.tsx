import React from 'react';
import { Box, Text } from 'ink';

interface ConfigViewProps {
  options: any;
}

const ConfigView: React.FC<ConfigViewProps> = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>Configuration</Text>
      
      <Box marginTop={1}>
        <Text>GitHub User: martinpalastanga</Text>
        <Text>Team Name: Code Warriors FC</Text>
        <Text>League: Git Football League</Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default ConfigView;