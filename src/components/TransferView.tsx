import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';

interface TransferViewProps {
  options: any;
}

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  price: number;
  points: number;
  form: number;
  ownership: number;
}

const TransferView: React.FC<TransferViewProps> = () => {
  const { exit } = useApp();
  const [step, setStep] = useState<'select-out' | 'select-in' | 'confirm' | 'processing'>('select-out');
  const [currentSquad, setCurrentSquad] = useState<Player[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [playerOut, setPlayerOut] = useState<Player | null>(null);
  const [playerIn, setPlayerIn] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transferCost, setTransferCost] = useState(0);

  useEffect(() => {
    loadCurrentSquad();
  }, []);

  const loadCurrentSquad = async () => {
    setLoading(true);
    try {
      // Simulate loading current squad
      const squad: Player[] = [
        { id: 1, name: 'Alisson', team: 'Liverpool', position: 'GK', price: 5.5, points: 45, form: 5.2, ownership: 15.3 },
        { id: 3, name: 'Alexander-Arnold', team: 'Liverpool', position: 'DEF', price: 7.0, points: 62, form: 6.8, ownership: 25.1 },
        { id: 5, name: 'Salah', team: 'Liverpool', position: 'MID', price: 13.0, points: 89, form: 8.9, ownership: 45.2 },
        { id: 7, name: 'Haaland', team: 'Man City', position: 'FWD', price: 14.0, points: 102, form: 9.2, ownership: 62.3 }
      ];
      setCurrentSquad(squad);
      setLoading(false);
    } catch (err) {
      setError('Failed to load squad');
      setLoading(false);
    }
  };

  const loadAvailablePlayers = async (position: string) => {
    setLoading(true);
    try {
      // Simulate loading available players
      const players: Player[] = [
        { id: 10, name: 'Ramsdale', team: 'Arsenal', position: 'GK', price: 4.5, points: 38, form: 4.2, ownership: 8.1 },
        { id: 11, name: 'White', team: 'Arsenal', position: 'DEF', price: 5.0, points: 42, form: 4.8, ownership: 12.3 },
        { id: 12, name: 'Saka', team: 'Arsenal', position: 'MID', price: 8.5, points: 72, form: 7.2, ownership: 32.1 },
        { id: 13, name: 'Jesus', team: 'Arsenal', position: 'FWD', price: 8.0, points: 65, form: 6.5, ownership: 18.7 }
      ];
      setAvailablePlayers(players.filter(p => p.position === position));
      setLoading(false);
    } catch (err) {
      setError('Failed to load players');
      setLoading(false);
    }
  };

  const handlePlayerOutSelect = (item: { value: string }) => {
    const player = currentSquad.find(p => p.id.toString() === item.value);
    if (player) {
      setPlayerOut(player);
      loadAvailablePlayers(player.position);
      setStep('select-in');
    }
  };

  const handlePlayerInSelect = (item: { value: string }) => {
    const player = availablePlayers.find(p => p.id.toString() === item.value);
    if (player) {
      setPlayerIn(player);
      
      // Calculate transfer cost
      const cost = playerOut ? player.price - playerOut.price : 0;
      setTransferCost(cost);
      
      setStep('confirm');
    }
  };

  const processTransfer = async () => {
    setStep('processing');
    try {
      // Simulate processing transfer
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => exit(), 2000);
    } catch (err) {
      setError('Failed to process transfer');
    }
  };

  if (success) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="green">✅ Transfer completed successfully!</Text>
        <Text color="gray">
          {playerOut?.name} → {playerIn?.name}
        </Text>
        {transferCost !== 0 && (
          <Text color={transferCost > 0 ? 'red' : 'green'}>
            Budget impact: £{Math.abs(transferCost).toFixed(1)}m {transferCost > 0 ? 'spent' : 'gained'}
          </Text>
        )}
      </Box>
    );
  }

  if (loading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan">
          <Spinner type="dots" /> Loading...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">❌ {error}</Text>
      </Box>
    );
  }

  if (step === 'processing') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan">
          <Spinner type="dots" /> Processing transfer...
        </Text>
      </Box>
    );
  }

  if (step === 'select-out') {
    const squadItems = currentSquad.map(p => ({
      label: `${p.name} (${p.team}) - ${p.position} - £${p.price}m - ${p.points}pts`,
      value: p.id.toString()
    }));

    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>Select Player to Transfer Out</Text>
        
        <Box marginTop={1} borderStyle="single" borderColor="gray" padding={1}>
          <Box flexDirection="column">
            <Text color="yellow">Current Squad</Text>
            <Text color="gray" dimColor>Select a player to remove from your team</Text>
          </Box>
        </Box>

        <Box marginTop={1}>
          <SelectInput items={squadItems} onSelect={handlePlayerOutSelect} />
        </Box>

        <Box marginTop={1}>
          <Text color="gray" dimColor>Use arrow keys to navigate, Enter to select</Text>
        </Box>
      </Box>
    );
  }

  if (step === 'select-in') {
    const playerItems = availablePlayers
      .filter(p => searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(p => ({
        label: `${p.name} (${p.team}) - £${p.price}m - ${p.points}pts - Form: ${p.form}`,
        value: p.id.toString()
      }));

    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>Select Player to Transfer In</Text>
        
        <Box marginTop={1} borderStyle="single" borderColor="red" padding={1}>
          <Box flexDirection="column">
            <Text color="red">Transferring Out:</Text>
            <Text>{playerOut?.name} ({playerOut?.team}) - £{playerOut?.price}m</Text>
          </Box>
        </Box>

        <Box marginTop={1}>
          <Text>Search player: </Text>
          <TextInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Type to filter..."
          />
        </Box>

        <Box marginTop={1}>
          <SelectInput items={playerItems} onSelect={handlePlayerInSelect} />
        </Box>

        <Box marginTop={1}>
          <Text color="gray" dimColor>Players must be in the same position</Text>
        </Box>
      </Box>
    );
  }

  if (step === 'confirm') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>Confirm Transfer</Text>
        
        <Box marginTop={1} flexDirection="column">
          <Box borderStyle="single" borderColor="red" padding={1} marginBottom={1}>
            <Box flexDirection="column">
              <Text color="red" bold>OUT:</Text>
              <Text>{playerOut?.name} ({playerOut?.team})</Text>
              <Text>Position: {playerOut?.position}</Text>
              <Text>Price: £{playerOut?.price}m</Text>
              <Text>Points: {playerOut?.points}</Text>
            </Box>
          </Box>

          <Box borderStyle="single" borderColor="green" padding={1}>
            <Box flexDirection="column">
              <Text color="green" bold>IN:</Text>
              <Text>{playerIn?.name} ({playerIn?.team})</Text>
              <Text>Position: {playerIn?.position}</Text>
              <Text>Price: £{playerIn?.price}m</Text>
              <Text>Points: {playerIn?.points}</Text>
              <Text>Form: {playerIn?.form}</Text>
              <Text>Ownership: {playerIn?.ownership}%</Text>
            </Box>
          </Box>
        </Box>

        <Box marginTop={1}>
          <Text color={transferCost > 0 ? 'red' : 'green'} bold>
            Budget Impact: {transferCost > 0 ? '-' : '+'}£{Math.abs(transferCost).toFixed(1)}m
          </Text>
        </Box>

        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: '✅ Confirm Transfer', value: 'confirm' },
              { label: '❌ Cancel', value: 'cancel' }
            ]}
            onSelect={(item) => {
              if (item.value === 'confirm') {
                processTransfer();
              } else {
                exit();
              }
            }}
          />
        </Box>
      </Box>
    );
  }

  return null;
};

export default TransferView;