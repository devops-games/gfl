import React, { useState } from 'react';
import { Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';

interface InitViewProps {
  options: any;
}

const InitView: React.FC<InitViewProps> = () => {
  const { exit } = useApp();
  const [step, setStep] = useState<'username' | 'teamname' | 'saving' | 'done'>('username');
  const [githubUser, setGithubUser] = useState('');
  const [teamName, setTeamName] = useState('');

  const handleUsernameSubmit = () => {
    if (githubUser.trim()) {
      setStep('teamname');
    }
  };

  const handleTeamNameSubmit = async () => {
    if (teamName.trim()) {
      setStep('saving');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('done');
      setTimeout(() => exit(), 2000);
    }
  };

  if (step === 'done') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="green">✅ Configuration saved successfully!</Text>
        <Text color="gray">You can now create your team with 'gfl create-team'</Text>
      </Box>
    );
  }

  if (step === 'saving') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan">
          <Spinner type="dots" /> Saving configuration...
        </Text>
      </Box>
    );
  }

  if (step === 'username') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>Initialize GFL Configuration</Text>
        
        <Box marginTop={1}>
          <Text>Enter your GitHub username: </Text>
          <TextInput
            value={githubUser}
            onChange={setGithubUser}
            onSubmit={handleUsernameSubmit}
            placeholder="e.g., martinpalastanga"
          />
        </Box>
        
        <Box marginTop={1}>
          <Text color="gray" dimColor>Press Enter to continue</Text>
        </Box>
      </Box>
    );
  }

  if (step === 'teamname') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan" bold>Initialize GFL Configuration</Text>
        
        <Box marginTop={1}>
          <Text>Enter your team name: </Text>
          <TextInput
            value={teamName}
            onChange={setTeamName}
            onSubmit={handleTeamNameSubmit}
            placeholder="e.g., Code Warriors FC"
          />
        </Box>
        
        <Box marginTop={1}>
          <Text color="gray" dimColor>Press Enter to save</Text>
        </Box>
      </Box>
    );
  }

  return null;
};

export default InitView;