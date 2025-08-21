import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';

interface CreateTeamViewProps {
  options: any;
}

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  price: number;
}

interface TeamSelection {
  goalkeepers: Player[];
  defenders: Player[];
  midfielders: Player[];
  forwards: Player[];
  budget: number;
}

const CreateTeamView: React.FC<CreateTeamViewProps> = () => {
  const { exit } = useApp();
  const [step, setStep] = useState<'name' | 'formation' | 'players' | 'confirm' | 'saving'>('name');
  const [teamName, setTeamName] = useState('');
  const [formation, setFormation] = useState('4-4-2');
  const [selectedPlayers, setSelectedPlayers] = useState<TeamSelection>({
    goalkeepers: [],
    defenders: [],
    midfielders: [],
    forwards: [],
    budget: 100.0
  });
  const [currentPosition, setCurrentPosition] = useState<'GK' | 'DEF' | 'MID' | 'FWD'>('GK');
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (step === 'players') {
      loadPlayers();
    }
  }, [step, currentPosition]);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call PlayerService
      // For now, we'll simulate with dummy data
      const dummyPlayers: Player[] = [
        { id: 1, name: 'Alisson', team: 'Liverpool', position: 'GK', price: 5.5 },
        { id: 2, name: 'Ederson', team: 'Man City', position: 'GK', price: 5.5 },
        { id: 3, name: 'Alexander-Arnold', team: 'Liverpool', position: 'DEF', price: 7.0 },
        { id: 4, name: 'Van Dijk', team: 'Liverpool', position: 'DEF', price: 6.5 },
        { id: 5, name: 'Salah', team: 'Liverpool', position: 'MID', price: 13.0 },
        { id: 6, name: 'De Bruyne', team: 'Man City', position: 'MID', price: 10.0 },
        { id: 7, name: 'Haaland', team: 'Man City', position: 'FWD', price: 14.0 },
        { id: 8, name: 'Darwin', team: 'Liverpool', position: 'FWD', price: 7.5 }
      ];
      
      setAvailablePlayers(dummyPlayers.filter(p => p.position === currentPosition));
      setLoading(false);
    } catch (err) {
      setError('Failed to load players');
      setLoading(false);
    }
  };

  const handleNameSubmit = () => {
    if (teamName.trim()) {
      setStep('formation');
    }
  };

  const handleFormationSelect = (item: { value: string }) => {
    setFormation(item.value);
    setStep('players');
  };

  const handlePlayerSelect = (item: { value: string }) => {
    const player = availablePlayers.find(p => p.id.toString() === item.value);
    if (!player) return;

    const newBudget = selectedPlayers.budget - player.price;
    if (newBudget < 0) {
      setError('Not enough budget!');
      return;
    }

    const newSelection = { ...selectedPlayers, budget: newBudget };
    
    switch (currentPosition) {
      case 'GK':
        newSelection.goalkeepers = [...newSelection.goalkeepers, player];
        if (newSelection.goalkeepers.length >= 2) {
          setCurrentPosition('DEF');
        }
        break;
      case 'DEF':
        newSelection.defenders = [...newSelection.defenders, player];
        if (newSelection.defenders.length >= 5) {
          setCurrentPosition('MID');
        }
        break;
      case 'MID':
        newSelection.midfielders = [...newSelection.midfielders, player];
        if (newSelection.midfielders.length >= 5) {
          setCurrentPosition('FWD');
        }
        break;
      case 'FWD':
        newSelection.forwards = [...newSelection.forwards, player];
        if (newSelection.forwards.length >= 3) {
          setStep('confirm');
        }
        break;
    }
    
    setSelectedPlayers(newSelection);
    setError(null);
  };

  const saveTeam = async () => {
    setStep('saving');
    try {
      // In real implementation, this would save the team
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => exit(), 2000);
    } catch (err) {
      setError('Failed to save team');
    }
  };

  if (success) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="green">✅ Team created successfully!</Text>
        <Text color="gray">Your team has been saved and is ready for the season.</Text>
      </Box>
    );
  }

  if (step === 'saving') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan">
          <Spinner type="dots" /> Saving your team...
        </Text>
      </Box>
    );
  }

  if (step === 'name') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>Create Your Team</Text>
        <Box marginTop={1}>
          <Text>Enter your team name: </Text>
          <TextInput
            value={teamName}
            onChange={setTeamName}
            onSubmit={handleNameSubmit}
            placeholder="e.g., Code Warriors FC"
          />
        </Box>
        <Box marginTop={1}>
          <Text color="gray" dimColor>Press Enter to continue</Text>
        </Box>
      </Box>
    );
  }

  if (step === 'formation') {
    const formations = [
      { label: '3-5-2', value: '3-5-2' },
      { label: '3-4-3', value: '3-4-3' },
      { label: '4-3-3', value: '4-3-3' },
      { label: '4-4-2', value: '4-4-2' },
      { label: '4-5-1', value: '4-5-1' },
      { label: '5-3-2', value: '5-3-2' },
      { label: '5-4-1', value: '5-4-1' }
    ];

    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>Select Your Formation</Text>
        <Box marginTop={1}>
          <SelectInput items={formations} onSelect={handleFormationSelect} />
        </Box>
        <Box marginTop={1}>
          <Text color="gray" dimColor>This will be your default formation</Text>
        </Box>
      </Box>
    );
  }

  if (step === 'players') {
    const playerItems = availablePlayers.map(p => ({
      label: `${p.name} (${p.team}) - £${p.price}m`,
      value: p.id.toString()
    }));

    return (
      <Box flexDirection="column" padding={1}>
        <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
          <Text color="cyan" bold>Select Players - {currentPosition}</Text>
          <Text color="yellow">Budget: £{selectedPlayers.budget.toFixed(1)}m</Text>
        </Box>
        
        <Box borderStyle="single" borderColor="gray" padding={1} marginBottom={1}>
          <Box flexDirection="column">
            <Text color="green">Selected Squad:</Text>
            <Text>GK: {selectedPlayers.goalkeepers.map(p => p.name).join(', ') || 'None'}</Text>
            <Text>DEF: {selectedPlayers.defenders.map(p => p.name).join(', ') || 'None'}</Text>
            <Text>MID: {selectedPlayers.midfielders.map(p => p.name).join(', ') || 'None'}</Text>
            <Text>FWD: {selectedPlayers.forwards.map(p => p.name).join(', ') || 'None'}</Text>
          </Box>
        </Box>

        {loading ? (
          <Text color="cyan">
            <Spinner type="dots" /> Loading players...
          </Text>
        ) : (
          <Box>
            <SelectInput items={playerItems} onSelect={handlePlayerSelect} />
          </Box>
        )}

        {error && (
          <Box marginTop={1}>
            <Text color="red">❌ {error}</Text>
          </Box>
        )}
      </Box>
    );
  }

  if (step === 'confirm') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>Confirm Your Team</Text>
        
        <Box marginTop={1} borderStyle="single" borderColor="green" padding={1}>
          <Box flexDirection="column">
            <Text color="yellow" bold>{teamName}</Text>
            <Text>Formation: {formation}</Text>
            <Box marginTop={1}>
              <Box flexDirection="column">
                <Text color="green" bold>Goalkeepers:</Text>
                {selectedPlayers.goalkeepers.map(p => (
                  <Text key={p.id}>  {p.name} ({p.team}) - £{p.price}m</Text>
                ))}
                
                <Box marginTop={1}><Text color="green" bold>Defenders:</Text></Box>
                {selectedPlayers.defenders.map(p => (
                  <Text key={p.id}>  {p.name} ({p.team}) - £{p.price}m</Text>
                ))}
                
                <Box marginTop={1}><Text color="green" bold>Midfielders:</Text></Box>
                {selectedPlayers.midfielders.map(p => (
                  <Text key={p.id}>  {p.name} ({p.team}) - £{p.price}m</Text>
                ))}
                
                <Box marginTop={1}><Text color="green" bold>Forwards:</Text></Box>
                {selectedPlayers.forwards.map(p => (
                  <Text key={p.id}>  {p.name} ({p.team}) - £{p.price}m</Text>
                ))}
              </Box>
            </Box>
            <Box marginTop={1}>
              <Text color="yellow">Remaining Budget: £{selectedPlayers.budget.toFixed(1)}m</Text>
            </Box>
          </Box>
        </Box>

        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: '✅ Save Team', value: 'save' },
              { label: '❌ Cancel', value: 'cancel' }
            ]}
            onSelect={(item) => {
              if (item.value === 'save') {
                saveTeam();
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

export default CreateTeamView;