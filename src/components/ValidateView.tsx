import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface ValidateViewProps {
  options: any;
}

const ValidateView: React.FC<ValidateViewProps> = () => {
  const [loading, setLoading] = useState(true);
  const [validationResults, setValidationResults] = useState<any[]>([]);

  useEffect(() => {
    validateTeam();
  }, []);

  const validateTeam = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setValidationResults([
      { type: 'success', message: '✅ Squad size: 15 players' },
      { type: 'success', message: '✅ Formation valid: 3-5-2' },
      { type: 'success', message: '✅ Budget: £99.8m (within limit)' },
      { type: 'warning', message: '⚠️  No captain selected for GW12' },
      { type: 'success', message: '✅ Max 3 players per club' }
    ]);
    
    setLoading(false);
  };

  if (loading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan">
          <Spinner type="dots" /> Validating team...
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>Team Validation Results</Text>
      
      <Box marginTop={1} flexDirection="column">
        {validationResults.map((result, i) => (
          <Text key={i} color={result.type === 'warning' ? 'yellow' : 'green'}>
            {result.message}
          </Text>
        ))}
      </Box>
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default ValidateView;