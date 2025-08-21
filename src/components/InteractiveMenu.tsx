import React, { useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

interface InteractiveMenuProps {
  options: any;
}

const InteractiveMenu: React.FC<InteractiveMenuProps> = () => {
  const { exit } = useApp();
  const [selectedView, setSelectedView] = useState<string | null>(null);

  const menuItems = [
    { label: '👀 View Team Status', value: 'status' },
    { label: '🔄 Make Transfers', value: 'transfer' },
    { label: '🆕 Create New Team', value: 'create-team' },
    { label: '✅ Validate Team', value: 'validate' },
    { label: '⏰ View Deadlines', value: 'deadline' },
    { label: '🎯 Manage Captain', value: 'captain' },
    { label: '🎰 Use Chip', value: 'chip' },
    { label: '📊 Run Simulation', value: 'simulate' },
    { label: '🏆 League Management', value: 'league' },
    { label: '📈 View History', value: 'history' },
    { label: '🔄 Sync with GitHub', value: 'sync' },
    { label: '⚙️  Configuration', value: 'config' },
    { label: '❌ Exit', value: 'exit' }
  ];

  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) {
      exit();
    }
  });

  const handleSelect = (item: { label: string; value: string }) => {
    if (item.value === 'exit') {
      exit();
    } else {
      setSelectedView(item.value);
    }
  };

  if (selectedView) {
    // In a real implementation, we would import and render the appropriate view component
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan">Loading {selectedView} view...</Text>
        <Text color="gray" dimColor>Press 'q' to quit</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Gradient name="rainbow">
          <BigText text="GFL" />
        </Gradient>
      </Box>
      
      <Box marginBottom={1}>
        <Text color="gray">Git Fantasy League - Interactive Mode</Text>
      </Box>

      <Box borderStyle="round" borderColor="cyan" padding={1}>
        <Box flexDirection="column">
          <Text color="yellow" bold>
            Select an option:
          </Text>
          <Box marginTop={1}>
            <SelectInput items={menuItems} onSelect={handleSelect} />
          </Box>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Use arrow keys to navigate, Enter to select, 'q' to quit
        </Text>
      </Box>
    </Box>
  );
};

export default InteractiveMenu;