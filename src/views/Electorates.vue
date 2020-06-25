<template>
    <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
            <article class="tile is-child notification is-slate">
                <p class="is-size-5">Electorates</p>
                <p><i>The deadline to submit nominations for the electorates is 21 August.</i></p>
                <b-field class="mt-1 mb-1 dark" style="margin-bottom: 1.5rem">
                    <b-input
                        placeholder="Search for an electorate..."
                        v-model="searchQuery"
                        @input="calculateSearchQuery"
                        expanded
                    ></b-input>
                    <p class="control" @click="showMarginalElectorates">
                        <b-button class="button is-primary">Show Likely Marginal Electorates</b-button>
                    </p>
                    <p class="control" @click="showAllElectorates">
                        <b-button class="button is-orange3">Show All</b-button>
                    </p>
                </b-field>
                <div class="notification is-charcoal" v-for="(electorate, name) of searchQueryResults" :key="name">
                    <p class="is-size-5 mb-1">{{name}}</p>
                    <p class="mb-1">
                        2017: <b>{{!electorate.incumbent ? 'No incumbent' : electorate.incumbent}}</b> - 
                        <span v-html="displayMargin(electorate.margin)"></span>
                    </p>
                    <template v-for="(candidate, party) of getCandidates(electorate)">
                        <span class="tag is-medium mr-1 mb-1" :class="[`is-${getPartyCSSName(party)}`]" :key="party">
                            {{getPartyName(party)}}— <b>{{candidate}}</b>
                        </span>
                    </template>
                </div>
            </article>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Config from '@/config';
import { Util } from '@/util';

export default Vue.extend({
    name: "Electorates",
    components: {},
    computed: {
        
    },
    data: function() {
        return {
            electorates: {},
            searchQuery: '',
            searchQueryResults: {}
        };
    },
    mounted () {
        fetch(`${Config.baseUrl}/electorates`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.electorates = data;
            });
    },
    methods: {
        getPartyName(abbr: string): string {
            return Util.getPartyName(abbr);
        },

        getPartyCSSName(abbr: string): string {
            return Util.getPartyCSSName(abbr);
        },

        getPartyTextCSSName(abbr: string): string {
            return Util.getPartyTextCSSName(abbr);
        },

        isParty(party: string): boolean {
            return Util.isParty(party);
        },

        getCandidates(electorate: any): any {
            const candidates = {};
            for (const party of Object.keys(electorate)) {
                if (this.isParty(party) && electorate[party] !== '') {
                    (candidates as any)[party] = electorate[party];
                }
            }
            return candidates;
        },

        calculateSearchQuery() {
            const queryResults = {};
            if (this.searchQuery !== '' && this.searchQuery.length > 1) {
                for (const electorate of Object.keys(this.electorates)) {
                    // Remove accents
                    const latinized = electorate.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    
                    if (latinized.toLowerCase().includes(this.searchQuery.toLowerCase())) {
                        (queryResults as any)[electorate] = (this.electorates as any)[electorate];
                    }
                }
            }
            this.searchQueryResults = queryResults;
        },

        showMarginalElectorates() {
            const queryResults = {};
            for (const electorate of Object.keys(this.electorates)) {
                // manual overrides
                if (['Northland', 'Te Tai Hauāuru'].includes(electorate)) {
                    continue;
                }

                const margin = (this.electorates as any)[electorate]['margin'].split('+')[1];
                if (parseFloat(margin) <= 7.25 || ['Taieri', 'Nelson'].includes(electorate)) {
                    (queryResults as any)[electorate] = (this.electorates as any)[electorate];
                }
            }
            this.searchQueryResults = queryResults;
        },

        showAllElectorates() {
            this.searchQueryResults = this.electorates;
        },

        displayMargin(margin: string): string {
            if (margin === 'new') {
                return 'New Electorate';
            }

            const incumbent = margin.split('/')[0];
            const topChallenger = margin.split('/')[1].split('+')[0];
            const pctMargin = margin.split('/')[1].split('+')[1];

            const incumbentName = this.getPartyName(incumbent);
            const topChallengerName = this.getPartyName(topChallenger);
            const incumbentClass = this.getPartyTextCSSName(incumbent);
            const topChallengerClass = this.getPartyTextCSSName(topChallenger);

            return `
                <span class="has-text-${incumbentClass}">${incumbentName}</span> over
                <span class="has-text-${topChallengerClass}">${topChallengerName}</span> 
                by <b>${pctMargin}%</b>
            `;
        }
    },
    watch: {
        electorates() {
            this.calculateSearchQuery();
        }
    }
});
</script>