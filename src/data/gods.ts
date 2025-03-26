export interface God {
    name: string;
    role: 'Guardian' | 'Warrior' | 'Mage' | 'Hunter' | 'Assassin';
    pantheon: string;
}

export const SMITE_GODS: God[] = [
    { name: 'Achilles', role: 'Warrior', pantheon: 'Greek' },
    { name: 'Agni', role: 'Mage', pantheon: 'Hindu' },
    { name: 'Aladdin', role: 'Mage', pantheon: 'Arabian' },
    { name: 'Amaterasu', role: 'Warrior', pantheon: 'Japanese' },
    { name: 'Anhur', role: 'Hunter', pantheon: 'Egyptian' },
    { name: 'Anubis', role: 'Mage', pantheon: 'Egyptian' },
    { name: 'Aphrodite', role: 'Mage', pantheon: 'Greek' },
    { name: 'Ares', role: 'Guardian', pantheon: 'Greek' },
    { name: 'Artemis', role: 'Hunter', pantheon: 'Greek' },
    { name: 'Athena', role: 'Guardian', pantheon: 'Greek' },
    { name: 'Awilix', role: 'Assassin', pantheon: 'Maya' },
    { name: 'Bacchus', role: 'Guardian', pantheon: 'Roman' },
    { name: 'Baron Samedi', role: 'Mage', pantheon: 'Voodoo' },
    { name: 'Bellona', role: 'Warrior', pantheon: 'Roman' },
    { name: 'Cabrakan', role: 'Guardian', pantheon: 'Maya' },
    { name: 'Cernunnos', role: 'Hunter', pantheon: 'Celtic' },
    { name: 'Chaac', role: 'Warrior', pantheon: 'Maya' },
    { name: 'Cupid', role: 'Hunter', pantheon: 'Roman' },
    { name: 'Danzaburou', role: 'Hunter', pantheon: 'Japanese' },
    { name: 'Fenrir', role: 'Assassin', pantheon: 'Norse' },
    { name: 'Geb', role: 'Guardian', pantheon: 'Egyptian' },
    { name: 'Hades', role: 'Mage', pantheon: 'Greek' },
    { name: 'Hecate', role: 'Mage', pantheon: 'Greek' },
    { name: 'Hercules', role: 'Warrior', pantheon: 'Roman' },
    { name: 'Hua Mulan', role: 'Warrior', pantheon: 'Chinese' },
    { name: 'Hun Batz', role: 'Assassin', pantheon: 'Maya' },
    { name: 'Izanami', role: 'Hunter', pantheon: 'Japanese' },
    { name: 'Jing Wei', role: 'Hunter', pantheon: 'Chinese' },
    { name: 'Loki', role: 'Assassin', pantheon: 'Norse' },
    { name: 'Merlin', role: 'Mage', pantheon: 'Arthurian' },
    { name: 'Nu Wa', role: 'Mage', pantheon: 'Chinese' },
    { name: 'Pele', role: 'Assassin', pantheon: 'Polynesian' },
    { name: 'Yemoja', role: 'Guardian', pantheon: 'Yoruba' }
];

// Helper function to get just the names for components that only need the list of names
export const getGodNames = (): string[] => SMITE_GODS.map(god => god.name); 