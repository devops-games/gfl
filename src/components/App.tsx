import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Spinner from 'ink-spinner';
import InteractiveMenu from './InteractiveMenu.js';
import StatusView from './StatusView.js';
import TransferView from './TransferView.js';
import CreateTeamView from './CreateTeamView.js';
import ValidateView from './ValidateView.js';
import DeadlineView from './DeadlineView.js';
import CaptainView from './CaptainView.js';
import ChipView from './ChipView.js';
import SimulateView from './SimulateView.js';
import LeagueView from './LeagueView.js';
import HistoryView from './HistoryView.js';
import SyncView from './SyncView.js';
import ConfigView from './ConfigView.js';
import InitView from './InitView.js';

interface AppProps {
  mode: string;
  options: any;
}

const App: React.FC<AppProps> = ({ mode, options }) => {
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Gradient name="rainbow">
          <BigText text="GFL" />
        </Gradient>
        <Box marginTop={1}>
          <Text color="gray">
            <Spinner type="dots" /> Loading Git Fantasy League...
          </Text>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">❌ Error: {error}</Text>
      </Box>
    );
  }

  // Route to appropriate component based on mode
  switch (mode) {
    case 'interactive':
      return <InteractiveMenu options={options} />;
    case 'status':
      return <StatusView options={options} />;
    case 'transfer':
      return <TransferView options={options} />;
    case 'create-team':
      return <CreateTeamView options={options} />;
    case 'validate':
      return <ValidateView options={options} />;
    case 'deadline':
      return <DeadlineView options={options} />;
    case 'captain':
      return <CaptainView options={options} />;
    case 'chip':
      return <ChipView options={options} />;
    case 'simulate':
      return <SimulateView options={options} />;
    case 'league':
      return <LeagueView options={options} />;
    case 'history':
      return <HistoryView options={options} />;
    case 'sync':
      return <SyncView options={options} />;
    case 'config':
      return <ConfigView options={options} />;
    case 'init':
      return <InitView options={options} />;
    default:
      return (
        <Box flexDirection="column" padding={1}>
          <Text color="yellow">⚠️  Unknown mode: {mode}</Text>
        </Box>
      );
  }
};

export default App;