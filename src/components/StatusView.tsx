import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import Gradient from 'ink-gradient';

interface StatusViewProps {
  options: any;
}

interface TeamData {
  name: string;
  value: number;
  rank: number;
  points: number;
  gameweekPoints: number;
  transfers: number;
  chips: string[];
  captain: string;
  viceCaptain: string;
}

interface Player {
  name: string;
  position: string;
  team: string;
  points: number;
  price: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isBenched: boolean;
}

const StatusView: React.FC<StatusViewProps> = () => {
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [squad, setSquad] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeamStatus();
  }, []);

  const loadTeamStatus = async () => {
    setLoading(true);
    try {
      // Simulate loading team data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTeamData({
        name: 'Code Warriors FC',
        value: 99.8,
        rank: 1247,
        points: 523,
        gameweekPoints: 67,
        transfers: 2,
        chips: ['wildcard', 'bench_boost'],
        captain: 'Haaland',
        viceCaptain: 'Salah'
      });

      setSquad([
        { name: 'Alisson', position: 'GK', team: 'LIV', points: 45, price: 5.5, isCaptain: false, isViceCaptain: false, isBenched: false },
        { name: 'Ramsdale', position: 'GK', team: 'ARS', points: 32, price: 4.5, isCaptain: false, isViceCaptain: false, isBenched: true },
        { name: 'Alexander-Arnold', position: 'DEF', team: 'LIV', points: 62, price: 7.0, isCaptain: false, isViceCaptain: false, isBenched: false },
        { name: 'Van Dijk', position: 'DEF', team: 'LIV', points: 58, price: 6.5, isCaptain: false, isViceCaptain: false, isBenched: false },
        { name: 'Dias', position: 'DEF', team: 'MCI', points: 52, price: 6.0, isCaptain: false, isViceCaptain: false, isBenched: false },
        { name: 'White', position: 'DEF', team: 'ARS', points: 42, price: 5.0, isCaptain: false, isViceCaptain: false, isBenched: false },
        { name: 'Chilwell', position: 'DEF', team: 'CHE', points: 38, price: 5.5, isCaptain: false, isViceCaptain: false, isBenched: true },
        { name: 'Salah', position: 'MID', team: 'LIV', points: 89, price: 13.0, isCaptain: false, isViceCaptain: true, isBenched: false },
        { name: 'De Bruyne', position: 'MID', team: 'MCI', points: 76, price: 10.0, isCaptain: false, isViceCaptain: false, isBenched: false },
        { name: 'Saka', position: 'MID', team: 'ARS', points: 72, price: 8.5, isCaptain: false, isViceCaptain: false, isBenched: false },
        { name: 'Rashford', position: 'MID', team: 'MUN', points: 65, price: 7.5, isCaptain: false, isViceCaptain: false, isBenched: false },
        { name: 'Martinelli', position: 'MID', team: 'ARS', points: 58, price: 6.5, isCaptain: false, isViceCaptain: false, isBenched: true },
        { name: 'Haaland', position: 'FWD', team: 'MCI', points: 102, price: 14.0, isCaptain: true, isViceCaptain: false, isBenched: false },
        { name: 'Darwin', position: 'FWD', team: 'LIV', points: 48, price: 7.5, isCaptain: false, isViceCaptain: false, isBenched: false },
        { name: 'Toney', position: 'FWD', team: 'BRE', points: 42, price: 7.0, isCaptain: false, isViceCaptain: false, isBenched: true }
      ]);

      setLoading(false);
    } catch (err) {
      setError('Failed to load team status');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan">
          <Spinner type="dots" /> Loading team status...
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

  const startingXI = squad.filter(p => !p.isBenched);
  const bench = squad.filter(p => p.isBenched);
  const goalkeepers = startingXI.filter(p => p.position === 'GK');
  const defenders = startingXI.filter(p => p.position === 'DEF');
  const midfielders = startingXI.filter(p => p.position === 'MID');
  const forwards = startingXI.filter(p => p.position === 'FWD');

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Gradient name="rainbow">
          <Text bold>{teamData?.name}</Text>
        </Gradient>
      </Box>

      <Box flexDirection="row" gap={2} marginBottom={1}>
        <Box borderStyle="round" borderColor="cyan" padding={1} width={30}>
          <Box flexDirection="column">
            <Text color="cyan" bold>Team Overview</Text>
            <Text>Rank: #{teamData?.rank}</Text>
            <Text>Points: {teamData?.points}</Text>
            <Text>GW Points: {teamData?.gameweekPoints}</Text>
            <Text>Team Value: £{teamData?.value}m</Text>
            <Text>Transfers: {teamData?.transfers}</Text>
          </Box>
        </Box>

        <Box borderStyle="round" borderColor="yellow" padding={1} width={30}>
          <Box flexDirection="column">
            <Text color="yellow" bold>Chips Used</Text>
            {teamData?.chips.map(chip => (
              <Text key={chip}>• {chip.replace('_', ' ')}</Text>
            ))}
            <Box marginTop={1}>
              <Text color="green">Captain: {teamData?.captain}</Text>
              <Text color="blue">Vice: {teamData?.viceCaptain}</Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="green" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Text color="green" bold>Starting XI</Text>
          
          <Box marginTop={1}>
            <Text color="yellow">Goalkeepers ({goalkeepers.length})</Text>
            {goalkeepers.map(p => (
              <Text key={p.name}>
                {p.isCaptain && '(C) '}
                {p.isViceCaptain && '(V) '}
                {p.name} ({p.team}) - {p.points}pts
              </Text>
            ))}
          </Box>

          <Box marginTop={1}>
            <Text color="yellow">Defenders ({defenders.length})</Text>
            {defenders.map(p => (
              <Text key={p.name}>
                {p.isCaptain && '(C) '}
                {p.isViceCaptain && '(V) '}
                {p.name} ({p.team}) - {p.points}pts
              </Text>
            ))}
          </Box>

          <Box marginTop={1}>
            <Text color="yellow">Midfielders ({midfielders.length})</Text>
            {midfielders.map(p => (
              <Text key={p.name}>
                {p.isCaptain && '(C) '}
                {p.isViceCaptain && '(V) '}
                {p.name} ({p.team}) - {p.points}pts
              </Text>
            ))}
          </Box>

          <Box marginTop={1}>
            <Text color="yellow">Forwards ({forwards.length})</Text>
            {forwards.map(p => (
              <Text key={p.name}>
                {p.isCaptain && '(C) '}
                {p.isViceCaptain && '(V) '}
                {p.name} ({p.team}) - {p.points}pts
              </Text>
            ))}
          </Box>
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="gray" padding={1}>
        <Box flexDirection="column">
          <Text color="gray" bold>Bench</Text>
          {bench.map((p, i) => (
            <Text key={p.name}>
              {i + 1}. {p.name} ({p.team}) - {p.position} - {p.points}pts
            </Text>
          ))}
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text color="gray" dimColor>Press any key to exit</Text>
      </Box>
    </Box>
  );
};

export default StatusView;