'use client';

import { useState, useEffect } from 'react';
import { SMITE_GODS, getGodNames } from '@/data/gods';

interface Player {
    id: string;
    name: string;
    god?: string;
}

interface Team {
    teamName: string;
    players: Player[];
}

export default function TeamGenerator() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [team1Size, setTeam1Size] = useState(5);
    const [team2Size, setTeam2Size] = useState(5);
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState('');
    const [isBalanced, setIsBalanced] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [noDuplicates, setNoDuplicates] = useState(true);
    const [usedGods, setUsedGods] = useState<Set<string>>(new Set());
    const [isAssigningGods, setIsAssigningGods] = useState(false);
    const godNames = getGodNames();

    // Load players from localStorage on component mount
    useEffect(() => {
        const loadPlayers = () => {
            try {
                const savedPlayers = localStorage.getItem('smite2Players');
                if (savedPlayers) {
                    const parsedPlayers = JSON.parse(savedPlayers);
                    if (Array.isArray(parsedPlayers)) {
                        setPlayers(parsedPlayers);
                    }
                }
            } catch (error) {
                console.error('Error loading players from localStorage:', error);
            }
        };

        loadPlayers();
        setIsInitialized(true);
    }, []); // Only run once on mount

    // Save players to localStorage whenever they change
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem('smite2Players', JSON.stringify(players));
            } catch (error) {
                console.error('Error saving players to localStorage:', error);
            }
        }
    }, [players, isInitialized]);

    const addPlayer = () => {
        if (!newPlayerName.trim()) {
            setError('Please enter a player name');
            return;
        }

        if (players.some(p => p.name.toLowerCase() === newPlayerName.toLowerCase())) {
            setError('This player name already exists');
            return;
        }

        const newPlayer = { id: Date.now().toString(), name: newPlayerName.trim() };
        setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
        setNewPlayerName('');
        setError('');
    };

    const deletePlayer = (id: string) => {
        setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== id));
    };

    const startEdit = (player: Player) => {
        setEditingPlayer(player);
        setNewPlayerName(player.name);
    };

    const saveEdit = () => {
        if (!newPlayerName.trim() || !editingPlayer) return;

        if (players.some(p => p.name.toLowerCase() === newPlayerName.toLowerCase() && p.id !== editingPlayer.id)) {
            setError('This player name already exists');
            return;
        }

        setPlayers(prevPlayers => prevPlayers.map(p => 
            p.id === editingPlayer.id ? { ...p, name: newPlayerName.trim() } : p
        ));
        setEditingPlayer(null);
        setNewPlayerName('');
        setError('');
    };

    const generateTeams = () => {
        const totalPlayersNeeded = team1Size + team2Size;
        if (players.length < totalPlayersNeeded) {
            setError(`Need at least ${totalPlayersNeeded} players to generate teams (${team1Size}v${team2Size})`);
            return;
        }

        // Shuffle players
        const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
        
        // Create teams
        const team1 = shuffledPlayers.slice(0, team1Size);
        const team2 = shuffledPlayers.slice(team1Size, team1Size + team2Size);

        setTeams([
            { teamName: 'Team 1', players: team1 },
            { teamName: 'Team 2', players: team2 }
        ]);
        setError('');
    };

    const handleTeamSizeChange = (team: 'team1' | 'team2', value: number) => {
        if (team === 'team1') {
            setTeam1Size(value);
            if (isBalanced) {
                setTeam2Size(value);
            }
        } else {
            setTeam2Size(value);
        }
    };

    const handleBalancedChange = (checked: boolean) => {
        setIsBalanced(checked);
        if (checked) {
            setTeam2Size(team1Size);
        }
    };

    const assignRandomGod = async (player: Player) => {
        // Get all currently assigned gods from all players
        const currentlyAssignedGods = new Set(
            teams.flatMap(team => 
                team.players
                    .filter(p => p.id !== player.id) // Exclude the current player
                    .map(p => p.god)
                    .filter((god): god is string => god !== undefined)
            )
        );

        // Filter available gods based on noDuplicates setting
        const availableGods = noDuplicates 
            ? godNames.filter(god => !currentlyAssignedGods.has(god))
            : godNames;

        if (availableGods.length === 0) {
            alert('No more gods available!');
            return;
        }

        // Create animation effect
        let iterations = 0;
        const maxIterations = 20;
        const interval = setInterval(() => {
            const randomGod = godNames[Math.floor(Math.random() * godNames.length)];
            setTeams(prevTeams => prevTeams.map(team => ({
                ...team,
                players: team.players.map(p => 
                    p.id === player.id ? { ...p, god: randomGod } : p
                )
            })));
            iterations++;
            
            if (iterations >= maxIterations) {
                clearInterval(interval);
                // Set the final god
                const finalGod = availableGods[Math.floor(Math.random() * availableGods.length)];
                setTeams(prevTeams => prevTeams.map(team => ({
                    ...team,
                    players: team.players.map(p => 
                        p.id === player.id ? { ...p, god: finalGod } : p
                    )
                })));
            }
        }, 100);
    };

    const assignAllGods = async () => {
        setIsAssigningGods(true);
        
        // Get all players that need gods
        const playersNeedingGods = teams.flatMap(team => team.players);
        
        // Shuffle the players to randomize the order of assignment
        const shuffledPlayers = [...playersNeedingGods].sort(() => Math.random() - 0.5);
        
        // Keep track of assigned gods during the process
        const assignedGods = new Set<string>();
        
        for (const player of shuffledPlayers) {
            // Get available gods based on noDuplicates setting
            const availableGods = noDuplicates 
                ? godNames.filter(god => !assignedGods.has(god))
                : godNames;

            if (availableGods.length === 0) {
                alert('No more gods available!');
                break;
            }

            // Create animation effect
            let iterations = 0;
            const maxIterations = 20;
            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    const randomGod = godNames[Math.floor(Math.random() * godNames.length)];
                    setTeams(prevTeams => prevTeams.map(team => ({
                        ...team,
                        players: team.players.map(p => 
                            p.id === player.id ? { ...p, god: randomGod } : p
                        )
                    })));
                    iterations++;
                    
                    if (iterations >= maxIterations) {
                        clearInterval(interval);
                        // Set the final god
                        const finalGod = availableGods[Math.floor(Math.random() * availableGods.length)];
                        setTeams(prevTeams => prevTeams.map(team => ({
                            ...team,
                            players: team.players.map(p => 
                                p.id === player.id ? { ...p, god: finalGod } : p
                            )
                        })));
                        assignedGods.add(finalGod);
                        resolve();
                    }
                }, 100);
            });

            // Add delay between players
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setIsAssigningGods(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">Team Generator</h1>

            {/* Player Management Section */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Player Management</h2>
                
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="Enter player name"
                        className="flex-1 p-2 border rounded"
                        onKeyPress={(e) => e.key === 'Enter' && (editingPlayer ? saveEdit() : addPlayer())}
                    />
                    {editingPlayer ? (
                        <div className="flex gap-2">
                            <button
                                onClick={saveEdit}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setEditingPlayer(null);
                                    setNewPlayerName('');
                                }}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={addPlayer}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add Player
                        </button>
                    )}
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Player List */}
                <div className="space-y-2">
                    {players.map(player => (
                        <div key={player.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <span>{player.name}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => startEdit(player)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deletePlayer(player.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Generation Section */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Generate Teams</h2>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isBalanced}
                                onChange={(e) => handleBalancedChange(e.target.checked)}
                                className="rounded"
                            />
                            Balanced Teams
                        </label>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label>Team 1 Size:</label>
                            <select
                                value={team1Size}
                                onChange={(e) => handleTeamSizeChange('team1', Number(e.target.value))}
                                className="border rounded p-2"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label>Team 2 Size:</label>
                            <select
                                value={team2Size}
                                onChange={(e) => handleTeamSizeChange('team2', Number(e.target.value))}
                                className="border rounded p-2"
                                disabled={isBalanced}
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <button
                        onClick={generateTeams}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Generate Teams
                    </button>
                </div>

                {/* Display Teams */}
                {teams.length > 0 && (
                    <div className="mt-8">
                        <div className="grid grid-cols-2 gap-4">
                            {teams.map((team, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded">
                                    <h3 className="text-xl font-semibold mb-2">{team.teamName}</h3>
                                    <div className="space-y-2">
                                        {team.players.map(player => (
                                            <div key={player.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span>{player.name}</span>
                                                    {player.god && (
                                                        <span className="text-blue-600 font-medium">
                                                            ({player.god})
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => assignRandomGod(player)}
                                                    disabled={isAssigningGods}
                                                    className="text-purple-600 hover:text-purple-800 disabled:opacity-50"
                                                >
                                                    Re-roll
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Random God Assignment Controls */}
                        <div className="mt-6 flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={noDuplicates}
                                    onChange={(e) => setNoDuplicates(e.target.checked)}
                                    className="rounded"
                                />
                                No Duplicate Gods
                            </label>
                            <button
                                onClick={assignAllGods}
                                disabled={isAssigningGods}
                                className={`bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors
                                    ${isAssigningGods ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isAssigningGods ? 'Assigning Gods...' : 'Assign Random Gods'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 