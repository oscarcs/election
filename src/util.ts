export interface Party {
    name: string;
    votes: number;
    quota: number;
}

export interface ElectorateCandidates {
    name: string;
    candidates: Candidate[];
    previous: string;
    current: string;
}

export interface PartyElectorates {
    name: string;
    seats: number;
}

export interface Candidate {
    name: string;
    party: string;
}

export interface Quota {
    party: string;
    allocation: number;
}

export interface Parliament {
    seats: number;
    parties: Party[];
}

export class Util {
    public static getPartyColor(party: string) {
        switch (party.toUpperCase()) {
        case 'NAT':
            return '#2C8ACA';
        case 'LAB':
            return '#d82c20';
        case 'NZF':
            return '#1e1e21';
        case 'GRN':
            return '#2CC84D';
        case 'ACT':
            return '#FFD100';
        case 'NCP':
            return '#56D2FF';
        case 'MRI':
            return '#5c0006';
        default:
            return '#777777';
        }
    }

    public static isParty(abbr: string): boolean {
        return ['NAT', 'LAB', 'NZF', 'GRN', 'ACT', 'NCP', 'MRI', 'TOP'].includes(abbr.toUpperCase());
    }

    public static getPartyName(abbr: string): string {
        const fullNames: any = {
            'NAT': 'National',
            'LAB': 'Labour',
            'GRN': 'Green',
            'NZF': 'NZ First',
            'ACT': 'ACT',
            'NCP': 'New Conservative',
            'MRI': 'Māori Party',
            'TOP': 'The Opportunities Party',
            'MAN': 'Mana'
        };
        return fullNames[abbr.toUpperCase()] ?? abbr;
    }

    public static getPartyCSSName(abbr: string): string {
        const cssNames: any = {
            'NAT': 'national',
            'LAB': 'labour',
            'GRN': 'greens',
            'NZF': 'nzf',
            'ACT': 'act',
            'NCP': 'nc',
            'MRI': 'lightred',
            'TOP': 'grey'
        };
        return cssNames[abbr.toUpperCase()] ?? abbr;
    }

    public static getPartyTextCSSName(abbr: string): string {
        const cssNames: any = {
            'NAT': 'national',
            'LAB': 'labour',
            'GRN': 'greens',
            'NZF': 'grey-light',
            'ACT': 'act',
            'NCP': 'nc',
            'MRI': 'lightred',
            'TOP': 'grey'
        };
        return cssNames[abbr.toUpperCase()] ?? abbr;
    }

    public static getLikelihoodCSSName(likelihood: string): string {
        const cssNames: any = {
            'near certain': 'deepgreen',
            'highly likely': 'green',
            'likely': 'green',
            'fair': 'yellow',
            'unlikely': 'orange2',
            'highly unlikely': 'red'
        };
        return cssNames[likelihood.toLowerCase()] ?? 'light';
    }

    public static calculateMMP(parties: Party[], electorates: PartyElectorates[], totalVotes: number): Parliament {
        const calculateQuotas = (numQuotas: number, parties: Party[], electorates: PartyElectorates[]): Parliament => {
            let quotas: Quota[] = [];
    
            for (let i = 0; i < numQuotas; i++) {
                for (const j in parties) {
                    quotas.push({
                        party: parties[j].name,
                        allocation: parties[j].votes / ((i * 2) + 1)
                    });
                }
            }
    
            // Sort the quotas and take the number required.
            quotas.sort((x, y) => y.allocation - x.allocation);
            quotas = quotas.slice(0, numQuotas);
        
            // Set up the 'quota' property on each of the parties.
            for (const i in parties) {
                parties[i].quota = 0;
            }
            
            // Allocate the quotas:
            for (const i in quotas) {
                const party = parties.find(x => x.name === quotas[i].party);
                if (typeof party !== 'undefined') {
                    party.quota += 1;
                }
            }
            
            for (const i in electorates) {
                const electorateParty = electorates[i];
                const party = parties.find(x => x.name === electorateParty.name);
                
                // Provide for possible overhangs.
                if (typeof party !== "undefined") {
                    party.quota = Math.max(party.quota, electorateParty.seats);
                }

                // Add independents and other parties not contesting the party vote
                else {
                    parties.push({
                        name: electorateParty.name,
                        votes: 0,
                        quota: electorateParty.seats
                    });
                }
            }
    
            // Calculate the total number of seats:
            const totalSeats = parties.reduce((acc, x) => acc += x.quota, 0);
    
            const parliament = {
                seats: totalSeats,
                parties: parties,
            };
            
            return parliament;
        };
        
        const getValidParties = (parties: Party[], electorates: PartyElectorates[], totalVotes?: number): Parliament => {
            if (typeof totalVotes === "undefined") {
                totalVotes = parties.reduce((acc, x) => acc += x.votes, 0);
            }
    
            let numQuotas = 120;
            const validParties = [];
            
            for (const i in parties) {
                const electorateSeats = electorates.find(x => x.name === parties[i].name);

                if (parties[i].votes >= totalVotes * 0.05 || (typeof electorateSeats !== 'undefined' && electorateSeats.seats > 0)) {
                    validParties.push(parties[i]);
                }
            }

            for (const i in electorates) {
                const party = parties.find(x => x.name === electorates[i].name);
                if (typeof party === 'undefined') {
                    numQuotas -= electorates[i].seats;
                }
            }

            return calculateQuotas(numQuotas, validParties, electorates);
        };

        return getValidParties(parties, electorates, totalVotes);
    }

    public static calculatePollingAverage(polls: any[]) {
        const averagePoll: any = {};
        for (const poll of polls) {
            for (const party of Object.keys(poll)) {
                if (!Util.isParty(party)) {
                    continue;
                }

                if (!averagePoll[party]) {
                    averagePoll[party] = [];
                }

                if (!isNaN(parseFloat(poll[party]))) {
                    averagePoll[party].push(parseFloat(poll[party]));
                }
            }
        }

        for (const party of Object.keys(averagePoll)) {
            const numElements = averagePoll[party].length;
            averagePoll[party] = averagePoll[party].reduce((acc: number, val: number) => acc + val);
            averagePoll[party] = averagePoll[party] / numElements;
        }

        return averagePoll;
    }

    public static calculateSeatsFromPoll(poll: any, partyElectorates: PartyElectorates[]): Parliament {
        const parties: Party[] = [];
        const scaleFactor = 10000;
        
        for (const party of Object.keys(poll)) {
            if (!Util.isParty(party)) {
                continue;
            }

            if (!isNaN(parseFloat(poll[party]))) {
                parties.push({
                    name: party.toUpperCase(),
                    votes: parseFloat(poll[party]) * scaleFactor,
                    quota: 0
                });
            }
        }

        const total = 100 * scaleFactor;

        return Util.calculateMMP(parties, partyElectorates, total);
    }

    public static guessElectorateSeats(poll: any): PartyElectorates[] {
        poll;
        return [
            {
                name: 'LAB',
                seats: 32
            },
            {
                name: 'NAT',
                seats: 38
            },
            {
                name: 'ACT',
                seats: 1
            },
            {
                name: 'GRN',
                seats: 0
            },
            {
                name: 'NZF',
                seats: 0
            }
        ];
    }

    /**
     * Return the estimated swing for the simplistic swing model.
     */
    public static getSimplisticSwing(): number {
        return +5;
    }
}
