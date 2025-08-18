# Teams Directory

This directory contains all team data for the Git Fantasy League.

## Directory Structure

```
teams/
├── {github-username}/
│   ├── team.json          # Current team composition
│   ├── transfers/         # Transfer history by gameweek
│   ├── chips/            # Chip usage history
│   └── history/          # Gameweek points history
```

## How to Join

1. Fork this repository
2. Create a directory with your GitHub username
3. Add your `team.json` file following the schema below
4. Submit a pull request
5. Wait for validation

## Team JSON Schema

```json
{
  "manager": {
    "github": "your-github-username",
    "teamName": "Your Team Name",
    "email": "your-email@example.com",
    "joined": "ISO-8601-timestamp"
  },
  "squad": {
    "goalkeepers": [...],  // Exactly 2 GK
    "defenders": [...],     // Exactly 5 DEF
    "midfielders": [...],   // Exactly 5 MID
    "forwards": [...]       // Exactly 3 FWD
  },
  "formation": "4-4-2",     // Valid formations only
  "startingXI": [...],      // 11 player IDs
  "bench": [...],           // 4 player IDs
  "captain": "player_id",
  "viceCaptain": "player_id",
  "budget": {
    "total": 100.0,
    "spent": 0.0,
    "remaining": 100.0
  },
  "transfers": {
    "free": 1,
    "made": 0,
    "cost": 0
  },
  "chips": {
    "wildcard1": true,
    "wildcard2": true,
    "freeHit": true,
    "tripleCaptain": true,
    "benchBoost": true
  },
  "metadata": {
    "created": "ISO-8601-timestamp",
    "lastModified": "ISO-8601-timestamp",
    "gameweekLocked": null,
    "version": "1.0.0"
  }
}
```

## Validation Rules

- Budget must not exceed £100m
- Squad must have exactly 15 players (2 GK, 5 DEF, 5 MID, 3 FWD)
- Maximum 3 players from any single team
- Valid formations: 4-4-2, 4-3-3, 3-5-2, 3-4-3, 5-4-1, 5-3-2
- Captain and vice-captain must be in starting XI

## Sample Teams

This directory includes sample teams for demonstration:
- `john-doe/` - Complete team with full history
- `sarah-smith/` - Active team with chip usage
- `alex-jones/` - Basic team setup
- `emma-wilson/` - New team template
- `mike-brown/` - Inactive team example

## Files

### team.json
Current team composition and settings

### transfers/gameweek-{n}.json
Transfer history for each gameweek

### chips/used-chips.json
Record of all chips used and available

### history/gameweek-{n}.json
Points and performance for each gameweek

## CLI Commands

```bash
# Validate your team
gfl validate

# Check team status
gfl status

# Make transfers
gfl transfer

# View team history
gfl history
```

## Important Notes

- Only modify files in your own team directory
- All changes must be via pull request
- Automated validation runs on every PR
- Deadline enforcement is automatic
- Team data is public - no sensitive information

## Support

For issues or questions:
- Open an issue in the main repository
- Check the FAQ.md
- Use the CLI help: `gfl help`